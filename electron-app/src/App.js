import React from 'react';
import './stylesheets/App.css';
import Navbar from './components/Navbar';

localStorage.setItem('proxy', 'http://localhost:5000');
localStorage.setItem('user.loggedin', 'false');
localStorage.setItem('filters', JSON.stringify({
    date: '',
    host: '',
    access: ''
}));

function App(props) {
    return (
        <div className={"App " + props.childClass}>
            <Navbar />
            {props.children}
        </div>
    );
}

export default App;