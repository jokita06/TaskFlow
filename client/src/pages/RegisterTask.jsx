import "../styles/form.scss"

export function RegisterTask() {
    return(
        <form className="formulario">
            <h2>Cadastro de Tarefas</h2>

            <label>Descrição:</label>
            <textarea/>

            <label>Setor:</label>
            <input type="text"/>

            <label>Usuário:</label>
            <select>
                <option value=""></option>
            </select>

            <label>Prioridade:</label>
            <select>
                <option value=""></option>
            </select>

            <div>
                <button className="SubmitBtn">Cadastrar</button>
            </div>
        </form>
    )
}