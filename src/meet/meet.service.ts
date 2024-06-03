import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Meet, MeetDocument } from './schemas/meet.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMeetDto } from './dtos/createmeet.dto';
import { generateLink } from './helpers/linkgenerator.helper';
import { MeetObject, MeetObjectDocument } from './schemas/meetobject.schema';
import { UpdateMeet, UpdateMeetObjectDto } from './dtos/updatemeet.dto';
import { MeetMessagersHelper } from './helpers/meetmessagers.helper';

@Injectable()
export class MeetService{
    private readonly logger = new Logger(MeetService.name);

    constructor(
        @InjectModel(Meet.name) private readonly model: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel: Model<MeetObjectDocument>,
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

    async getMeetObjects(meetId: string, userId:string){
        this.logger.debug(`getMeetObjcts - ${userId} - ${meetId}`);
        const user = await this.userService.getUserById(userId);
        const meet = await this.model.findOne({user, _id: meetId});

        return await this.objectModel.find({meet})
    }

    async updateMeet(meetId: string, userId:string, dto : UpdateMeet){
        this.logger.debug(`update - ${userId} - ${meetId}`);
        const user = await this.userService.getUserById(userId);
        const meet = await this.model.findOne({user, _id: meetId});

        if(!meet){
            throw new BadRequestException(MeetMessagersHelper.UPDATE_MEET_NOT_FOUND);
        }

        meet.name = dto.name;
        meet.color = dto.color;
        await this.model.findByIdAndUpdate({_id: meetId}, meet);

        await this.objectModel.deleteMany({meet});

        let objectPayload;
        for (const object of dto.objects) {
            objectPayload = {
                meet,
                ...object
            }
            await this.objectModel.create(objectPayload);
        }
    }

}
