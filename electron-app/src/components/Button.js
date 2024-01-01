import { Component } from 'react';
import '../stylesheets/Button.css';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.props.clickHandler;
        this.state = {toggle: false};
    }

    handleClick = () => {
        this.setState(prevState => ({
            toggle: !prevState.toggle
        }));
        return null;
    }

    render() {
        return (
            <button className={"Button " + this.props.className} onClick={this.handleClick}>
                {this.props.children ? this.props.children : 'BUTTON'}
            </button>
        )
    }
}