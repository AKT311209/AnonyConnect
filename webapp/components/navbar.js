import Link from 'next/link';
import { useRouter } from 'next/router';

const NavBar = () => {
  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-md sticky-top navbar-shrink py-3" id="mainNav">
      <div className="container">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand d-flex align-items-center">
            <span className="bs-icon-sm bs-icon-circle bs-icon-primary shadow d-flex justify-content-center align-items-center me-2 bs-icon">
              <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor">
                <g>
                  <rect fill="none" height="24" width="24" y="0"></rect>
                  <path d="M22,6.98V16c0,1.1-0.9,2-2,2H6l-4,4V4c0-1.1,0.9-2,2-2h10.1C14.04,2.32,14,2.66,14,3c0,2.76,2.24,5,5,5 C20.13,8,21.16,7.61,22,6.98z M16,3c0,1.66,1.34,3,3,3s3-1.34,3-3s-1.34-3-3-3S16,1.34,16,3z"></path>
                </g>
              </svg>
            </span>
            <span>AnonyConnect</span>
          </a>
        </Link>
        <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1">
          <span className="visually-hidden">Toggle navigation</span>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>Contact</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/tickets" legacyBehavior>
                <a className={`nav-link ${router.pathname === '/tickets' ? 'active' : ''}`}>Tickets</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;