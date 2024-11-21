import { useContext } from 'react';
import { VirtualClassroomContext } from '../contexts/VirtualClassroomContext';
import type {
  Participant,
  ChatMessage,
  Poll,
  WhiteboardObject,
  VirtualClassroomState
} from './useVirtualClassroom';

export interface UseVirtualClassroomContextReturn {
  state: VirtualClassroomState;
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
  // Utility functions
  getParticipant: (participantId: string) => Participant | undefined;
  getParticipantsByRole: (role: Participant['role']) => Participant[];
  getActiveParticipants: () => Participant[];
  getRaisedHands: () => Participant[];
  getPollResults: (pollId: string) => { [key: string]: number };
  getParticipantPermissions: (participantId: string) => string[];
  isParticipantActive: (participantId: string) => boolean;
  canParticipantPerformAction: (participantId: string, action: string) => boolean;
}

const useVirtualClassroomContext = (): UseVirtualClassroomContextReturn => {
  const context = useContext(VirtualClassroomContext);

  if (!context) {
    throw new Error('useVirtualClassroomContext must be used within a VirtualClassroomProvider');
  }

  const {
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
  } = context;

  // Utility functions
  const getParticipant = (participantId: string): Participant | undefined => {
    return state.participants.find(p => p.id === participantId);
  };

  const getParticipantsByRole = (role: Participant['role']): Participant[] => {
    return state.participants.filter(p => p.role === role);
  };

  const getActiveParticipants = (): Participant[] => {
    return state.participants.filter(p => p.status === 'active');
  };

  const getRaisedHands = (): Participant[] => {
    return state.participants.filter(p => p.status === 'raised-hand');
  };

  const getPollResults = (pollId: string): { [key: string]: number } => {
    const poll = state.polls.find(p => p.id === pollId);
    if (!poll) return {};

    return poll.options.reduce((acc, option) => ({
      ...acc,
      [option.id]: option.votes
    }), {});
  };

  const getParticipantPermissions = (participantId: string): string[] => {
    const participant = getParticipant(participantId);
    if (!participant) return [];

    const rolePermissions: { [key in Participant['role']]: string[] } = {
      host: ['all'],
      'co-host': ['present', 'moderate', 'share-screen', 'record'],
      participant: ['chat', 'raise-hand'],
      observer: ['chat']
    };

    return rolePermissions[participant.role] || [];
  };

  const isParticipantActive = (participantId: string): boolean => {
    const participant = getParticipant(participantId);
    return participant?.status === 'active' || false;
  };

  const canParticipantPerformAction = (participantId: string, action: string): boolean => {
    const permissions = getParticipantPermissions(participantId);
    return permissions.includes('all') || permissions.includes(action);
  };

  return {
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
    // Utility functions
    getParticipant,
    getParticipantsByRole,
    getActiveParticipants,
    getRaisedHands,
    getPollResults,
    getParticipantPermissions,
    isParticipantActive,
    canParticipantPerformAction,
  };
};

export default useVirtualClassroomContext;
