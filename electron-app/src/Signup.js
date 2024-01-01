import React from 'react';
import { Navigate } from 'react-router-dom';
import App from './App';
import Button from './components/Button';
import Alert from './components/Alert';
import './stylesheets/Login.css';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.nameInput = '';
        this.usernameInput = '';
        this.passwordInput = '';
        this.selectInput = 'student';
        this.alertOptions = null;
        this.state = {
            alert: false,
            redirect: false
        };
    }
    
    handleName = event => {
        this.nameInput = event.target.value;
    }
    handleUsername = event => {
        this.usernameInput = event.target.value;
    }
    handlePassword = event => {
        this.passwordInput = event.target.value;
    }
    handleSelect = event => {
        this.selectInput = event.target.value;
    }

    handleSubmit = () => {
        this.nameInput = this.nameInput.trim();
        this.usernameInput = this.usernameInput.trim();
        this.passwordInput = this.passwordInput.trim();
        if (this.nameInput === '' || this.usernameInput === '' || this.passwordInput === '') {
            this.alertOptions = {
                type: -1,
                title: 'User(name)/password CANNOT be whitespace or empty!'
            }
            return this.setState({ alert: true });
        }

        const params = new URLSearchParams({
            username: this.usernameInput,
            name: this.nameInput,
            password: this.passwordInput,
            role: this.selectInput
        });

        fetch(localStorage.getItem('proxy') + '/users/create?' + params, { method: 'POST' }).then(r => {
            if (r.status === 200) {
                localStorage.setItem('user.username', this.usernameInput);
                localStorage.setItem('user.name', this.nameInput);
                localStorage.setItem('user.role', this.selectInput);
                localStorage.setItem('user.loggedin', 'true');
                return this.setState({ redirect: true });
            } else {
                this.alertOptions = {
                    type: -1,
                    title: r.status + ' ERR with API request'
                }
                return this.setState({ alert: true });
            }
        });
    }

    closePopup = () => {
        this.alertOptions = null;
        this.setState({ alert: false });
    }

    render() {
        const content = (
            <div className="page-wrapper">
                <div className="login-box">
                    <form style={{width: '100%'}}>
                        <div className="login-title-wrapper">
                            <h2 className="login-title">Setup</h2>
                        </div>
                        <div className="login-input__group">
                            <label htmlFor="f_name">Name: </label>
                            <input type="text" id="f_name" placeholder="Your name" onChange={this.handleName}></input>
                        </div>
                        <br />
                        <div className="login-input__group">
                            <label htmlFor="f_username">Username: </label>
                            <input type="text" id="f_username" placeholder="Your username" onChange={this.handleUsername}></input>
                        </div>
                        <br />
                        <div className="login-input__group">
                            <label htmlFor="f_password">Password: </label>
                            <input type="text" id="f_password" placeholder="Your password" onChange={this.handlePassword}></input>
                        </div>
                        <br />
                        <div className="login-input__group">
                            <label htmlFor="f_role">Role: </label>
                            <select id="f_role" onChange={this.handleSelect}>
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Organizer">Organizer</option>
                                <option value="Administrator">Administrator</option>
                            </select>
                        </div>
                    </form>
                    <br />
                    <Button class="login-button" clickHandler={this.handleSubmit}>Signup</Button>
                </div>
            </div>
        );
        return (
            <App childClass="login">
                {content}
                {this.state.alert && <Alert options={this.alertOptions} closePopup={this.closePopup}></Alert>}
                {this.state.redirect && <Navigate to={"/events/"} />}
            </App>
        )
    }
}

export default Signup;