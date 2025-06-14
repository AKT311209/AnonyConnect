import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminNavBar = () => {
  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-md sticky-top navbar-shrink py-3" id="mainNav">
      <div className="container">
        <Link href="/admin" className="navbar-brand d-flex align-items-center">
          <span className="bs-icon-sm bs-icon-circle bs-icon-primary shadow d-flex justify-content-center align-items-center me-2 bs-icon">
            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor">
              <g>
                <path d="M0,0h24v24H0V0z" fill="none"></path>
              </g>
              <g>
                <g>
                  <circle cx="10" cy="8" r="4"></circle>
                  <path d="M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V20h9.26 C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z"></path>
                  <path d="M20.75,16c0-0.22-0.03-0.42-0.06-0.63l1.14-1.01l-1-1.73l-1.45,0.49c-0.32-0.27-0.68-0.48-1.08-0.63L18,11h-2l-0.3,1.49 c-0.4,0.15-0.76,0.36-1.08,0.63l-1.45-0.49l-1,1.73l1.14,1.01c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-1.14,1.01 l1,1.73l1.45-0.49c0.32,0.27,0.68,0.48,1.08,0.63L16,21h2l0.3-1.49c0.4-0.15,0.76-0.36,1.08-0.63l1.45,0.49l1-1.73l-1.14-1.01 C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.1,18,17,18z"></path>
                </g>
              </g>
            </svg>
          </span>
          <span>Admin Interface</span>
        </Link>
        <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1">
          <span className="visually-hidden">Toggle navigation</span>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav mx-auto">            
            <li className="nav-item">
              <Link href="/admin/tickets" className={`nav-link ${router.pathname === '/admin/tickets' ? 'active' : ''}`}>Tickets</Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/management" className={`nav-link ${router.pathname === '/admin/management' ? 'active' : ''}`}>Management</Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/configuration" className={`nav-link ${router.pathname === '/admin/configuration' ? 'active' : ''}`}>Configuration</Link>
            </li>
          </ul>
          <div className="d-flex ms-0" style={{gap: '0.05rem'}}>
            <button
              className="btn btn-outline-danger ms-0"
              style={{ minWidth: 80, fontWeight: 500, fontSize: '1.05rem', borderRadius: '2rem', borderWidth: 2, color: '#e53935', borderColor: '#e53935', background: 'transparent', padding: '0.18rem 0.9rem' }}
              onClick={async () => {
                await fetch('/api/admin/invalidate-session', { method: 'POST' });
                router.push('/admin/login');
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;