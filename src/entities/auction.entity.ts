import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Bid } from "./bid.entity";
import { User } from "./user.entity";


@Entity()
export class Auction extends Base {

    @Column()
    title: string

    @Column({nullable: true})
    description: string

    @Column()
    image: string

    @Column()
    starting_price: number

    @Column()
    end_date: Date

    @Column({
        default: true
    })
    is_active: boolean

    @ManyToOne(() => User, (user) => user.auctions)
    @JoinColumn({name: 'user_id'})
    auction_creator: User

    @OneToMany(() => Bid, (bid) => bid.auction)
    bids: Bid[]

}