import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventModule } from './event/event.module';
import { StallModule } from './stall/stall.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserInterceptor } from './user/interceptor/user.interceptor';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UserModule, EventModule, StallModule, ConfigModule.forRoot()],
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
      provide: APP_INTERCEPTOR,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
