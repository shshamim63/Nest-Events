import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

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
});
