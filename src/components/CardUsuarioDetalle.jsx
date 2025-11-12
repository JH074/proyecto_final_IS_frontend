
function CardUsuarioDetalle({ reserva}) {
    return (
        <div className="relative w-full  bg-white border border-black rounded-xl p-6 space-y-6">
            <div className="font-medium text-gray-800">Reserva #{reserva.idReserva}</div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <div className="uppercase font-semibold text-gray-800">Fecha de reserva</div>
                    <div className="text-gray-700">{reserva.fechaReserva}</div>
                </div>
                <div>
                    <div className="uppercase font-semibold text-gray-800">Lugar</div>
                    <div className="text-gray-700">{reserva.
                        nombreLugar
                    }</div>
                </div>
                <div>
                    <div className="uppercase font-semibold text-gray-800">Fecha de compra</div>
                    <div className="text-gray-700">{reserva.fechaCreacion}</div>
                </div>
                <div>
                    <div className="uppercase font-semibold text-gray-800">Hora de entrada</div>
                    <div className="text-gray-700">{reserva.horaEntrada}</div>
                </div>
                <div>
                    <div className="uppercase font-semibold text-gray-800">Hora de salida</div>
                    <div className="text-gray-700">{reserva.horaSalida}</div>
                </div>
                <div>
                    <div className="uppercase font-semibold text-gray-800">Monto</div>
                    <div className="text-gray-700">Total ${reserva.precioTotal.toFixed(2)}</div>
                </div>
                <div>
                    <div className="uppercase font-semibold text-gray-800">Nombre cancha</div>
                    <div className="text-gray-700">{reserva.nombreCancha}</div>
                </div>
            </div>
        </div>
    );
}

export default CardUsuarioDetalle;