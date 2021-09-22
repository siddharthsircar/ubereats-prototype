import React, { Component } from 'react';
// import { withRouter } from "react-router-dom";
// import { connect } from 'react-redux';
// import { ActionCreators } from '../../../../actions/profile';
import { formatPhoneNumber, isValidEmail } from '../../utils/utils';
import Logo from '../Navigation/Logo/Logo';

export class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                telephone: '',
                email: '',
                addressType: 'Home',
                street: '',
                city: '',
                state: 'CA',
                country: 'USA'
            },
            errors: {
                user: {
                    firstName: 'Enter First Name',
                    telephone: 'Enter Telephone',
                    email: 'Email is not valid!',
                    street: 'Enter street',
                    city: 'Enter city',
                }
            },
            validForm: false,
            submitted: false
        }
    }

    componentDidMount() {
        if (this.props.profile) {
            this.setState({ user: this.props.profile });
            if (this.props.profile.email) {
                this.resetErrorMsg();
            }
        }
    }

    validationErrorMessage = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'firstName':
                errors.user.firstName = value.length < 1 ? 'Enter First Name' : '';
                break;
            case 'email':
                errors.user.email = isValidEmail(value) ? '' : 'Email is not valid!';
                break;
            case 'telephone':
                errors.user.telephone = value.length < 1 && value.length > 10 ? 'Enter valid telephone number' : '';
                break;
            case 'street':
                errors.user.street = value.length < 1 ? `Enter ${this.state.user.address} street` : '';
                break;
            case 'city':
                errors.user.city = value.length < 1 ? `Enter ${this.state.user.address} city` : '';
                break;
            default:
                break;
        }

        this.setState({ errors });
    }

    inputChange = (event) => {
        let telphone = ''
        const { name, value } = event.target;
        const user = this.state.user;
        if (name === 'telephone') {
            telphone = formatPhoneNumber(value);
            user[name] = telphone;
        } else {
            user[name] = value;
        }
        this.setState({ user });
        this.validationErrorMessage(event);
    }

    checkboxChange = (event) => {
        const { name, checked } = event.target;
        const user = this.state.user;
        user[name] = checked;
        this.setState({ user });
    }

    onChangeAddress = (event) => {
        const user = this.state.user;
        user['address'] = event.target.value;
        this.setState({ user });
    }

    validateForm = (errors) => {
        let valid = true;
        Object.entries(errors.user).forEach(item => {
            console.log(item)
            item && item[1].length > 0 && (valid = false)
        })
        return valid;
    }

    // submitForm = async (event) => {
    //     this.setState({ submitted: true });
    //     this.props.dispatch(ActionCreators.formSubmittionStatus(true));
    //     const user = this.state.user;
    //     if (user && this.props.profile) {
    //         user.profileImage = this.props.profile.profileImage;
    //     }
    //     event.preventDefault();
    //     if (this.validateForm(this.state.errors) && this.props.profile && this.props.profile.profileImage) {
    //         console.info('Valid Form')
    //         this.props.dispatch(ActionCreators.addProfile(user));
    //         this.props.history.push('/confirm')
    //     } else {
    //         console.log('Invalid Form')
    //     }
    // }

    resetErrorMsg = () => {
        let errors = this.state.errors;
        errors.user.firstName = ''
        errors.user.telephone = ''
        errors.user.email = ''
        errors.user.street = ''
        errors.user.city = ''
        this.setState({ errors });
    }

    render() {
        const { firstName, lastName, email, telephone, addressType, street, city, state, country } = this.state.user;
        const { submitted } = this.state;
        return (
            <div>
                <nav className='fl-jc-center' style={{ overflow: 'hidden', position: 'sticky', top: '0', background: 'linear-gradient(89deg, #ff5edf 0%, #04c8de 100%)' }}>
                    <Logo />
                </nav>
                <main className="pa4 black-80">
                    <form className="measure center">
                        <fieldset id="signin" className="ba b--transparent ph0 mh0">
                            <legend className="f3 fw6 ph0 mh0 center">Create new account</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">First Name</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" autoFocus required />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">Last Name</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" required />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">Phone Number</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" required />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" required />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f5" for="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" required />
                            </div>
                            <legend className="f3 fw6 ph0 mh0">Address</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">Street Address</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" required />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">City</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" required />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">State</label>
                                <input className="b pa2 input-reset ba bg-transparent w-100" type="email" name="email-address" id="email-address" value='California' disabled required />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">Country</label>
                                <input className="b pa2 input-reset ba bg-transparent w-100" type="email" name="email-address" id="email-address" value='United States' disabled required />
                            </div>
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib" type="submit" value="Sign up" />
                        </div>
                        <div className="lh-copy f4 mt3">
                            Have an account? <a href="/user/login" className="b f4 link dim black db">Sign In</a>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//     return {
//         profile: state.user.profile
//     }
// }

export default RegisterUser;