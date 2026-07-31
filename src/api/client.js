const API_URL = import.meta.env.VITE_API_URL
const BASE_URL = 'http://localhost:8000'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(res, defaultMessage) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || defaultMessage)
  }
  return res.json()
}

// --- Auth ---

export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return handleResponse(res, "Erreur lors de l'inscription")
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(res, 'Erreur lors de la connexion')
}

export async function logout() {
  const res = await fetch(`${API_URL}/v1/logout`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors de la déconnexion')
}

// --- Dashboard ---

export async function fetchDashboard() {
  const res = await fetch(`${API_URL}/dashboard`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors du chargement du dashboard')
}

// --- Produits ---

export async function fetchProduits() {
  const res = await fetch(`${API_URL}/produits`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors du chargement des produits')
}

export async function createProduit(produit) {
  const res = await fetch(`${API_URL}/produits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(produit),
  })
  return handleResponse(res, 'Erreur lors de la création du produit')
}

// --- Coût de revient ---

export async function fetchCout(produitId, quantite) {
  const res = await fetch(`${BASE_URL}/api/cout/${produitId}?quantite=${quantite}`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors du calcul du coût')
}

export async function savePrixVente(produitId, prixVente) {
  const res = await fetch(`${API_URL}/produits/${produitId}/prix-vente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ prix_vente: prixVente }),
  })
  return handleResponse(res, 'Erreur lors de la sauvegarde du prix de vente')
}

// --- Pricing ---

export async function calculerPricing(coutUnitaire, prixVente) {
  const res = await fetch(`${API_URL}/pricing/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({
      cout_unitaire: coutUnitaire,
      prix_vente: prixVente,
    }),
  })
  return handleResponse(res, 'Erreur lors du calcul du pricing')
}

// --- Simulation ---

export async function simuler(payload) {
  const res = await fetch(`${API_URL}/simulation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return handleResponse(res, 'Erreur lors de la simulation')
}

export async function downloadExportExcel() {
  const res = await fetch(`${BASE_URL}/api/export/excel`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    throw new Error("Erreur lors de l'export Excel")
  }
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'rapport.xlsx'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export async function fetchRecettes() {
  const res = await fetch(`${API_URL}/recettes`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors du chargement des recettes')
}

export async function fetchMatieresPremieres() {
  const res = await fetch(`${API_URL}/matierepremiere`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors du chargement des matières premières')
}

export async function createRecette(recette) {
  const res = await fetch(`${API_URL}/recettes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(recette),
  })
  return handleResponse(res, 'Erreur lors de la création de la recette')
}

export async function createMatierePremiere(matiere) {
  const res = await fetch(`${API_URL}/matierepremiere`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(matiere),
  })
  return handleResponse(res, 'Erreur lors de la création de la matière première')
}

export async function fetchFournisseurs() {
  const res = await fetch(`${API_URL}/fournisseurs`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors du chargement des fournisseurs')
}

export async function fetchPackagings() {
  const res = await fetch(`${API_URL}/packagings`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, 'Erreur lors du chargement des packagings')
}

export async function createPackaging(packaging) {
  const res = await fetch(`${API_URL}/packagings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(packaging),
  })
  return handleResponse(res, 'Erreur lors de la création du packaging')
}

export async function fetchMainOeuvres() {
  const res = await fetch(`${API_URL}/main-oeuvre`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, "Erreur lors du chargement de la main d'œuvre")
}

export async function createMainOeuvre(mainOeuvre) {
  const res = await fetch(`${API_URL}/main-oeuvre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(mainOeuvre),
  })
  return handleResponse(res, "Erreur lors de la création de la main d'œuvre")
}
export async function downloadExportPdf() {
  const res = await fetch(`${BASE_URL}/api/export/pdf`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    throw new Error("Erreur lors de l'export PDF")
  }
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'rapport.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export async function fetchHistoriquePrix() {
  const res = await fetch(`${API_URL}/historiqueprix`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, "Erreur lors du chargement de l'historique des prix")
}

export async function createHistoriquePrix(entry) {
  const res = await fetch(`${API_URL}/historiqueprix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(entry),
  })
  return handleResponse(res, "Erreur lors de l'ajout du prix")
}

export async function fetchHistoriqueCouts(produitId) {
  const url = produitId
    ? `${API_URL}/historique-couts?produit_id=${produitId}`
    : `${API_URL}/historique-couts`
  const res = await fetch(url, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res, "Erreur lors du chargement de l'historique des calculs")
}