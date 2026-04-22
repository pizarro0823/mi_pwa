import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Tabs from "./Tabs";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tabs />
  </StrictMode>,
)

// ❌ COMENTA ESTO POR AHORA
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
*/