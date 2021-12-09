import { PostCreateDTO } from '@dtos/post.create.dto';
import { PostGetUserPostsDTO } from '@dtos/post.get_user.dto';
import { PostUpdateDTO } from '@dtos/post.update.dto';
import { Injectable } from '@nestjs/common';
import { PostRepository } from '@repositories/post.repository';
import { Post } from '@schemas/post.schema';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(args: PostCreateDTO): Promise<Post> {
    const isSlugTaken = await this.postRepository.getPostWithSlug(args.slug);
    if (isSlugTaken) {
      const slug = slugify(args.title);
      args.slug = slug;
    }
    return await this.postRepository.createPost(args);
  }

  async getPostWithId(id: string): Promise<Post> {
    return await this.postRepository.getPostWithId(id);
  }

  async getPostWithSlug(slug: string): Promise<Post> {
    return await this.postRepository.getPostWithSlug(slug);
  }

  async getUsersPosts(args: PostGetUserPostsDTO): Promise<Post[]> {
    return await this.postRepository.getUsersPosts(args);
  }

  async udpatePost(id: string, args: PostUpdateDTO): Promise<Post> {
    return await this.postRepository.updatePost(id, args);
  }

  async deletePost(id: string): Promise<Post> {
    return await this.postRepository.deletePost(id);
  }
}
