/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl, IsDateString} from 'class-validator';
export class ClubDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsDateString()
 @IsNotEmpty()
 readonly fechaFundacion: string;
 
 @IsString()
 @IsNotEmpty()
 readonly imagen: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;

}
/* archivo: src/club/club.dto.ts */