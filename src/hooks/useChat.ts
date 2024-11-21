import { useState, useCallback, useRef } from 'react';
import useNotification from './useNotification';
import useAnalytics from './useAnalytics';

export type MessageType = 'text' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  status: MessageStatus;
  isPrivate?: boolean;
  recipientId?: string;
}

export interface UseChatOptions {
  roomId: string;
  userId: string;
  userName: string;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string, options?: {
    isPrivate?: boolean;
    recipientId?: string;
  }) => void;
  clearMessages: () => void;
}

const useChat = ({ roomId, userId, userName }: UseChatOptions): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const notification = useNotification();
  const analytics = useAnalytics();

  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const sendMessage = useCallback((
    content: string, 
    options: { isPrivate?: boolean; recipientId?: string } = {}
  ) => {
    const messageId = generateMessageId();
    const message: ChatMessage = {
      id: messageId,
      type: 'text',
      content,
      senderId: userId,
      senderName: userName,
      timestamp: new Date(),
      status: 'sending',
      isPrivate: options.isPrivate,
      recipientId: options.recipientId,
    };

    setMessages(prev => [...prev, message]);

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId 
            ? { ...m, status: 'sent' } 
            : m
        )
      );
    }, 500);

    analytics.trackEvent({
      category: 'virtual_classroom',
      action: 'send_message',
      label: options.isPrivate ? 'private' : 'public',
    });
  }, [userId, userName, analytics]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
  };
};

export default useChat;
