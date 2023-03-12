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
  HttpCode,
} from '@nestjs/common'
import { JoiValidationPipe } from 'src/common/pipe/joi-validation.pipe'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { RoleRequestDto, roleRequestSchema } from './role.dto'
import { IRole } from './role.entity'
import { IRoleService } from './role.service'

@Controller({ path: 'api/roles', version: '1' })
@UseInterceptors(TransformInterceptor<RoleRequestDto>)
export class RoleController {
  private logger: Logger

  constructor(private readonly roleService: IRoleService) {
    this.logger = new Logger()
  }

  @Get()
  @ResponseMessage('Success')
  findAll(): Promise<IRole[]> {
    return this.roleService.findAll()
  }

  @Get(':id')
  @ResponseMessage('Success')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.roleService.findOne(id)
    return data
  }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Role Created')
  @UsePipes(new JoiValidationPipe(roleRequestSchema))
  async create(@Body() role: RoleRequestDto) {
    const createdRole = this.roleService.create(role)
    return createdRole
  }

  @Put(':id')
  @ResponseMessage('Updated')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: RoleRequestDto
  ) {
    return this.roleService.update(id, role)
  }

  @Delete(':id')
  @ResponseMessage('Deleted')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roleService.delete(id)
  }
}
