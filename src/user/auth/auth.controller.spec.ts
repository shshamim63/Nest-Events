import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn().mockReturnValue({}),
            login: jest.fn().mockReturnValue({}),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    const userBody = {
      first_name: 'Shakhawat',
      last_name: 'Hossain',
      email: 'shshamim63@gmail.com',
      phone: '+8801671451201',
      password: '123456789',
    };
    it('Should call the signup auth service method', async () => {
      const mockSingup = jest.fn().mockReturnValue({});
      jest.spyOn(authService, 'signup').mockImplementation(mockSingup);
      await controller.signup(userBody);
      expect(mockSingup).toBeCalledWith(userBody);
    });
  });

  describe('login', () => {
    const loginCredential = {
      email: 'shshamim63@gmail.com',
      password: '123456789',
    };
    it('Should call the login auth service method', async () => {
      const mockLogin = jest.fn().mockReturnValue({});
      jest.spyOn(authService, 'login').mockImplementation(mockLogin);
      await controller.login(loginCredential);
      expect(mockLogin).toBeCalledWith(loginCredential);
    });
  });
});
