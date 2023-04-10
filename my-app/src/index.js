import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';
<script src="https://unpkg.com/react-router-dom/umd/react-router-dom.min.js"></script>
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
    <App/>
  </BrowserRouter>,
);

// reportWebVitals();