
import './App.css'
import AllRoutes from './routes'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'
import { connectSocket } from './lib/socket'

function App() {
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken)
    }
  }, [accessToken])

  return (
    <>
      <AllRoutes />
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
