import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService;

  const prismaUserResponse = {
    id: 1,
    first_name: 'Shakhawat',
    last_name: 'Hossain',
    email: 'shshamim63@gmail.com',
    phone: '+8801671451201',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockReturnValue(prismaUserResponse),
              findUnique: jest.fn().mockReturnValue(false),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('signUp', () => {
    const userBody = {
      first_name: prismaUserResponse.first_name,
      last_name: prismaUserResponse.last_name,
      email: prismaUserResponse.email,
      password: '123456789',
      phone: prismaUserResponse.phone,
    };
    it('Should call prisma user.create with correct parameter', async () => {
      const mockPrismaCreateUser = jest
        .fn()
        .mockReturnValue(prismaUserResponse);
      const mockBcryptHash = jest.fn().mockReturnValue('123456789');

      jest.spyOn(bcrypt, 'hash').mockImplementation(mockBcryptHash);
      jest
        .spyOn(prismaService.user, 'create')
        .mockImplementation(mockPrismaCreateUser);

      await service.signup(userBody);

      expect(mockPrismaCreateUser).toBeCalledWith({
        data: {
          ...userBody,
          user_type: UserType.VISITOR,
        },
      });
    });

    it('Should throw conflict exception when user with email already exist', () => {
      const prismaFindUnique = jest.fn().mockReturnValue(true);
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(prismaFindUnique);

      expect(service.signup(userBody)).rejects.toThrowError(ConflictException);
    });

    it('Should throw internal server exception when prisma service failed to save record', () => {
      const mockBcryptHash = jest.fn().mockReturnValue('123456789');

      jest.spyOn(bcrypt, 'hash').mockImplementation(mockBcryptHash);
      jest.spyOn(prismaService.user, 'create').mockImplementation(() => {
        throw new Error();
      });

      expect(service.signup(userBody)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    const loginCredential = {
      email: 'shshamim63@gmail.com',
      password: '123456789',
    };
    it('Should thorw unauthorized exception when user with email does not exist', () => {
      const prismaFindUnique = jest.fn().mockReturnValue(false);
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(prismaFindUnique);

      expect(service.login(loginCredential)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('Should throw unauthorized exception when password is invalid', () => {
      const prismaFindUnique = jest.fn().mockReturnValue(true);
      const mockBcryptCompare = jest.fn().mockReturnValue(false);
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(prismaFindUnique);

      jest.spyOn(bcrypt, 'compare').mockImplementation(mockBcryptCompare);

      expect(service.login(loginCredential)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('Should provide response with containing token property', async () => {
      const prismaFindUnique = jest.fn().mockReturnValue(true);
      const mockBcryptCompare = jest.fn().mockReturnValue(true);
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(prismaFindUnique);

      jest.spyOn(bcrypt, 'compare').mockImplementation(mockBcryptCompare);
      const response = await service.login(loginCredential);
      expect(response.token).toBeTruthy();
    });
  });
});
