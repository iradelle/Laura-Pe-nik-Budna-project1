import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from 'src/entities/bid.entity';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateBidDto } from './dto/update-bid.dto';


@Controller('bids')
export class BidsController {

    constructor(private readonly bidsService: BidsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createBidDto: CreateBidDto): Promise<Bid> {
        return this.bidsService.create(createBidDto)
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto): Promise<Bid> {
        return this.bidsService.update(id, updateBidDto)
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<Bid> {
        return this.bidsService.remove(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('bid-history/:userId')
    async getBidHistory(@Param('userId') userId: string): Promise<Bid[]> {
        // Retrieve bid history for the user
        return this.bidsService.getBidHistory(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('auction/:auctionId')
    async getBidsForAuction(@Param('auctionId', ParseUUIDPipe) auctionId: string): Promise<Bid[]> {
        // Retrieve bids for a specific auction
        return this.bidsService.getBidsForAuction(auctionId);
    }
}
