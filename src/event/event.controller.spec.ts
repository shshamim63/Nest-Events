import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('EventController', () => {
  let controller: EventController;
  let eventService: EventService;

  const eventParams = {
    name: 'Testing Event',
    address: 'South Building',
    description: 'Tech event',
    when: new Date().toString(),
  };

  const user = {
    id: 1,
    email: 'test@demo.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            findAll: jest.fn().mockReturnValue([]),
            findOne: jest.fn().mockReturnValue({}),
            addEvent: jest.fn().mockReturnValue({}),
            updateEvent: jest.fn().mockReturnValue({}),
            remove: jest.fn().mockReturnValue(null),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
  });

  describe('findAll', () => {
    it('Should call the findAll method once', async () => {
      const mockFindAll = jest.fn().mockReturnValue([]);
      jest.spyOn(eventService, 'findAll').mockImplementation(mockFindAll);
      await controller.findAll(1, 5);
      expect(mockFindAll).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('Should call the findOne method once', async () => {
      const mockFindOne = jest.fn().mockReturnValue({});
      jest.spyOn(eventService, 'findOne').mockImplementation(mockFindOne);
      await controller.findOne(5);
      expect(mockFindOne).toBeCalledTimes(1);
    });
  });

  describe('create', () => {
    it('Should call the create method with the correct parameters', async () => {
      const mockAddEvent = jest.fn().mockReturnValue({
        ...eventParams,
        id: 1,
        createAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(eventService, 'addEvent').mockImplementation(mockAddEvent);
      await controller.create(eventParams, user);
      expect(mockAddEvent).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('Should call the update method when receives correct parameters', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        ...eventParams,
        id: 1,
        createAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(eventService, 'updateEvent').mockImplementation(mockUpdate);
      await controller.update(1, eventParams);
      expect(mockUpdate).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('Should call the remove method when recives correct id', async () => {
      const mockRemove = jest.fn().mockReturnValue(null);
      jest.spyOn(eventService, 'remove').mockImplementation(mockRemove);
      await controller.remove(1);
      expect(mockRemove).toBeCalledWith(1);
    });
  });
});
