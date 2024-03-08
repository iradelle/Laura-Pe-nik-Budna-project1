import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { BidStatus } from "src/entities/bid.entity";

export class UpdateBidDto {    
    @IsNotEmpty()
    @IsNumber({}, { message: 'Bid price must be a number' })
    bid_price: number;

    @IsNotEmpty()
    @IsDateString({}, { message: 'Bid time must be a valid date string' })
    bid_time: Date;

    @IsNotEmpty()
    @IsEnum(BidStatus, { message: 'Bid status must be Winning or Outbid' })
    bid_status: BidStatus;
}
