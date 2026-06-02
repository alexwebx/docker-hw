import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly repo: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.repo.findOne({ where: { id } });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  create(dto: CreateTodoDto): Promise<Todo> {
    const todo = this.repo.create({
      title: dto.title,
      description: dto.description ?? null,
      completed: false,
    });
    return this.repo.save(todo);
  }

  async update(id: string, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    if (dto.title !== undefined) todo.title = dto.title;
    if (dto.description !== undefined) todo.description = dto.description;
    if (dto.completed !== undefined) todo.completed = dto.completed;
    return this.repo.save(todo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException(`Todo ${id} not found`);
  }
}
