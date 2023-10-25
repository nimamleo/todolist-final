import { Module } from '@nestjs/common';
import { IoModule } from './io/io.module';
import { ConfigModule } from '@nestjs/config';
import { httpConfigLoader } from './io/http/config/http.config';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    IoModule,
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['.env'],
      load: [httpConfigLoader],
    }),
    ApplicationModule,
  ],
})
export class AppModule {}
