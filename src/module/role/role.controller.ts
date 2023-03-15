import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common'
import { TransformInterceptor } from '../../common/interceptor/transform.interceptor'
import { ResponseMessage } from 'src/common/decorator/response-message.decorator'
import { RoleRequestDto } from './role.dto'
import { IRole } from './role.entity'
import { IRoleService } from './role.service'
import { ApiPath } from '../../app/constant/app.constant'

@Controller({ path: [ApiPath.BASE, ApiPath.ROLES].join('/'), version: '1' })
@UseInterceptors(TransformInterceptor<RoleRequestDto>)
export class RoleController {
  constructor(private readonly roleService: IRoleService) {}

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

  // @Post()
  // @HttpCode(201)
  // @ResponseMessage('Role Created')
  // @UsePipes(new JoiValidationPipe(roleRequestSchema))
  // async create(@Body() role: RoleRequestDto) {
  //   const createdRole = this.roleService.create(role)
  //   return createdRole
  // }

  // @Put(':id')
  // @ResponseMessage('Updated')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() role: RoleRequestDto
  // ) {
  //   return this.roleService.update(id, role)
  // }

  // @Delete(':id')
  // @ResponseMessage('Deleted')
  // deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.roleService.delete(id)
  // }
}
