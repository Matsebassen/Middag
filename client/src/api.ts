export const API = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? 'https://localhost:7267/api'
  : 'https://middagwebapp.azurewebsites.net/api';
