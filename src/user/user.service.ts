import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { RegisterDto } from "./dtos/register.dto";
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

    async create(dto: RegisterDto){
        dto.password = CryptoJS.AES.encrypt(dto.password, process.env.USER_CYPHER_SECRET_KEY).toString();
        User.name
        const createUser = new this.userModel(dto);
        await createUser.save();
        
    }

    async existsByEmail(email:string) : Promise<boolean> {
        const result  = await this.userModel.findOne({email})
        
        
        if(result){
            return true
        }
        return false;
    }
}