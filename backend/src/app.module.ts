import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { RelationshipModule } from './modules/relationship/relationship.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({ isGlobal: true }),

    // Mongoose Connection
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: 'SocialMediaDB',
    }),

    // Auth Module
    AuthModule,
    // User Module
    UserModule,
    // Relationship Module
    RelationshipModule,
    // Post Module
    PostModule,
  ],
})
export class AppModule {}
