import { useEffect, useState } from 'react'
import { fetchPackagings, fetchProduits, createPackaging } from '../api/client'
import { useAuth } from '../auth/AuthContext'

function Packaging() {
  const { isAdmin } = useAuth()

  const [packagings, setPackagings] = useState([])
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    produit_id: '',
    nom: '',
    prix: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function loadAll() {
    setLoading(true)
    Promise.all([fetchPackagings(), fetchProduits()])
      .then(([pk, p]) => {
        setPackagings(pk)
        setProduits(p)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAll()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createPackaging({
        produit_id: form.produit_id,
        nom: form.nom,
        prix: parseFloat(form.prix),
      })
      setForm({ produit_id: '', nom: '', prix: '' })
      loadAll()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Packaging</h2>

      <div className={`grid gap-8 ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-5 space-y-3 col-span-1">
            <h3 className="font-semibold mb-2">Nouvel élément de packaging</h3>

            <div>
              <label className="block text-sm text-brown-dark/70 mb-1">Produit</label>
              <select
                name="produit_id"
                value={form.produit_id}
                onChange={handleChange}
                required
                className="w-full border border-beige rounded-md px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                {produits.map((p) => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            </div>

            <Field label="Nom (ex: Film OPP, Carton...)" name="nom" value={form.nom} onChange={handleChange} required />
            <Field label="Prix (dh)" name="prix" value={form.prix} onChange={handleChange} type="number" required />

            {submitError && <p className="text-brick text-sm">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {submitting ? 'Création...' : 'Ajouter le packaging'}
            </button>
          </form>
        )}

        <div className={isAdmin ? 'col-span-2' : ''}>
          {loading && <p>Chargement...</p>}
          {error && <p className="text-brick">Erreur : {error}</p>}

          {!loading && !error && (
            <table className="w-full bg-white border border-beige rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-beige text-left">
                  <th className="p-3">Produit</th>
                  <th className="p-3">Élément</th>
                  <th className="p-3">Prix</th>
                </tr>
              </thead>
              <tbody>
                {packagings.map((pk) => (
                  <tr key={pk.id} className="border-b border-beige last:border-0">
                    <td className="p-3">{pk.produit?.nom ?? '—'}</td>
                    <td className="p-3">{pk.nom}</td>
                    <td className="p-3">{pk.prix} dh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-sm text-brown-dark/70 mb-1">{label}</label>
      <input
        type={type}
        step="0.01"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-beige rounded-md px-3 py-2 focus:outline-none focus:border-gold"
      />
    </div>
  )
}

export default Packaging