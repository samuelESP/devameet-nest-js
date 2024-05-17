import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { MessagesHelper } from "./helpers/messages.helper";


@Injectable()
export class AuthService{

    login(dto: LoginDto){
        if(dto.login !== "teste@teste.com" || dto.password !== "testando"){
            throw new BadRequestException(MessagesHelper.AUTH_PASSWORD_0R_LOGIN_NOT_FOUND)
        }
        return dto;
    }
}