/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fechaFundacion: Date;

    @Column()
    imagen: string;

    @Column({ length: 100 })
    descripcion: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubes)
    @JoinTable()
    socios: SocioEntity[];
    
}
