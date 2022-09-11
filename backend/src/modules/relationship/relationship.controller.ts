import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { GetUserId } from 'src/decorators/getUser.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RelationshipService } from './relationship.service';

@Controller('relation')
@UseGuards(JwtGuard)
export class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}

  @Patch('send/:userId')
  sendPetition(
    @Param('userId') userIdToSend: string,
    @GetUserId() userId: string,
  ) {
    return this.relationshipService.sendPetition(userIdToSend, userId);
  }

  @Patch('reject/:userId')
  rejectPetition(
    @Param('userId') userIdToReject: string,
    @GetUserId() userId: string,
  ) {
    return this.relationshipService.rejectPetition(userIdToReject, userId);
  }

  @Patch('accept/:userId')
  acceptPetition(
    @Param('userId') userIdToAccept: string,
    @GetUserId() userId: string,
  ) {
    return this.relationshipService.acceptPetition(userIdToAccept, userId);
  }

  @Patch('finish')
  finishRelationship(@GetUserId() userId: string) {
    return this.relationshipService.finishRelationship(userId);
  }
}
