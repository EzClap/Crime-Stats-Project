import React from "react";
import { Redirect } from "react-router-dom";


//Login/register function logic
//login fetch and authenticate
class LoginBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            emailAcc: "",
            passCode: "",
            errors: [],
            loggedin: false,
            loggedout: false,
        };

        this.changeEmail = this.changeEmail.bind(this);
        this.changePass = this.changePass.bind(this);
    }


    changeEmail(event) {
        this.setState({ emailAcc: event.target.value });
        this.clearValidErr("emailAcc");
    }
    changePass(event) {
        this.setState({ passCode: event.target.value });
        this.clearValidErr("passCode");
    }
    submitLogin(e) {
        if (this.state.emailAcc === "") {
            this.showValidErr("emailAcc", "email cannot be empty!")
        }
        if (this.state.passCode === "") {
            this.showValidErr("passCode", "password cannot be empty!")
        }
        this.LoginAcc(this.state.emailAcc, this.state.passCode);

    }

    showValidErr(elem, msg) {
        this.setState((prevState) => ({ errors: [...prevState.errors, { elem, msg }] }));
    }

    clearValidErr(elem) {
        this.setState((prevState) => {
            let newArr = [];
            for (let err of prevState.errors) {
                if (elem !== err.elem) {
                    newArr.push(err);
                }
            }
            return { errors: newArr };
        })
    }


    renderRedirect = () => {
        if (this.state.loggedin) {
            return <Redirect to='/' />
        }
    }
    renderLogout = () => {
        if (this.state.loggedout) {
            return <Redirect to='/' />
        }
    }
    //Login fetch
    LoginAcc = (emailinput, passcodeinput) => {
        fetch("https://cab230.hackhouse.sh/login", {
        // fetch("https://172.22.30.87/login", {
            method: "POST",
            body: "email=" + emailinput + "&password=" + passcodeinput,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            redirect: "follow",
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(function (result) {
                sessionStorage.setItem("token", result.token);
            })
            .then(
                this.setState({
                    loggedin: true
                })
            )
            .catch(function (error) {
                console.log(
                    "There has been a problem with your fetch operation: ",
                    error.message
                );
            });
    }
    //render login
    render() {
        let emailErr = null, passErr = null;

        for (let err of this.state.errors) {
            if (err.elem === "emailAcc") {
                emailErr = err.msg;
            }
            if (err.elem === "passCode") {
                passErr = err.msg;
            }
        }

        if (sessionStorage.getItem("token") !== null) {
            return (
                <div className="signed-in">
                    You are signed in!
                <button type="button" className="logout-btn" onClick={() => {
                        sessionStorage.removeItem("token");
                        this.setState({ loggedout: true })
                    }}>Sign Out</button>
                    {this.renderLogout()}
                </div>
            )
        }
        else {
                return (
                    <div className="inner-container">
                        <div className="header">
                            SIGN IN NOW
            </div>

                        <div className="box">
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" className="login-input" placeholder="Your email address" value={this.state.emailAcc}
                                    onChange={this.changeEmail} />
                                <small className="danger-error">{emailErr ? emailErr : ""}</small>
                            </div>

                            <div className="input-group">

                                <label htmlFor="pwd">Password</label>
                                <input type="password" name="pwd" id="pwd" className="login-input" placeholder="Password" value={this.state.passCode}
                                    onChange={this.changePass} />
                                <small className="danger-error">{passErr ? passErr : ""}</small>
                            </div>

                            <button type="button" className="login-btn" onClick={this.submitLogin.bind(this)}>Sign in</button>
                            {this.renderRedirect()}

                        </div>
                    </div>
                );
            
        }
    }
}

//register fetch and passing input box to backend
class RegisterBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            emailAcc: "",
            passCode: "",
        };

        this.changeEmail = this.changeEmail.bind(this);
        this.changePass = this.changePass.bind(this);
    }

    changeEmail(event) {
        this.setState({ emailAcc: event.target.value });
    }

    changePass(event) {
        this.setState({ passCode: event.target.value });
    }

    submitReg(e) {
        this.RegAcc(this.state.emailAcc, this.state.passCode);
    }

    //register fetch 
    RegAcc = (emailinput, passcodeinput) => {
        
        fetch("https://cab230.hackhouse.sh/register", {
        // fetch("https://172.22.30.87/register", {
            method: "POST",
            body: "email=" + emailinput + "&password=" + passcodeinput,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then(function (result) {
                this.RegAcc.disabled = true;

            })
            .catch(function (error) {
                console.log(
                    "There has been a problem with your fetch operation: ",
                    error.message
                );
            });
    }

    render() {

        return (
            <div className="inner-container">
                <div className="header">
                    REGISTER ACCOUNT
            </div>
                <div className="box">

                    <div className="input-group">

                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" className="reg-input" placeholder="Your email address" value={this.state.emailAcc}
                            onChange={this.changeEmail} />
                    </div>

                    <div className="input-group">

                        <label htmlFor="pwd">Password</label>
                        <input type="password" name="pwd" className="reg-input" placeholder="Password" value={this.state.passCode}
                            onChange={this.changePass} />
                    </div>

                    <button type="button" className="reg-btn" onClick={this.submitReg.bind(this)}>Sign up</button>

                </div>


            </div>
        );
    }

}


export { LoginBox, RegisterBox } 