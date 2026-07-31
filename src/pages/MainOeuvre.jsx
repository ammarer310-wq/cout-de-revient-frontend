import { useEffect, useState } from 'react'
import { fetchMainOeuvres, fetchProduits, createMainOeuvre } from '../api/client'
import { useAuth } from '../auth/AuthContext'

function MainOeuvre() {
  const { isAdmin } = useAuth()

  const [entries, setEntries] = useState([])
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    produit_id: '',
    nom: '',
    cout_horaire: '',
    temps_minutes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function loadAll() {
    setLoading(true)
    Promise.all([fetchMainOeuvres(), fetchProduits()])
      .then(([mo, p]) => {
        setEntries(mo)
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

  // Aperçu du coût total, pour aider à comprendre l'impact avant de valider
  function apercuCoutTotal() {
    const cout = parseFloat(form.cout_horaire) || 0
    const temps = parseFloat(form.temps_minutes) || 0
    if (cout === 0 || temps === 0) return null
    return ((temps / 60) * cout).toFixed(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createMainOeuvre({
        produit_id: form.produit_id,
        nom: form.nom || null,
        cout_horaire: parseFloat(form.cout_horaire),
        temps_minutes: parseFloat(form.temps_minutes),
      })
      setForm({ produit_id: '', nom: '', cout_horaire: '', temps_minutes: '' })
      loadAll()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const apercu = apercuCoutTotal()

  // Produits qui ont déjà une entrée main d'œuvre (pour avertir avant doublon)
  const produitsAvecMainOeuvre = new Set(entries.map((e) => e.produit_id))
  const dejaExistant = form.produit_id && produitsAvecMainOeuvre.has(parseInt(form.produit_id))

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Main d'œuvre</h2>

      <div className={`grid gap-8 ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-5 space-y-3 col-span-1">
            <h3 className="font-semibold mb-2">Nouvelle main d'œuvre</h3>

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

            {dejaExistant && (
              <p className="text-sm text-brick">
                ⚠️ Ce produit a déjà une entrée de main d'œuvre. En créer une deuxième risque de fausser le calcul.
              </p>
            )}

            <Field label="Nom (optionnel, ex: Ouvrier ligne 1)" name="nom" value={form.nom} onChange={handleChange} />
            <Field label="Coût horaire (dh/h)" name="cout_horaire" value={form.cout_horaire} onChange={handleChange} type="number" required />
            <Field label="Temps de production (min)" name="temps_minutes" value={form.temps_minutes} onChange={handleChange} type="number" required />

            {apercu && (
              <p className="text-sm text-brown-dark/70">
                Coût total estimé pour le lot : <span className="font-semibold text-[#C08B2C]">{apercu} dh</span>
              </p>
            )}

            {submitError && <p className="text-brick text-sm">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {submitting ? 'Création...' : 'Créer'}
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
                  <th className="p-3">Nom</th>
                  <th className="p-3">Coût horaire</th>
                  <th className="p-3">Temps (min)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-beige last:border-0">
                    <td className="p-3">{e.produit?.nom ?? '—'}</td>
                    <td className="p-3">{e.nom ?? '—'}</td>
                    <td className="p-3">{e.cout_horaire} dh/h</td>
                    <td className="p-3">{e.temps_minutes} min</td>
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

export default MainOeuvre