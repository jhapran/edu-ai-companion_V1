import { useEffect, useCallback, useRef } from 'react';
import useVirtualClassroomContext from './useVirtualClassroomContext';
import VirtualClassroomService from '../services/VirtualClassroomService';
import useNotification from './useNotification';
import useAnalytics from './useAnalytics';

export type ParticipantRole = 'host' | 'co-host' | 'participant' | 'observer';
export type ParticipantStatus = 'active' | 'inactive' | 'away' | 'raised-hand';

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  joinedAt: Date;
}

export type ChatMessageType = 'text' | 'file' | 'system';

export interface ChatMessage {
  id: string;
  senderId: string;
  type: ChatMessageType;
  content: string;
  timestamp: Date;
  isPrivate?: boolean;
  recipientId?: string;
  metadata?: Record<string, any>;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: Date;
  expiresAt?: Date;
  isAnonymous: boolean;
  allowMultipleVotes: boolean;
  status: 'active' | 'ended';
}

export interface WhiteboardObject {
  id: string;
  type: 'path' | 'shape' | 'text' | 'image';
  data: any;
  createdBy: string;
  createdAt: Date;
}

export interface VirtualClassroomState {
  isConnected: boolean;
  participants: Participant[];
  messages: ChatMessage[];
  polls: Poll[];
  whiteboardObjects: WhiteboardObject[];
  activePresenter?: string;
  activeScreenShare?: string;
  recordingStatus: 'inactive' | 'recording' | 'paused';
  settings: {
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    isChatEnabled: boolean;
    isPollEnabled: boolean;
    isWhiteboardEnabled: boolean;
    isRecordingEnabled: boolean;
    maxParticipants: number;
  };
}

export interface UseVirtualClassroomOptions {
  roomId: string;
  userId: string;
  userName: string;
  role?: ParticipantRole;
  wsUrl: string;
  onError?: (error: Error) => void;
}

const useVirtualClassroom = (options: UseVirtualClassroomOptions) => {
  const {
    roomId,
    userId,
    userName,
    role = 'participant',
    wsUrl,
    onError,
  } = options;

  const serviceRef = useRef<VirtualClassroomService | null>(null);
  const notification = useNotification();
  const analytics = useAnalytics();
  const virtualClassroom = useVirtualClassroomContext();

  const {
    state,
    setConnected,
    addParticipant,
    removeParticipant,
    updateParticipant,
    addMessage,
    addPoll,
    updatePoll,
    addWhiteboardObject,
    updateWhiteboardObject,
    removeWhiteboardObject,
    setActivePresenter,
    setActiveScreenShare,
    setRecordingStatus,
  } = virtualClassroom;

  // Initialize VirtualClassroomService
  useEffect(() => {
    serviceRef.current = new VirtualClassroomService({
      roomId,
      userId,
      userName,
      role,
      wsUrl,
    });

    serviceRef.current.setEventHandlers({
      onConnect: () => {
        setConnected(true);
        notification.success('Connected to virtual classroom');
        analytics.trackEvent({
          category: 'virtual_classroom',
          action: 'connect',
          label: roomId,
        });
      },

      onDisconnect: () => {
        setConnected(false);
        notification.warning('Disconnected from virtual classroom');
        analytics.trackEvent({
          category: 'virtual_classroom',
          action: 'disconnect',
          label: roomId,
        });
      },

      onParticipantJoin: (participant) => {
        addParticipant(participant);
        notification.info(`${participant.name} joined the classroom`);
      },

      onParticipantLeave: (participantId) => {
        const participant = state.participants.find(p => p.id === participantId);
        if (participant) {
          removeParticipant(participantId);
          notification.info(`${participant.name} left the classroom`);
        }
      },

      onParticipantUpdate: (participant) => {
        updateParticipant(participant.id, participant);
      },

      onMessage: (message) => {
        addMessage(message);
      },

      onPollCreate: (poll) => {
        addPoll(poll);
        notification.info('New poll created');
      },

      onPollUpdate: (poll) => {
        updatePoll(poll.id, poll);
      },

      onWhiteboardUpdate: (objects) => {
        objects.forEach(object => {
          if (!state.whiteboardObjects.find(o => o.id === object.id)) {
            addWhiteboardObject(object);
          } else {
            updateWhiteboardObject(object.id, object.data);
          }
        });
      },

      onPresenterChange: (participantId) => {
        setActivePresenter(participantId);
      },

      onScreenShareChange: (participantId) => {
        setActiveScreenShare(participantId);
      },

      onRecordingStatusChange: (status) => {
        setRecordingStatus(status);
        notification.info(`Recording ${status}`);
      },

      onError: (error) => {
        onError?.(error);
        notification.error('Virtual classroom error: ' + error.message);
        analytics.trackEvent({
          category: 'virtual_classroom',
          action: 'error',
          label: error.message,
        });
      },
    });

    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
        serviceRef.current = null;
      }
    };
  }, [roomId, userId, userName, role, wsUrl]);

  const connect = useCallback(async () => {
    try {
      await serviceRef.current?.connect();
    } catch (error) {
      const err = error as Error;
      onError?.(err);
      notification.error('Failed to connect: ' + err.message);
    }
  }, [onError, notification]);

  const disconnect = useCallback(() => {
    serviceRef.current?.disconnect();
  }, []);

  const sendMessage = useCallback((content: string, isPrivate = false, recipientId?: string) => {
    try {
      serviceRef.current?.sendMessage(content, isPrivate, recipientId);
    } catch (error) {
      const err = error as Error;
      onError?.(err);
      notification.error('Failed to send message: ' + err.message);
    }
  }, [onError, notification]);

  const raiseHand = useCallback(() => {
    try {
      serviceRef.current?.raiseHand();
    } catch (error) {
      const err = error as Error;
      onError?.(err);
      notification.error('Failed to raise hand: ' + err.message);
    }
  }, [onError, notification]);

  const lowerHand = useCallback(() => {
    try {
      serviceRef.current?.lowerHand();
    } catch (error) {
      const err = error as Error;
      onError?.(err);
      notification.error('Failed to lower hand: ' + err.message);
    }
  }, [onError, notification]);

  return {
    ...virtualClassroom,
    connect,
    disconnect,
    sendMessage,
    raiseHand,
    lowerHand,
  };
};

export default useVirtualClassroom;
