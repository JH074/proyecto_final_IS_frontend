// src/context/NotificationContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

const NotificationContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

export function NotificationProvider({ children }) {
const { token, user, role } = useAuth();
const [notification, setNotification] = useState(null);
const lastEstadoRef = useRef(null); // último estado conocido
const intervalRef = useRef(null);

const clearNotification = () => setNotification(null);

useEffect(() => {
// limpiamos cualquier intervalo anterior
if (intervalRef.current) {
clearInterval(intervalRef.current);
intervalRef.current = null;
}

// si no hay sesión o no hay usuario, no hacemos nada
if (!token || !user || !user.id) {
setNotification(null);
lastEstadoRef.current = null;
return;
}

// (Opcional) solo notificar a usuarios CLIENTE
if (role && role !== "CLIENTE") {
setNotification(null);
lastEstadoRef.current = null;
return;
}

const checkEstado = async () => {
try {
const res = await fetch(`${API_URL}/solicitudes/estado-usuario/${user.id}`, {
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
});

if (res.status === 404) {
console.log("[Noti] 404: usuario sin solicitudes");
lastEstadoRef.current = null;
setNotification(null);
return;
}

if (!res.ok) {
console.error("[Noti] Error HTTP:", res.status);
return;
}

const data = await res.json(); // { idSolicitud, estadoSolicitud }
const motivo = data.motivoRechazo;
const estadoActual = data.estadoSolicitud; // PENDIENTE / APROBADA / RECHAZADA
const estadoAnterior = lastEstadoRef.current;

// 🔹 Primera vez que preguntamos por este usuario
if (estadoAnterior == null) {
lastEstadoRef.current = estadoActual;

// Si ya está APROBADA o RECHAZADA, también queremos avisar
if (estadoActual === "APROBADA") {
setNotification({
type: "success",
message:
"Tu solicitud ha sido aceptada. Ahora eres propietario, cierra e inicia sesión de nuevo.",
});
} else if (estadoActual === "RECHAZADA") {
setNotification({
type: "error",
message:
motivo && motivo.trim().length > 0
? `Tu solicitud ha sido rechazada. Motivo: ${motivo}`
: "Tu solicitud ha sido rechazada. Revisa tus datos o contacta al administrador.",
});
}
return;
}

// 🔹 Si no cambió el estado, no hacemos nada
if (estadoActual === estadoAnterior) return;

// 🔹 Cambio real de estado (PENDIENTE → APROBADA/RECHAZADA, etc.)
lastEstadoRef.current = estadoActual;

if (estadoActual === "APROBADA") {
setNotification({
type: "success",
message:
"Tu solicitud ha sido aceptada. Ahora eres propietario, cierra e inicia sesión de nuevo.",
});
} else if (estadoActual === "RECHAZADA") {
setNotification({
type: "error",
message:
motivo && motivo.trim().length > 0
? `Tu solicitud ha sido rechazada. Motivo: ${motivo}`
: "Tu solicitud ha sido rechazada. Revisa tus datos o contacta al administrador.",
});
} else {
setNotification(null);
}
} catch (err) {
console.error("[Noti] Error consultando estado de solicitud:", err);
}
};

// llamada inicial
checkEstado();

// polling cada 5s
intervalRef.current = setInterval(checkEstado, 5000);

// limpiar al desmontar o cambiar usuario
return () => {
if (intervalRef.current) {
clearInterval(intervalRef.current);
intervalRef.current = null;
}
};
}, [token, user, role]);

return (
<NotificationContext.Provider value={{ notification, clearNotification }}>
{children}
</NotificationContext.Provider>
);
}

export function useNotification() {
return useContext(NotificationContext);
}