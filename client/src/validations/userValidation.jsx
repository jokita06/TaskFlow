import { z } from "zod"

export const schemaSignUp = z.object({
  username: z.string()
    .trim() 
    .nonempty({ message: "O nome é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { message: "Digite apenas letras" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(60, { message: "Máximo 60 caracteres" }),

  email: z.string()
    .trim()
    .nonempty({ message: "O e-mail é obrigatório" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "E-mail inválido"
    })
})