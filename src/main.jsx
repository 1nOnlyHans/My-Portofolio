import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// admin is a separate chunk so visitors never download it
// eslint-disable-next-line react-refresh/only-export-components
const Admin = lazy(() => import('./admin/admin.jsx'))
// eslint-disable-next-line react-refresh/only-export-components
const ProjectPage = lazy(() => import('./sections/project-page.jsx'))
// eslint-disable-next-line react-refresh/only-export-components
const AllProjects = lazy(() => import('./sections/all-projects.jsx'))
// eslint-disable-next-line react-refresh/only-export-components
const AllCertifications = lazy(() => import('./sections/all-certifications.jsx'))
const path = window.location.pathname.replace(/\/$/, '')
const slug = /^\/projects\/([^/]+)$/.exec(path)?.[1]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/admin' ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : path === '/projects' ? (
      <Suspense fallback={null}>
        <AllProjects />
      </Suspense>
    ) : path === '/certifications' ? (
      <Suspense fallback={null}>
        <AllCertifications />
      </Suspense>
    ) : slug ? (
      <Suspense fallback={null}>
        <ProjectPage slug={decodeURIComponent(slug)} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
