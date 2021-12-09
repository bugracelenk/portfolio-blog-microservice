import { PostController } from '@controllers/post.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from '@repositories/post.repository';
import { Post, PostSchema } from '@schemas/post.schema';
import { PostService } from '@services/post.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URI),
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          const schema = PostSchema;
          schema.pre('save', function () {
            if (this.isNew) {
              const objId = this._id;
              this.id = objId;
            }
          });

          return schema;
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        options: {
          urls: [process.env.RMQ_HOST],
          qeuue: 'USER_QUEUE',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
