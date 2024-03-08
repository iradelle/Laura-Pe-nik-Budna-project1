import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareHash, hash } from 'src/utils/bcrypt';
import { PostgresErrorCode } from 'src/helpers/postgres-error-code.enum';

@Injectable()
export class UsersService extends AbstractService{
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
        super(usersRepository)
    }

    // CREATE USER
    async create(createUserDto: CreateUserDto) {
        // probamo najdit user-ja prek mail-a
        const user = await this.findBy({ email: createUserDto.email })

        // če že obstaja user s temu mail-u, vržemo error, ne more se ustvarit nov -> login
        if(user) {
            throw new BadRequestException('User with this email already exists, try logging in.')
        }

        // ustvari novega userja in če ne uspe, vrže error
        try{
            const newUser = this.usersRepository.create(createUserDto)
            return this.usersRepository.save(newUser)
        } catch (error) {
            console.error(error)
            throw new BadRequestException('Something went wrong while creating a user.')
        }
    }

    // UPDATE USER
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        // poiščemo userja z id
        const user = (await this.findById(id)) as User
        const {email, password, confirm_password, ...data} = updateUserDto

        // email update
        if(user.email !== email && email) {
            user.email = email
        } else if (email && user.email === email) {
            throw new BadRequestException('User with that email already exists.')
        }

        // password update
        if(password && confirm_password) {
            if(password !== confirm_password) {
                throw new BadRequestException('Passwords do not match.')
            }
            if(await compareHash(password, user.password)) {
                throw new BadRequestException('Password can not be the same as your old password.')
            }
            user.password = await hash(password)
        }

        // data update (other)
        try {
            Object.entries(data).map((entry) => {
                user[entry[0]] = entry[1]
            })
            return this.usersRepository.save(user)
        } catch (error) {
            console.error(error)
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new BadRequestException('User with that email already exists.')
            }

            throw new InternalServerErrorException('Something went wrong while updating the user.')
        }
    }

    // IMAGE UPDATE
    async updateUserImageId( id: string, image: string ): Promise<User> {
        const user = await this.findById(id)
        return this.update(user.id, { image })
    }
}
