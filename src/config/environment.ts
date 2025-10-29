// src/config/environment.ts
export const environment = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // App Configuration
  appName: 'Oumer Car Rent',
  appVersion: '1.0.0',
  
  // Feature Flags
  features: {
    phoneVerification: true,
    onlinePayments: false,
    gpsTracking: false,
    multiLanguage: false
  },
  
  // External Services
  services: {
    sms: {
      enabled: true,
      provider: 'twilio' // or 'aws-sns', 'local'
    },
    maps: {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      enabled: false
    }
  },
  
  // Business Configuration
  business: {
    currency: 'USD',
    timezone: 'Africa/Addis_Ababa',
    workingHours: {
      start: '06:00',
      end: '22:00'
    },
    emergencyContact: '+251913503145'
  }
}

export default environment