
import React from "react";
import { LoginBox, RegisterBox } from "./lognreg";

//Authentication login/register GUI
class AuthenMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginOpen: true,
            isRegisterOpen: false,
        };
    }

    showReg() {
        this.setState({ isRegisterOpen: true, isLoginOpen: false });
    }

    showLogin() {
        this.setState({ isLoginOpen: true, isRegisterOpen: false });
    }


    render() {
        return (
            <div className="root-container">
                <div className="box-controller">
                    <div className={"controller" + (this.state.isLoginOpen ? "-selected" : "")}
                        onClick={this.showLogin.bind(this)}>
                        Log In
                </div>
                    <div className={"controller" + (this.state.isRegisterOpen ? "-selected" : "")}
                        onClick={this.showReg.bind(this)}>
                        Sign up
                </div>

                </div>

                <div className="box-container">
                    {this.state.isLoginOpen && <LoginBox />}
                    {this.state.isRegisterOpen && <RegisterBox />}

                </div>
                <div className="ocean">
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
            </div>
        );
    }
}

export { AuthenMain } 
