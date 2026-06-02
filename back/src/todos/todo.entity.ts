import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('todos')
export class Todo {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ maxLength: 255, example: 'Buy milk' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'From the corner store',
  })
  @Column({ type: 'varchar', length: 2000, nullable: true })
  description: string | null;

  @ApiProperty({ default: false })
  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @ApiProperty({ format: 'date-time' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
