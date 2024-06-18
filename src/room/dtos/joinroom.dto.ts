import { IsNotEmpty } from "class-validator";
import {RoomMessagesHelpers} from '../helpers/roommessages.helper'
export class JoinRoomDto {
    @IsNotEmpty({message:RoomMessagesHelpers.JOIN_USER_NOT_VALID})
    userId: string;

    @IsNotEmpty({message: RoomMessagesHelpers.ROOM_LINK_NOT_FOUND})
    link: string;
}