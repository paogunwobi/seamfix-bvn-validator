import { Controller, Post, Body } from '@nestjs/common';
import { BVNService } from './bvn.service';

@Controller('bv-service')
export class BVNController {
    constructor(private readonly bvnService: BVNService) { }

    @Post('svalidate/wrapper')
    async validateBVN(@Body() bvn: any): Promise<any> {
        return this.bvnService.validateBVN(bvn);
    }
}
