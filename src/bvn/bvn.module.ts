import { Module, CacheModule } from '@nestjs/common';
import { BVNController } from './bvn.controller';
import { BVNService } from './bvn.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BvnSchema } from './infrastructures/mongo/bvn.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'BVN', schema: BvnSchema }]),
        CacheModule.register(),
    ],
    controllers: [BVNController],
    providers: [BVNService],
})
export class BVNModule { }
