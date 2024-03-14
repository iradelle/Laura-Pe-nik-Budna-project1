import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Auction } from 'src/entities/auction.entity';
import { PaginatedResult } from 'src/interfaces/paginated.result.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtentionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('auctions')
export class AuctionsController {

    constructor(private readonly auctionsService: AuctionsService) {

    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('page') page: number): Promise<PaginatedResult> {
        return this.auctionsService.paginate(page)
    }

    @Get(':id')
    async findOne(@Query('id') id: string): Promise<Auction> {
        return this.auctionsService.findById(id)
    }

    @Get('auctions/:userId')
    async getAuctionsForUser(@Param('userId') userId: string): Promise<Auction[]> {
        return this.auctionsService.getAuctionsForUser(userId)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
        return this.auctionsService.create(createAuctionDto)
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    @HttpCode(HttpStatus.CREATED)
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Param('id') auctionId: string): Promise<Auction> {
        const filename = file?.filename

        if(!filename) throw new BadRequestException('File must ne png, jpg or jpeg.')

        const imagesFolderPath = join(process.cwd(), 'files')
        const fullImagePath = join(imagesFolderPath + '/' + file.filename)

        if (await isFileExtentionSafe(fullImagePath)) {
            return this.auctionsService.updateAuctionImage(auctionId, filename)
        }

        removeFile(fullImagePath)
        throw new BadRequestException('File content does not match extention.')
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
        return this.auctionsService.update(id, updateAuctionDto)
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<Auction> {
        return this.auctionsService.remove(id)
    }


}
