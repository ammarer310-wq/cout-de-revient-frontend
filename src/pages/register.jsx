import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api/client'
import { useAuth } from '../auth/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await registerApi(name, email, password)
      loginUser(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-8 w-96 space-y-4">
        <h1 className="text-2xl font-semibold text-center mb-2">Créer un compte</h1>

        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-beige rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-beige rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Mot de passe (8 caractères min.)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border border-beige rounded-md px-3 py-2"
          />
        </div>

        {error && <p className="text-brick text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer le compte'}
        </button>

        <p className="text-sm text-center text-brown-dark/70">
          Déjà un compte ? <Link to="/login" className="text-[#C08B2C] font-medium">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}

export default Register