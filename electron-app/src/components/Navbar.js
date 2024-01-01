import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import '../stylesheets/Navbar.css';
import logo from '../assets/app_logo.png';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: -1 };
    }

    navLink = (link) => {
        let urlpath = window.location.href;
        urlpath = urlpath.substring(urlpath.indexOf('#') + 1);
        if (urlpath === link) return; // prevent infinite loop caused by redirecting to same path

        if (link === '/') {
            localStorage.setItem('user.loggedin', 'false');
        }
        this.setState({ redirect: link });
    }

    render() {
        let navlinks = null, navigate = null;
        if (localStorage.getItem('user.loggedin') === 'true') {
            navlinks = (
                <>
                    <p>{localStorage.getItem('user.name')}<br />
                        <span>{localStorage.getItem('user.role')}</span>
                    </p>
                    <button onClick={() => this.navLink('/events')} style={{ marginLeft: 'auto' }}>Events</button>
                    <button onClick={() => this.navLink('/map')}>Map</button>
                    <button onClick={() => this.navLink('/myevents')}>MyEvents</button>
                    <button onClick={() => this.navLink('/')}>Logout</button>
                </>
            );
        }

        if (this.state.redirect !== -1) {
            navigate = <Navigate to={this.state.redirect} />;
        }

        return (
            <>
                <div className="navbar">
                    <img src={logo} alt="Campus Discovery System" className="logo"/>
                    {navlinks}
                </div>

                {navigate}
            </>
        )
    }
}