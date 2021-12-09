import { PostCreateDTO } from '@dtos/post.create.dto';
import { PostGetUserPostsDTO } from '@dtos/post.get_user.dto';
import { PostUpdateDTO } from '@dtos/post.update.dto';
import { sendAck } from '@helpers/sendAck';
import { Controller, HttpStatus } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Patterns } from '@patterns';
import { PostResponse } from '@responses/post.response';
import { PostService } from '@services/post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern(Patterns.CREATE_POST)
  async createPost(
    @Payload() args: PostCreateDTO,
    @Ctx() context: RmqContext,
  ): Promise<PostResponse> {
    const post = await this.postService.createPost(args);
    if (!post) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'POST_CREATE_ERROR',
      };
    }

    sendAck(context);
    return {
      status: HttpStatus.OK,
      result: { ...post },
    };
  }

  @MessagePattern(Patterns.GET_WITH_ID)
  async getWithId(
    @Payload() { id }: { id: string },
    @Ctx() context: RmqContext,
  ): Promise<PostResponse> {
    const post = await this.postService.getPostWithId(id);
    if (!post) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'POST_GET_WITH_ID_ERROR',
      };
    }

    sendAck(context);
    return {
      status: HttpStatus.OK,
      result: { ...post },
    };
  }

  @MessagePattern(Patterns.GET_WITH_SLUG)
  async getWithSlug(
    @Payload() { slug }: { slug: string },
    @Ctx() context: RmqContext,
  ): Promise<PostResponse> {
    const post = await this.postService.getPostWithSlug(slug);
    if (!post) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'POST_GET_WITH_SLUG_ERROR',
      };
    }

    sendAck(context);
    return {
      status: HttpStatus.OK,
      result: { ...post },
    };
  }

  @MessagePattern(Patterns.GET_BY_USER)
  async getByUser(
    @Payload() args: PostGetUserPostsDTO,
    @Ctx() context: RmqContext,
  ): Promise<PostResponse> {
    const posts = await this.postService.getUsersPosts(args);
    if (!posts) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'POST_GET_BY_USER_ERROR',
      };
    }

    sendAck(context);
    return {
      status: HttpStatus.OK,
      result: { ...posts },
    };
  }

  @MessagePattern(Patterns.UPDATE)
  async updatePost(
    @Payload() { args, id }: { args: PostUpdateDTO; id: string },
    @Ctx() context: RmqContext,
  ): Promise<PostResponse> {
    const post = await this.postService.udpatePost(id, args);
    if (!post) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'POST_UPDATE_ERROR',
      };
    }

    sendAck(context);
    return {
      status: HttpStatus.OK,
      result: { ...post },
    };
  }

  @MessagePattern(Patterns.UPDATE)
  async deletePost(
    @Payload() { id }: { id: string },
    @Ctx() context: RmqContext,
  ): Promise<PostResponse> {
    const post = await this.postService.deletePost(id);
    if (!post) {
      sendAck(context);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'POST_DELETE_ERROR',
      };
    }

    sendAck(context);
    return {
      status: HttpStatus.OK,
      message: 'POST DELETED SUCCESSFULLY',
    };
  }
}
