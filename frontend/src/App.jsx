import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from './api.js'
import { useState, useEffect } from 'react'

export default function App() {
  const navigate = useNavigate()
  const [username, setUsername] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('customer-service-user')
    if (stored) setUsername(stored)
  }, [])

  const logout = () => {
    clearToken()
    localStorage.removeItem('customer-service-user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <header>
        <Link to="/customers" className="brand">Pensionat Kundtjänst</Link>
        <nav>
          <a href="http://localhost:8081" className="link" style={{marginRight: '8px', color: '#006ce4', fontWeight: 600}}>
            &larr; Till Bokningssystemet
          </a>
          <a href="/swagger-ui/index.html" target="_blank" rel="noreferrer">API docs</a>
          {username && <span style={{marginLeft: '12px', marginRight: '12px'}}>Inloggad som {username}</span>}
          <button type="button" className="link" onClick={logout}>Logga ut</button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Pensionat &middot; Kundtjänst</footer>
    </div>
  )
}
