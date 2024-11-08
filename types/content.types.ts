// types/content.types.ts
export enum ContentType {
  VIDEO = 'video',
  IMAGE = 'image',
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  mediaPath: string;
  thumbnailPath?: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentResponse {
  success: boolean;
  message: string;
  data: {
    content: Content;
  };
}

export interface ContentListResponse {
  success: boolean;
  message: string;
  data: {
    content: Content[];
  };
}
