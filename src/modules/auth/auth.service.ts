import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { hash } from 'src/utils/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    // REGISTER USER
    async register(registerUserDto: RegisterUserDto): Promise<User> {

        // preverimo, če je email že registered
        const existingUser = await this.usersService.findBy({email: registerUserDto.email})
        if(existingUser) {
            throw new BadRequestException('User with this email already exists.')
        }

        // ustvarimo userja
        const hashedPassword = await hash(registerUserDto.password)
        const user = await this.usersService.create({
            ...registerUserDto,
            password: hashedPassword
        })

        return user
    }

    // LOGIN USER
    async login(loginUserDto: LoginUserDto): Promise<User> {
        const {email, password} = loginUserDto

        // find user by email
        const user = await this.usersService.findBy(email)
        if(!user || (loginUserDto.password != user.password)) {
            throw new UnauthorizedException('Invalid credentials.')
        }

        // access token
        const accessToken = this.generateToken(user)

        return user
    }

    // GENERATE TOKEN
    async generateToken(user: User): Promise<string> {
        const payload = {email: user.email, sub: user.id}
        return this.jwtService.sign(payload)
    }
}
