import { useEffect, useState } from 'react'
import { fetchProduits, fetchCout, calculerPricing } from '../api/client'

function Pricing() {
  const [produits, setProduits] = useState([])
  const [produitId, setProduitId] = useState('')

  const [coutUnitaire, setCoutUnitaire] = useState('')
  const [prixVente, setPrixVente] = useState('')

  const [resultat, setResultat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduits().then(setProduits).catch(() => {})
  }, [])

  async function handleChargerCout() {
    if (!produitId) return
    try {
      const data = await fetchCout(produitId, 1000)
      setCoutUnitaire(data.cout_unitaire)
    } catch {
      // silencieux : le champ reste modifiable manuellement
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResultat(null)
    try {
      const data = await calculerPricing(parseFloat(coutUnitaire), parseFloat(prixVente))
      setResultat(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Pricing &amp; Marges</h2>

      <div className="bg-white border border-beige rounded-lg p-5 mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Charger le coût d'un produit (optionnel)</label>
          <select
            value={produitId}
            onChange={(e) => setProduitId(e.target.value)}
            className="border border-beige rounded-md px-3 py-2 min-w-[200px]"
          >
            <option value="">-- Choisir --</option>
            {produits.map((p) => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleChargerCout}
          disabled={!produitId}
          className="bg-[#2E2118]/10 text-brown-dark px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          Charger le coût
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-5 flex gap-4 items-end mb-6">
        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Coût unitaire (dh)</label>
          <input
            type="number"
            step="0.01"
            value={coutUnitaire}
            onChange={(e) => setCoutUnitaire(e.target.value)}
            required
            className="border border-beige rounded-md px-3 py-2 w-40"
          />
        </div>

        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Prix de vente envisagé (dh)</label>
          <input
            type="number"
            step="0.01"
            value={prixVente}
            onChange={(e) => setPrixVente(e.target.value)}
            required
            className="border border-beige rounded-md px-3 py-2 w-40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? 'Calcul...' : 'Simuler'}
        </button>
      </form>

      {error && <p className="text-brick mb-4">Erreur : {error}</p>}

      {resultat && (
        <div className="bg-white border border-beige rounded-lg p-5">
          <h3 className="font-semibold mb-4">Résultat</h3>
          <div className="grid grid-cols-3 gap-4">
            <Detail label="Coût unitaire" value={resultat.cout_unitaire} />
            <Detail label="Prix de vente" value={resultat.prix_vente} />
            <Detail label="Marge brute" value={resultat.marge_brute} accent />
            <Detail label="Taux de marge" value={`${resultat.taux_marge} %`} />
            <Detail label="Prix min. conseillé" value={resultat.prix_min_conseille} />
          </div>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value, accent }) {
  return (
    <div>
      <p className="text-sm text-brown-dark/70">{label}</p>
      <p className={`text-lg font-semibold ${accent ? 'text-[#C08B2C]' : ''}`}>
        {typeof value === 'number' ? `${value} dh` : value}
      </p>
    </div>
  )
}

export default Pricing