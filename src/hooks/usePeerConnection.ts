import { useState, useCallback, useEffect, useRef } from 'react';
import useNotification from './useNotification';
import useAnalytics from './useAnalytics';
import { VIRTUAL_CLASSROOM_CONFIG } from '../config/virtualClassroom';
import { getConnectionQualityMetrics } from '../utils/virtualClassroom';

export interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
  bundlePolicy?: RTCBundlePolicy;
  rtcpMuxPolicy?: RTCRtcpMuxPolicy;
  sdpSemantics?: 'unified-plan' | 'plan-b';
}

export interface PeerStats {
  bitrate: number;
  packetLoss: number;
  roundTripTime: number;
  isWarning: boolean;
}

export interface UsePeerConnectionReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  signalingState: RTCSignalingState;
  
  // Media streams
  localStreams: MediaStream[];
  remoteStreams: MediaStream[];
  
  // Connection stats
  stats: PeerStats | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  addTrack: (track: MediaStreamTrack, stream: MediaStream) => RTCRtpSender;
  removeTrack: (sender: RTCRtpSender) => void;
  replaceTrack: (sender: RTCRtpSender, track: MediaStreamTrack | null) => Promise<void>;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: () => Promise<RTCSessionDescriptionInit>;
  setLocalDescription: (description: RTCSessionDescriptionInit) => Promise<void>;
  setRemoteDescription: (description: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  
  // Error state
  error: Error | null;
}

const DEFAULT_CONFIG: PeerConnectionConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
  iceTransportPolicy: 'all',
  bundlePolicy: 'balanced',
  rtcpMuxPolicy: 'require',
  sdpSemantics: 'unified-plan',
};

const usePeerConnection = (config: Partial<PeerConnectionConfig> = {}): UsePeerConnectionReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [iceConnectionState, setIceConnectionState] = useState<RTCIceConnectionState>('new');
  const [signalingState, setSignalingState] = useState<RTCSignalingState>('stable');
  const [stats, setStats] = useState<PeerStats | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const statsInterval = useRef<number | null>(null);

  const notification = useNotification();
  const analytics = useAnalytics();

  const [localStreams, setLocalStreams] = useState<MediaStream[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const mergedConfig = { ...DEFAULT_CONFIG, ...config };
      peerConnection.current = new RTCPeerConnection(mergedConfig);

      // Set up event handlers
      peerConnection.current.onconnectionstatechange = () => {
        const state = peerConnection.current?.connectionState || 'new';
        setConnectionState(state);
        setIsConnected(state === 'connected');
        
        if (state === 'connected') {
          analytics.trackEvent({
            category: 'virtual_classroom',
            action: 'connect',
            label: 'peer',
          });
        } else if (state === 'failed' || state === 'disconnected') {
          analytics.trackEvent({
            category: 'virtual_classroom',
            action: 'error',
            label: `peer_${state}`,
          });
        }
      };

      peerConnection.current.oniceconnectionstatechange = () => {
        setIceConnectionState(peerConnection.current?.iceConnectionState || 'new');
      };

      peerConnection.current.onsignalingstatechange = () => {
        setSignalingState(peerConnection.current?.signalingState || 'stable');
      };

      peerConnection.current.ontrack = (event) => {
        setRemoteStreams(prev => {
          const streamExists = prev.some(stream => 
            stream.id === event.streams[0]?.id
          );
          if (!streamExists && event.streams[0]) {
            return [...prev, event.streams[0]];
          }
          return prev;
        });
      };

      // Start stats monitoring
      startStatsMonitoring();

      setIsConnecting(false);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsConnecting(false);
      notification.error('Failed to create peer connection');
      throw error;
    }
  }, [config, analytics, notification]);

  const disconnect = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    stopStatsMonitoring();
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionState('closed');
    setIceConnectionState('closed');
    setSignalingState('closed');
    setStats(null);
    setLocalStreams([]);
    setRemoteStreams([]);
  }, []);

  const addTrack = useCallback((track: MediaStreamTrack, stream: MediaStream) => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }
    const sender = peerConnection.current.addTrack(track, stream);
    setLocalStreams(prev => {
      const streamExists = prev.some(s => s.id === stream.id);
      if (!streamExists) {
        return [...prev, stream];
      }
      return prev;
    });
    return sender;
  }, []);

  const removeTrack = useCallback((sender: RTCRtpSender) => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }
    peerConnection.current.removeTrack(sender);
    setLocalStreams(prev => prev.filter(stream => 
      stream.getTracks().some(track => track.id !== sender.track?.id)
    ));
  }, []);

  const replaceTrack = useCallback(async (sender: RTCRtpSender, track: MediaStreamTrack | null) => {
    try {
      await sender.replaceTrack(track);
    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error('Failed to replace track');
      throw error;
    }
  }, [notification]);

  const createOffer = useCallback(async () => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }
    try {
      return await peerConnection.current.createOffer();
    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error('Failed to create offer');
      throw error;
    }
  }, [notification]);

  const createAnswer = useCallback(async () => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }
    try {
      return await peerConnection.current.createAnswer();
    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error('Failed to create answer');
      throw error;
    }
  }, [notification]);

  const setLocalDescription = useCallback(async (description: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }
    try {
      await peerConnection.current.setLocalDescription(description);
    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error('Failed to set local description');
      throw error;
    }
  }, [notification]);

  const setRemoteDescription = useCallback(async (description: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }
    try {
      await peerConnection.current.setRemoteDescription(description);
    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error('Failed to set remote description');
      throw error;
    }
  }, [notification]);

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error('Failed to add ICE candidate');
      throw error;
    }
  }, [notification]);

  const startStatsMonitoring = useCallback(() => {
    if (!peerConnection.current) return;

    const monitorStats = async () => {
      try {
        const stats = await peerConnection.current?.getStats();
        if (stats) {
          const metrics = getConnectionQualityMetrics(stats);
          setStats(metrics);

          if (metrics.isWarning) {
            analytics.trackEvent({
              category: 'virtual_classroom',
              action: 'error',
              label: 'connection_quality',
            });
          }
        }
      } catch (error) {
        console.error('Failed to get connection stats:', error);
      }
    };

    statsInterval.current = window.setInterval(
      monitorStats,
      VIRTUAL_CLASSROOM_CONFIG.RECORDING_CHECK_INTERVAL
    );
  }, [analytics]);

  const stopStatsMonitoring = useCallback(() => {
    if (statsInterval.current) {
      clearInterval(statsInterval.current);
      statsInterval.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    connectionState,
    iceConnectionState,
    signalingState,
    localStreams,
    remoteStreams,
    stats,
    connect,
    disconnect,
    addTrack,
    removeTrack,
    replaceTrack,
    createOffer,
    createAnswer,
    setLocalDescription,
    setRemoteDescription,
    addIceCandidate,
    error,
  };
};

export default usePeerConnection;
