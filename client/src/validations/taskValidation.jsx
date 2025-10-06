import { z } from "zod";

const validateCharacterRepetition = (value) => {
  return !/(.)\1{2,}/.test(value); 
};

const validateMultipleSpaces = (value) => {
  return !/\s{2,}/.test(value); 
};

export const schemaTask = z.object({
  nome: z.string()
    .trim()
    .nonempty({ message: "O nome é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { 
      message: "Digite apenas letras"
    })
    .min(5, 'Mínimo 5 caracteres')
    .max(60, 'Máximo 60 caracteres')
    .refine(validateMultipleSpaces, {
      message: "Não são permitidos múltiplos espaços em branco"
    })
    .refine(validateCharacterRepetition, {
      message: "Não são permitidas mais de 2 letras repetidas consecutivas"
    }),
  
  descricao: z.string()
    .trim()
    .nonempty({ message: "A descrição é obrigatória" })
    .regex(/^[A-Za-zÀ-ÿ0-9\s.,-]+$/, { 
      message: "O nome deve começar com letra e pode conter números"
    })
    .min(10, 'A descrição deve ter no mínimo 10 caracteres')
    .max(255, 'A descrição deve ter no máximo 255 caracteres')
    .refine(validateMultipleSpaces, {
      message: "Não são permitidos múltiplos espaços em branco"
    })
    .refine(validateCharacterRepetition, {
      message: "Não são permitidas mais de 2 letras repetidas consecutivas"
    }),
  
  setor: z.string()
    .trim()
    .nonempty({message: "O setor é obrigatório"})
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { 
      message: "Digite apenas letras"
    })
    .min(2, 'Mínimo 2 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .refine(validateMultipleSpaces, {
      message: "Não são permitidos múltiplos espaços em branco"
    })
    .refine(validateCharacterRepetition, {
      message: "Não são permitidas mais de 2 letras repetidas consecutivas"
    }),
    
  criador: z.number({
    required_error: "O criador é obrigatório",
    invalid_type_error: "Selecione um criador válido"
  }),
  prioridade: z.string()
    .min(1, 'A prioridade é obrigatória'),
  status: z.string()
    .min(1, 'O status é obrigatório'),
});
