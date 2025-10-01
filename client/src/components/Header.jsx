import '../styles/header.scss';
import { Link } from 'react-router-dom';

export function Cabecalho() {
    return (
        <header className="container">
            <Link to="/" className="logo">
                <h1 className="titulo">TaskFlow</h1>
            </Link>

            <nav className="nav">
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/SignUp" className="nav-link">
                            Cadastro de Usuários
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/RegisterTask" className="nav-link">
                            Cadastro de Tarefa
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/ManagementTask" className="nav-link">
                            Gerenciar Tarefas
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}