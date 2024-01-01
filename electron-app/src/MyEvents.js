import { Component } from 'react';
import App from './App';
import Alert from './components/Alert';
import Clock from './components/Clock';
import Event from './components/Event';
import EventInfo from './components/EventInfo';
import './stylesheets/MyEvents.css';

class MyEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rsvps: {
                going: [],
                maybe: [],
                notgoing: []
            },
            eventInfo: null,
            alert: false
        };
    }

    updateEvents = () => {
        fetch(localStorage.getItem('proxy') + '/events/rsvps').then(r => r.json()).then(rdata => {
            const rArr = rdata.rsvps;
            fetch(localStorage.getItem('proxy') + '/events').then(r => r.json()).then(edata => {
                const eArr = edata.events;
                let going = [];
                let maybe = [];
                let notgoing = [];
                let times = [];
                let timeconflict = false;
                Object.keys(rArr).forEach(eID => {
                    const RSVP = rArr[eID].find(u => u.username === localStorage.getItem('user.username'));
                    if (RSVP) {
                        const event = eArr.find(e => e.id.toString() === eID);
                        if (event) {
                            const eJSX = <Event key={event.id} event={event} show={this.showEvent} displayOnly />;
                            if (RSVP.status === 1) {
                                going.push(eJSX);
                                if (!timeconflict) {
                                    if (times.includes(event.date)) timeconflict = true;
                                    else times.push(event.date);
                                }
                            } else if (RSVP.status === 0) {
                                maybe.push(eJSX);
                            } else {
                                notgoing.push(eJSX);
                            }
                        }
                    }
                });
                if (timeconflict) {
                    this.createAlert({
                        type: -1,
                        title: 'There is a time conflict between two or more events you are attending!'
                    });
                }
                this.setState({
                    rsvps: {
                        going: going,
                        maybe: maybe,
                        notgoing: notgoing
                    }
                });
            });
        });
    }

    showEvent = (event) => {
        const popup = <EventInfo event={event} closePopup={this.closeEventPopup} createAlert={this.createAlert} />;
        this.setState({ eventInfo: popup });
    }
    closeEventPopup = () => {
        this.setState({ eventInfo: false });
    }

    createAlert = (options) => {
        if (options.type === 1) {
            this.updateEvents();
            if (!options.keepPopup) this.setState({ eventInfo: false });
        }
        this.setState({ alert: options });
    }
    closeAlert = () => {
        this.setState({ alert: false });
    }

    componentDidMount() {
        this.updateEvents();
    }

    render() {
        const content = (
            <div className="page-wrapper myevents-wrapper">
                <h1>My Events</h1>
                <Clock />
                <div className="events-list">
                    <p className="rsvp-category" style={{ color: '#018901' }}>Going {this.state.rsvps.going.length}</p>
                    {this.state.rsvps.going}
                    <p className="rsvp-category" style={{ color: '#D6A800' }}>Maybe {this.state.rsvps.maybe.length}</p>
                    {this.state.rsvps.maybe}
                    <p className="rsvp-category" style={{ color: '#BF0000' }}>Not going {this.state.rsvps.notgoing.length}</p>
                    {this.state.rsvps.notgoing}
                </div>
                {this.state.eventInfo && this.state.eventInfo}
            </div>
        );
        return (
            <App childClass="myevents">
                {content}
                {this.state.alert && <Alert options={this.state.alert} closePopup={this.closeAlert} />}
            </App>
        )
    }
}

export default MyEvents;