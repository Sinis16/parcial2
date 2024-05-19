/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl, IsDateString} from 'class-validator';
export class SocioDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly correo: string;
 
 @IsDateString()
 @IsNotEmpty()
 readonly fechaNacimiento: string;

 
}
/* archivo: src/socio/socio.dto.ts */