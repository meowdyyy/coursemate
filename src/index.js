// index.js
import React from 'react'; // Add this import to resolve the error
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming your main App component is in the same directory

// Create Root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
