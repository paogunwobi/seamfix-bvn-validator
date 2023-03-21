import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bvn, BvnDocument } from './bvn.schema';

@Injectable()
export class BvnRepository {
    public constructor(
        @InjectModel(Bvn.name) private readonly bvnModel: Model<BvnDocument>,
    ) { }

    async findByBvn(bvn: string): Promise<BvnDocument> {
        return this.bvnModel.findOne({ bvn }).exec();
    }

    async create(createBvnDto: any) {
        const createdBvn = new this.bvnModel(createBvnDto);
        return createdBvn.save();
    }
}
