import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let database: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/bv-service/svalidate/wrapper (POST)', () => {
    const endpoint = '/bv-service/svalidate/wrapper';

    it('should return success message, code, and images when given a valid BVN', async () => {
      const bvn = '12345678901';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message', 'Success');
      expect(response.body).toHaveProperty('code', '00');
      expect(response.body).toHaveProperty('bvn', bvn);
      expect(response.body).toHaveProperty('imageDetail');
      expect(response.body.imageDetail).not.toEqual('');
      expect(response.body).toHaveProperty('basicDetail');
      expect(response.body.basicDetail).not.toEqual('');
    });

    it('should return 400 error when given an empty BVN', async () => {
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn: '' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'One or more of your request parameters failed validation. Please retry',
      );
      expect(response.body).toHaveProperty('code', '400');
    });

    it('should return 400 error when given an invalid BVN (less than 11 digits)', async () => {
      const bvn = '1234567890';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'The searched BVN is invalid',
      );
      expect(response.body).toHaveProperty('code', '02');
      expect(response.body).toHaveProperty('bvn', bvn);
    });

    it('should return 400 error when given an invalid BVN (contains non-digits)', async () => {
      const bvn = '12a456b8901';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'The searched BVN is invalid',
      );
      expect(response.body).toHaveProperty('code', '400');
      expect(response.body).toHaveProperty('bvn', bvn);
    });

    it('should return 400 error when given an invalid BVN (does not exist)', async () => {
      const bvn = '99999999999';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'The searched BVN does not exist',
      );
      expect(response.body).toHaveProperty('code', '01');
      expect(response.body).toHaveProperty('bvn', bvn);
    });

    it('should return 400 error when given an empty BVN', async () => {
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn: '' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'One or more of your request parameters failed validation. Please retry',
      );
      expect(response.body).toHaveProperty('code', '400');
    }, 1000);

    it('should return 400 error when given an invalid BVN (less than 11 digits)', async () => {
      const bvn = '1234567890';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'The searched BVN is invalid',
      );
      expect(response.body).toHaveProperty('code', '02');
      expect(response.body).toHaveProperty('bvn', bvn);
    }, 1000);

    it('should return 400 error when given an invalid BVN (contains non-digits)', async () => {
      const bvn = '12a456b8901';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'The searched BVN is invalid',
      );
      expect(response.body).toHaveProperty('code', '400');
      expect(response.body).toHaveProperty('bvn', bvn);
    }, 1000);

    it('should return 400 error when given an invalid BVN (does not exist)', async () => {
      const bvn = '99999999999';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'message',
        'The searched BVN does not exist',
      );
      expect(response.body).toHaveProperty('code', '01');
      expect(response.body).toHaveProperty('bvn', bvn);
    }, 1000);

    it('should return success message, code, and basicDetail when given a valid BVN', async () => {
      const bvn = '12345678901';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message', 'Success');
      expect(response.body).toHaveProperty('code', '00');
      expect(response.body).toHaveProperty('bvn', bvn);
      expect(response.body).toHaveProperty('basicDetail');
      expect(response.body.basicDetail).not.toEqual('');
    }, 5000);

    it('should persist request and response payloads in the database', async () => {
      const bvn = '12345678901';
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ bvn })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('basicDetail');
      expect(response.body.basicDetail).not.toEqual('');
      expect(response.body.imageDetail).not.toEqual('');

      // Retrieve the persisted data from the database
      const persistedData = await database.getPayloads();

      // Check that the persisted data is correct
      expect(persistedData.length).toEqual(1);
      const persistedPayload = persistedData[0];
      const requestPayloadData = JSON.parse(persistedPayload.requestPayload);
      const responsePayloadData = JSON.parse(persistedPayload.responsePayload);
      expect(persistedPayload).toHaveProperty('requestPayload');
      expect(persistedPayload).toHaveProperty('responsePayload');
      expect(requestPayloadData).toHaveProperty('bvn', bvn);
      expect(responsePayloadData).toHaveProperty('basicDetail', response.body.basicDetail);
      expect(responsePayloadData).toHaveProperty('imageDetail', response.body.imageDetail);
    });

  });
});
