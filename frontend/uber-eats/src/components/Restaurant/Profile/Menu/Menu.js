import React, { Component } from 'react';
import { connect } from 'react-redux';
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: ''
        }
    }

    componentDidMount = () => {
        this.setState({
            user: this.props.menu,
        })
        console.log("Restaurant Menu: ", this.props.menu);
    }

    render() {
        return (
            <div>
                {console.log("Div Menu: ", this.props.menu)}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(Menu);