import '../styles/form.scss';
import api from '../service/Service';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaCheck } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { schemaSignUp } from '../validations/userValidation';
import { ErrorMessage } from "../components/ErrorMessage";
 
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
      console.log(error);
      setMensagem('Ocorreu um erro, tente novamente!');
      setTipoMensagem("erro");
    }
  }
 
  return (
    <main>
      <form 
        className="form" 
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
