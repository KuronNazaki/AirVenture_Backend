import * as Joi from 'joi'

export const roleRequestSchema = Joi.object({
  name: Joi.string().required(),
})

export class RoleRequestDto {
  // id: string
  name: string
}
