import { EventStallModule } from 'src/event-stall/event-stall.module';
import { EventModule } from './event.module';

export const EVENT_ROUTES = [
  {
    path: 'events',
    module: EventModule,
    children: [
      {
        path: '/:eventId/stalls',
        module: EventStallModule,
      },
    ],
  },
];
