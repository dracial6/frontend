import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Home, About, BayPlan } from './components';
import QCSide from './components/quaycrane/QCSide';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/Marta">About</Link>
            </li>
            <li>
              <Link to="/002/bayplan">BayPlan</Link>
            </li>
            <li>
              <Link to="/qcside">QCSide</Link>
            </li>
          </ul>
        </nav>

        <Route exact path='/' component={Home}/>
        <Route path='/about/:name' component={About}/>
        <Route path='/:vslCd/bayplan' component={BayPlan}/>
        <Route path='/qcside' component={QCSide}/>
      </div>
    </Router>
  );
}

export default App;
