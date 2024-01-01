import React from 'react';
import App from './App';
import Alert from './components/Alert';
import Button from './components/Button';
import Event from './components/Event';
import EventEdit from './components/EventEdit';
import EventInfo from './components/EventInfo';
import { Filters, filterEvents } from './components/Filters';
import Clock from './components/Clock';
import './stylesheets/Events.css';

class Events extends React.Component {
    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.state = {
            events: [],
            nextPage: false,
            prevPage: false,
            alert: false,
            eventInfo: false,
            redirect: false
        };
    }

    updateEvents = () => {
        let eList = [];
        fetch(localStorage.getItem('proxy') + '/events').then(r => r.json()).then(data => {
            const eArr = filterEvents(data.events);
            const pages = Math.ceil(eArr.length / 10);
            if (this.currentPage > pages) this.currentPage = pages;
            let startIndex = (this.currentPage - 1) * 10;
            if (startIndex < 0) startIndex = 0;
            for (let i = startIndex; i < startIndex + 10; i++) {
                if (i === eArr.length) break;
                eList.push(
                    <Event key={eArr[i].id} event={eArr[i]} edit={this.editEvent} show={this.showEvent} />
                );
            }
            if (eArr.length === 1) this.currentPage = 1;
            this.setState({
                events: eList,
                nextPage: this.currentPage < pages,
                prevPage: this.currentPage > 1
            });
        });
    }
    cyclePage = (offset) => {
        this.currentPage += offset;
        this.updateEvents();
    }

    createEvent = () => {
        const popup = <EventEdit event={-1} closePopup={this.closePopup} createAlert={this.createAlert} />;
        this.setState({ eventInfo: popup });
    }
    editEvent = (event) => {
        const popup = <EventEdit event={event} closePopup={this.closePopup} createAlert={this.createAlert} />;
        this.setState({ eventInfo: popup });
    }
    showEvent = (event) => {
        const popup = <EventInfo event={event} closePopup={this.closePopup} createAlert={this.createAlert} />;
        this.setState({ eventInfo: popup });
    }
    editFilters = () => {
        const popup = <Filters closePopup={this.closePopup} createAlert={this.createAlert} />
        this.setState({ eventInfo: popup });
    }
    closePopup = () => {
        this.setState({ eventInfo: false });
    }

    createAlert = (options) => {
        if (options.type === 1) {
            this.updateEvents();
            if (!options.keepPopup) this.closePopup();
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
            <div className="page-wrapper events-wrapper">
                <h1>Events</h1>
                <Button clickHandler={this.createEvent} className="create-button">CREATE</Button>
                <Button clickHandler={this.editFilters} className="filters-button">FILTER</Button>
                <Clock />
                <div className="events-list">
                    {this.state.events}
                    {this.state.nextPage && <span className="events-list_pagenav" onClick={() => this.cyclePage(1)} style={{ top: 0, right: 0 }}>&gt;</span>}
                    {this.state.prevPage && <span className="events-list_pagenav" onClick={() => this.cyclePage(-1)} style={{ top: 0, left: 0 }}>&lt;</span>}
                </div>
                {this.state.eventInfo && this.state.eventInfo}
            </div>
        );
        return (
            <App childClass="events">
                {content}
                {this.state.alert && <Alert options={this.state.alert} closePopup={this.closeAlert} />}
            </App>
        )
    }
}

export default Events;