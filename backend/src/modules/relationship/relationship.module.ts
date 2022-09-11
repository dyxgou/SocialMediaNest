import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/index';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService],
})
export class RelationshipModule {}
