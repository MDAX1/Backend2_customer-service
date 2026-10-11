import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api.js'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const submit = async (event) => {
            event.preventDefault()
            setError(null)
            setBusy(true)
    try {
        await login(username, password)
        navigate('/customers', { replace: true })
    } catch (e) {
        setError(e.status === 401 ? 'Fel användarnamn eller lösenord' : e.message)
    } finally {
        setBusy(false)
    }
  }

    return (
            <div className="login">
            <form onSubmit={submit}>
            <h1>Kundtjänst &ndash; Inloggning</h1>
            {error && <p className="error" role="alert">{error}</p>}
            <label htmlFor="username">Användarnamn</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
        <label htmlFor="password">Lösenord</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={busy}>{busy ? 'Loggar in…' : 'Logga in'}</button>
            </form>
            </div>
  )
}
