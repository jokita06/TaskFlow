import { BrowserRouter } from "react-router-dom"
import { Rotas } from './routes/Routes'
import { Cabecalho } from './components/Header'

function App() {

  return (
    <BrowserRouter>
      <Cabecalho/>
      <Rotas/>
    </BrowserRouter>
  )
}

export default App