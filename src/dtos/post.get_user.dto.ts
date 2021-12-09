import { PostPaginationDTO } from '@dtos/post.pagination.dto';

export interface PostGetUserPostsDTO extends PostPaginationDTO {
  profileId: string;
}
