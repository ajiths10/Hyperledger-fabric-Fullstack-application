import { IsEmail, IsNotEmpty, IsString, IsDateString, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreatePatientDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail({}, { message: 'Invalid email message' })
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsPhoneNumber(null, { message: 'must be a valid phone number' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    dob: string;

    @IsOptional()
    @IsString()
    blood_group?: string;
}
