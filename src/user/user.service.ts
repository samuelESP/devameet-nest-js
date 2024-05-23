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

    async getUserByLoginPassword(email: String, password: String): Promise<UserDocument|null> {
        console.log(email, password);
        
        const user  = await this.userModel.findOne({ email }) as UserDocument;
        
        
        if(user){
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.USER_CYPHER_SECRET_KEY);
            
            
            const savedPassword = bytes.toString(CryptoJS.enc.Utf8);

            
            if(password == savedPassword){
                return user
            }
        }

        return null
    }

    async getUserById(id: String){
        return await this.userModel.findById(id);
    }
}