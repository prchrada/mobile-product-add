import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAuth } from './utils/userAuth'

// Initialize authentication before rendering
initializeAuth().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
