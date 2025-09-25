import '../styles/form.scss';
import api from '../service/Service';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { email, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoAlertCircle } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
 
const schemaSignUp = z.object({
    username: z.string()
        .regex(/^[A-Za-zÀ-ÿ\s]+$/,{ // A-Z maiúsculo, a-z minúsculo, À-ÿ com acentos
            message: "Digite apenas letras"
        })
        .regex(/^.{3,60}$/,{
            message: "Mínimo 3 caracteres e no máximo 60"
        }),
    email: z.string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
            message: "E-mail inválido"
        })    
    
})

function ErrorMessage({ error }) {
    if (!error) return null;
    return (
        <p className="error">
            <IoAlertCircle /> {error.message}
        </p>
    );
}
 
export function SignUp() {
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('')
 
    const {
        register, // registra o que o usuário digitou
        handleSubmit, // no momento de enviar o formulário
        formState: { errors }, // guarda o erro
        reset
    } = useForm({
        resolver: zodResolver(schemaSignUp)
    })
 
    async function obterDados(data) {
        console.log("Dados reecebidos: ", data);
 
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
            <form className="formulario" method='POST' onSubmit={handleSubmit(obterDados)}>
                <h1>Cadastro de Usuário</h1>

                <div className='inputGroup'>
                    <label htmlFor='name'>Name</label>
                    <input
                        id='name'
                        type="text"
                        {...register('username')}
                        placeholder='Digite seu nome...'
                    />
                    <ErrorMessage error={errors.username}/>
                </div>
                
                <div className='inputGroup'>
                    <label htmlFor='email'>E-mail</label>
                    <input
                        id='email'
                        type="text"
                        {...register('email')}
                        placeholder='Digite seu email...'
                    />
                    <ErrorMessage error={errors.email}/>
                </div>
                

                <div>
                    <button type="submit" className="SubmitBtn">Cadastrar</button>
                    <p className={`mensagem ${tipoMensagem}`}>
                        {tipoMensagem === 'sucesso' && <FaCheck />}
                        {tipoMensagem == 'erro' && <GoAlertFill />}
                        {mensagem}
                    </p>
                </div>
            </form>
        </main>
        
    )
}
 
// O required buga o zod, por isso é bom retirar
// O required é o primeiro a ser lido, depois o zod