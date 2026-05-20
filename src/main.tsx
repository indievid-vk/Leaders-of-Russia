import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Гарантируем наличие trailing slash для корректной работы PWA и относительных путей на любых хостингах
if (
  window.location.pathname && 
  !window.location.pathname.endsWith('/') && 
  !window.location.pathname.split('/').pop()?.includes('.')
) {
  window.location.replace(window.location.href + '/');
}

// Fix relative paths for manifest and icons on GitHub Pages without trailing slash
const baseUrl = import.meta.env.BASE_URL || './';
document.querySelector('link[rel="manifest"]')?.setAttribute('href', `${baseUrl}manifest.json`);
document.querySelector('link[rel="apple-touch-icon"]')?.setAttribute('href', `${baseUrl}icon-192.webp`);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = 'sw.js';
    navigator.serviceWorker.register(swUrl)
      .then((reg) => console.log('ServiceWorker registration successful with scope: ', reg.scope))
      .catch((err) => console.log('ServiceWorker registration failed: ', err));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
