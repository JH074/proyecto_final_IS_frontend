function CardUsuario({ usuario, index, onVerReservas, onEliminar }) {
  return (
    <div className=" border border-black rounded-xl p-4 space-y-3">
      <p className="font-medium text-gray-800">Usuario #{index + 1}</p>

      <div className="grid grid-cols-2 text-sm md:text-base text-gray-700 gap-4">
        <div>
          <span className="font-medium">Nombre</span>
          <p>{usuario.nombre}</p>
        </div>
        <div>
          <span className="font-medium">Correo</span>
          <p>{usuario.correo}</p>
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-2">
        <button
          onClick={() => onVerReservas(usuario.id)}
          className="bg-black text-white px-4 py-1.5 rounded-full hover:opacity-90"
        >
          Ver reservas realizadas
        </button>
        <button
          onClick={() => onEliminar(usuario.id)}
          className="bg-gray-200 text-red-500 px-4 py-1.5 rounded-full hover:bg-gray-300"
        >
          Eliminar usuario
        </button>
      </div>
    </div>
  );
}

export default CardUsuario;
