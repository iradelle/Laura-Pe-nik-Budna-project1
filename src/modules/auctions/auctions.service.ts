import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from 'src/entities/auction.entity';
import { Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Injectable()
export class AuctionsService extends AbstractService {

    constructor(@InjectRepository(Auction) private readonly auctionsRepository: Repository<Auction>) {
        super(auctionsRepository)
    }

    // CREATE AUCTION
    async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
        try {
            const newAuction = this.auctionsRepository.create(createAuctionDto)
            return this.auctionsRepository.save(newAuction)
        } catch(error) {
            console.error(error)
            throw new BadRequestException('Something went wrong while creating an auction.')
        }
    }

    // UPDATE AUCTION
    async update(auctionId: string, updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
        // find auction by id
        const auction = (await this.findById(auctionId)) as Auction

        try{
            auction.title = updateAuctionDto.title
            auction.description = updateAuctionDto.description
            auction.end_date = updateAuctionDto.end_date
            auction.starting_price = updateAuctionDto.starting_price
            auction.is_active = updateAuctionDto.is_active
            auction.image = updateAuctionDto.image
            return this.auctionsRepository.save(auction)
        } catch(error) {
            console.error(error)
            throw new BadRequestException('Something went wrong while updating an auction')
        }
    }

    // UPDATE AUCTION PRODUCT IMAGE
    async updateAuctionImage(id: string, image: string): Promise<Auction> {

        // find auction by id
        const auction = (await this.findById(id)) as Auction

        return this.update(auction.id, {...auction, image})
    }

    // GET ALL AUCTIONS FOR A SPECIFIC USER
    async getAuctionsForUser(userId: string): Promise<Auction[]> {

        // find auctions for user with userId
        const auctions = await this.auctionsRepository.find({where: {auction_creator: {id: userId}}})

        if(!auctions || auctions.length == 0) {
            throw new NotFoundException('No auctions were found for that user.')
        }

        return auctions
    }

}
