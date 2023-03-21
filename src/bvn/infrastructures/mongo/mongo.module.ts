import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/seamfix-bvn-validator'), // replace with your MongoDB URI
    ],
    exports: [MongooseModule],
})
export class MongoModule { }
