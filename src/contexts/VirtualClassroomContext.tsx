import React, { createContext, useReducer, useCallback } from 'react';
import type {
  Participant,
  ChatMessage,
  Poll,
  WhiteboardObject,
  VirtualClassroomState
} from '../hooks/useVirtualClassroom';

interface VirtualClassroomContextState extends VirtualClassroomState {}

type VirtualClassroomAction =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_PARTICIPANTS'; payload: Participant[] }
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'UPDATE_PARTICIPANT'; payload: { id: string; updates: Partial<Participant> } }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_POLL'; payload: Poll }
  | { type: 'UPDATE_POLL'; payload: { id: string; updates: Partial<Poll> } }
  | { type: 'ADD_WHITEBOARD_OBJECT'; payload: WhiteboardObject }
  | { type: 'UPDATE_WHITEBOARD_OBJECT'; payload: { id: string; data: any } }
  | { type: 'REMOVE_WHITEBOARD_OBJECT'; payload: string }
  | { type: 'SET_ACTIVE_PRESENTER'; payload: string | undefined }
  | { type: 'SET_ACTIVE_SCREEN_SHARE'; payload: string | undefined }
  | { type: 'SET_RECORDING_STATUS'; payload: 'inactive' | 'recording' | 'paused' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<VirtualClassroomState['settings']> };

interface VirtualClassroomContextValue {
  state: VirtualClassroomContextState;
  setConnected: (isConnected: boolean) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  addMessage: (message: ChatMessage) => void;
  addPoll: (poll: Poll) => void;
  updatePoll: (pollId: string, updates: Partial<Poll>) => void;
  addWhiteboardObject: (object: WhiteboardObject) => void;
  updateWhiteboardObject: (objectId: string, data: any) => void;
  removeWhiteboardObject: (objectId: string) => void;
  setActivePresenter: (participantId: string | undefined) => void;
  setActiveScreenShare: (participantId: string | undefined) => void;
  setRecordingStatus: (status: 'inactive' | 'recording' | 'paused') => void;
  updateSettings: (settings: Partial<VirtualClassroomState['settings']>) => void;
}

const initialState: VirtualClassroomContextState = {
  isConnected: false,
  participants: [],
  messages: [],
  polls: [],
  whiteboardObjects: [],
  recordingStatus: 'inactive',
  settings: {
    isAudioEnabled: true,
    isVideoEnabled: true,
    isChatEnabled: true,
    isPollEnabled: true,
    isWhiteboardEnabled: true,
    isRecordingEnabled: true,
    maxParticipants: 100,
  },
};

const virtualClassroomReducer = (
  state: VirtualClassroomContextState,
  action: VirtualClassroomAction
): VirtualClassroomContextState => {
  switch (action.type) {
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };

    case 'SET_PARTICIPANTS':
      return {
        ...state,
        participants: action.payload,
      };

    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };

    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.payload),
      };

    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.updates }
            : p
        ),
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case 'ADD_POLL':
      return {
        ...state,
        polls: [...state.polls, action.payload],
      };

    case 'UPDATE_POLL':
      return {
        ...state,
        polls: state.polls.map(p =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.updates }
            : p
        ),
      };

    case 'ADD_WHITEBOARD_OBJECT':
      return {
        ...state,
        whiteboardObjects: [...state.whiteboardObjects, action.payload],
      };

    case 'UPDATE_WHITEBOARD_OBJECT':
      return {
        ...state,
        whiteboardObjects: state.whiteboardObjects.map(obj =>
          obj.id === action.payload.id
            ? { ...obj, data: action.payload.data }
            : obj
        ),
      };

    case 'REMOVE_WHITEBOARD_OBJECT':
      return {
        ...state,
        whiteboardObjects: state.whiteboardObjects.filter(obj => obj.id !== action.payload),
      };

    case 'SET_ACTIVE_PRESENTER':
      return {
        ...state,
        activePresenter: action.payload,
      };

    case 'SET_ACTIVE_SCREEN_SHARE':
      return {
        ...state,
        activeScreenShare: action.payload,
      };

    case 'SET_RECORDING_STATUS':
      return {
        ...state,
        recordingStatus: action.payload,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export const VirtualClassroomContext = createContext<VirtualClassroomContextValue | null>(null);

export const VirtualClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(virtualClassroomReducer, initialState);

  const setConnected = useCallback((isConnected: boolean) => {
    dispatch({ type: 'SET_CONNECTED', payload: isConnected });
  }, []);

  const setParticipants = useCallback((participants: Participant[]) => {
    dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
  }, []);

  const addParticipant = useCallback((participant: Participant) => {
    dispatch({ type: 'ADD_PARTICIPANT', payload: participant });
  }, []);

  const removeParticipant = useCallback((participantId: string) => {
    dispatch({ type: 'REMOVE_PARTICIPANT', payload: participantId });
  }, []);

  const updateParticipant = useCallback((participantId: string, updates: Partial<Participant>) => {
    dispatch({ type: 'UPDATE_PARTICIPANT', payload: { id: participantId, updates } });
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  const addPoll = useCallback((poll: Poll) => {
    dispatch({ type: 'ADD_POLL', payload: poll });
  }, []);

  const updatePoll = useCallback((pollId: string, updates: Partial<Poll>) => {
    dispatch({ type: 'UPDATE_POLL', payload: { id: pollId, updates } });
  }, []);

  const addWhiteboardObject = useCallback((object: WhiteboardObject) => {
    dispatch({ type: 'ADD_WHITEBOARD_OBJECT', payload: object });
  }, []);

  const updateWhiteboardObject = useCallback((objectId: string, data: any) => {
    dispatch({ type: 'UPDATE_WHITEBOARD_OBJECT', payload: { id: objectId, data } });
  }, []);

  const removeWhiteboardObject = useCallback((objectId: string) => {
    dispatch({ type: 'REMOVE_WHITEBOARD_OBJECT', payload: objectId });
  }, []);

  const setActivePresenter = useCallback((participantId: string | undefined) => {
    dispatch({ type: 'SET_ACTIVE_PRESENTER', payload: participantId });
  }, []);

  const setActiveScreenShare = useCallback((participantId: string | undefined) => {
    dispatch({ type: 'SET_ACTIVE_SCREEN_SHARE', payload: participantId });
  }, []);

  const setRecordingStatus = useCallback((status: 'inactive' | 'recording' | 'paused') => {
    dispatch({ type: 'SET_RECORDING_STATUS', payload: status });
  }, []);

  const updateSettings = useCallback((settings: Partial<VirtualClassroomState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const value: VirtualClassroomContextValue = {
    state,
    setConnected,
    setParticipants,
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
    updateSettings,
  };

  return (
    <VirtualClassroomContext.Provider value={value}>
      {children}
    </VirtualClassroomContext.Provider>
  );
};

export default VirtualClassroomProvider;
