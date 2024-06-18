import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Meet } from "src/meet/schemas/meet.schema";
import { User } from "src/user/schemas/user.schema";


export type PositionDocument = HydratedDocument<Position>

@Schema()
export class Position {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: Meet.name})
    meet: Meet;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    user: User;

    @Prop({required: true})
    name: String;

    @Prop({required: true})
    avatar: String;
    
    @Prop({required: true})
    clientId: String;
    
    @Prop({required: true})
    x: Number;
    
    @Prop({required: true})
    y:number;
    
    @Prop({required: true})
    orientation: String;
    
    @Prop({default: false})
    muted: boolean;
}


export const PositionSchema = SchemaFactory.createForClass(Position);