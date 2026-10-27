import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// admin is a separate chunk so visitors never download it
// eslint-disable-next-line react-refresh/only-export-components
const Admin = lazy(() => import('./admin/admin.jsx'))
const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
