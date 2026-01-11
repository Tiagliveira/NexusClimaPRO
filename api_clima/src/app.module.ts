import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true

    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
      ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://127.0.0.1:27017/nexus_clima_db',

      }),
      inject: [ConfigService],
    }),

    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
