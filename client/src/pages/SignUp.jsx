import "../styles/form.scss"

export function SignUp() {
    return (
        <form className="formulario">
            <h2>Cadastro de Usuários</h2>

            <label>Nome:</label>
            <input type="text"/>

            <label>E-mail:</label>
            <input type="email"/>

            <div>
                <button className="SubmitBtn">Cadastrar</button>
            </div>

        </form>
    )
}