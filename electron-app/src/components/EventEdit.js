import { Component } from 'react';
import Button from './Button';
import EditMap from './EditMap';
import '../stylesheets/EventInfo.css';

export default class EventEdit extends Component {
    constructor(props) {
        super(props);
        this.title = 'Create Event';
        let template = {
            name: '',
            description: '',
            location: '',
            lngLat: [],
            date: '',
            cap: '100',
            access: 'Public',
            whitelist: '',
            host: {
                username: localStorage.getItem('user.username'),
                name: localStorage.getItem('user.name')
            }
        };
        if (this.props.event !== -1) {
            this.title = 'Edit event';
            template = this.props.event;
            if (typeof template.whitelist === 'object') {
                template.whitelist = template.whitelist.join();
            }
        }
        this.state = ({ event: template, map: false });
    }

    openMap = () => {
        this.setState({ map: true });
    }
    closeMap = () => {
        this.setState({ map: false });
    }
    updateLocation = (location) => {
        let event = this.state.event;
        event.location = location.text;
        event.lngLat = [location.lng, location.lat];
        this.setState({
            event: event,
            map: false
        });
    }

    handleInput = (e) => {
        let event = this.state.event;
        event[e.target.name] = e.target.value;
        this.setState({ event: event });
    }

    handleSubmit = () => {
        const event = {
            id: this.props.event === -1 ? Date.now() : this.props.event.id,
            name: this.state.event.name.trim(),
            description: this.state.event.description.trim(),
            location: this.state.event.location.trim(),
            lngLat: this.state.event.lngLat,
            date: this.state.event.date.trim(),
            cap: this.state.event.cap,
            access: !this.state.event.access ? 'Public' : this.state.event.access,
            host: this.state.event.host
        }
        if (event.access === 'Invite only') {
            event.whitelist = !this.state.event.whitelist ? [] : this.state.event.whitelist.split(',').map(u => u.trim());
        }
        if (!event.name || !event.description || !event.location || !event.date || !event.cap) {
            return this.props.createAlert({
                type: -1,
                title: 'None of the fields can be left empty!'
            });
        }
        if (event.cap.includes('.') || parseInt(event.cap) < 1) {
            return this.props.createAlert({
                type: -1,
                title: 'Guest capacity must be an integer and greater than or equal to 1!'
            });
        }

        fetch(localStorage.getItem('proxy') + '/events/put', {
            method: 'PUT',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        }).then(r => {
            if (r.status === 200) {
                return this.props.createAlert({
                    type: 1,
                    title: 'Success!'
                });
            } else {
                return this.props.createAlert({
                    type: -1,
                    title: 'ERR with updating event'
                });
            }
        });
    }

    handleDelete = () => {
        fetch(localStorage.getItem('proxy') + '/events/delete?' + new URLSearchParams({ id: this.props.event.id }), {
            method: 'DELETE'
        }).then(r => {
            if (r.status === 200) {
                return this.props.createAlert({
                    type: 1,
                    title: 'Success!'
                });
            } else {
                return this.props.createAlert({
                    type: -1,
                    title: r.status + 'ERR with deleting event'
                });
            }
        });
    }

    render() {
        return (
            <div className="eventinfo-wrapper">
                <div className={"eventinfo-box" + (!this.state.map ? '' : ' eventinfo-box_map')}>
                    <b style={{ fontSize: '20px' }}>{this.title}</b>
                    <form style={{width: '100%'}}>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_name">Name: </label>
                            <input type="text" name="name" value={this.state.event.name}
                                placeholder="Event name" onChange={this.handleInput} />
                        </div>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_Description">Description: </label>
                            <input type="text" name="description" value={this.state.event.description}
                                placeholder="Event description" onChange={this.handleInput} />
                        </div>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_location">Location: </label>
                            <input type="text" name="location" value={this.state.event.location}
                                placeholder="Event location" onFocus={this.openMap} readOnly />
                        </div>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_date">Date: </label>
                            <input type="datetime-local" name="date" value={this.state.event.date}
                                placeholder="Event date" onChange={this.handleInput} />
                        </div>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_cap">Guest capacity: </label>
                            <input type="number" name="cap" value={this.state.event.cap}
                                min="1" max="50000" step="1" pattern="[0-9]" onChange={this.handleInput} />
                        </div>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_access">Access: </label>
                            <select id="f_access" name="access" value={this.state.event.access} onChange={this.handleInput}>
                                <option value="Public">Public</option>
                                <option value="Invite only">Invite only</option>
                            </select>
                        </div>
                        <br />
                        {this.state.event.access === 'Invite only' &&
                            <>
                                <div className="input__group">
                                    <label htmlFor="f_whitelist">Whitelist: </label>
                                    <input type="text" name="whitelist" value={this.state.event.whitelist}
                                        placeholder="username1, user2, ...(csv)" onChange={this.handleInput} />
                                </div>
                                <br />
                            </>
                        }
                    </form>
                    <Button className="eventedit_submit-btn" clickHandler={this.handleSubmit}>Submit</Button>
                    {this.props.event === -1
                        ? null
                        : <Button className="eventedit_delete-btn" clickHandler={this.handleDelete}>Delete</Button>
                    }
                    <span className="x-close" onClick={this.props.closePopup} />

                    {this.state.map &&
                        <div className="mapedit-wrapper">
                            <EditMap lngLat={this.state.event.lngLat} updateLocation={this.updateLocation} createAlert={this.props.createAlert} />
                            <span className="x-close" onClick={this.closeMap} />
                        </div>
                    }
                </div>
            </div>
        )
    }
}