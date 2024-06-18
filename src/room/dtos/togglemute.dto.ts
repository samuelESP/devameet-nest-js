import { IsBoolean} from "class-validator";
import { JoinRoomDto } from "./joinroom.dto";
import { RoomMessagesHelpers } from "../helpers/roommessages.helper";

export class ToggleMuteDto extends JoinRoomDto {
    
    @IsBoolean({message: RoomMessagesHelpers.MUTE_NOT_VALID})
    muted: boolean;
}