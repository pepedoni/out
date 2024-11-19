import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column()
  producers: string;

  @Column()
  studios: string;

  @Column()
  winner: boolean;
}