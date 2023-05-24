import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { EVENT_ROUTES } from './event/event.routes';

const Routes = [...EVENT_ROUTES];

@Module({
  imports: [RouterModule.register(Routes)],
  exports: [RouterModule],
})
export class AppRouteModule {}
