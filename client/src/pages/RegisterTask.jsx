import "../styles/form.scss";
import api from "../service/Service";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoAlertCircle } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";

const schemaTask = z.object({
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

function ErrorMessage({ error }) {
	if (!error) return null;
	return (
		<p className="error">
			<IoAlertCircle /> {error.message}
		</p>
	);
}

export function RegisterTask() {
	const [mensagem, setMensagem] = useState('');
	const [users, setUsers] = useState([]);
    const [tipoMensagem, setTipoMensagem] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({
		resolver: zodResolver(schemaTask)
	});

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
            setTipoMensagem("sucesso");
			reset();
		} catch (error) {
			if (error.response) {
				console.log("Erro do backend:", error.response.data); 
                setTipoMensagem("erro")
			} else {
				console.log(error);
				setMensagem('Ocorreu um erro, tente novamente!');
                setTipoMensagem("erro")
			}
		}
	}

	return (
		<main>
			<form 
				className="formulario" 
				method="POST" 
				onSubmit={handleSubmit(createTask)}
				aria-labelledby="formTitle"
			>
				<h1 id="formTitle">Cadastro de Tarefas</h1>

				<div className="inputGroup" role="group" aria-labelledby="labelNome">
					<label htmlFor="nome">Nome</label>
					<input
					id="nome"
					type="text"
					{...register('nome')}
					placeholder="Informe o nome da tarefa..."
					aria-invalid={errors.nome ? "true" : "false"}
					/>
					<ErrorMessage error={errors.nome} />
				</div>

				<div className="inputGroup" role="group" aria-labelledby="labelDescricao">
					<label htmlFor="descricao">Descrição</label>
					<textarea
					id="descricao"
					{...register('descricao')}
					placeholder="Descreva a tarefa..."
					aria-invalid={errors.descricao ? "true" : "false"}
					/>
					<ErrorMessage error={errors.descricao} />
				</div>

				<div className="inputGroup" role="group" aria-labelledby="labelSetor">
					<label htmlFor="setor">Setor</label>
					<input
					id="setor"
					type="text"
					{...register('setor')}
					placeholder="Informe o setor..."
					aria-invalid={errors.setor ? "true" : "false"}
					/>
					<ErrorMessage error={errors.setor} />
				</div>

				<div className="inputGroup" role="group" aria-labelledby="labelCriador">
					<label htmlFor="criador">Criador</label>
					<select id="criador" {...register('criador', { valueAsNumber: true })}>
					<option value="">Selecione um criador</option>
					{users.map(user => (
						<option key={user.id} value={user.id}>
						{user.username}
						</option>
					))}
					</select>
					<ErrorMessage error={errors.criador} />
				</div>

				<div className="inputGroup" role="group" aria-labelledby="labelPrioridade">
					<label htmlFor="prioridade">Prioridade</label>
					<select id="prioridade" {...register('prioridade')}>
					<option value="">Selecione a prioridade</option>
					<option value="Alta">Alta</option>
					<option value="Média">Média</option>
					<option value="Baixa">Baixa</option>
					</select>
					<ErrorMessage error={errors.prioridade} />
				</div>

				<div className="inputGroup" role="group" aria-labelledby="labelStatus">
					<label htmlFor="status">Status</label>
					<select id="status" {...register('status')}>
					<option value="">Selecione o status</option>
					<option value="Fazer">Fazer</option>
					<option value="Fazendo">Fazendo</option>
					<option value="Feito">Feito</option>
					</select>
					<ErrorMessage error={errors.status} />
				</div>

				<fieldset aria-label="Ações do formulário">
					<button className="SubmitBtn" type="submit">Cadastrar</button>
					<p 
						className={`mensagem ${tipoMensagem}`} 
						role="status" 
						aria-live="polite"
					>
						{tipoMensagem === 'sucesso' && <FaCheck />}
						{tipoMensagem === 'erro' && <GoAlertFill />}
						{mensagem}
					</p>
				</fieldset>
			</form>
		</main>
	);
}