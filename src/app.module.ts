import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserInterceptor } from './user/interceptor/user.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AppRouteModule } from './app-route.module';
import { StallModule } from './stall/stall.module';

@Module({
  imports: [
    UserModule,
    EventModule,
    PrismaModule,
    AppRouteModule,
    StallModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
