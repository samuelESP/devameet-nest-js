import { IsNumber, IsString, Max, Min } from "class-validator";
import { JoinRoomDto } from "./joinroom.dto";
import { MeetMessagersHelper } from "src/meet/helpers/meetmessagers.helper";

export class UpdateUserPositionDto extends JoinRoomDto {
    @IsNumber({}, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Min(0, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Max(8, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    x: number;

    @IsNumber({}, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Min(0, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    @Max(8, {message: MeetMessagersHelper.UPDATE_XY_NOT_VALID})
    y:number;
    
    @IsString({message: MeetMessagersHelper.UPDATE_ORIENTATION_NOT_VALID})
    orientation: string;
}