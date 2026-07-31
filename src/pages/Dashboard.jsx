import { useEffect, useState } from 'react'
import { fetchDashboard } from '../api/client'

function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="text-brick">Erreur : {error}</p>

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Produits" value={data.nombre_produits} />
        <StatCard label="Non rentables" value={data.produits_non_rentables} accent="brick" />
        <StatCard label="Coût moyen" value={`${data.cout_moyen} dh`} />
        <StatCard label="Prix moyen" value={`${data.prix_moyen} dh`} />
      </div>

      <h3 className="text-lg font-semibold mb-3">Détail par produit</h3>
      <table className="w-full bg-white border border-beige rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-beige text-left">
            <th className="p-3">Produit</th>
            <th className="p-3">Coût total</th>
            <th className="p-3">Prix de vente</th>
            <th className="p-3">Rentable</th>
          </tr>
        </thead>
        <tbody>
          {data.produits.map((p) => (
            <tr key={p.id} className="border-b border-beige last:border-0">
              <td className="p-3">{p.nom}</td>
              <td className="p-3">{p.cout_total ?? '—'} dh</td>
              <td className="p-3">{p.prix_vente ?? '—'} dh</td>
              <td className="p-3">
                {p.rentable === null ? (
                  '—'
                ) : p.rentable ? (
                  <span className="text-olive font-medium">Oui</span>
                ) : (
                  <span className="text-brick font-medium">Non</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-beige rounded-lg p-4">
      <p className="text-sm text-brown-dark/70">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accent === 'brick' ? 'text-brick' : 'text-gold'}`}>
        {value}
      </p>
    </div>
  )
}

export default Dashboard