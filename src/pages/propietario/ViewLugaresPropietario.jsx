import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const API_URL = import.meta.env.VITE_API_URL;

export default function ViewLugaresPropietario() {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const [lugares, setLugares] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [alertaEliminado, setAlertaEliminado] = useState(false);
  const [alertaError, setAlertaError] = useState(false);
  const porPagina = 3;

  useEffect(() => {
    if (role && role !== 'PROPIETARIO') {
      navigate('/');
    }
  }, [role, navigate]);

  const fetchLugares = async () => {
    try {
      if (!token || role !== 'PROPIETARIO') return;

      const response = await fetch(`${API_URL}/lugares`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los lugares');
      }

      const data = await response.json();
      setLugares(data);
    } catch (error) {
      console.error('Error al cargar los lugares:', error);
    }
  };

  useEffect(() => {
    fetchLugares();
  }, [token, role]);

  const handleEliminarLugar = async (id) => {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este lugar?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`${API_URL}/lugares/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setLugares(prev => prev.filter(l => l.idLugar !== id));
        setAlertaEliminado(true);
        setTimeout(() => setAlertaEliminado(false), 2000);
      } else {
        setAlertaError(true);
        setTimeout(() => setAlertaError(false), 2000);
      }
    } catch (error) {
      console.error('Error al hacer la solicitud DELETE:', error);
      setAlertaError(true);
      setTimeout(() => setAlertaError(false), 2000);
    }
  };

  const totalPaginas = Math.ceil(lugares.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const lugaresPaginados = lugares.slice(inicio, inicio + porPagina);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagina]);

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#213A58]">Mis lugares</h1>
          <Link
            to="/propietario/nuevo_lugar"
            className="px-4 py-2 bg-black text-white rounded-full text-sm"
          >
            Agregar un nuevo lugar
          </Link>
        </div>

        {alertaEliminado && (
          <div role="alert" className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="h-6 w-6 shrink-0 stroke-current"
                 fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Lugar eliminado correctamente.</span>
          </div>
        )}

        {alertaError && (
          <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="h-6 w-6 shrink-0 stroke-current"
                 fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>No se pudo eliminar el lugar.</span>
          </div>
        )}

        <div className="space-y-6">
          {lugaresPaginados.map((lugar) => (
            <div
              key={lugar.idLugar}
              className="bg-white border border-black rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">&bull;</span>
                <span>Datos del lugar</span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <div className="font-medium text-gray-800">Nombre del lugar</div>
                  <div className="text-gray-700">{lugar.nombre}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Dirección</div>
                  <div className="text-gray-700">{lugar.direccion}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Código</div>
                  <div className="text-gray-700">{lugar.codigo}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Zona</div>
                  <div className="text-gray-700">{lugar.zona}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => handleEliminarLugar(lugar.idLugar)}
                  className="px-4 py-2 bg-gray-200 text-red-500 rounded-full text-sm hover:bg-gray-300"
                >
                  Eliminar
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/lugares/${lugar.idLugar}/canchas`)}
                  className="px-4 py-2 bg-black text-white rounded-full text-sm hover:opacity-90"
                >
                  Canchas
                </button>
              </div>
            </div>
          ))}

          {lugares.length === 0 && (
            <p className="text-gray-600">Aún no has registrado ningún lugar.</p>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-4">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="px-4 py-2 bg-white border border-gray-400 text-gray-900 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-800 font-medium">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-4 py-2 bg-white border border-gray-400 text-gray-900 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
