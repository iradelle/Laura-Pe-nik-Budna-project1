import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Exclude } from "class-transformer";
import { Bid } from "./bid.entity";
import { Auction } from "./auction.entity";

@Entity()
export class User extends Base {
    @Column({unique: true})
    email: string

    @Column({nullable: true})
    name: string

    @Column({nullable: true})
    surname: string

    @Column({nullable: true})
    avatar: string

    @Column({nullable: true})
    @Exclude()// will not show when searching for users
    password: string

    @OneToMany(() => Auction, (auction) => auction.auction_creator)
    auctions: User[]

    @OneToMany(() => Bid, (bid) => bid.bidder)
    bids: Bid[]
}