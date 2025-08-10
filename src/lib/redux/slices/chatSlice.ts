import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  senderId: string;
  receiverId: string;
  read: boolean;
}

interface Conversation {
  userId: string;
  username?: string | null;
  name?: string | null;
  image?: string | null;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null; // userId of active conversation
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    fetchConversationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchConversationsSuccess: (state, action: PayloadAction<Conversation[]>) => {
      state.loading = false;
      state.conversations = action.payload;
      state.error = null;
    },
    fetchConversationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload;
      // Mark messages as read when conversation is opened
      const conversation = state.conversations.find(c => c.userId === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
        conversation.messages.forEach(message => {
          if (!message.read && message.senderId !== action.payload) {
            message.read = true;
          }
        });
      }
    },
    fetchMessagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action: PayloadAction<{ userId: string; messages: Message[] }>) => {
      state.loading = false;
      const conversation = state.conversations.find(c => c.userId === action.payload.userId);
      if (conversation) {
        conversation.messages = action.payload.messages;
      } else {
        // Create new conversation if it doesn't exist
        state.conversations.push({
          userId: action.payload.userId,
          messages: action.payload.messages,
          unreadCount: 0,
        });
      }
      state.error = null;
    },
    fetchMessagesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    sendMessage: (state, action: PayloadAction<Message>) => {
      const { senderId, receiverId } = action.payload;
      const conversation = state.conversations.find(c => c.userId === receiverId);
      if (conversation) {
        conversation.messages.push(action.payload);
        conversation.lastMessage = action.payload;
      } else {
        // Create new conversation if it doesn't exist
        state.conversations.push({
          userId: receiverId,
          messages: [action.payload],
          lastMessage: action.payload,
          unreadCount: 0,
        });
      }
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      const { senderId } = action.payload;
      const conversation = state.conversations.find(c => c.userId === senderId);
      
      // Only mark as read if this conversation is active
      const isRead = state.activeConversation === senderId;
      const message = { ...action.payload, read: isRead };
      
      if (conversation) {
        conversation.messages.push(message);
        conversation.lastMessage = message;
        if (!isRead) {
          conversation.unreadCount += 1;
        }
      } else {
        // Create new conversation if it doesn't exist
        state.conversations.push({
          userId: senderId,
          messages: [message],
          lastMessage: message,
          unreadCount: isRead ? 0 : 1,
        });
      }
    },
  },
});

export const {
  fetchConversationsStart,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  setActiveConversation,
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  sendMessage,
  receiveMessage,
} = chatSlice.actions;

export default chatSlice.reducer;