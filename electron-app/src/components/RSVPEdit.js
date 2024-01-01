import { Component } from 'react';
import Button from './Button';
import '../stylesheets/RSVPEdit.css';

export default class RSVPEdit extends Component {
    constructor(props) {
        super(props);
        this.rsvp = {
            username: localStorage.getItem('user.username'),
            name: localStorage.getItem('user.name'),
            status: 0
        }
        if (this.props.rsvp.hasRSVP !== -1) {
            this.rsvp = this.props.rsvp.hasRSVP;
        }
        this.state = { status: this.rsvp.status };
    }

    handleInput = (e) => {
        this.setState({ status: e.target.value });
    }
    handleSubmit = () => {
        const params = new URLSearchParams({
            id: this.props.rsvp.event.id,
            username: this.rsvp.username,
            name: this.rsvp.name,
            status: this.state.status
        });

        fetch(localStorage.getItem('proxy') + '/events/putRSVP?' + params, { method: 'PUT' }).then(r => {
            if (r.status === 200) {
                return this.props.createAlert({
                    type: 1,
                    title: 'RSVP successful!'
                });
            } else {
                return this.props.createAlert({
                    type: -1,
                    title: r.status + ' ERR with RSVP'
                });
            }
        });
    }
    handleDelete = () => {
        const params = new URLSearchParams({
            id: this.props.rsvp.event.id,
            username: this.rsvp.username
        });

        fetch(localStorage.getItem('proxy') + '/events/deleteRSVP?' + params, { method: 'DELETE' }).then(r => {
            if (r.status === 200) {
                return this.props.createAlert({
                    type: 1,
                    title: 'RSVP successfully removed!'
                });
            } else {
                return this.props.createAlert({
                    type: -1,
                    title: r.status + ' ERR with RSVP'
                });
            }
        });
    }

    render() {
        return (
            <div className="rsvp-box">
                <b style={{ fontSize: '20px' }}>RSVP to<br />
                    <span className="event_name">{this.props.rsvp.event.name}</span>
                </b>
                <form style={{ width: '100%' }}>
                    <br />
                    <div className="input__group">
                        <label htmlFor="f_username">Username</label><br />
                        <input type="text" name="username" value={localStorage.getItem('user.username')}
                            placeholder="Your username" readOnly />
                    </div>
                    <br />
                    <div className="input__group">
                        <label htmlFor="f_name">Name</label><br />
                        <input type="text" name="name" value={localStorage.getItem('user.name')}
                            placeholder="Your name" readOnly />
                    </div>
                    <br />
                    <div className="input__group">
                        <label htmlFor="f_status">Status</label><br />
                        <select id="f_status" name="status" value={this.state.status} onChange={this.handleInput}>
                            <option value="1">Going</option>
                            <option value="0">Maybe</option>
                            <option value="-1">Not going</option>
                        </select>
                    </div>
                    <br />
                </form>
                <Button className="eventedit_submit-btn" clickHandler={this.handleSubmit}>Submit</Button>
                {this.props.rsvp.hasRSVP !== -1 && <Button className="eventedit_delete-btn" clickHandler={this.handleDelete}>Remove</Button>}

                <span className="x-close" onClick={this.props.closePopup} />
            </div>
        )
    }
}