import { Injectable, Logger } from '@nestjs/common';
import { Meet, MeetDocument } from './schemas/meet.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMeetDto } from './dtos/createmeet.dto';
import { generateLink } from './helpers/linkgenerator.helper';

@Injectable()
export class MeetService{
    private readonly logger = new Logger(MeetService.name);

    constructor(
        @InjectModel(Meet.name) private readonly model: Model<MeetDocument>,
        private readonly userService: UserService
    ){}

    async getMeetsByUser(userId: String){
        this.logger.debug('getMeetsByUser - ' + userId);
        return await this.model.find({user: userId})
    }

    async createMeet(userId: String, dto:CreateMeetDto){
        this.logger.debug('createMeet - ' + userId);

        const user = await this.userService.getUserById(userId);

        const meet = {
            ...dto,
            user,
            link: generateLink()
        };

        const createMeet = new this.model(meet);
        return await createMeet.save();
    }

    async deleteMeetByUser(userId: String, meetId: string){
        this.logger.debug(`deleteMeetByUser - ${userId} - ${meetId} - `);
        return await this.model.deleteOne({user: userId, _id: meetId})
    }

}
