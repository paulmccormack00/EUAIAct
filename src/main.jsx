import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Analytics />
    </ErrorBoundary>
  </StrictMode>
)

// If the root has children, the page was prerendered — hydrate instead of full render
if (container.children.length > 0) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
