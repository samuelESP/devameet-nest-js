import { Matches, MinLength } from "class-validator";
import { MeetMessagersHelper } from "../helpers/meetmessagers.helper";

export class CreateMeetDto {

    @MinLength(2,{message: MeetMessagersHelper.CREATE_NAME_NOT_VALID})
    name: string;

    @Matches(/[0-9A-Fa-f]{3,6}/, {message: MeetMessagersHelper.CREATE_COLOR_NOT_VALID})
    color: string;
}