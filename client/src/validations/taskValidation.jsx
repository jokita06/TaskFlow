import { z } from "zod";

export const schemaTask = z.object({
  nome: z.string()
    .trim()
    .nonempty({ message: "O nome é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { 
      message: "Digite apenas letras"
    })
    .min(5, 'Mínimo 5 caracteres')
    .max(60, 'Máximo 60 caracteres'),
  
  descricao: z.string()
    .trim()
    .nonempty({ message: "A descrição é obrigatória" })
    .regex(/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\s]*$/, { 
      message: "O nome deve começar com letra e pode conter números"
    })
    .min(10, 'A descrição deve ter no mínimo 10 caracteres')
    .max(255, 'A descrição deve ter no máximo 255 caracteres'),
  
  setor: z.string()
    .trim()
    .nonempty({message: "O setor é obrigatório"})
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { 
      message: "Digite apenas letras"
    })
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres'),
  criador: z.number({
    required_error: "O criador é obrigatório",
    invalid_type_error: "Selecione um criador válido"
  }),
  prioridade: z.string()
    .min(1, 'A prioridade é obrigatória'),
  status: z.string()
    .min(1, 'O status é obrigatório'),
});
