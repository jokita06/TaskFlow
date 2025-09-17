import { Card } from "../components/Card" 
import '../styles/managementTask.scss'

export function ManagementTask() {

    return (
        <main>
            <section className="managementTask">
                <h2>Tarefas</h2>
                
                <div className="managementCard">
                    <article>
                        <h3>Fazer</h3>
                        <Card status="Fazer"/>
                        
                    </article>

                    <article>
                        <h3>Fazendo</h3>
                        <Card status="Fazendo"/>
                    </article>

                    <article>
                        <h3>Feito</h3>
                        <Card status="Feito"/>
                    </article>
                </div>
            </section>
        </main>
        
    )
}