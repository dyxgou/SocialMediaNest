import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/index';
import { Model } from 'mongoose';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async sendPetition(userIdToSend: string, userId: string) {
    if (userIdToSend === userId) {
      throw new BadRequestException(
        "You can't send a relationship petition to yourself",
      );
    }

    const [userSending, userToSend] = await Promise.all([
      this.userSchema.findById(userId, { relationship: true }),
      this.userSchema.findById(userIdToSend, { suitors: true }),
    ]);

    if (!userSending || !userToSend) {
      throw new NotFoundException("Some of the two users don't exists");
    }

    if (userSending.relationship) {
      throw new BadRequestException(
        'The user sending the petition have relationship currently',
      );
    }

    if (userToSend.suitors.includes(userSending._id)) {
      throw new BadRequestException('You has sent a relation petition');
    }

    try {
      await userToSend.updateOne({
        $addToSet: {
          suitors: userSending._id,
        },
      });

      return { suitorId: userSending.id };
    } catch (error) {
      throw new BadRequestException(
        { error },
        'Error sending the relationship petition',
      );
    }
  }

  async rejectPetition(userIdToReject: string, userId: string) {
    if (userIdToReject === userId) {
      throw new BadRequestException(
        "You can't reject a relationship petition to yourself",
      );
    }

    const [userRejecting, userToReject] = await Promise.all([
      this.userSchema.findById(userId, { suitors: true }),
      this.userSchema.findById(userIdToReject, { _id: true }),
    ]);

    if (!userRejecting || !userToReject) {
      throw new NotFoundException("Some of the two users doesn't exists");
    }

    if (!userRejecting.suitors.includes(userToReject._id)) {
      throw new BadRequestException(
        "This user hasn't sent you a relation petition",
      );
    }

    try {
      await userRejecting.updateOne({
        $pull: {
          suitors: userToReject._id,
        },
      });

      return { userRejected: userToReject._id };
    } catch (error) {
      throw new BadRequestException({ error }, 'Error rejecting this user');
    }
  }

  async acceptPetition(userIdToAccept: string, userId: string) {
    if (userIdToAccept === userId) {
      throw new BadRequestException(
        "You can't accept a relationship to yourself",
      );
    }

    const [userAccepting, userToAccept] = await Promise.all([
      this.userSchema.findById(userId),
      this.userSchema.findById(userIdToAccept),
    ]);

    if (!userAccepting || !userToAccept) {
      throw new NotFoundException("Some of the two users hasn't found");
    }

    if (!userAccepting.suitors.includes(userToAccept._id)) {
      throw new BadRequestException(
        "This user hasn't sent you a relationship petition",
      );
    }

    try {
      const updatedUserAccepting = userAccepting.updateOne({
        $set: { relationship: userToAccept._id },
        $pull: { suitors: userToAccept._id },
      });

      const updatedUserToAccept = userToAccept.updateOne({
        $set: { relationship: userAccepting._id },
      });

      await Promise.all([updatedUserAccepting, updatedUserToAccept]);

      return { areTheyRelationship: true };
    } catch (error) {
      throw new BadRequestException(
        { error },
        'There is an error accepting the relationship',
      );
    }
  }

  async finishRelationship(userId: string) {
    const user = await this.userSchema.findById(userId, { relationship: true });

    if (!user.relationship) {
      throw new BadRequestException("This user don't have a relationship");
    }

    try {
      const updatedFinishingUser = user.updateOne({
        $set: { relationship: null },
      });

      const updatedFinishedUser = this.userSchema.findByIdAndUpdate(
        user.relationship,
        {
          $set: { relationship: null },
        },
      );

      await Promise.all([updatedFinishingUser, updatedFinishedUser]);

      return { isFinished: true };
    } catch (error) {
      throw new BadRequestException(
        { error },
        'Error finishing the relationship',
      );
    }
  }
}
