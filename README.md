# Medical Anatomy 3D Viewer

An interactive 3D anatomy learning application built with React, Three.js, and React Three Fiber.

## Features

- 🫀 Interactive 3D anatomical models
- 🔍 Detailed organ information and descriptions
- 🎮 Intuitive camera controls (rotate, zoom, pan)
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🥽 VR support with WebXR

## Tech Stack

- **React** - UI framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
cd anatomy-app
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `https://localhost:5173` (HTTPS enabled for WebXR support)

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy.

### Vercel Configuration

The build settings for Vercel:
- **Framework Preset**: Vite
- **Build Command**: `cd anatomy-app && npm install && npm run build`
- **Output Directory**: `anatomy-app/dist`
- **Install Command**: `npm install`

## Project Structure

```
medical/
├── anatomy-app/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── SceneControls.jsx # 3D scene controls
│   │   ├── anatomyData.js   # Organ data and information
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   └── package.json
└── README.md
```

## License

MIT
