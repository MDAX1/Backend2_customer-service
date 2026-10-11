import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from './api.js'

export default function App() {
    const navigate = useNavigate()

    const logout = () => {
        clearToken()
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
