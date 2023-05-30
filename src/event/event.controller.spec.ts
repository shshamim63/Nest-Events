import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('EventController', () => {
  let controller: EventController;
  let eventService: EventService;

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
      await controller.findAll();
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
});
