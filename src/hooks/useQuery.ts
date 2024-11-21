import { useState, useEffect, useCallback, useRef } from 'react';

export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

export interface QueryOptions<T> {
  initialData?: T;
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: T | undefined, error: Error | null) => void;
  retry?: number | boolean;
  retryDelay?: number;
  cacheTime?: number;
  staleTime?: number;
}

export interface QueryResult<T> {
  data: T | undefined;
  error: Error | null;
  status: QueryStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

const useQuery = <T>(
  key: string,
  queryFn: () => Promise<T>,
  options: QueryOptions<T> = {}
): QueryResult<T> => {
  const {
    initialData,
    enabled = true,
    refetchInterval,
    refetchOnMount = true,
    refetchOnWindowFocus = true,
    onSuccess,
    onError,
    onSettled,
    retry = 3,
    retryDelay = 1000,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 0,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<QueryStatus>('idle');
  const [isFetching, setIsFetching] = useState(false);

  const retryCount = useRef(0);
  const refetchIntervalId = useRef<number>();
  const lastFetchTime = useRef<number>();

  const fetchData = useCallback(async (shouldRetry = true) => {
    setIsFetching(true);
    setStatus(prev => prev === 'idle' ? 'loading' : prev);

    try {
      const result = await queryFn();
      setData(result);
      setError(null);
      setStatus('success');
      onSuccess?.(result);
      onSettled?.(result, null);
      retryCount.current = 0;

      // Update cache
      cache.set(key, {
        data: result,
        timestamp: Date.now(),
      });

      lastFetchTime.current = Date.now();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('error');
      onError?.(error);
      onSettled?.(undefined, error);

      // Handle retry logic
      if (shouldRetry && (typeof retry === 'boolean' ? retry : retryCount.current < retry)) {
        retryCount.current += 1;
        setTimeout(() => {
          fetchData(true);
        }, retryDelay * retryCount.current);
      }
    } finally {
      setIsFetching(false);
    }
  }, [key, queryFn, retry, retryDelay, onSuccess, onError, onSettled]);

  const refetch = useCallback(async () => {
    await fetchData(false);
  }, [fetchData]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setStatus('idle');
    setIsFetching(false);
    retryCount.current = 0;
  }, [initialData]);

  // Check cache and fetch if needed
  useEffect(() => {
    if (!enabled) return;

    const cachedData = cache.get(key);
    const now = Date.now();

    if (cachedData) {
      const isStale = now - cachedData.timestamp > staleTime;
      
      if (!isStale) {
        setData(cachedData.data);
        setStatus('success');
        return;
      }
    }

    if (refetchOnMount || !lastFetchTime.current) {
      fetchData();
    }
  }, [enabled, key, staleTime, refetchOnMount, fetchData]);

  // Set up refetch interval
  useEffect(() => {
    if (!enabled || !refetchInterval) return;

    refetchIntervalId.current = window.setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      if (refetchIntervalId.current) {
        window.clearInterval(refetchIntervalId.current);
      }
    };
  }, [enabled, refetchInterval, fetchData]);

  // Handle window focus events
  useEffect(() => {
    if (!enabled || !refetchOnWindowFocus) return;

    const handleFocus = () => {
      const now = Date.now();
      const shouldRefetch = !lastFetchTime.current || now - lastFetchTime.current > staleTime;
      
      if (shouldRefetch) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [enabled, refetchOnWindowFocus, staleTime, fetchData]);

  // Clean up cache
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      cache.forEach((value, key) => {
        if (now - value.timestamp > cacheTime) {
          cache.delete(key);
        }
      });
    };

    const intervalId = window.setInterval(cleanup, cacheTime);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cacheTime]);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    isFetching,
    refetch,
    reset,
  };
};

export default useQuery;
