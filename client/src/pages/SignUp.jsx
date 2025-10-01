import '../styles/form.scss';
import api from '../service/Service';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoAlertCircle } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
 
const schemaSignUp = z.object({
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

function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <p className="error" role="alert">
      <IoAlertCircle /> {error.message}
    </p>
  );
}
 
export function SignUp() {
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaSignUp)
  });
 
  async function obterDados(data) {
    console.log("Dados recebidos: ", data);
 
    try {
      await api.post('usuario/', data);
      setMensagem("Cadastrado com sucesso!");
      setTipoMensagem("sucesso");
      reset();
    } catch (error) {
      setMensagem('Ocorreu um erro, tente novamente!');
      console.log(error);
      setTipoMensagem("erro");
    }
  }
 
  return (
    <main>
      <form 
        className="formulario" 
        method="POST" 
        onSubmit={handleSubmit(obterDados)}
        aria-labelledby="formTitle"
      >
        <h1 id="formTitle">Cadastro de Usuário</h1>

        <div className="inputGroup" role="group" aria-labelledby="labelName">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            {...register('username')}
            placeholder="Digite seu nome..."
            aria-invalid={errors.username ? "true" : "false"}
          />
          <ErrorMessage error={errors.username}/>
        </div>

        <div className="inputGroup" role="group" aria-labelledby="labelEmail">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="text"
            {...register('email')}
            placeholder="Digite seu email..."
            aria-invalid={errors.email ? "true" : "false"}
          />
          <ErrorMessage error={errors.email}/>
        </div>

        <div role="region" aria-label="Ações do formulário">
            <button type="submit" className="SubmitBtn">Cadastrar</button>

            <p 
                className={`mensagem ${tipoMensagem}`} 
                role="status"
            >
                {tipoMensagem === 'sucesso' && <FaCheck />}
                {tipoMensagem === 'erro' && <GoAlertFill />}
                {mensagem}
            </p>
        </div>

      </form>
    </main>
  );
}
