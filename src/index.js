import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import './index.css'; // Ensure you're importing the necessary styles
import App from './App'; // Import the App component

const rootElement = document.getElementById('root'); // The root element from index.html
const root = ReactDOM.createRoot(rootElement); // Create root using the new API

root.render(
  <React.StrictMode>
    <App />  {/* Rendering the App component */}
  </React.StrictMode>
);