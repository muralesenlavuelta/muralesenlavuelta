import Logo from '../assets/Logo.png';

function Layout({ children, user, isAdmin, onNavigate, onLogout }) {
  return (
    <div className="shell">
      <header className="topbar">
        <button className="brand" onClick={() => onNavigate('/')} aria-label="Ir al inicio">
          <img className="logo" src={Logo} alt="Murales en la Vuelta"/>
        </button>
        <nav className="main-nav" aria-label="Navegación principal">
          <button onClick={() => onNavigate('/')}>Explorar</button>
          {isAdmin && <button onClick={() => onNavigate('/admin')}>Gestionar</button>}
        </nav>
        <div className="account-nav">
          {user ? (
            <>
              <span className="user-chip">{user.username}</span>
              <button className="button button-quiet" onClick={onLogout}>Salir</button>
            </>
          ) : <button className="button button-dark" onClick={() => onNavigate('/acceso')}>Acceder</button>}
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>Murales en la Vuelta</span>
        <span>Proyecto Integrador 2026</span>
        <span>UTU Pedro Blanes Viale</span>
        <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">
          CC0 1.0 Universal (Creative Commons)
        </a>
      </footer>
    </div>
  )
}

export default Layout