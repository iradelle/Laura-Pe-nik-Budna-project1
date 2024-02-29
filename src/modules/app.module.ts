import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'skillupmentor_project1',
      entities: [],
      synchronize: true // NEVER USE IN PRODUCTION!
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
