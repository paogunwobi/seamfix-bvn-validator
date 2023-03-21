import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/common';
import { BvnDto } from './dto/bvn.dto';
import { BVNService } from './bvn.service';
import { BvnRepository } from './infrastructures/mongo/bvn.repository';
import { ConfigService } from '@nestjs/config';

describe('BvnService', () => {
    let service: BVNService;

    const mockBvnModel = {
        findOne: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            imports: [CacheModule.register()],
            providers: [
                BVNService,
                {
                    provide: getModelToken('Bvn'),
                    useValue: mockBvnModel,
                },
                {
                    provide: BvnRepository,
                    useValue: { findByBvn: jest.fn(), create: jest.fn() }
                },
                {
                    provide: ConfigService,
                    useValue: {}
                },
                {
                    provide: 'AXIOS_INSTANCE_TOKEN',
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BVNService>(BVNService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateBVN', () => {
        it('should throw an error if bvn is empty', async () => {
            const result = await service.validateBVN({ bvn: '' } as BvnDto);
            expect(result.code).toEqual(400);
            expect(result.message).toEqual(
                'One or more of your request parameters failed validation. Please retry',
            );
            expect(result.bvn).toEqual('');
        });

        it('should return an error if bvn is less than 11 characters', async () => {
            const result = await service.validateBVN({ bvn: '1234567890' } as BvnDto);
            expect(result.code).toEqual(2);
            expect(result.message).toEqual('The searched BVN is invalid');
            expect(result.bvn).toEqual('1234567890');
        });

        it('should return an error if bvn contains non-digit characters', async () => {
            const result = await service.validateBVN({ bvn: '1234567890A' } as BvnDto);
            expect(result.code).toEqual(400);
            expect(result.message).toEqual('The searched BVN is invalid');
            expect(result.bvn).toEqual('1234567890A');
        });

        it('should return an error if bvn is not found in the database and cannot be fetched from third party API', async () => {
            mockBvnModel.findOne.mockReturnValueOnce(undefined);
            const result = await service.validateBVN({ bvn: '12345678901' } as BvnDto);
            expect(result.code).toEqual(1);
            expect(result.message).toEqual('The searched BVN does not exist');
            expect(result.bvn).toEqual('12345678901');
        });

        it('should return an error if bvn is not found in the database and third party API returns error', async () => {
            mockBvnModel.findOne.mockReturnValueOnce(undefined);
            const result = await service.validateBVN({ bvn: '12345678901' } as BvnDto);
            expect(result.code).toEqual(1);
            expect(result.message).toEqual('The searched BVN does not exist');
            expect(result.bvn).toEqual('12345678901');
        });

        it('should return basic and image details if bvn is found in the database', async () => {
            mockBvnModel.findOne.mockResolvedValueOnce({
                _id: '123',
                bvn: '12345678901',
                basicDetail: 'basic detail',
                imageDetail: 'image detail',
            });
            const result = await service.validateBVN({ bvn: '12345678901' } as BvnDto);
            expect(result.code).toEqual(0);
            expect(result.message).toEqual('Success');
            expect(result.bvn).toEqual('12345678901');
            expect(result.basicDetail).toEqual('basic detail');
            expect(result.imageDetail).toEqual('image detail');
        });

        it('should fetch and save bvn details from third party API if not found in the database', async () => {
            mockBvnModel.findOne.mockReturnValueOnce(undefined);
            mockBvnModel.create.mockResolvedValueOnce({
                _id: '123',
                bvn: '12345678901',
                basicDetail: 'basic detail',
                imageDetail: 'image detail',
            });
            const result = await service.validateBVN({ bvn: '12345678901' } as BvnDto);
            expect(result.code).toEqual(0);
            expect(result.message).toEqual('Success');
            expect(result.bvn).toEqual('12345678901');
            expect(result.basicDetail).toEqual('basic detail');
            expect(result.imageDetail).toEqual('image detail');
            expect(mockBvnModel.create).toHaveBeenCalledWith({
                bvn: '12345678901',
                basicDetail: 'basic detail',
                imageDetail: 'image detail',
            });
        });
    });
});
