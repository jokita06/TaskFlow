import "../styles/form.scss";
import api from "../service/Service";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schemaTask = z.object({
    nome: z.string()
        .min(5, 'O nome é obrigatório, informe pelos menos 5 caracteres')
        .max(60, 'O nome da tarefa deve ter no máximo 60 caracteres'),
    descricao: z.string()
        .min(10, 'A descrição deve ter no mínimo 10 caracteres')
        .max(255, 'A descrição deve ter no máximo 255 caracteres'),
    setor: z.string()
        .min(5, 'O setor é obrigatório, informe pelos menos 5 caracteres')
        .max(30, 'O setor deve ter no máximo 60 caracteres'),
    criador: z.string()
        .min(1, 'O criador é obrigatório'),
    prioridade: z.string()
        .min(1, 'A prioridade é obrigatória')
})

export function RegisterTask() {
    const [mensagem, setMensagem] = useState('');
    const [users, setUsers] = useState([]);

    const {
        register, // registra o que o usuário digitou
        handleSubmit, // no momento de enviar o formulário
        formState: { errors }, // guarda o erro
        reset
    } = useForm({
        resolver: zodResolver(schemaTask)
    })

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get('usuario/');
                setUsers(response.data);
            } catch (error) {
                console.log('Erro ao buscar usuários:', error);
            }
        }
        fetchUsers();
    }, []);

    async function createTask(data) {
        try {
            await api.post('tarefas/', data);
            setMensagem("Tarefa cadastrada com sucesso!");

            reset();
        } catch (error) {
            setMensagem('Ocorreu um erro, tente novamente!');
            console.log(error);
        }
    }

    // async function listTask(data) {
    //     try {
    //         await api.get('tarefa/', data);
    //         setMensagem("Tarefa listada com sucesso!");

    //         reset();
    //     } catch (error) {
    //         setMensagem('Ocorreu um erro, tente novamente!');
    //         console.log(error);
    //     }
    // }

    // async function updateTask(data) {
    //     try {
    //         await api.put('tarefa/', data);
    //         setMensagem("Tarefa atualizada com sucesso!");
    //     } catch (error) {
    //         setMensagem('Ocorreu um erro, tente novamente!');
    //         console.log(error);
    //     }
    // }

    // async function deleteTask(data) {
    //     try {
    //         await api.delete('tarefa/', data);
    //         setMensagem("Tarefa deletada com sucesso!");
    //     } catch (error) {
    //         setMensagem('Ocorreu um erro, tente novamente!');
    //         console.log(error);
    //     }
    // }

    return(
        <main>
            <form className="formulario" method="POST" onSubmit={handleSubmit(createTask)}>

                <h1>Cadastro de Tarefas</h1>

                <div className="inputGroup">
                    <label>Descrição</label>
                    <textarea
                        type="text"
                        {...register('descricao')}
                        placeholder='Descreva a tarefa...'
                    />
                    {errors.descricao && <p className="error">{errors.descricao.message}</p>}
                </div>
                
                <div className="inputGroup">
                    <label>Setor</label>
                    <input 
                    type="text"
                    {...register('setor')}
                    placeholder='Informe o setor...'
                    />
                    {errors.setor && <p className="error">{errors.setor.message}</p>}
                </div>

                <div className="inputGroup">
                    <label>Criador</label>
                    <select {...register('criador')}>
                        <option value="">Selecione um criador</option>
                            {users.map(user => (
                            <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                        ))}
                    </select>
                    {errors.criador && <p className="error">{errors.criador.message}</p>}
                </div>

                <div className="inputGroup">
                    <label>Prioridade</label>
                    <select {...register('prioridade')}>
                        <option value="">Selecione a prioridade</option>
                        <option value="Alto">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                    </select>
                    {errors.prioridade && <p className="error">{errors.prioridade.message}</p>}
                </div>
                
                <div>
                    <button className="SubmitBtn" type="submit">Cadastrar</button>
                    <p>{mensagem}</p>
                </div>
            </form>
        </main>
        
    )
}