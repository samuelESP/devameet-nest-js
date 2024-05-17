import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auto.module';


@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
