import { useState, useCallback, useRef, useEffect } from 'react';
import useNotification from './useNotification';
import useAnalytics from './useAnalytics';
import { VIRTUAL_CLASSROOM_CONFIG } from '../config/virtualClassroom';
import { generateError } from '../utils/virtualClassroom';

export type RecordingMode = 'local' | 'cloud';
export type RecordingStatus = 'inactive' | 'recording' | 'paused';
export type RecordingFormat = 'webm' | 'mp4';

export interface RecordingOptions {
  mode?: RecordingMode;
  format?: RecordingFormat;
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  timeslice?: number;
  includeAudio?: boolean;
  includeVideo?: boolean;
  maxDuration?: number;
}

export interface RecordingMetadata {
  startTime: Date;
  duration: number;
  size: number;
  format: RecordingFormat;
  resolution?: {
    width: number;
    height: number;
  };
}

export interface UseRecordingReturn {
  // State
  isRecording: boolean;
  isPaused: boolean;
  status: RecordingStatus;
  duration: number;
  metadata: RecordingMetadata | null;
  
  // Actions
  startRecording: (streams: MediaStream[], options?: RecordingOptions) => Promise<void>;
  stopRecording: () => Promise<Blob>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  
  // Download
  downloadRecording: (filename?: string) => void;
  
  // Error state
  error: Error | null;
}

const DEFAULT_OPTIONS: RecordingOptions = {
  mode: 'local',
  format: 'webm',
  mimeType: 'video/webm;codecs=vp8,opus',
  videoBitsPerSecond: 2500000,
  audioBitsPerSecond: 128000,
  timeslice: 1000,
  includeAudio: true,
  includeVideo: true,
  maxDuration: VIRTUAL_CLASSROOM_CONFIG.MAX_RECORDING_DURATION,
};

const useRecording = (): UseRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState<RecordingStatus>('inactive');
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState<RecordingMetadata | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const startTime = useRef<Date | null>(null);
  const durationInterval = useRef<number | null>(null);
  const maxDurationTimeout = useRef<number | null>(null);

  const notification = useNotification();
  const analytics = useAnalytics();

  const updateDuration = useCallback(() => {
    if (startTime.current && !isPaused) {
      const elapsed = Date.now() - startTime.current.getTime();
      setDuration(elapsed);
    }
  }, [isPaused]);

  const startRecording = useCallback(async (
    streams: MediaStream[],
    options: RecordingOptions = {}
  ) => {
    try {
      if (isRecording) {
        throw new Error('Recording is already in progress');
      }

      const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

      // Validate options
      if (!MediaRecorder.isTypeSupported(mergedOptions.mimeType!)) {
        throw new Error(`Unsupported MIME type: ${mergedOptions.mimeType}`);
      }

      // Combine all streams into one
      const combinedStream = new MediaStream();
      streams.forEach(stream => {
        stream.getTracks().forEach(track => {
          if (
            (track.kind === 'audio' && mergedOptions.includeAudio) ||
            (track.kind === 'video' && mergedOptions.includeVideo)
          ) {
            combinedStream.addTrack(track);
          }
        });
      });

      // Create MediaRecorder
      mediaRecorder.current = new MediaRecorder(combinedStream, {
        mimeType: mergedOptions.mimeType,
        videoBitsPerSecond: mergedOptions.videoBitsPerSecond,
        audioBitsPerSecond: mergedOptions.audioBitsPerSecond,
      });

      // Set up event handlers
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstart = () => {
        startTime.current = new Date();
        setIsRecording(true);
        setStatus('recording');
        setError(null);

        // Start duration tracking
        durationInterval.current = window.setInterval(
          updateDuration,
          1000
        );

        // Set max duration timeout
        if (mergedOptions.maxDuration) {
          maxDurationTimeout.current = window.setTimeout(() => {
            stopRecording().catch(console.error);
          }, mergedOptions.maxDuration);
        }

        analytics.trackEvent({
          category: 'virtual_classroom',
          action: 'start',
          label: 'recording',
        });
      };

      mediaRecorder.current.onpause = () => {
        setIsPaused(true);
        setStatus('paused');
        analytics.trackEvent({
          category: 'virtual_classroom',
          action: 'pause',
          label: 'recording',
        });
      };

      mediaRecorder.current.onresume = () => {
        setIsPaused(false);
        setStatus('recording');
        analytics.trackEvent({
          category: 'virtual_classroom',
          action: 'resume',
          label: 'recording',
        });
      };

      mediaRecorder.current.onstop = () => {
        const endTime = new Date();
        const recordingDuration = startTime.current
          ? endTime.getTime() - startTime.current.getTime()
          : 0;

        // Create final recording blob
        const recordingBlob = new Blob(recordedChunks.current, {
          type: mergedOptions.mimeType,
        });

        // Update metadata
        setMetadata({
          startTime: startTime.current!,
          duration: recordingDuration,
          size: recordingBlob.size,
          format: mergedOptions.format!,
          resolution: mergedOptions.includeVideo ? {
            width: combinedStream.getVideoTracks()[0]?.getSettings().width || 0,
            height: combinedStream.getVideoTracks()[0]?.getSettings().height || 0,
          } : undefined,
        });

        // Clean up
        cleanup();

        analytics.trackEvent({
          category: 'virtual_classroom',
          action: 'complete',
          label: 'recording',
        });
      };

      mediaRecorder.current.onerror = () => {
        const error = new Error('Recording error occurred');
        setError(error);
        cleanup();
        notification.error(error.message);
      };

      // Start recording
      recordedChunks.current = [];
      mediaRecorder.current.start(mergedOptions.timeslice);

    } catch (err) {
      const error = err as Error;
      setError(error);
      notification.error(error.message);
      throw error;
    }
  }, [isRecording, updateDuration, analytics, notification]);

  const stopRecording = useCallback(async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder.current || mediaRecorder.current.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      const handleStop = () => {
        const recordingBlob = new Blob(recordedChunks.current, {
          type: mediaRecorder.current?.mimeType,
        });
        resolve(recordingBlob);
      };

      mediaRecorder.current.addEventListener('stop', handleStop, { once: true });
      mediaRecorder.current.stop();
    });
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.pause();
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorder.current?.state === 'paused') {
      mediaRecorder.current.resume();
    }
  }, []);

  const downloadRecording = useCallback((filename?: string) => {
    if (recordedChunks.current.length === 0) {
      notification.error('No recording available to download');
      return;
    }

    const blob = new Blob(recordedChunks.current, {
      type: mediaRecorder.current?.mimeType,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename || `recording-${new Date().toISOString()}.webm`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);

    analytics.trackEvent({
      category: 'virtual_classroom',
      action: 'download',
      label: 'recording',
    });
  }, [notification, analytics]);

  const cleanup = useCallback(() => {
    setIsRecording(false);
    setIsPaused(false);
    setStatus('inactive');
    startTime.current = null;

    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }

    if (maxDurationTimeout.current) {
      clearTimeout(maxDurationTimeout.current);
      maxDurationTimeout.current = null;
    }

    if (mediaRecorder.current) {
      const tracks = mediaRecorder.current.stream.getTracks();
      tracks.forEach(track => track.stop());
      mediaRecorder.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isRecording,
    isPaused,
    status,
    duration,
    metadata,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    downloadRecording,
    error,
  };
};

export default useRecording;
