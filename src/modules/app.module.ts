import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Auction } from 'src/entities/auction.entity';
import { Bid } from 'src/entities/bid.entity';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PWD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Auction,
        Bid,
      ],
      synchronize: true // NEVER USE IN PRODUCTION!
    }),
    UsersModule,
    AuctionsModule,
    BidsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
