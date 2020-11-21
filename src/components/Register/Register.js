import React from 'react';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            error: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({ email: event.target.value });
    }

    onNameChange = (event) => {
        this.setState({ name: event.target.value });
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    onRegisterSubmit = (event) => {
        event.preventDefault();

        if (!this.state.email.length) {
            this.setState({ error: 'Email field is empty' });
        } else if (!this.state.name.length) {
            this.setState({ error: 'Name field is empty' });
        } else if (this.state.password.length < 8) {
            this.setState({ error: 'Password must be atleast 8 characters in length' });
        } else {
            fetch('https://smartbrainfacedetector-api.herokuapp.com/register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.email.toLowerCase(),
                    name: this.state.name,
                    password: this.state.password
                })
            }).then(response => response.json())
                .then(data => {
                    if (data === 'Email is already in use') {
                        this.setState({ error: data });
                    } else if (data === 'Error registering user!') {
                        this.setState({ error: data });
                    } else {
                        this.setState({ error: '' });
                        this.props.loadUser(data);
                        this.props.onRouteChange('home');
                    }
                });
        }
    }

    render() {

        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>
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
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    onChange={this.onNameChange}
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
                                onClick={this.onRegisterSubmit}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Register"
                            />
                        </div>
                        {   this.state.error.length
                            ? <div className="w-90 ba br2 pa3 ma2 red bg-washed-red" role="alert">
                                {this.state.error}
                            </div>
                            : <></>
                        }
                    </form>
                </main>
            </article>
        );
    }
}

export default Register;