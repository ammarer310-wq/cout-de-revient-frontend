import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { logout as logoutApi, downloadExportExcel, downloadExportPdf } from '../api/client'

function LogoIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D9A94E" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2 3 2 3 .6 3 2-1.3 2.5-3 2.5-3-1.1-3-2.5" />
    </svg>
  )
}

function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logoutApi()
    } catch {
      // même si l'appel échoue, on déconnecte localement
    }
    logoutUser()
    navigate('/login')
  }

  async function handleExport() {
    try {
      await downloadExportExcel()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleExportPdf() {
    try {
      await downloadExportPdf()
    } catch (err) {
      alert(err.message)
    }
  }

  const initiale = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <nav className="bg-[#1B2A41] px-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 py-4">
          <LogoIcon />
          <h1 className="text-xl font-semibold text-[#FAF6F0]">Coût de Revient</h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={handleExport}
              className="bg-[#5C7A4A] text-white text-sm px-3 py-2 rounded-md font-medium hover:opacity-90"
            >
              Export Excel
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleExportPdf}
              className="bg-[#A33B2C] text-white text-sm px-3 py-2 rounded-md font-medium hover:opacity-90"
            >
              Export PDF
            </button>
          )}

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-[#D9A94E] flex items-center justify-center text-[#1B2A41] font-semibold text-sm">
                {initiale}
              </div>
              <span className="text-sm text-[#FAF6F0]/80">{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-[#E8A798] font-medium">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 