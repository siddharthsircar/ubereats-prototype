import React, { Component } from 'react';

class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ''
        }
    }

    componentDidMount = () => {
        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
        })
    }

    render() {
        const { street_address, city, state, country } = this.state.user;
        return (
            <div>
                <main className="pa4 black-80">
                    <fieldset id="profile" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">
                            Store Address
                        </legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f4 b" for="street_address">Street</label>
                            <label className="border db fw6 lh-copy f5" for="street_address">{street_address}</label>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f4 b" for="city">City</label>
                            <label className="border db fw6 lh-copy f5" for="city">{city}</label>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f4 b" for="state">State</label>
                            <label className="border db fw6 lh-copy f5" for="state">{state}</label>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f4 b" for="country">Country</label>
                            <label className="border db fw6 lh-copy f5" for="country">{country}</label>
                        </div>
                    </fieldset>
                </main>
            </div>
        );
    }
}

export default Address;