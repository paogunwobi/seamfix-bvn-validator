import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BvnDocument = Bvn & Document;

@Schema()
export class Bvn {
    @Prop({ required: true })
    bvn: string;

    @Prop({ required: true })
    basicDetail: string;

    @Prop({ required: true })
    imageDetail: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    dateOfBirth: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    requestPayload: string; // or object type if needed

    @Prop()
    responsePayload: string; // or object type if needed
}

export const BvnSchema = SchemaFactory.createForClass(Bvn);
