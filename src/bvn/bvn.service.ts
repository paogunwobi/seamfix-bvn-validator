import {
  Injectable,
  HttpException,
  HttpStatus,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BvnDto } from './dto/bvn.dto';
import { BvnRepository } from './infrastructures/mongo/bvn.repository';

@Injectable()
export class BVNService {
  constructor(
    private readonly bvnRepository: BvnRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) { }

  async validateBVN(createBVNDto: BvnDto): Promise<any> {
    const { bvn } = createBVNDto;
    let ImageDetail: string;
    let BasicDetail: string;

    // validate BVN format
    if (!/^\d{11}$/.test(bvn)) {
      throw new HttpException(
        {
          Message: 'The searched BVN is invalid',
          Code: 400,
          Bvn: bvn,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if BVN exists in cache
    const cachedBVN = await this.cacheManager.get(bvn);
    if (cachedBVN) {
      return cachedBVN;
    }

    // Check if BVN exists in database
    let bvnDetails = await this.bvnRepository.findByBvn(bvn);
    if (!bvnDetails) {
      // Fetch BVN details from third-party API if not found in database
      try {
        const apiResponse = await axios.get(
          `${this.configService.get('BVN_API_BASE_URL')}/${bvn}`,
        );
        bvnDetails = apiResponse.data;
      } catch (error) {
        throw new HttpException(
          {
            Message: 'The searched BVN does not exist',
            Code: '01',
            Bvn: bvn,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Save BVN details to database
      await this.bvnRepository.create({
        bvn: bvnDetails.bvn,
        imageDetail: bvnDetails.imageDetail,
        basicDetail: bvnDetails.basicDetail,
      });
    }

    // Cache the BVN details
    await this.cacheManager.set(bvn, bvnDetails);

    // Return the BVN details
    const responsePayload = {
      Message: 'Success',
      Code: '00',
      Bvn: bvn,
      ImageDetail,
      BasicDetail,
    };
    return responsePayload;
  }
}
