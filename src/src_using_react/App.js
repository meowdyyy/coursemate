import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <section className="hero">
          <div className="overlay-text">Welcome to LearnLink</div>
        </section>
        <section className="features container">
          <div className="feature-box">
            <div className="feature-image"></div>
            <div className="feature-content">
              <h4>Feature 1</h4>
              <p>Feature 1 description goes here. It provides users with the ability to do XYZ.</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-image"></div>
            <div className="feature-content">
              <h4>Feature 2</h4>
              <p>Feature 2 description goes here. It provides users with the ability to do XYZ.</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-image"></div>
            <div className="feature-content">
              <h4>Feature 3</h4>
              <p>Feature 3 description goes here. It provides users with the ability to do XYZ.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
