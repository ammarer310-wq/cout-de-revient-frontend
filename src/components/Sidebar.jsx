import { NavLink } from 'react-router-dom'

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  )
}

function IconProduits() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
    </svg>
  )
}

function IconCout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2 3 2 3 .6 3 2-1.3 2.5-3 2.5-3-1.1-3-2.5" />
    </svg>
  )
}

function IconPricing() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.6 12.6L13 20.2a2 2 0 01-2.8 0l-6.4-6.4a2 2 0 010-2.8L11.4 3.4a2 2 0 011.4-.6H19a2 2 0 012 2v5.4a2 2 0 01-.6 1.4z" />
      <circle cx="14.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconSimulation() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 21V10M4 6V3M12 21V14M12 10V3M20 21V16M20 12V3" />
      <circle cx="4" cy="8" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="20" cy="14" r="2" />
    </svg>
  )
}

function IconRecettes() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4z" />
      <path d="M8 8h6M8 12h6" />
    </svg>
  )
}

function IconMatieres() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2s5 4 5 9a5 5 0 01-10 0c0-5 5-9 5-9z" />
      <path d="M12 15v7" />
    </svg>
  )
}

function IconPackaging() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8M3 8l9 5 9-5" />
    </svg>
  )
}

function IconMainOeuvre() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a6 6 0 0112 0v2" />
      <path d="M18 8a3 3 0 010 6" />
    </svg>
  )
}

const links = [
  { to: '/', label: 'Dashboard', Icon: IconDashboard },
  { to: '/produits', label: 'Produits', Icon: IconProduits },
  { to: '/cout', label: 'Coût de revient', Icon: IconCout },
  { to: '/pricing', label: 'Pricing', Icon: IconPricing },
  { to: '/simulation', label: 'Simulation', Icon: IconSimulation },
  { to: '/recettes', label: 'Recettes', Icon: IconRecettes },
  { to: '/matieres-premieres', label: 'Matières premières', Icon: IconMatieres },
  { to: '/packaging', label: 'Packaging', Icon: IconPackaging },
  { to: '/main-oeuvre', label: "Main d'œuvre", Icon: IconMainOeuvre },
  { to: '/historique-prix-matieres', label: 'Historique prix matières', Icon: IconMatieres },
  { to: '/historique-couts', label: 'Historique des calculs', Icon: IconCout },
]

function Sidebar() {
  return (
    <aside className="w-56 bg-[#1B2A41] min-h-full">
      <nav className="p-3 space-y-1">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-white/10 text-[#D9A94E] font-medium'
                  : 'text-[#FAF6F0]/80 hover:bg-white/5'
              }`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar