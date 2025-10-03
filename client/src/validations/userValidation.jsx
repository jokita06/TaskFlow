import { z } from "zod"

const validateCharacterRepetition = (value) => {
  return !/(.)\1{2,}/.test(value); 
};

const validateMultipleSpaces = (value) => {
  return !/\s{2,}/.test(value); 
};

export const schemaSignUp = z.object({
  username: z.string()
    .trim() 
    .nonempty({ message: "O nome é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { message: "Digite apenas letras" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(60, { message: "Máximo 60 caracteres" })
    .refine(validateMultipleSpaces, {
      message: "Não são permitidos múltiplos espaços em branco"
    })
    .refine(validateCharacterRepetition, {
      message: "Não são permitidas mais de 2 letras repetidas consecutivas"
    }),

  email: z.string()
    .trim()
    .nonempty({ message: "O e-mail é obrigatório" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "E-mail inválido"
    })
})