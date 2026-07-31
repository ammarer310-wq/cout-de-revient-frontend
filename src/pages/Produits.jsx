import { useEffect, useState } from 'react'
import { fetchProduits, createProduit } from '../api/client'
import { useAuth } from '../auth/AuthContext'

function Produits() {
  const { isAdmin } = useAuth()
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    nom: '',
    description: '',
    grammage: '',
    rendement: '',
    temps_production: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function loadProduits() {
    setLoading(true)
    fetchProduits()
      .then(setProduits)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProduits()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createProduit({
        ...form,
        grammage: parseFloat(form.grammage) || 0,
        rendement: parseFloat(form.rendement) || 0,
        temps_production: parseFloat(form.temps_production) || 0,
      })
      setForm({ nom: '', description: '', grammage: '', rendement: '', temps_production: '' })
      loadProduits()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Produits</h2>

      <div className={`grid gap-8 ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {isAdmin && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-beige rounded-lg p-5 space-y-3 col-span-1"
          >
            <h3 className="font-semibold mb-2">Nouveau produit</h3>

            <Field label="Nom" name="nom" value={form.nom} onChange={handleChange} required />
            <Field label="Description" name="description" value={form.description} onChange={handleChange} />
            <Field label="Grammage (g)" name="grammage" value={form.grammage} onChange={handleChange} type="number" />
            <Field label="Rendement (%)" name="rendement" value={form.rendement} onChange={handleChange} type="number" />
            <Field label="Temps production (min)" name="temps_production" value={form.temps_production} onChange={handleChange} type="number" />

            {submitError && <p className="text-brick text-sm">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {submitting ? 'Création...' : 'Créer le produit'}
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
                  <th className="p-3">Nom</th>
                  <th className="p-3">Grammage</th>
                  <th className="p-3">Rendement</th>
                  <th className="p-3">Temps prod.</th>
                </tr>
              </thead>
              <tbody>
                {produits.map((p) => (
                  <tr key={p.id} className="border-b border-beige last:border-0">
                    <td className="p-3">{p.nom}</td>
                    <td className="p-3">{p.grammage} g</td>
                    <td className="p-3">{p.rendement} %</td>
                    <td className="p-3">{p.temps_production} min</td>
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
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-beige rounded-md px-3 py-2 focus:outline-none focus:border-gold"
      />
    </div>
  )
}

export default Produits