import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Auction } from 'src/entities/auction.entity';
import { Bid } from 'src/entities/bid.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'skillupmentor_project1',
      entities: [
        User,
        Auction,
        Bid,
      ],
      synchronize: true // NEVER USE IN PRODUCTION!
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
