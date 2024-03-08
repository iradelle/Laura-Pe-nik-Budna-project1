import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Auction } from "./auction.entity";

export enum BidStatus {
    Winning = 'Winning',
    Outbid = 'Outbid'
}

@Entity()
export class Bid extends Base {

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    bidder: User

    @ManyToOne(() => Auction, (auction) => auction.bids)
    @JoinColumn({name: 'auction_id'})
    auction: Auction

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    bid_price: number

    @Column({
        type: 'timestamp'
    })
    bid_time: Date

    @Column()
    bid_status: BidStatus


}