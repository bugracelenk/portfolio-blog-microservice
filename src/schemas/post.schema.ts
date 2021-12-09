import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ versionKey: false, timestamps: true })
export class Post {
  id: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: false,
    default: '',
  })
  desc: string;

  @Prop({
    required: true,
  })
  headerImage: string;

  @Prop({
    required: true,
  })
  body: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    required: true,
  })
  author: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
