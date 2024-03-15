import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/entities/user.entity';
import { Public } from 'src/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { UserData } from 'src/interfaces/user.interface';
import { Request } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/auth.interface';

@UseGuards(JwtAuthGuard)
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(private readonly authService: AuthService) {

    }

    // REGISTER
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        return this.authService.register(registerUserDto)
    }

    // LOGIN
    @Public()
    @UseGuards(JwtAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body(ValidationPipe) loginUserDto: LoginUserDto): Promise<User> {
        return this.authService.login(loginUserDto)
    }

    // SIGN-OUT
    @UseGuards(JwtAuthGuard)
    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@Res({passthrough: true}) response: Response): Promise<void> {
        response.clearCookie('access_token')
    }

    // GET CURRENT USER
    @UseGuards(JwtAuthGuard)
    @Get('me')
    @HttpCode(HttpStatus.OK)
    async getCurrentUser(@Req() request: RequestWithUser): Promise<UserData> {
        const user = await request.user

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            avatar: user.avatar
        }
    }
}
