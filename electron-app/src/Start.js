import React from 'react';
import { Navigate } from 'react-router-dom';
import App from './App';
import Button from './components/Button';
import './stylesheets/Start.css';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { signup: false, login: false };
    }

    redirectToSignup = () => {
        this.setState({
            signup: true
        });
    }

    redirectToLogin = () => {
        this.setState({
            redirect: true
        });
    }

    render() {
        const content = (
            <div className="page-wrapper">
                <div className="start-box">
                    <h2 className="start-title"><b>Campus Discovery System</b></h2>
                    <p>The best place to find events around you</p>
                    <br />
                    <Button className="start-button" clickHandler={this.redirectToLogin}>Login</Button>
                    <Button className="start-button" clickHandler={this.redirectToSignup}>Signup</Button>
                </div>
            </div>
        );
        return (
            <App>
                {content}
                {this.state.signup && <Navigate to="/signup" />}
                {this.state.redirect && <Navigate to="/login" />}
            </App>
        )
    }
}