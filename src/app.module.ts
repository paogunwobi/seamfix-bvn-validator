import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BVNService } from './bvn/bvn.service';
import { BVNController } from './bvn/bvn.controller';
import { BVNSchema } from './schemas/bvn.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/seamfix-bvn-validator'),
    MongooseModule.forFeature([{ name: 'BVN', schema: BVNSchema }]),
  ],
  controllers: [BVNController],
  providers: [BVNService],
})
export class AppModule { }
