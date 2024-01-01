import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/index.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

// PAGES IMPORT
import Start from './Start'
import Signup from './Signup';
import Login from './Login';
import Events from './Events';
import MyEvents from './MyEvents';
import Map from './Map';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route exact path="/" element={<Start />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/events" element={<Events />} />
            <Route exact path="/myevents" element={<MyEvents />} />
            <Route exact path="/map" element={<Map />} />
        </Routes>
    </Router>
);