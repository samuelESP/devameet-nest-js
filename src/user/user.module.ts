import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "./schemas/user.schema";
import { UserService } from "./user.service";


@Module({
    imports: [MongooseModule.forFeature([{name: User.name , schema: userSchema}])],
    controllers: [],
    providers: [UserService],
    exports: [MongooseModule, UserService]
})

export class UserModule{};