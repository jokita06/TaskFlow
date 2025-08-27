import '../styles/barraNavegacao.scss'
import { Link } from 'react-router-dom'

export function BarraNavegacao() {
    return (
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
    )
}