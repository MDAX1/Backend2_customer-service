import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createCustomer, getCustomer, updateCustomer } from '../api.js'

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', address: '' }

export default function CustomerForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const [customer, setCustomer] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!editing) return
    getCustomer(id)
      .then((found) => setCustomer({ ...EMPTY, ...found }))
      .catch((e) => setError(e.message))
  }, [id, editing])

  const change = (event) =>
    setCustomer({ ...customer, [event.target.name]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setFieldErrors({})
    setError(null)
    setBusy(true)
    try {
      if (editing) {
        await updateCustomer(id, customer)
      } else {
        await createCustomer(customer)
      }
      navigate('/customers')
    } catch (e) {
      // The API reports field-level problems in errors[]; anything else is a page-level error.
      if (e.errorCode === 'VALIDATION_FAILED' && Array.isArray(e.problem.errors)) {
        setFieldErrors(Object.fromEntries(e.problem.errors.map((f) => [f.field, f.message])))
      } else {
        setError(e.message)
      }
    } finally {
      setBusy(false)
    }
  }

  const field = (name, label, type = 'text') => (
    <>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={customer[name] ?? ''} onChange={change} />
      {fieldErrors[name] && <span className="field-error">{fieldErrors[name]}</span>}
    </>
  )

  return (
    <>
      <h1>{editing ? 'Redigera kund' : 'Registrera ny kund'}</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <form onSubmit={submit} className="stacked">
        {field('firstName', 'Förnamn')}
        {field('lastName', 'Efternamn')}
        {field('email', 'E-post', 'email')}
        {field('phone', 'Telefonnummer')}
        {field('address', 'Gatuadress & ort')}
        <div className="buttons">
          <button type="submit" disabled={busy}>{busy ? 'Sparar…' : 'Spara kund'}</button>
          <button type="button" className="link" onClick={() => navigate('/customers')}>Avbryt</button>
        </div>
      </form>
    </>
  )
}
