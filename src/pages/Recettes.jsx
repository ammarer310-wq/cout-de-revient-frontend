import { useEffect, useState } from 'react'
import { fetchRecettes, fetchProduits, fetchMatieresPremieres, createRecette } from '../api/client'
import { useAuth } from '../auth/AuthContext'

function Recettes() {
  const { isAdmin } = useAuth()

  const [recettes, setRecettes] = useState([])
  const [produits, setProduits] = useState([])
  const [matieres, setMatieres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    produit_id: '',
    matierepremiere_id: '',
    quantite_theorique: '',
    perte_pourcentage: '',
    rendement: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function loadAll() {
    setLoading(true)
    Promise.all([fetchRecettes(), fetchProduits(), fetchMatieresPremieres()])
      .then(([r, p, m]) => {
        setRecettes(r)
        setProduits(p)
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

  // Aperçu du calcul, pour que l'utilisateur voie l'impact avant de valider
  function apercuQuantiteReelle() {
    const q = parseFloat(form.quantite_theorique) || 0
    const perte = parseFloat(form.perte_pourcentage) || 0
    const rendement = parseFloat(form.rendement) || 100
    if (q === 0) return null
    const reel = (q * (1 + perte / 100)) / (rendement / 100)
    return reel.toFixed(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createRecette({
        produit_id: form.produit_id,
        matierepremiere_id: form.matierepremiere_id,
        quantite_theorique: parseFloat(form.quantite_theorique),
        perte_pourcentage: form.perte_pourcentage ? parseFloat(form.perte_pourcentage) : null,
        rendement: form.rendement ? parseFloat(form.rendement) : null,
      })
      setForm({ produit_id: '', matierepremiere_id: '', quantite_theorique: '', perte_pourcentage: '', rendement: '' })
      loadAll()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const apercu = apercuQuantiteReelle()

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Recettes</h2>

      <div className={`grid gap-8 ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-5 space-y-3 col-span-1">
            <h3 className="font-semibold mb-2">Nouvelle recette</h3>

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
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>

            <Field label="Quantité théorique" name="quantite_theorique" value={form.quantite_theorique} onChange={handleChange} type="number" required />
            <Field label="Perte (%)" name="perte_pourcentage" value={form.perte_pourcentage} onChange={handleChange} type="number" />
            <Field label="Rendement (%)" name="rendement" value={form.rendement} onChange={handleChange} type="number" />

            {apercu && (
              <p className="text-sm text-brown-dark/70">
                Quantité réelle estimée : <span className="font-semibold text-[#C08B2C]">{apercu}</span>
              </p>
            )}

            {submitError && <p className="text-brick text-sm">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {submitting ? 'Création...' : 'Créer la recette'}
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
                  <th className="p-3">Matière première</th>
                  <th className="p-3">Qté théorique</th>
                  <th className="p-3">Perte</th>
                  <th className="p-3">Rendement</th>
                  <th className="p-3">Qté réelle</th>
                </tr>
              </thead>
              <tbody>
                {recettes.map((r) => (
                  <tr key={r.id} className="border-b border-beige last:border-0">
                    <td className="p-3">{r.produit?.nom ?? '—'}</td>
                    <td className="p-3">{r.matiere_premiere?.nom ?? '—'}</td>
                    <td className="p-3">{r.quantite_theorique}</td>
                    <td className="p-3">{r.perte_pourcentage ?? 0} %</td>
                    <td className="p-3">{r.rendement ?? 100} %</td>
                    <td className="p-3 font-medium">{r.quantite_reelle}</td>
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

export default Recettes