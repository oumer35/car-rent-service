// src/main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { CarProvider } from './contexts/CarContext.tsx'
import { BookingProvider } from './contexts/BookingContext.tsx'
import './styles/global.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)

// Apply saved theme on startup
const savedTheme = localStorage.getItem('cr_theme') || 
  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
document.body.setAttribute('data-theme', savedTheme)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CarProvider>
        <BookingProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BookingProvider>
      </CarProvider>
    </AuthProvider>
  </React.StrictMode>
)