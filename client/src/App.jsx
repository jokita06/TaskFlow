import './App.css'
import { BrowserRouter } from "react-router-dom"
import { Rotas } from './routes/Routes'
import { BarraNavegacao } from './components/BarraNavegação'
import { Cabecalho } from './components/Cabecalho'

function App() {

  return (
    <BrowserRouter>
      <Cabecalho/>
      <BarraNavegacao/>
      <Rotas/>
    </BrowserRouter>
  )
}

export default App