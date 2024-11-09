export interface Message {
  id: string;
  text: string;
  senderId: string;
  conversationId: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    username: string;
    profileImagePath?: string;
  };
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    username: string;
    profileImagePath?: string;
    isVerified: boolean;
  }>;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}
