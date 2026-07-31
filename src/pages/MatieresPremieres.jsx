import { useEffect, useState } from 'react'
import { fetchMatieresPremieres, createMatierePremiere, fetchFournisseurs } from '../api/client'
import { useAuth } from '../auth/AuthContext'

function MatieresPremieres() {
  const { isAdmin } = useAuth()

  const [matieres, setMatieres] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    nom: '',
    prix_achat: '',
    unite: '',
    fournisseur_id: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function loadAll() {
    setLoading(true)
    Promise.all([fetchMatieresPremieres(), fetchFournisseurs()])
      .then(([m, f]) => {
        setMatieres(m)
        setFournisseurs(f)
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
      await createMatierePremiere({
        nom: form.nom,
        prix_achat: parseFloat(form.prix_achat),
        unite: form.unite,
        fournisseur_id: form.fournisseur_id || null,
      })
      setForm({ nom: '', prix_achat: '', unite: '', fournisseur_id: '' })
      loadAll()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Matières premières</h2>

      <div className={`grid gap-8 ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-5 space-y-3 col-span-1">
            <h3 className="font-semibold mb-2">Nouvelle matière première</h3>

            <Field label="Nom" name="nom" value={form.nom} onChange={handleChange} required />
            <Field label="Prix d'achat (dh)" name="prix_achat" value={form.prix_achat} onChange={handleChange} type="number" required />

            <div>
              <label className="block text-sm text-brown-dark/70 mb-1">Unité</label>
              <select
                name="unite"
                value={form.unite}
                onChange={handleChange}
                required
                className="w-full border border-beige rounded-md px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="unite">unité</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-brown-dark/70 mb-1">Fournisseur (optionnel)</label>
              <select
                name="fournisseur_id"
                value={form.fournisseur_id}
                onChange={handleChange}
                className="w-full border border-beige rounded-md px-3 py-2"
              >
                <option value="">-- Aucun --</option>
                {fournisseurs.map((f) => (
                  <option key={f.id} value={f.id}>{f.nom}</option>
                ))}
              </select>
            </div>

            {submitError && <p className="text-brick text-sm">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {submitting ? 'Création...' : 'Créer la matière première'}
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
                  <th className="p-3">Prix d'achat</th>
                  <th className="p-3">Unité</th>
                  <th className="p-3">Fournisseur</th>
                </tr>
              </thead>
              <tbody>
                {matieres.map((m) => (
                  <tr key={m.id} className="border-b border-beige last:border-0">
                    <td className="p-3">{m.nom}</td>
                    <td className="p-3">{m.prix_achat} dh</td>
                    <td className="p-3">{m.unite}</td>
                    <td className="p-3">{m.fournisseur?.nom ?? '—'}</td>
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

export default MatieresPremieres