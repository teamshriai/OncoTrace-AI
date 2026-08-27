import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const crashFallback = (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      color: '#0f172a',
    }}
  >
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Something went wrong</h1>
    <p style={{ color: '#64748b', maxWidth: '28rem', margin: 0 }}>
      Please refresh the page. If the problem continues, try again in a few minutes.
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '0.625rem 1.5rem',
        borderRadius: '0.75rem',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      Reload
    </button>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallback={crashFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
