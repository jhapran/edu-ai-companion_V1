import { VIRTUAL_CLASSROOM_CONFIG } from '../config/virtualClassroom';
import type {
  Participant,
  ParticipantRole,
  Poll,
  WhiteboardObject,
} from '../hooks/useVirtualClassroom';

export const hasPermission = (role: ParticipantRole, permission: string): boolean => {
  const permissions = VIRTUAL_CLASSROOM_CONFIG.ROLE_PERMISSIONS[role];
  return permissions?.includes(permission as any) || false;
};

export const getGridLayout = (participantCount: number): readonly [number, number, number] => {
  const layouts = VIRTUAL_CLASSROOM_CONFIG.UI.GRID_LAYOUTS;
  if (participantCount <= 4) return layouts['1-4'];
  if (participantCount <= 9) return layouts['5-9'];
  if (participantCount <= 16) return layouts['10-16'];
  return layouts['17+'];
};

export const getVideoQualityPreset = (bandwidth: number) => {
  const presets = VIRTUAL_CLASSROOM_CONFIG.UI.VIDEO_QUALITY_PRESETS;
  if (bandwidth >= 1500000) return presets.high;
  if (bandwidth >= 800000) return presets.medium;
  return presets.low;
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
};

export const calculatePollResults = (poll: Poll) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  return poll.options.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
  }));
};

export const sortParticipantsByRole = (participants: Participant[]): Participant[] => {
  const roleOrder: ParticipantRole[] = ['host', 'co-host', 'participant', 'observer'];
  return [...participants].sort((a, b) => {
    const aIndex = roleOrder.indexOf(a.role);
    const bIndex = roleOrder.indexOf(b.role);
    return aIndex - bIndex;
  });
};

export const sortParticipantsByStatus = (participants: Participant[]): Participant[] => {
  const statusOrder = ['raised-hand', 'active', 'away', 'inactive'];
  return [...participants].sort((a, b) => {
    const aIndex = statusOrder.indexOf(a.status);
    const bIndex = statusOrder.indexOf(b.status);
    return aIndex - bIndex;
  });
};

export const validateWhiteboardObject = (object: WhiteboardObject): string | null => {
  const {
    MAX_OBJECT_SIZE,
    SUPPORTED_IMAGE_TYPES,
    MAX_IMAGE_DIMENSION,
    ERROR_MESSAGES,
  } = VIRTUAL_CLASSROOM_CONFIG;

  // Check object size
  const objectSize = new Blob([JSON.stringify(object.data)]).size;
  if (objectSize > MAX_OBJECT_SIZE) {
    return ERROR_MESSAGES.WHITEBOARD.OBJECT_TOO_LARGE;
  }

  // Additional checks for image objects
  if (object.type === 'image') {
    const { type, width, height } = object.data;

    // Check image type
    if (!SUPPORTED_IMAGE_TYPES.includes(type)) {
      return ERROR_MESSAGES.WHITEBOARD.INVALID_IMAGE_TYPE;
    }

    // Check image dimensions
    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      return ERROR_MESSAGES.WHITEBOARD.IMAGE_TOO_LARGE;
    }
  }

  return null;
};

export const validatePoll = (poll: Omit<Poll, 'id' | 'createdAt' | 'status'>): string | null => {
  const { MIN_POLL_OPTIONS, MAX_POLL_OPTIONS, ERROR_MESSAGES } = VIRTUAL_CLASSROOM_CONFIG;

  if (poll.options.length < MIN_POLL_OPTIONS || poll.options.length > MAX_POLL_OPTIONS) {
    return ERROR_MESSAGES.POLL.INVALID_OPTIONS;
  }

  return null;
};

export const getConnectionQualityMetrics = (stats: RTCStatsReport) => {
  let totalBitrate = 0;
  let totalPacketLoss = 0;
  let maxRoundTripTime = 0;
  let streamCount = 0;

  stats.forEach(stat => {
    if (stat.type === 'inbound-rtp' || stat.type === 'outbound-rtp') {
      if ('bitrate' in stat) totalBitrate += (stat as any).bitrate;
      if ('packetsLost' in stat && 'packetsReceived' in stat) {
        const total = (stat as any).packetsLost + (stat as any).packetsReceived;
        totalPacketLoss += total > 0 ? (stat as any).packetsLost / total : 0;
      }
      streamCount++;
    }
    if (stat.type === 'candidate-pair' && 'currentRoundTripTime' in stat) {
      maxRoundTripTime = Math.max(maxRoundTripTime, (stat as any).currentRoundTripTime * 1000);
    }
  });

  const averagePacketLoss = streamCount > 0 ? totalPacketLoss / streamCount : 0;

  return {
    bitrate: totalBitrate,
    packetLoss: averagePacketLoss,
    roundTripTime: maxRoundTripTime,
    isWarning: (
      totalBitrate < VIRTUAL_CLASSROOM_CONFIG.BANDWIDTH_WARNING_THRESHOLD ||
      maxRoundTripTime > VIRTUAL_CLASSROOM_CONFIG.LATENCY_WARNING_THRESHOLD ||
      averagePacketLoss > VIRTUAL_CLASSROOM_CONFIG.PACKET_LOSS_WARNING_THRESHOLD
    ),
  };
};

export const generateError = (category: keyof typeof VIRTUAL_CLASSROOM_CONFIG.ERROR_MESSAGES, code: string) => {
  const message = VIRTUAL_CLASSROOM_CONFIG.ERROR_MESSAGES[category][code as keyof typeof VIRTUAL_CLASSROOM_CONFIG.ERROR_MESSAGES[typeof category]];
  return new Error(message);
};

export const getAnalyticsEvent = (
  category: keyof typeof VIRTUAL_CLASSROOM_CONFIG.ANALYTICS_EVENTS.CATEGORIES,
  action: keyof typeof VIRTUAL_CLASSROOM_CONFIG.ANALYTICS_EVENTS.ACTIONS
) => ({
  category: VIRTUAL_CLASSROOM_CONFIG.ANALYTICS_EVENTS.CATEGORIES[category],
  action: VIRTUAL_CLASSROOM_CONFIG.ANALYTICS_EVENTS.ACTIONS[action],
});
