import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';

function App() {
  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar />
        
        <div className="flex-grow-1 d-flex flex-column">
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<MainContent />} />
              {/* You can add other routes here for different pages like metrics, settings, etc. */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
export default App;
