import React, { Component } from "react";
import Logo from "../Navigation/Logo/Logo";

class Signin extends Component {
    render() {
        return (
            <div>
                <div className='fl-jc-center'>
                    <Logo />
                </div>
                {/* <div className='b f3 fl-jc-center'>  </div>
                <div className='b f3 fl-jc-center ma4'> WELCOME BACK </div>
                <div className='b f4 fl-jc-center'> Sign in with email address </div>
                <form className='form-group'>
                    <div><input className='ma2 pa2' type='email' placeholder='Email Address' style={{ width: '400px' }} /></div>
                    <div><input className='ma2 pa2' type='password' placeholder='Password' style={{ width: '400px' }} /></div>
                    <div><input className='f4 bg-black white grow br3 ma3 pa2' type='button' value='SIGN IN' style={{ width: '200px' }} /></div>
                </form>
                <div className='f4 fl-jc-center'>New to Uber? <a href='/user/register' className='b'> Create an account</a> </div> */}
                {/* <article class="br2 ba dark-gray b--black-10 mv4 w-100 w-70-m w-50-l mw5 center"> */}
                <main className="pa4 black-80">
                    <form className="measure center">
                        <fieldset id="signin" className="ba b--transparent ph0 mh0">
                            <legend className="f3 fw6 ph0 mh0">Welcome Back</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" autoFocus />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f5" for="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" />
                            </div>
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib" type="submit" value="Sign In" />
                        </div>
                        <div className="lh-copy mt3 f4">
                            New to Uber? <a href="/user/register" className="b f4 link dim black db">Create an account</a>
                        </div>
                    </form>
                </main>
                {/* </article> */}
            </div>
        );
    }
}

export default Signin;