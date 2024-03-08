import { Equals, IsEmail, IsNotEmpty, IsOptional, Matches, isEmail, isNotEmpty } from "class-validator"
import { Match } from "src/decorators/match.decorator" 
import { ApiProperty } from "@nestjs/swagger"
export class CreateUserDto {
    @ApiProperty({required: false})
    @IsOptional()
    name?: string

    @ApiProperty({required: false})
    @IsOptional()
    surname?: string

    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({required: true})
    @IsNotEmpty()
    @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
        message: 'Password must have at least one number, lower and uppercase letetr and it has to be longer then 5 characters.'
    })
    password: string

    @ApiProperty({required: true})
    @IsNotEmpty()
    @Match(CreateUserDto, (field) => field.password, {message: 'Passwords do not match.'})
    confirm_password: string
}