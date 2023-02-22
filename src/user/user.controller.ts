import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Logger,
  ParseUUIDPipe,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common'
import { IUserService } from './user.service'
import { CreateUserDto, createUserSchema } from './create-user.dto'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../common/interceptor/transform.interceptor'

@Controller('users')
@UseInterceptors(TransformInterceptor<CreateUserDto>)
export class UserController {
  private logger: Logger
  constructor(private readonly userService: IUserService) {
    this.logger = new Logger()
  }

  @Get()
  findAll(): Promise<CreateUserDto[]> {
    return this.userService.findAll()
  }

  @Get(':uuid')
  async get(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const data = await this.userService.findOne(uuid)
    return data
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user)
  }

  @Put(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() user: CreateUserDto
  ) {
    return this.userService.update(uuid, user)
  }

  @Delete(':uuid')
  deleteUser(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.userService.delete(uuid)
  }
}
