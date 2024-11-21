export const VIRTUAL_CLASSROOM_CONFIG = {
  // WebSocket configuration
  WS_RECONNECT_MAX_ATTEMPTS: 5,
  WS_RECONNECT_DELAY: 1000, // Base delay in milliseconds
  WS_PING_INTERVAL: 15000, // 15 seconds
  WS_PONG_TIMEOUT: 30000, // 30 seconds

  // Participant limits
  MAX_PARTICIPANTS: 100,
  MAX_RAISED_HANDS: 10,

  // Chat configuration
  MAX_MESSAGE_LENGTH: 1000,
  MAX_CHAT_HISTORY: 200,
  TYPING_INDICATOR_TIMEOUT: 3000,

  // Poll configuration
  MAX_POLL_OPTIONS: 10,
  MIN_POLL_OPTIONS: 2,
  MAX_POLL_DURATION: 3600000, // 1 hour in milliseconds
  DEFAULT_POLL_DURATION: 300000, // 5 minutes in milliseconds

  // Whiteboard configuration
  MAX_WHITEBOARD_OBJECTS: 1000,
  MAX_OBJECT_SIZE: 5242880, // 5MB in bytes
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_IMAGE_DIMENSION: 2048, // pixels

  // Recording configuration
  MAX_RECORDING_DURATION: 14400000, // 4 hours in milliseconds
  RECORDING_CHECK_INTERVAL: 60000, // 1 minute in milliseconds

  // Performance thresholds
  BANDWIDTH_WARNING_THRESHOLD: 500000, // 500Kbps
  LATENCY_WARNING_THRESHOLD: 200, // 200ms
  PACKET_LOSS_WARNING_THRESHOLD: 0.05, // 5%

  // Role permissions
  ROLE_PERMISSIONS: {
    host: [
      'manage_participants',
      'manage_recordings',
      'manage_polls',
      'manage_whiteboard',
      'share_screen',
      'send_messages',
      'moderate_chat',
      'present',
      'record',
    ],
    'co-host': [
      'share_screen',
      'send_messages',
      'manage_polls',
      'manage_whiteboard',
      'present',
      'record',
    ],
    participant: [
      'send_messages',
      'participate_polls',
      'use_whiteboard',
      'raise_hand',
      'share_screen',
    ],
    observer: [
      'send_messages',
      'participate_polls',
    ],
  } as const,

  // UI configuration
  UI: {
    GRID_LAYOUTS: {
      '1-4': [1, 2, 4],
      '5-9': [2, 3, 3],
      '10-16': [3, 4, 4],
      '17+': [4, 5, 5],
    },
    VIDEO_QUALITY_PRESETS: {
      high: {
        width: 1280,
        height: 720,
        frameRate: 30,
        bitrate: 1500000,
      },
      medium: {
        width: 640,
        height: 480,
        frameRate: 25,
        bitrate: 800000,
      },
      low: {
        width: 320,
        height: 240,
        frameRate: 15,
        bitrate: 400000,
      },
    },
    TOOLBAR_ACTIONS: [
      'toggle-audio',
      'toggle-video',
      'share-screen',
      'raise-hand',
      'chat',
      'participants',
      'polls',
      'whiteboard',
      'record',
      'settings',
      'leave',
    ] as const,
    NOTIFICATION_DURATION: 5000,
    ANIMATION_DURATION: 300,
  },

  // Analytics events
  ANALYTICS_EVENTS: {
    CATEGORIES: {
      CONNECTION: 'virtual_classroom_connection',
      INTERACTION: 'virtual_classroom_interaction',
      MEDIA: 'virtual_classroom_media',
      CHAT: 'virtual_classroom_chat',
      POLL: 'virtual_classroom_poll',
      WHITEBOARD: 'virtual_classroom_whiteboard',
      ERROR: 'virtual_classroom_error',
      PERFORMANCE: 'virtual_classroom_performance',
    },
    ACTIONS: {
      CONNECT: 'connect',
      DISCONNECT: 'disconnect',
      JOIN: 'join',
      LEAVE: 'leave',
      SEND_MESSAGE: 'send_message',
      RAISE_HAND: 'raise_hand',
      START_SHARE: 'start_share',
      STOP_SHARE: 'stop_share',
      START_RECORDING: 'start_recording',
      STOP_RECORDING: 'stop_recording',
      CREATE_POLL: 'create_poll',
      VOTE_POLL: 'vote_poll',
      ADD_WHITEBOARD_OBJECT: 'add_whiteboard_object',
      CLEAR_WHITEBOARD: 'clear_whiteboard',
      ERROR_OCCURRED: 'error_occurred',
      BANDWIDTH_WARNING: 'bandwidth_warning',
      LATENCY_WARNING: 'latency_warning',
    },
  },

  // Error messages
  ERROR_MESSAGES: {
    CONNECTION: {
      FAILED_TO_CONNECT: 'Failed to connect to the virtual classroom',
      CONNECTION_LOST: 'Connection to the virtual classroom was lost',
      RECONNECTING: 'Attempting to reconnect...',
      MAX_RETRIES_EXCEEDED: 'Maximum reconnection attempts exceeded',
    },
    MEDIA: {
      NO_AUDIO_PERMISSION: 'Microphone access was denied',
      NO_VIDEO_PERMISSION: 'Camera access was denied',
      NO_SCREEN_SHARE_PERMISSION: 'Screen sharing permission was denied',
      DEVICE_NOT_FOUND: 'Required media device was not found',
      HARDWARE_ERROR: 'Hardware error occurred while accessing media devices',
    },
    RECORDING: {
      FAILED_TO_START: 'Failed to start recording',
      FAILED_TO_STOP: 'Failed to stop recording',
      MAX_DURATION_EXCEEDED: 'Maximum recording duration exceeded',
    },
    WHITEBOARD: {
      OBJECT_TOO_LARGE: 'Whiteboard object exceeds maximum size limit',
      MAX_OBJECTS_EXCEEDED: 'Maximum number of whiteboard objects exceeded',
      INVALID_IMAGE_TYPE: 'Unsupported image type',
      IMAGE_TOO_LARGE: 'Image dimensions exceed maximum limit',
    },
    POLL: {
      INVALID_OPTIONS: 'Invalid number of poll options',
      ALREADY_VOTED: 'You have already voted in this poll',
      POLL_ENDED: 'This poll has ended',
    },
  },
} as const;

export type RolePermission = keyof typeof VIRTUAL_CLASSROOM_CONFIG.ROLE_PERMISSIONS;
export type ToolbarAction = typeof VIRTUAL_CLASSROOM_CONFIG.UI.TOOLBAR_ACTIONS[number];
export type AnalyticsCategory = keyof typeof VIRTUAL_CLASSROOM_CONFIG.ANALYTICS_EVENTS.CATEGORIES;
export type AnalyticsAction = keyof typeof VIRTUAL_CLASSROOM_CONFIG.ANALYTICS_EVENTS.ACTIONS;

export default VIRTUAL_CLASSROOM_CONFIG;
