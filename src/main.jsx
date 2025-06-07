import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UsernameProvider } from './context/UsernamePrompt.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsernameProvider>
      <App />
    </UsernameProvider>
  </StrictMode>,
)
