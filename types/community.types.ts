// types/community.types.ts
export interface User {
  id: string;
  username: string;
  profileImagePath?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  bio?: string;
  followersCount: number;
  followingCount: number;
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  type: "video" | "image";
  mediaPath: string;
  thumbnailPath?: string;
  tags: string[];
  creator: User;
  likeCount: number;
  commentsCount: number;
  viewCount: number;
  isLiked: boolean;
  isSubscribed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  user: User;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  replies?: Comment[];
}
