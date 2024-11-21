import { useState, useCallback, useEffect, useRef } from 'react';
import useNotification from './useNotification';
import useAnalytics from './useAnalytics';
import { VIRTUAL_CLASSROOM_CONFIG } from '../config/virtualClassroom';
import { generateError } from '../utils/virtualClassroom';

export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export interface MediaStreamInfo {
  stream: MediaStream;
  settings: MediaTrackSettings;
  capabilities: MediaTrackCapabilities;
}

export interface UseMediaDevicesReturn {
  // Device lists
  audioInputs: MediaDevice[];
  audioOutputs: MediaDevice[];
  videoInputs: MediaDevice[];
  
  // Active streams
  audioStream: MediaStreamInfo | null;
  videoStream: MediaStreamInfo | null;
  screenStream: MediaStreamInfo | null;
  
  // Device selection
  selectedAudioInput: string | null;
  selectedAudioOutput: string | null;
  selectedVideoInput: string | null;
  
  // Stream states
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  
  // Actions
  startAudio: () => Promise<void>;
  stopAudio: () => void;
  startVideo: () => Promise<void>;
  stopVideo: () => void;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  
  // Device selection
  selectAudioInput: (deviceId: string) => Promise<void>;
  selectAudioOutput: (deviceId: string) => Promise<void>;
  selectVideoInput: (deviceId: string) => Promise<void>;
  
  // Controls
  toggleAudio: () => void;
  toggleVideo: () => void;
  
  // Device management
  refreshDevices: () => Promise<void>;
  
  // Error state
  error: Error | null;
}

