import { IsArray, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";
import { CreateMeetDto } from "./createmeet.dto";
import { MeetMessagersHelper } from "../helpers/meetmessagers.helper";
import { Type } from "class-transformer";


export class UpdateMeet extends CreateMeetDto{

    @IsArray({message: MeetMessagersHelper.CREATE_OBJECT_NAME_NOT_VALID})
    @Type(() => UpdateMeetObjectDto)
    @ValidateNested({each:true})
    objects: Array<UpdateMeetObjectDto>

}

export class UpdateMeetObjectDto{
   
    @IsNotEmpty({message:MeetMessagersHelper.CREATE_NAME_NOT_VALID})
    name: string; 

    @IsNumber({}, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Min(2, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Max(8, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    x: number;

    @IsNumber({}, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Min(2, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Max(8, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    y: number; 

    @IsNumber({}, {message: MeetMessagersHelper.UPDATE_ZINDEX_NOT_VALID})
    zindex: number;

    @IsString({message: MeetMessagersHelper.UPDATE_ORIENTATION_NOT_VALID})
    orientation: string;
}