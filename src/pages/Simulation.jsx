import { useState } from 'react'
import { simuler } from '../api/client'

function Simulation() {
  const [recettes, setRecettes] = useState([{ prix_achat: '', quantite_reelle: '' }])
  const [coutMod, setCoutMod] = useState('')
  const [coutPackaging, setCoutPackaging] = useState('')
  const [chargesIndirectes, setChargesIndirectes] = useState('')
  const [quantiteLot, setQuantiteLot] = useState(1000)

  const [resultat, setResultat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function updateRecette(index, field, value) {
    const copie = [...recettes]
    copie[index][field] = value
    setRecettes(copie)
  }

  function ajouterRecette() {
    setRecettes([...recettes, { prix_achat: '', quantite_reelle: '' }])
  }

  function supprimerRecette(index) {
    setRecettes(recettes.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResultat(null)
    try {
      const data = await simuler({
        recettes: recettes.map((r) => ({
          prix_achat: parseFloat(r.prix_achat) || 0,
          quantite_reelle: parseFloat(r.quantite_reelle) || 0,
        })),
        cout_mod: parseFloat(coutMod) || 0,
        cout_packaging: parseFloat(coutPackaging) || 0,
        charges_indirectes: parseFloat(chargesIndirectes) || 0,
        quantite_lot: parseFloat(quantiteLot) || 1,
      })
      setResultat(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Simulation</h2>

      <form onSubmit={handleSubmit} className="bg-white border border-beige rounded-lg p-5 space-y-5">
        <div>
          <h3 className="font-semibold mb-2">Matières premières</h3>
          <div className="space-y-2">
            {recettes.map((r, i) => (
              <div key={i} className="flex gap-3 items-end">
                <div>
                  <label className="block text-sm text-brown-dark/70 mb-1">Prix d'achat (dh)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={r.prix_achat}
                    onChange={(e) => updateRecette(i, 'prix_achat', e.target.value)}
                    className="border border-beige rounded-md px-3 py-2 w-32"
                  />
                </div>
                <div>
                  <label className="block text-sm text-brown-dark/70 mb-1">Quantité réelle</label>
                  <input
                    type="number"
                    step="0.01"
                    value={r.quantite_reelle}
                    onChange={(e) => updateRecette(i, 'quantite_reelle', e.target.value)}
                    className="border border-beige rounded-md px-3 py-2 w-32"
                  />
                </div>
                {recettes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => supprimerRecette(i)}
                    className="text-brick text-sm px-2 py-2"
                  >
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={ajouterRecette}
            className="text-[#C08B2C] text-sm mt-2 font-medium"
          >
            + Ajouter une matière première
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 border-t border-beige pt-4">
          <div>
            <label className="block text-sm text-brown-dark/70 mb-1">Coût MOD (dh)</label>
            <input
              type="number"
              step="0.01"
              value={coutMod}
              onChange={(e) => setCoutMod(e.target.value)}
              className="border border-beige rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-brown-dark/70 mb-1">Coût packaging (dh)</label>
            <input
              type="number"
              step="0.01"
              value={coutPackaging}
              onChange={(e) => setCoutPackaging(e.target.value)}
              className="border border-beige rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-brown-dark/70 mb-1">Charges indirectes (dh)</label>
            <input
              type="number"
              step="0.01"
              value={chargesIndirectes}
              onChange={(e) => setChargesIndirectes(e.target.value)}
              className="border border-beige rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-brown-dark/70 mb-1">Quantité du lot</label>
            <input
              type="number"
              value={quantiteLot}
              onChange={(e) => setQuantiteLot(e.target.value)}
              className="border border-beige rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#C08B2C] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? 'Calcul...' : 'Simuler'}
        </button>
      </form>

      {error && <p className="text-brick mt-4">Erreur : {error}</p>}

      {resultat && (
        <div className="bg-white border border-beige rounded-lg p-5 mt-6">
          <h3 className="font-semibold mb-4">Résultat de la simulation</h3>
          <div className="grid grid-cols-3 gap-4">
            <Detail label="Coût matières" value={resultat.cout_matieres} />
            <Detail label="Coût total" value={resultat.cout_total} />
            <Detail label="Coût unitaire" value={resultat.cout_unitaire} accent />
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

export default Simulation