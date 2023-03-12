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
  UseFilters,
  HttpCode,
} from '@nestjs/common'
import { IUserService } from './user.service'
import { CreateUserDto, createUserSchema } from './create-user.dto'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter'

@Controller('users')
@UseInterceptors(TransformInterceptor<CreateUserDto>)
@UseFilters(HttpExceptionFilter)
export class UserController {
  private logger: Logger

  constructor(private readonly userService: IUserService) {
    this.logger = new Logger()
  }

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<CreateUserDto[]> {
    return this.userService.findAll()
  }

  @Get(':uuid')
  @ResponseMessage('Success')
  async get(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const data = await this.userService.findOne(uuid)
    return data
  }

  @Post()
  @HttpCode(201)
  @ResponseMessage('User Created')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user)
    // throw new BadRequestException('Something', {
    //   cause: new Error('ALOOO'),
    //   description: 'Nah',
    // })
  }

  @Put(':uuid')
  @ResponseMessage('Updated')
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() user: CreateUserDto
  ) {
    return this.userService.update(uuid, user)
  }

  @Delete(':uuid')
  @ResponseMessage('Deleted')
  deleteUser(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.userService.delete(uuid)
  }
}
