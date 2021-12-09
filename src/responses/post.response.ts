import { Post } from '@schemas/post.schema';

export interface PostResponse {
  status: number;
  error?: string;
  message?: string;
  result?: Post | Post[];
}
