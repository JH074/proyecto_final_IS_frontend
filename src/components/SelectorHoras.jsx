function SelectorHoras({
  horasDisponibles = [],
  horasReservadas = [],
  horasSeleccionadas = [],
  onHoraClick
}) {
  const allHours = Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, '0')}:00`
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {allHours.map(hora => {
        const disp = horasDisponibles.includes(hora);
        const occ = horasReservadas.includes(hora);
        const sel = horasSeleccionadas.includes(hora);

        let clases = "btn btn-sm border-white ";

        if (!disp || occ) {
          // Ocupadas o no disponibles
          clases += "bg-transparent text-white cursor-not-allowed";
        } else if (sel) {
          // Seleccionadas
          clases += "bg-blue-500 text-white hover:bg-blue-600";
        } else {
          // Disponibles
          clases += "bg-green-500 text-black hover:bg-green-300";
        }

        return (
          <button
            key={hora}
            disabled={!disp || occ}
            onClick={() => onHoraClick(hora)}
            className={clases}
          >
            {hora}
          </button>
        );
      })}
    </div>
  );
}

export default SelectorHoras;
