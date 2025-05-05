import { useState, useEffect, useRef } from 'react';

interface UseEventSourceOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
}

export const useEventSource = (url: string | null, options: UseEventSourceOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [error, setError] = useState<Event | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  
  useEffect(() => {
    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (!url) {
      setIsConnected(false);
      return;
    }
    
    try {
      // Create new EventSource
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;
      
      // Set up event handlers
      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        if (options.onOpen) {
          options.onOpen();
        }
      };
      
      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setLastEvent(parsedData);
          if (options.onMessage) {
            options.onMessage(parsedData);
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
          setLastEvent(event.data);
          if (options.onMessage) {
            options.onMessage(event.data);
          }
        }
      };
      
      eventSource.onerror = (err) => {
        setError(err);
        setIsConnected(false);
        if (options.onError) {
          options.onError(err);
        }
        // Close the connection on error
        eventSource.close();
        eventSourceRef.current = null;
      };
      
      // Clean up on unmount
      return () => {
        eventSource.close();
        eventSourceRef.current = null;
      };
    } catch (e) {
      console.error('Error creating EventSource:', e);
      setError(e as Event);
      setIsConnected(false);
    }
  }, [url, options.onMessage, options.onError, options.onOpen]);
  
  // Function to manually close the connection
  const close = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };
  
  return {
    isConnected,
    lastEvent,
    error,
    close
  };
};

export default useEventSource;