import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Home, About, BayPlan } from './components';
import YardBayView from './view/yardbayview/YardBayView';
import QCSide from './components/quaycrane/QCSide';
import LayerView from './components/layer/LayerView';

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
              <Link to="/layer">Layer</Link>
            </li>
            <li>
              <Link to="/qcside">QCSide</Link>
            </li>
            <li>
              <Link to="/yardbay">YardBay</Link>
            </li>
          </ul>
        </nav>

        <Route exact path='/' component={Home}/>
        <Route path='/about/:name' component={About}/>
        <Route path='/:vslCd/bayplan' component={BayPlan}/>
        <Route path='/layer' component={LayerView}/>
        <Route path='/qcside' component={QCSide}/>
        <Route path='/yardbay' component={YardBayView}/>
      </div>
    </Router>
  );
}

export default App;
