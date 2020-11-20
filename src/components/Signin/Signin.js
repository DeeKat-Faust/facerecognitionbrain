import React from 'react';

class Signin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            error: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value });
    }

    onSignInSubmit = (event) => {
        event.preventDefault();

        if (!this.state.signInEmail.length) {
            this.setState({ error: 'Email field is empty' });
        } else {
            fetch('http://localhost:3010/signin', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.signInEmail,
                    password: this.state.signInPassword
                })
            }).then(response => response.json())
                .then(data => {
                    if (data._id) {
                        this.setState({ error: '' });
                        this.props.loadUser(data);
                        this.props.onRouteChange('home');
                    } else if (data === 'The provided combination of email and password is incorrect') {
                        this.setState({ error: data });
                    } else if (data === 'The email in invalid. Please register first before Signing In') {
                        this.setState({ error: data });
                    } else {
                        this.setState({ error: 'Error Signing In' });
                    }
                });
        }
    }

    render() {
        const { onRouteChange } = this.props;

        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address" 
                                    id="email-address" 
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </fieldset>
                        <div className="">
                            <input
                                onClick={this.onSignInSubmit}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Sign in"
                            />
                        </div>
                        {   this.state.error.length 
                            ? <div className="w-90 ba br2 pa3 ma2 red bg-washed-red" role="alert">
                                {this.state.error}
                            </div>
                            : <></>
                        }
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                            {/* <a href="#0" className="f6 link dim black db">Forgot your password?</a> */}
                        </div>
                    </form>
                </main>
            </article>
        );
    }
}

export default Signin;