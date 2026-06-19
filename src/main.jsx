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
  hydrateRoot(container, app, {
    onRecoverableError: (error, errorInfo) => {
      // The prerendered HTML is a build-time snapshot, so genuinely time-relative
      // content (deadline countdowns and status, "X days until…") differs at load
      // time. React recovers and the final DOM is correct, but it logs a hydration
      // mismatch (#418/#423/#425). Suppress just those; surface everything else.
      const msg = String(error?.message || error)
      if (/Minified React error #(418|423|425)\b/.test(msg) || /hydrat/i.test(msg)) return
      console.error('Recoverable React error:', error, errorInfo)
    },
  })
} else {
  createRoot(container).render(app)
}
