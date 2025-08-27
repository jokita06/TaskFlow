import { Card } from "../components/Card" 
import '../styles/managementTask.scss'

export function ManagementTask() {
    return (
        <main>
            <section className="managementTask">
                <h2>Tarefas</h2>
                
                <div className="managementCard">
                    <article>
                        <h3>fazer</h3>
                        <Card/>
                    </article>

                    <article>
                        <h3>Fazendo</h3>
                        <Card/>
                    </article>

                    <article>
                        <h3>Pronto</h3>
                        <Card/>
                    </article>
                </div>
            </section>
        </main>
        
    )
}