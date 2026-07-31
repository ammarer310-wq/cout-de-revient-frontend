import { useEffect, useState } from 'react'
import { fetchHistoriqueCouts, fetchProduits } from '../api/client'

function HistoriqueCouts() {
  const [produits, setProduits] = useState([])
  const [produitId, setProduitId] = useState('')
  const [historique, setHistorique] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduits().then(setProduits).catch(() => {})
  }, [])

  function load(id) {
    setLoading(true)
    setError(null)
    fetchHistoriqueCouts(id)
      .then((data) => setHistorique(data.slice().reverse()))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  function handleChange(e) {
    const id = e.target.value
    setProduitId(id)
    if (id) load(id)
    else setHistorique([])
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Historique des calculs de coût</h2>

      <div className="bg-white border border-beige rounded-lg p-5 mb-6">
        <label className="block text-sm text-brown-dark/70 mb-1">Produit</label>
        <select
          value={produitId}
          onChange={handleChange}
          className="border border-beige rounded-md px-3 py-2 min-w-[220px]"
        >
          <option value="">-- Choisir un produit --</option>
          {produits.map((p) => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-brick">Erreur : {error}</p>}

      {!loading && produitId && historique.length > 0 && (
        <>
          <div className="bg-white border border-beige rounded-lg p-5 mb-6">
            <h3 className="font-semibold mb-4">Évolution du coût unitaire</h3>
            <CoutChart data={historique} />
          </div>

          <table className="w-full bg-white border border-beige rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-beige text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Coût matières</th>
                <th className="p-3">Main d'œuvre</th>
                <th className="p-3">Packaging</th>
                <th className="p-3">Charges indirectes</th>
                <th className="p-3">Coût unitaire</th>
              </tr>
            </thead>
            <tbody>
              {historique.slice().reverse().map((h) => (
                <tr key={h.id} className="border-b border-beige last:border-0">
                  <td className="p-3">{new Date(h.created_at).toLocaleString('fr-FR')}</td>
                  <td className="p-3">{h.cout_matieres} dh</td>
                  <td className="p-3">{h.cout_main_oeuvre} dh</td>
                  <td className="p-3">{h.cout_packaging} dh</td>
                  <td className="p-3">{h.charges_indirectes} dh</td>
                  <td className="p-3 font-semibold text-[#C08B2C]">{h.cout_unitaire} dh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!loading && produitId && historique.length === 0 && (
        <p className="text-brown-dark/60">Aucun calcul enregistré pour ce produit.</p>
      )}
    </div>
  )
}

function CoutChart({ data }) {
  const width = 700
  const height = 260
  const padding = 50

  const values = data.map((d) => parseFloat(d.cout_unitaire))
  const max = Math.max(...values) * 1.15
  const min = 0

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2)
    const y = height - padding - ((parseFloat(d.cout_unitaire) - min) / (max - min)) * (height - padding * 2)
    return { x, y, value: parseFloat(d.cout_unitaire), date: d.created_at }
  })

  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(' ')

  // 4 repères sur l'axe Y (0, 33%, 66%, 100% du max)
  const yTicks = [0, 0.33, 0.66, 1].map((f) => Math.round(max * f))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Lignes horizontales de repère + valeurs */}
      {yTicks.map((tick, i) => {
        const y = height - padding - (tick / max) * (height - padding * 2)
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#E5DCCF" strokeDasharray="4" />
            <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#2E2118" opacity="0.6">
              {tick} dh
            </text>
          </g>
        )
      })}

      {/* Ligne de la courbe */}
      <polyline points={pointsStr} fill="none" stroke="#C08B2C" strokeWidth="2.5" />

      {/* Points + valeur au-dessus de chaque point + date en-dessous */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#C08B2C" />
          <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#2E2118">
            {p.value}
          </text>
          <text
            x={p.x}
            y={height - padding + 18}
            textAnchor="middle"
            fontSize="9"
            fill="#2E2118"
            opacity="0.5"
            transform={`rotate(-30, ${p.x}, ${height - padding + 18})`}
          >
            {new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
          </text>
        </g>
      ))}

      {/* Axe horizontal */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#2E2118" opacity="0.3" />
    </svg>
  )
}

export default HistoriqueCouts