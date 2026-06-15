# 🤫 Insta Mute for X

**Silencia usuarios de X (Twitter) al instante con un solo clic.**

[![GitHub release](https://img.shields.io/github/v/release/vgb95/insta-mute?style=flat&label=versión)](https://github.com/vgb95/insta-mute/releases)
[![Licencia](https://img.shields.io/badge/licencia-MIT-green?style=flat)](LICENSE)
![Chrome](https://img.shields.io/badge/Chrome-≥88-4285F4?style=flat&logo=google-chrome&logoColor=white)
![X](https://img.shields.io/badge/X-compatible-000000?style=flat&logo=x&logoColor=white)

---

## 🎯 ¿Qué hace?

Añade un botón 🤫 en cada tuit de X. **Un solo clic** y el autor queda silenciado al instante, sin pasos intermedios ni confirmaciones.

![Demo](https://via.placeholder.com/800x450/1a1a2e/ffffff?text=🤫+Insta+Mute+en+acción)

*→ Aparece una animación "shhh!" cuando se silencia a alguien.*

## ✨ Características

| | |
|---|---|
| ⚡ **Instantáneo** | Un clic → silenciado. Sin menús, sin confirmaciones. |
| 🤫 **Animación** | Aparece un divertido "shhh!" al silenciar. |
| 🧹 **Invisible en tus tuits** | El botón no aparece en tus propios posts. |
| 🌐 **Multi-idioma** | Funciona en español e inglés. |
| 🔄 **Auto-reparación** | Si X regenera el DOM, el botón se recoloca solo. |
| 🪶 **Ligero** | Sin dependencias, sin frameworks, sin tracking. |

## 📦 Instalación

### Desde el código (Chrome, Edge, Brave, Opera)

1. Descarga el [último ZIP](https://github.com/vgb95/insta-mute/archive/refs/heads/main.zip) y descomprímelo.
2. Abre `chrome://extensions` en tu navegador.
3. Activa el **Modo desarrollador** (esquina superior derecha).
4. Haz clic en **"Cargar extensión sin empaquetar"**.
5. Selecciona la carpeta `insta-mute-main`.

### Desde Firefox (próximamente)

Actualmente solo disponible para navegadores basados en Chromium. La versión para Firefox llegará pronto.

## 🧑‍💻 Desarrollo

```bash
git clone https://github.com/vgb95/insta-mute.git
cd insta-mute
# Sin build steps — es JavaScript vanilla.
# Abre chrome://extensions → Cargar extensión sin empaquetar
```

### Estructura del proyecto

```
insta-mute/
├── manifest.json      # Manifest V3
├── content.js         # Lógica principal
├── popup.html         # Popup informativo
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🔒 Privacidad

**Cero datos recogidos.** La extensión:

- No se conecta a ningún servidor externo.
- No almacena ni transmite información.
- No requiere permisos de lectura de navegación.
- Solo se activa en `x.com` y `twitter.com`.

Todo el muteo se hace a través de la interfaz de X, simulando la acción del usuario.

## ⚠️ Compatibilidad

X (Twitter) modifica su interfaz con frecuencia. Si algo deja de funcionar, abre un [issue](https://github.com/vgb95/insta-mute/issues) e intentaré arreglarlo.

---

<div align="center">
Hecho con ❤️ y 🤫<br>
<a href="https://github.com/vgb95/insta-mute/issues">Reportar un fallo</a> ·
<a href="https://github.com/vgb95/insta-mute/issues">Sugerir una mejora</a>
</div>
