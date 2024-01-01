import React from 'react';
import { Navigate } from 'react-router-dom';
import App from './App';
import Button from './components/Button';
import Alert from './components/Alert';
import './stylesheets/Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.usernameInput = '';
        this.passwordInput = '';
        this.alertOptions = null;
        this.state = {
            alert: false,
            redirect: false,
            signup: false
        };
    }
    
    handleUsername = event => {
        this.usernameInput = event.target.value;
    }
    handlePassword = event => {
        this.passwordInput = event.target.value;
    }
    handleSubmit = () => {
        this.usernameInput = this.usernameInput.trim();
        this.passwordInput = this.passwordInput.trim();
        if (this.usernameInput === '' || this.passwordInput === '') {
            this.alertOptions = {
                type: -1,
                title: 'Username/password CANNOT be whitespace or empty!'
            }
            return this.setState({ alert: true });
        }

        fetch(localStorage.getItem('proxy') + '/users').then(r => r.json()).then(data => {
            const users = data.users;
            const found = users.find(u => u.username === this.usernameInput);
            if (!found || found.password !== this.passwordInput) {
                this.alertOptions = {
                    type: -1,
                    title: 'Invalid credentials! You must sign up first.'
                }
                return this.setState({ alert: true });
            } else {
                localStorage.setItem('user.username', found.username);
                localStorage.setItem('user.name', found.name);
                localStorage.setItem('user.role', found.role);
                localStorage.setItem('user.loggedin', 'true');
                return this.setState({ redirect: true });
            }
        });
    }

    closePopup = () => {
        this.alertOptions = null;
        this.setState({ alert: false });
    }

    signup = () => {
        this.setState({ signup: true });
    }

    render() {
        const content = (
            <div className="page-wrapper">
                <div className="login-box">
                    <form style={{width: '100%'}}>
                        <div className="login-title-wrapper">
                            <h2 className="login-title">Login</h2>
                        </div>
                        <div className="login-input__group">
                            <label htmlFor="f_username">Username: </label>
                            <input type="text" id="f_username" placeholder="Your username" onChange={this.handleUsername}></input>
                        </div>
                        <br />
                        <div className="login-input__group">
                            <label htmlFor="f_password">Password: </label>
                            <input type="text" id="f_password" placeholder="Your password" onChange={this.handlePassword}></input>
                        </div>
                    </form>
                    <br />
                    <Button class="login-button" clickHandler={this.handleSubmit}>Login</Button>
                </div>
            </div>
        );
        return (
            <App childClass="login">
                {content}
                {this.state.alert && <Alert options={this.alertOptions} closePopup={this.closePopup}><br /><Button clickHandler={this.signup}>Signup</Button></Alert>}
                {this.state.redirect && <Navigate to={"/events"} />}
                {this.state.signup && <Navigate to={"/signup"} />}
            </App>
        )
    }
}

export default Login;