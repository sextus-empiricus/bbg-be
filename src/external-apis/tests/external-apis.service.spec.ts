import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApisService } from '../external-apis.service';

describe('ExternalApisService', () => {
   let service: ExternalApisService;
   let httpService: HttpService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ExternalApisService,
            { provide: HttpService, useValue: {} },
         ],
      }).compile();

      service = module.get<ExternalApisService>(ExternalApisService);
      httpService = module.get<HttpService>(HttpService);
   });

   it('ExternalApisService should be defined', () => {
      expect(service).toBeDefined();
   });
   it('HttpService should be defined', () => {
      expect(service).toBeDefined();
   });
});
