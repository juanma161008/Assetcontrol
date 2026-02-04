# AssetControl Frontend (React + Vite)

## Requisitos
- Node.js 18+
- Backend Flask disponible (ver `assetcontrol_back`).

## Backend Flask + MySQL (XAMPP)
Este frontend consume el API del backend Flask ubicado en:  
https://github.com/juanma161008/assetcontrol_back.git

El backend se encarga de la conexión a MySQL (XAMPP). Asegúrate de:
1. Tener MySQL corriendo en XAMPP con la base `assetcontrol`.
2. Crear el usuario/credenciales indicadas en el backend Flask.
3. Levantar el backend en `http://localhost:5000`.

## Variables de entorno
Puedes definir la URL del backend con:

```
VITE_API_URL=http://localhost:5000
```

Si no se define, el frontend usa ese valor por defecto.

## Scripts
```
npm install
npm run dev
```

## Notas
- Las rutas del API usadas por el frontend son `/login`, `/activos` y `/mantenimientos`.
- Para el login, el frontend envía el identificador como `usuario` y `email` (mismo valor) para compatibilidad con backends que validan por usuario o correo y usan `password_hash` para verificación segura.
- Para producción configura el backend con el host/puerto deseado y actualiza `VITE_API_URL`.
