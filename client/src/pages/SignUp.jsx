import '../styles/form.scss';
import api from '../service/Service';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { email, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
 
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
 
export function SignUp() {
    const [mensagem, setMensagem] = useState('');
 
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
   
            reset();
        } catch (error) {
            setMensagem('Ocorreu um erro, tente novamente!');
            console.log(error);
        }
    }
 
    return (
        <form className="formulario" method='POST' onSubmit={handleSubmit(obterDados)}>
            <h1>Cadastro de Usuário</h1>

            <div className='inputGroup'>
                <label>Nome</label>
                <input
                    type="text"
                    {...register('username')}
                    placeholder='Digite seu nome...'
                />
                {errors.username &&
                    <p>{errors.username.message}</p>
                }
            </div>
            
            <div className='inputGroup'>
                <label>E-mail</label>
                <input
                    type="text"
                    {...register('email')}
                    placeholder='Digite seu email...'
                />
                {errors.username &&
                <p>{errors.email.message}</p>
                }
            </div>
            

            <div>
                <button type="submit" className="SubmitBtn">Cadastrar</button>
                <p>{mensagem}</p>
            </div>
        </form>
    )
}
 
// O required buga o zod, por isso é bom retirar
// O required é o primeiro a ser lido, depois o zod