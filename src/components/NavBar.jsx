import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import navbar1 from '/src/assets/futbol-americano.png'

function NavBar() {

  const { token, role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar items-center justify-center bg-[#213A58] shadow-sm">
      <div className="flex-1 items-center justify-center gap-2">
        <div>
          <Link to="/" className="flex grid-rows-1">
            <p className="text-xl font-bold text-white">Canchitas</p>
            <img
              src={navbar1}
              alt="Logo"
              className="w-8 h-8"
            />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 text-white">
            <li><Link to="/">Inicio</Link></li>

            {token && role === 'CLIENTE' && (
              <>
                <li><Link to="/info_canchas">Canchas</Link></li>
                <li><Link to="/reservar">Crear reservación</Link></li>
                <li><Link to="/mis_reservaciones">Mis reservaciones</Link></li>
                <li><Link to="/solicitudes">Solicitud propietario</Link></li>
              </>
            )}

            {token && role === 'PROPIETARIO' && (
            <>
            <li><Link to="/reservaciones">Reservaciones</Link></li>
            <li><Link to="/lugares">Lugares</Link></li>
            </>
            )}


            {token && role === 'ADMIN' && (
              <>
                <li><Link to="/reservaciones">Reservaciones</Link></li>
                <li><Link to="/usuarios">Usuarios</Link></li>
                <li><Link to="/lugares">Lugares</Link></li>
              </>
            )}
          </ul>
        </div>

        {token && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn-circle">
              <div className="w-10 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="size-10"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#213A58] rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {user && (
                <li className="px-4 py-2 text-white items-center">
                  <strong>{user.nombre}</strong>
                </li>
              )}
              <li>
                <button className="btn btn-ghost text-white" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;