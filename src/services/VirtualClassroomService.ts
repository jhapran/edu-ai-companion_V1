import type {
  Participant,
  ChatMessage,
  Poll,
  WhiteboardObject,
  ParticipantRole,
  ParticipantStatus
} from '../hooks/useVirtualClassroom';

export interface VirtualClassroomConfig {
  roomId: string;
  userId: string;
  userName: string;
  role: ParticipantRole;
  wsUrl: string;
}

export interface VirtualClassroomEvents {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onParticipantJoin?: (participant: Participant) => void;
  onParticipantLeave?: (participantId: string) => void;
  onParticipantUpdate?: (participant: Participant) => void;
  onMessage?: (message: ChatMessage) => void;
  onPollCreate?: (poll: Poll) => void;
  onPollUpdate?: (poll: Poll) => void;
  onWhiteboardUpdate?: (objects: WhiteboardObject[]) => void;
  onPresenterChange?: (participantId: string | undefined) => void;
  onScreenShareChange?: (participantId: string | undefined) => void;
  onRecordingStatusChange?: (status: 'inactive' | 'recording' | 'paused') => void;
  onError?: (error: Error) => void;
}

class VirtualClassroomService {
  private ws: WebSocket | null = null;
  private config: VirtualClassroomConfig;
  private events: VirtualClassroomEvents = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: number | null = null;
  private lastPongTime: number = Date.now();

  constructor(config: VirtualClassroomConfig) {
    this.config = config;
  }

  public setEventHandlers(events: VirtualClassroomEvents) {
    this.events = events;
  }

  public async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.startPingInterval();
          this.sendAuth();
          this.events.onConnect?.();
          resolve();
        };

        this.ws.onclose = () => {
          this.handleDisconnect();
        };

        this.ws.onerror = (error) => {
          this.handleError(error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopPingInterval();
    this.events.onDisconnect?.();
  }

  public sendMessage(content: string, isPrivate = false, recipientId?: string) {
    this.send('message', {
      content,
      isPrivate,
      recipientId,
      timestamp: new Date().toISOString()
    });
  }

  public updateParticipantStatus(status: ParticipantStatus) {
    this.send('participant_status', { status });
  }

  public createPoll(poll: Omit<Poll, 'id' | 'createdAt' | 'status'>) {
    this.send('create_poll', poll);
  }

  public votePoll(pollId: string, optionIds: string[]) {
    this.send('vote_poll', { pollId, optionIds });
  }

  public endPoll(pollId: string) {
    this.send('end_poll', { pollId });
  }

  public updateWhiteboard(objects: WhiteboardObject[]) {
    this.send('whiteboard_update', { objects });
  }

  public startPresenting() {
    this.send('start_presenting');
  }

  public stopPresenting() {
    this.send('stop_presenting');
  }

  public startScreenShare() {
    this.send('start_screen_share');
  }

  public stopScreenShare() {
    this.send('stop_screen_share');
  }

  public startRecording() {
    this.send('start_recording');
  }

  public stopRecording() {
    this.send('stop_recording');
  }

  public raiseHand() {
    this.updateParticipantStatus('raised-hand');
  }

  public lowerHand() {
    this.updateParticipantStatus('active');
  }

  private send(type: string, payload?: any) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(JSON.stringify({
      type,
      payload,
      roomId: this.config.roomId,
      userId: this.config.userId,
      timestamp: new Date().toISOString()
    }));
  }

  private sendAuth() {
    this.send('auth', {
      userName: this.config.userName,
      role: this.config.role
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      const { type, payload } = JSON.parse(event.data);

      switch (type) {
        case 'pong':
          this.lastPongTime = Date.now();
          break;

        case 'participant_join':
          this.events.onParticipantJoin?.(payload);
          break;

        case 'participant_leave':
          this.events.onParticipantLeave?.(payload.participantId);
          break;

        case 'participant_update':
          this.events.onParticipantUpdate?.(payload);
          break;

        case 'message':
          this.events.onMessage?.(payload);
          break;

        case 'poll_create':
          this.events.onPollCreate?.(payload);
          break;

        case 'poll_update':
          this.events.onPollUpdate?.(payload);
          break;

        case 'whiteboard_update':
          this.events.onWhiteboardUpdate?.(payload.objects);
          break;

        case 'presenter_change':
          this.events.onPresenterChange?.(payload.participantId);
          break;

        case 'screen_share_change':
          this.events.onScreenShareChange?.(payload.participantId);
          break;

        case 'recording_status_change':
          this.events.onRecordingStatusChange?.(payload.status);
          break;

        case 'error':
          this.events.onError?.(new Error(payload.message));
          break;

        default:
          console.warn('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private handleDisconnect() {
    this.stopPingInterval();
    this.events.onDisconnect?.();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connect(), delay);
    }
  }

  private handleError(error: Event) {
    const wsError = new Error('WebSocket error');
    console.error(wsError);
    this.events.onError?.(wsError);
  }

  private startPingInterval() {
    this.stopPingInterval();
    this.pingInterval = window.setInterval(() => {
      if (Date.now() - this.lastPongTime > 30000) {
        // No pong received for 30 seconds, reconnect
        this.disconnect();
        this.connect();
      } else {
        this.send('ping');
      }
    }, 15000);
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

export default VirtualClassroomService;
