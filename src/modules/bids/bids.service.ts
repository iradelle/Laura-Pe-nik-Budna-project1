import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { Repository } from 'typeorm';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BidsService extends AbstractService{

    constructor(@InjectRepository(Bid) private readonly bidsRepository: Repository<Bid>) {
        super(bidsRepository)
    }

    // CREATE BID
    async create (createBidDto: CreateBidDto): Promise<Bid> {
        try{
            const newBid = this.bidsRepository.create(createBidDto)
            return this.bidsRepository.save(newBid)
        } catch (error) {
            console.error(error)
            throw new BadRequestException('Something went wrong while creating a bid.')
        }
    }

    // UPDATE BID
    async update (bidId: string, updateBidDto: UpdateBidDto): Promise<Bid> {
        // najdemo bid by id
        const bid = (await this.findById(bidId)) as Bid

        try{
            bid.bid_price = updateBidDto.bid_price
            bid.bid_time = updateBidDto.bid_time
            bid.bid_status = updateBidDto.bid_status
            return this.bidsRepository.save(bid)
        } catch(error) {
            console.error(error)
            throw new BadRequestException('Something went wrong while updating the bid.')
        }
    }

    // GET USER'S BID HISTORY
    async getBidHistory(userId: string): Promise<Bid[]> {

        // pridobi vse bide za enga userja
        const bids = await this.bidsRepository.find({where: {bidder: {id: userId}}})

        if(!bids || bids.length == 0) {
            throw new NotFoundException(`No bids were found for user with id: ${userId}`)
        }

        return bids
    }

    async getBidsForAuction(auctionId: string): Promise<Bid[]> {

        // pridobi vse bide za en auction
        const bids = await this.bidsRepository.find({where: {auction: {id: auctionId}}})

        if(!bids || bids.length == 0) {
            throw new NotFoundException(`No bids were found for auction with id: ${auctionId}`)
        }

        return bids
    }

}
