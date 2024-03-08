import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAuctionDto {
    @IsNotEmpty()
    @IsString({message: 'Auction title must be a string.'})
    title: string

    @IsOptional()
    @IsString({message: 'Auction description must be a string'})
    description?: string

    @IsOptional()
    @IsString({message: 'Image source must be a string.'})
    image?: string

    @IsNotEmpty()
    @IsNumber({}, {message: 'Starting price must be a number.'})
    starting_price: number

    @IsNotEmpty()
    @IsDateString({}, {message: 'End date must be a valid date string type.'})
    end_date: Date

    @IsNotEmpty()
    @IsBoolean({message: 'Activity status (is_active) must be of a boolean type'})
    is_active: boolean
}