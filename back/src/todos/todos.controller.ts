import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Get()
  @ApiOkResponse({ type: Todo, isArray: true })
  findAll(): Promise<Todo[]> {
    return this.todos.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Todo })
  @ApiNotFoundResponse()
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Todo> {
    return this.todos.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: Todo })
  create(@Body() dto: CreateTodoDto): Promise<Todo> {
    return this.todos.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Todo })
  @ApiNotFoundResponse()
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todos.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.todos.remove(id);
  }
}
