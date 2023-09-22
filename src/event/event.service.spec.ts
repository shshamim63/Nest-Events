import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { POSTGRES_ERROR_CODE } from 'src/prisma/prisma.error.code';

describe('EventService', () => {
  let service: EventService;
  let prismaService: PrismaService;

  const eventParams = {
    name: 'Test',
    address: 'Testing Venue',
    when: new Date().toString(),
    description: 'This is a test event',
  };
  const eventResponse = {
    ...eventParams,
    id: 1,
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
  };

  const event = {
    id: 1,
    name: 'Test',
    address: 'Testing Venue',
    when: new Date().toString(),
    description: 'This is a test event',
    created_at: new Date(),
    updated_at: new Date(),
    stalls: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: PrismaService,
          useValue: {
            event: {
              create: jest.fn().mockReturnValue(eventResponse),
              delete: jest.fn().mockReturnValue(null),
              findMany: jest.fn().mockReturnValue([event]),
              findFirst: jest.fn().mockReturnValue(event),
            },
            stall: {
              deleteMany: jest.fn().mockReturnValue(null),
            },
          },
        },
      ],
    }).compile();
    service = module.get<EventService>(EventService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('addEvent', () => {
    it('Should throw Internal Server exception when Postgres cannot complete the command', async () => {
      jest.spyOn(prismaService.event, 'create').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.addEvent(eventParams, 1)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });

    it('Should return created event record', async () => {
      const mockCreateEvent = jest.fn().mockReturnValue({
        ...eventParams,
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        creator_id: 1,
      });

      jest
        .spyOn(prismaService.event, 'create')
        .mockImplementation(mockCreateEvent);

      const response = await service.addEvent(eventParams, 1);
      expect(mockCreateEvent).toBeCalledWith({
        data: {
          ...eventParams,
          when: new Date(eventParams.when),
          creator_id: 1,
        },
      });
      expect(response).toEqual({
        name: 'Test',
        address: 'Testing Venue',
        when: expect.any(String),
        description: 'This is a test event',
        id: 1,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        creator_id: 1,
      });
    });
  });

  describe('remove', () => {
    it('Should raise internal server error exception when server fails to remove stalls', async () => {
      jest.spyOn(prismaService.stall, 'deleteMany').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.remove(1)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });

    it('Should raise internal server error exception when server fails to remove event', async () => {
      const mockRemoveStall = jest.fn().mockReturnValue(true);
      jest
        .spyOn(prismaService.stall, 'deleteMany')
        .mockImplementation(mockRemoveStall);
      jest.spyOn(prismaService.event, 'delete').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.remove(1)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });

    it('Should raise not found exception when record with id does not exist', async () => {
      const mockRemoveStall = jest.fn().mockReturnValue(true);
      jest
        .spyOn(prismaService.stall, 'deleteMany')
        .mockImplementation(mockRemoveStall);
      jest.spyOn(prismaService.event, 'delete').mockImplementation(() => {
        throw Object.assign(new Error(), {
          code: POSTGRES_ERROR_CODE.doesNotExist,
        });
      });
      await expect(service.remove(2)).rejects.toThrowError(NotFoundException);
    });

    it('Should resolve request and delete event along with available stalls under the event', async () => {
      const mockRemoveStall = jest.fn().mockReturnValue(true);
      const mockRemoveEvent = jest.fn().mockReturnValue(true);
      jest
        .spyOn(prismaService.stall, 'deleteMany')
        .mockImplementation(mockRemoveStall);
      jest
        .spyOn(prismaService.event, 'delete')
        .mockImplementation(mockRemoveEvent);
      await service.remove(1);
      expect(mockRemoveStall).toBeCalledWith({
        where: {
          event_id: 1,
        },
      });
      expect(mockRemoveEvent).toBeCalledWith({
        where: {
          id: 1,
        },
      });
    });
  });

  describe('findAll', () => {
    it('Should return an array', async () => {
      const page = 2;
      const limit = 6;
      const mockPrismaFinaAll = jest.fn().mockReturnValue([event]);
      jest
        .spyOn(prismaService.event, 'findMany')
        .mockImplementation(mockPrismaFinaAll);
      await service.findAll(page, limit);
      expect(mockPrismaFinaAll).toBeCalledWith({
        select: {
          id: expect.any(Boolean),
          name: expect.any(Boolean),
          address: expect.any(Boolean),
          description: expect.any(Boolean),
          when: expect.any(Boolean),
          stalls: {
            select: {
              name: expect.any(Boolean),
            },
          },
        },
        skip: page * limit,
        take: limit,
      });
    });
  });

  describe('findOne', () => {
    it('Should return a record of event', async () => {
      const mockFindOne = jest.fn().mockReturnValue(event);
      jest
        .spyOn(prismaService.event, 'findFirst')
        .mockImplementation(mockFindOne);
      await service.findOne(1);
      expect(mockFindOne).toBeCalledTimes(1);
      expect(mockFindOne).toBeCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('Should raise internal server exception when database fails to resolve query', async () => {
      jest.spyOn(prismaService.event, 'findFirst').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.findOne(1)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });
});
