import { Component } from 'react';
import Button from './Button';
import '../stylesheets/Filters.css';

export class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = { filters: JSON.parse(localStorage.getItem('filters')) };
    }

    handleInput = (e) => {
        let filters = this.state.filters;
        filters[e.target.name] = e.target.value;
        this.setState({ filters: filters });
    }

    handleReset = () => {
        this.setState({
            filters: {
                date: '',
                host: '',
                access: ''
            }
        });
    }

    handleSubmit = () => {
        localStorage.setItem('filters', JSON.stringify(this.state.filters));
        this.props.createAlert({
            type: 1,
            title: 'Filters applied!'
        });
    }

    render() {
        return (
            <div className="filters-wrapper">
                <div className="filters-box">
                    <b style={{ fontSize: '20px', marginBottom: 0 }}>Filter Events</b>
                    <p style={{ margin: 0 }}>Leave blank for no respective filter</p>
                    <form style={{ width: '100%' }}>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_date">Date: </label>
                            <input type="date" name="date" value={this.state.filters.date} onChange={this.handleInput} />
                        </div>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_host">Host: </label>
                            <input type="text" name="host" value={this.state.filters.host}
                                placeholder="Host username" onChange={this.handleInput} />
                        </div>
                        <br />
                        <div className="input__group">
                            <label htmlFor="f_access">Access: </label>
                            <select id="f_access" name="access" value={this.state.filters.access} onChange={this.handleInput}>
                                <option value=""></option>
                                <option value="Public">Public</option>
                                <option value="Invite only">Invite only</option>
                            </select>
                        </div>
                        <br />
                    </form>
                    <Button className="filters_submit-btn" clickHandler={this.handleSubmit}>Submit</Button>
                    <Button className="filters_reset-btn" clickHandler={this.handleReset}>Reset</Button>
                    <span className="x-close" onClick={this.props.closePopup} />
                </div>
            </div>
        );
    }
}

export function filterEvents(events) {
    if (!events) return [];

    const filters = JSON.parse(localStorage.getItem('filters'));
    if (filters.date) {
        events = events.filter(e => e.date.slice(0, 10) === filters.date);
    }
    if (filters.host) {
        events = events.filter(e => e.host.username === filters.host);
    }
    if (filters.access) {
        events = events.filter(e => e.access === filters.access);
    }

    return events;
}