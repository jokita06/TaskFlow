import '../styles/header.scss'
import { Link } from 'react-router-dom'

export function Cabecalho() {
    return (
        <header className="container">
            <h1 className="titulo">TaskFlow</h1>

            <nav className='barra'>
                <ul>
                    <Link to="/SignUp">
                        <li>Cadastro de Usuários</li>
                    </Link>

                    <Link to="/RegisterTask">
                        <li>Cadastro de Tarefa</li>
                    </Link>

                    <Link to="/ManagementTask">
                        <li>Gerenciar Tarefas</li>
                    </Link>
                </ul>
            </nav>
        </header>
    )
}