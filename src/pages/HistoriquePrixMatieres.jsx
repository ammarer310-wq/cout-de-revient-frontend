import { useEffect, useState } from 'react'
import { fetchHistoriquePrix, createHistoriquePrix, fetchMatieresPremieres } from '../api/client'
import { useAuth } from '../auth/AuthContext'

function HistoriquePrixMatieres() {
  const { isAdmin } = useAuth()

  const [entries, setEntries] = useState([])
  const [matieres, setMatieres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    matierepremiere_id: '',
    prix: '',
    date_prix: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function loadAll() {
    setLoading(true)
    Promise.all([fetchHistoriquePrix(), fetchMatieresPremieres()])
      .then(([h, m]) => {
        setEntries(h)
        setMatieres(m)
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
      await createHistoriquePrix({
        matierepremiere_id: form.matierepremiere_id,
        prix: parseFloat(form.prix),
        date_prix: form.date_prix,
      })
      setForm({ matierepremiere_id: '', prix: '', date_prix: '' })
      loadAll()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date_prix) - new Date(a.date_prix))

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Historique des prix matières</h2>

      <div className={`grid gap-8 ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-5 space-y-3 col-span-1">
            <h3 className="font-semibold mb-2">Nouveau relevé de prix</h3>
            <p className="text-xs text-brown-dark/60 -mt-2">
              Enregistrer un nouveau prix mettra aussi à jour le prix actuel de la matière.
            </p>

            <div>
              <label className="block text-sm text-brown-dark/70 mb-1">Matière première</label>
              <select
                name="matierepremiere_id"
                value={form.matierepremiere_id}
                onChange={handleChange}
                required
                className="w-full border border-beige rounded-md px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                {matieres.map((m) => (
                  <option key={m.id} value={m.id}>{m.nom} (actuel : {m.prix_achat} dh)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-brown-dark/70 mb-1">Nouveau prix (dh)</label>
              <input
                type="number"
                step="0.01"
                name="prix"
                value={form.prix}
                onChange={handleChange}
                required
                className="w-full border border-beige rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-brown-dark/70 mb-1">Date du prix</label>
              <input
                type="date"
                name="date_prix"
                value={form.date_prix}
                onChange={handleChange}
                required
                className="w-full border border-beige rounded-md px-3 py-2"
              />
            </div>

            {submitError && <p className="text-brick text-sm">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
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
                  <th className="p-3">Matière première</th>
                  <th className="p-3">Prix</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((h) => (
                  <tr key={h.id} className="border-b border-beige last:border-0">
                    <td className="p-3">{h.matiere_premiere?.nom ?? '—'}</td>
                    <td className="p-3">{h.prix} dh</td>
                    <td className="p-3">{new Date(h.date_prix).toLocaleDateString('fr-FR')}</td>
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

export default HistoriquePrixMatieres