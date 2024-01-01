import { Component } from 'react';
import Button from './Button';
import '../stylesheets/Event.css';

export default class Event extends Component {
    constructor(props) {
        super(props);
        this.event = this.props.event;
        this.edit = false;
        if ((this.event.host.username === localStorage.getItem('user.username') || localStorage.getItem('user.role') === 'Administrator')) {
            this.edit = <Button className="event_edit-btn" clickHandler={this.editEvent}>EDIT</Button>
        }
    }

    editEvent = () => {
        if (!this.props.displayOnly) {
            this.props.edit(this.event);
        }
    }
    showEvent = () => {
        this.props.show(this.event);
    }

    render() {
        return (
            <div className="event-box">
                <div onClick={this.showEvent}>
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
                        Host: <span className="event_host">{this.event.host.name} ({this.event.host.username})</span>
                    </p>
                </div>
                {!this.props.displayOnly && this.edit && this.edit}
            </div>
        )
    }
}