import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCustomer, listCustomers } from '../api.js'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setCustomers(await listCustomers())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (customer) => {
    setMessage(null)
    setError(null)
    try {
      await deleteCustomer(customer.id)
      setMessage(`${customer.firstName} ${customer.lastName} togs bort`)
      await load()
    } catch (e) {
      if (e.errorCode === 'CUSTOMER_HAS_ACTIVE_BOOKINGS') {
        setError(`${customer.firstName} ${customer.lastName} har ${e.problem.activeBookingCount} aktiva bokningar och kan inte tas bort`)
      } else if (e.errorCode === 'BOOKING_SERVICE_UNAVAILABLE') {
        setError('Bokningstjänsten är inte tillgänglig just nu. Kan inte kontrollera bokningar. Försök igen senare.')
      } else {
        setError(e.message)
      }
    }
  }

  if (loading) return <p>Loading…</p>

  return (
      <>
        <div className="toolbar">
          <h1>Kunder</h1>
          <Link className="button" to="/customers/new">+ Ny kund</Link>
        </div>

        {message && <p className="success" role="status">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}

        {customers.length === 0 ? (
            <p className="empty">Inga kunder registrerade än.</p>
        ) : (
            <table>
              <thead>
              <tr>
                <th style={{width: '70px'}}>ID</th>
                <th>Namn</th>
                <th>E-post</th>
                <th>Telefon</th>
                <th style={{textAlign: 'right'}}>Åtgärder</th>
              </tr>
              </thead>
              <tbody>
              {customers.map((c) => (
                  <tr key={c.id}>
                    <td><strong style={{color: '#006ce4'}}>#{c.id}</strong></td>
                    <td><strong>{c.firstName} {c.lastName}</strong></td>
                    <td>{c.email || <span className="muted">—</span>}</td>
                    <td>{c.phone || <span className="muted">—</span>}</td>
                    <td className="actions" style={{textAlign: 'right'}}>
                      <Link to={`/customers/${c.id}/edit`}>Ändra</Link>
                      <button type="button" className="danger" onClick={() => remove(c)}>Ta bort</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </>
  )
}
