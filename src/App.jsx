import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Produits from './pages/Produits'
import CoutRevient from './pages/CoutRevient'
import Pricing from './pages/Pricing'
import Simulation from './pages/Simulation'
import Login from './pages/Login'
import Register from './pages/Register'
import Recettes from './pages/Recettes'
import MatieresPremieres from './pages/MatieresPremieres'
import PackagingPage from './pages/Packaging'
import MainOeuvrePage from './pages/MainOeuvre'
import Sidebar from './components/Sidebar'
import HistoriquePrixMatieres from './pages/HistoriquePrixMatieres'
import HistoriqueCouts from './pages/HistoriqueCouts'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
  <div className="min-h-screen bg-cream text-brown-dark flex flex-col">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/cout" element={<CoutRevient />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/recettes" element={<Recettes />} />
          <Route path="/matieres-premieres" element={<MatieresPremieres />} />
          <Route path="/packaging" element={<PackagingPage />} />
          <Route path="/main-oeuvre" element={<MainOeuvrePage />} />
          <Route path="/historique-prix-matieres" element={<HistoriquePrixMatieres />} />
          <Route path="/historique-couts" element={<HistoriqueCouts />} />
        </Routes>
      </main>
    </div>
  </div>
</ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App