const useMediaDevices = (): UseMediaDevicesReturn => {
  // Device lists
  const [audioInputs, setAudioInputs] = useState<MediaDevice[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<MediaDevice[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDevice[]>([]);

  // Active streams
  const [audioStream, setAudioStream] = useState<MediaStreamInfo | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStreamInfo | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStreamInfo | null>(null);

  // Selected devices
  const [selectedAudioInput, setSelectedAudioInput] = useState<string | null>(null);
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<string | null>(null);
  const [selectedVideoInput, setSelectedVideoInput] = useState<string | null>(null);

  // Stream states
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Error state
  const [error, setError] = useState<Error | null>(null);

  const notification = useNotification();
  const analytics = useAnalytics();

  // Keep track of stream cleanup functions
  const cleanupFunctions = useRef<(() => void)[]>([]);

  const addCleanupFunction = (cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  };

  const refreshDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      setAudioInputs(devices.filter(device => device.kind === 'audioinput'));
      setAudioOutputs(devices.filter(device => device.kind === 'audiooutput'));
      setVideoInputs(devices.filter(device => device.kind === 'videoinput'));
      
      // Update selected devices if they're no longer available
      setSelectedAudioInput(prev => 
        devices.some(d => d.deviceId === prev) ? prev : null
      );
      setSelectedAudioOutput(prev =>
        devices.some(d => d.deviceId === prev) ? prev : null
      );
      setSelectedVideoInput(prev =>
        devices.some(d => d.deviceId === prev) ? prev : null
      );
    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error('Failed to refresh media devices');
    }
  }, [notification]);

  const createStreamInfo = (stream: MediaStream): MediaStreamInfo => {
    const track = stream.getTracks()[0];
    return {
      stream,
      settings: track.getSettings(),
      capabilities: track.getCapabilities(),
    };
  };

  const startAudio = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedAudioInput ? { deviceId: selectedAudioInput } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const streamInfo = createStreamInfo(stream);
      
      setAudioStream(streamInfo);
      setIsAudioEnabled(true);
      
      addCleanupFunction(() => {
        stream.getTracks().forEach(track => track.stop());
      });

      analytics.trackEvent({
        category: 'virtual_classroom',
        action: 'start',
        label: 'audio',
      });
    } catch (err) {
      const error = generateError('MEDIA', 'NO_AUDIO_PERMISSION');
      setError(error);
      notification.error(error.message);
      throw error;
    }
  }, [selectedAudioInput, analytics, notification]);

  const startVideo = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedVideoInput
          ? { deviceId: selectedVideoInput }
          : VIRTUAL_CLASSROOM_CONFIG.UI.VIDEO_QUALITY_PRESETS.medium,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const streamInfo = createStreamInfo(stream);
      
      setVideoStream(streamInfo);
      setIsVideoEnabled(true);
      
      addCleanupFunction(() => {
        stream.getTracks().forEach(track => track.stop());
      });

      analytics.trackEvent({
        category: 'virtual_classroom',
        action: 'start',
        label: 'video',
      });
    } catch (err) {
      const error = generateError('MEDIA', 'NO_VIDEO_PERMISSION');
      setError(error);
      notification.error(error.message);
      throw error;
    }
  }, [selectedVideoInput, analytics, notification]);

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const streamInfo = createStreamInfo(stream);
      setScreenStream(streamInfo);
      setIsScreenSharing(true);

      // Handle when user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      addCleanupFunction(() => {
        stream.getTracks().forEach(track => track.stop());
      });

      analytics.trackEvent({
        category: 'virtual_classroom',
        action: 'start',
        label: 'screen_share',
      });
    } catch (err) {
      const error = generateError('MEDIA', 'NO_SCREEN_SHARE_PERMISSION');
      setError(error);
      notification.error(error.message);
      throw error;
    }
  }, [analytics, notification]);

  const stopAudio = useCallback(() => {
    if (audioStream) {
      audioStream.stream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
      setIsAudioEnabled(false);
      analytics.trackEvent({
        category: 'virtual_classroom',
        action: 'pause',
        label: 'audio',
      });
    }
  }, [audioStream, analytics]);

  const stopVideo = useCallback(() => {
    if (videoStream) {
      videoStream.stream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setIsVideoEnabled(false);
      analytics.trackEvent({
        category: 'virtual_classroom',
        action: 'pause',
        label: 'video',
      });
    }
  }, [videoStream, analytics]);

  const stopScreenShare = useCallback(() => {
    if (screenStream) {
      screenStream.stream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      analytics.trackEvent({
        category: 'virtual_classroom',
        action: 'pause',
        label: 'screen_share',
      });
    }
  }, [screenStream, analytics]);

  const selectAudioInput = useCallback(async (deviceId: string) => {
    setSelectedAudioInput(deviceId);
    if (isAudioEnabled) {
      stopAudio();
      await startAudio();
    }
  }, [isAudioEnabled, stopAudio, startAudio]);

  const selectAudioOutput = useCallback(async (deviceId: string) => {
    setSelectedAudioOutput(deviceId);
    // Handle audio output selection if browser supports it
    const audioElements = document.querySelectorAll('audio');
    const promises = Array.from(audioElements).map(audio => {
      if ('setSinkId' in audio) {
        return (audio as any).setSinkId(deviceId);
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
  }, []);

  const selectVideoInput = useCallback(async (deviceId: string) => {
    setSelectedVideoInput(deviceId);
    if (isVideoEnabled) {
      stopVideo();
      await startVideo();
    }
  }, [isVideoEnabled, stopVideo, startVideo]);

  const toggleAudio = useCallback(() => {
    if (audioStream) {
      audioStream.stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(prev => !prev);
    }
  }, [audioStream]);

  const toggleVideo = useCallback(() => {
    if (videoStream) {
      videoStream.stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(prev => !prev);
    }
  }, [videoStream]);

  // Initial device enumeration
  useEffect(() => {
    refreshDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', refreshDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
    };
  }, [refreshDevices]);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
    };
  }, []);

  return {
    audioInputs,
    audioOutputs,
    videoInputs,
    audioStream,
    videoStream,
    screenStream,
    selectedAudioInput,
    selectedAudioOutput,
    selectedVideoInput,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    startScreenShare,
    stopScreenShare,
    selectAudioInput,
    selectAudioOutput,
    selectVideoInput,
    toggleAudio,
    toggleVideo,
    refreshDevices,
    error,
  };
};

export default useMediaDevices;
