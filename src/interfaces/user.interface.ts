import { BidStatus } from "src/entities/bid.entity"

export interface UserData {
    id: string
    email: string
    name?: string
    surname?: string
    avatar?: string
    auctions?: {
        title: string
        description?: string
        image?: string
        starting_price: number
        end_date: Date
        isActive: Boolean
        bids?: {
            bidder: {
                id: string
                email: string
                name?: string
                surname?: string
                avatar?: string
            }
            bid_price: number
            bid_time: Date
            bid_status: BidStatus
        }
    }
    bids?: {
        auction: {
            title: string
            description?: string
            image?: string
            starting_price: number
            end_date: Date
            isActive: Boolean
        }
        bid_price: number
        bid_time: Date
        bid_status: BidStatus
    }
}