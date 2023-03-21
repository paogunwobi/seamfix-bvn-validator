import { IsDateString, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class BvnDto {
    @IsString()
    @IsNotEmpty()
    @Length(11, 11)
    bvn: string;

    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth: string;

    @IsString()
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    email: string;
}
