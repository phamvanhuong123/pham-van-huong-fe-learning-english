
import './App.css'
import AllRoutes from './routes'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <AllRoutes />
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
