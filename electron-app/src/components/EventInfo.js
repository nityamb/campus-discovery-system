import { Component } from 'react';
import Button from  './Button';
import RSVPEdit from './RSVPEdit';
import '../stylesheets/Event.css';
import '../stylesheets/EventInfo.css';

export default class EventInfo extends Component {
    constructor(props) {
        super(props);
        this.event = this.props.event;
        this.hasRSVP = -1;
        this.eventOwner = this.event.host.username === localStorage.getItem('user.username') || localStorage.getItem('user.role') === 'Administrator';
        this.attending = 0;
        this.state = {
            RSVPs: null,
            popup: null
        };
    }

    componentDidMount() {
        this.updateRSVPs();
    }

    updateRSVPs() {
        fetch(localStorage.getItem('proxy') + '/events/getRSVPs?id=' + this.event.id).then(r => {
            if (r.status === 200) {
                r.json().then(data => {
                    this.hasRSVP = !data ? -1 : data.map(r => r.username).indexOf(localStorage.getItem('user.username'));
                    if (this.hasRSVP > -1) {
                        this.hasRSVP = data[this.hasRSVP];
                    }
                    this.setState({ RSVPs: data });
                });
            } else {
                return this.props.createAlert({
                    type: -1,
                    title: r.status + ' ERR with getting RSVPs list'
                });
            }
        });
    }

    handleRSVP = () => {
        if (this.hasRSVP === -1 && parseInt(this.event.cap) <= this.attending) {
            return this.props.createAlert({
                type: -1,
                title: 'This event is at maximum capacity (full)!'
            });
        }
        if (this.event.access === 'Invite only' && localStorage.getItem('user.role') !== 'Administrator') {
            if (this.event.whitelist && !this.event.whitelist.includes(localStorage.getItem('user.username'))) {
                return this.props.createAlert({
                    type: -1,
                    title: 'This event is invite only! It is restricted to certain users and you are not invited/whitelisted by the host'
                });
            }
        }
        this.setState({popup: <RSVPEdit rsvp={{
            event: {
                id: this.event.id,
                name: this.event.name
            },
            hasRSVP: this.hasRSVP
        }} createAlert={this.createAlert} closePopup={this.closePopup} />});
    }
    deleteRSVP = (username) => {
        if (this.eventOwner && typeof username === 'string') {
            const params = new URLSearchParams({
                id: this.event.id,
                username: username
            });
    
            fetch(localStorage.getItem('proxy') + '/events/deleteRSVP?' + params, { method: 'DELETE' }).then(r => {
                if (r.status === 200) {
                    this.updateRSVPs();
                    return this.props.createAlert({
                        type: 1,
                        title: 'RSVP successfully removed!',
                        keepPopup: true
                    });
                } else {
                    return this.props.createAlert({
                        type: -1,
                        title: r.status + ' ERR with RSVP'
                    });
                }
            });
        }
    }

    createAlert = (options) => {
        this.setState({ popup: null });
        if (options.type === 1) {
            options.keepPopup = true;
            this.updateRSVPs();
        }
        this.props.createAlert(options);
    }
    closePopup = () => {
        this.setState({ popup: null });
    }

    render() {
        let rsvps = null;
        if (this.state.RSVPs) {
            let going = [];
            let maybe = [];
            let notgoing = [];
            const canDelete = this.eventOwner ? ' rsvp-kick' : '';
            this.state.RSVPs.forEach(r => {
                let user = <p className={`rsvp-name${canDelete}`} key={r.username} onClick={e => this.deleteRSVP(r.username)}>
                    <b>{r.name}</b> ({r.username})
                </p>;
                if (r.status === 1) going.push(user);
                else if (r.status === 0) maybe.push(user);
                else if (r.status === -1) notgoing.push(user);
            });
            this.attending = going.length;
    
            rsvps = (
                <>
                    <p className="going">Going {going.length}</p>
                    {going}
                    <p className="maybe">Maybe {maybe.length}</p>
                    {maybe}
                    <p className="notgoing">Not going {notgoing.length}</p>
                    {notgoing}
                </>
            );
        }

        return (
            <div className="eventinfo-wrapper">
                <div className="eventinfo-box">
                    <p className="event_info event_name">
                        {this.event.name}
                    </p>
                    <p className="event_info event_description">
                        {this.event.description}
                    </p>
                    <p className="event_info">
                        Where: <span className="event_location">{this.event.location}</span>
                    </p>
                    <p className="event_info">
                        When: <span className="event_date">{new Date(this.event.date).toLocaleString([], {month: "numeric", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit"})}</span>
                    </p>
                    <p className="event_info">
                        Guest capacity: <span className="event_cap">{this.event.cap}</span>
                    </p>
                    <p className="event_info">
                        Access: <span className="event_access">{this.event.access}</span>
                    </p>
                    <p className="event_info">
                        Host: <span className="event_host">{this.event.host.name} ({this.event.host.username})</span>
                    </p>
                    <p className="event_info">
                        Total RSVPs: <span className="event_numrsvps">{!this.state.RSVPs ? 0 : this.state.RSVPs.length}</span>
                    </p>
                    <p className="event_info">
                        Attending: <span className="event_attending">{this.attending}</span>
                    </p>
                    <Button className={`eventedit_${this.hasRSVP === -1 ? 'submit' : 'edit'}-btn`} clickHandler={this.handleRSVP}>
                        {this.hasRSVP !== -1 && 'Edit '}RSVP
                    </Button>
                    {rsvps}
                    <span className="x-close" onClick={this.props.closePopup} />

                    {this.state.popup}
                </div>
            </div>
        )
    }
}