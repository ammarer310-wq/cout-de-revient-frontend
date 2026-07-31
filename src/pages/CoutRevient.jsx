import { useEffect, useState } from 'react'
import { fetchProduits, fetchCout, savePrixVente } from '../api/client'

function CoutRevient() {
  const [produits, setProduits] = useState([])
  const [produitId, setProduitId] = useState('')
  const [quantite, setQuantite] = useState(1000)

  const [resultat, setResultat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [prixVente, setPrixVente] = useState('')
  const [saveMessage, setSaveMessage] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProduits().then(setProduits).catch(() => {})
  }, [])

  async function handleCalculer(e) {
    e.preventDefault()
    if (!produitId) return
    setLoading(true)
    setError(null)
    setResultat(null)
    try {
      const data = await fetchCout(produitId, quantite)
      setResultat(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSavePrix(e) {
    e.preventDefault()
    setSaving(true)
    setSaveMessage(null)
    try {
      await savePrixVente(produitId, parseFloat(prixVente))
      setSaveMessage('Prix de vente enregistré avec succès.')
    } catch (err) {
      setSaveMessage(`Erreur : ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Coût de revient</h2>

      <form onSubmit={handleCalculer} className="bg-white border border-beige rounded-lg p-5 flex gap-4 items-end mb-6">
        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Produit</label>
          <select
            value={produitId}
            onChange={(e) => setProduitId(e.target.value)}
            required
            className="border border-beige rounded-md px-3 py-2 min-w-[200px]"
          >
            <option value="">-- Choisir --</option>
            {produits.map((p) => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-brown-dark/70 mb-1">Quantité du lot</label>
          <input
            type="number"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            className="border border-beige rounded-md px-3 py-2 w-32"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? 'Calcul...' : 'Calculer'}
        </button>
      </form>

      {error && <p className="text-brick mb-4">Erreur : {error}</p>}

      {resultat && (
        <div className="bg-white border border-beige rounded-lg p-5 space-y-4">
          <h3 className="font-semibold">Détail du coût</h3>

          <div className="grid grid-cols-3 gap-4">
            <Detail label="Coût matières" value={resultat.cout_matieres} />
            <Detail label="Coût main d'œuvre" value={resultat.cout_main_oeuvre} />
            <Detail label="Coût packaging" value={resultat.cout_packaging} />
            <Detail label="Charges indirectes" value={resultat.chargesindirectes} />
            <Detail label="Coût total" value={resultat.cout_total} />
            <Detail label="Coût unitaire" value={resultat.cout_unitaire} accent />
          </div>

          <div className="border-t border-beige pt-4">
            <h4 className="font-medium mb-2">Fixer le prix de vente officiel</h4>
            <form onSubmit={handleSavePrix} className="flex gap-3 items-end">
              <input
                type="number"
                step="0.01"
                value={prixVente}
                onChange={(e) => setPrixVente(e.target.value)}
                placeholder="Prix de vente (dh)"
                required
                className="border border-beige rounded-md px-3 py-2 w-48"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-[#5C7A4A] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
            {saveMessage && <p className="text-sm mt-2">{saveMessage}</p>}
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
      <p className={`text-lg font-semibold ${accent ? 'text-[#C08B2C]' : ''}`}>{value} dh</p>
    </div>
  )
}

export default CoutRevient 