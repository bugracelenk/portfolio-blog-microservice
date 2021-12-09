import { PostCreateDTO } from '@dtos/post.create.dto';
import { PostGetUserPostsDTO } from '@dtos/post.get_user.dto';
import { PostUpdateDTO } from '@dtos/post.update.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '@schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async createPost(args: PostCreateDTO): Promise<Post> {
    return await this.postModel.create(args);
  }

  async getPostWithId(id: string): Promise<Post> {
    return await this.postModel.findById(id);
  }

  async getPostWithSlug(slug: string): Promise<Post> {
    return await this.postModel.findOne({ slug });
  }

  async getUsersPosts({
    profileId,
    limit,
    skip,
  }: PostGetUserPostsDTO): Promise<Post[]> {
    return await this.postModel
      .find({ author: profileId })
      .limit(limit)
      .skip(skip);
  }

  async updatePost(id: string, args: PostUpdateDTO): Promise<Post> {
    return await this.postModel.findByIdAndUpdate(
      id,
      { $set: args },
      { upsert: true, new: true },
    );
  }

  async deletePost(id: string): Promise<Post> {
    return await this.postModel.findByIdAndDelete(id);
  }
}
