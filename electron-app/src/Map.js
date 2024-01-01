import { Component } from 'react';
import App from './App';
import Alert from './components/Alert';
import Button from './components/Button';
import EventInfo from './components/EventInfo';
import { Filters, filterEvents } from './components/Filters';
import CampusMap from './components/CampusMap';
import './stylesheets/Map.css';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null,
            eventInfo: false,
            alert: false
        };
    }

    updateEvents = () => {
        let eList = [];
        fetch(localStorage.getItem('proxy') + '/events').then(r => r.json()).then(data => {
            const eArr = filterEvents(data.events);
            eArr.forEach(e => {
                eList.push(e);
            });
            this.setState({ events: eList });
        });
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
            <div className="page-wrapper eventsmap-wrapper">
                <h1>Map</h1>
                <div className="map-wrapper">
                    {this.state.events && <CampusMap key={this.state.events.length} events={this.state.events} show={this.showEvent} />}
                </div>
                <Button clickHandler={this.editFilters} className="filters-button">FILTER</Button>
                {this.state.eventInfo && this.state.eventInfo}
            </div>
        );
        return (
            <App childClass="eventsmap">
                {content}
                {this.state.alert && <Alert options={this.state.alert} closePopup={this.closeAlert} />}
            </App>
        );
    }
}

export default Map;