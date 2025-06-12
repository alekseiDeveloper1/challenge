import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
})

// class is required for using DTO as a type
export class RegisterDto extends createZodDto(RegisterSchema) {}