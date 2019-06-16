import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { AuthenMain } from "./authen";
import { Button } from 'react-bootstrap';
import { ShowOffences } from "./offences";
import { Search } from "./newsearch";


//Main App with all routing 
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <BrowserRouter>
        <div className="routes">
        
          <Link to="/">
            <Button variant="secondary" className="links">
              List of Offences
            </Button></Link>

          <Link to="/authen"><Button variant="secondary" className="links">Account</Button></Link>
          <Link to="/newsearch">
            <Button variant="secondary" className="links">
              Search
            </Button></Link>
      </div>
      <Switch>
          <Route path="/authen" component={AuthenMain} />
          <Route path="/newsearch" component={Search} />
          <Route exact path="/" component={ShowOffences} />
          </Switch>
      </BrowserRouter>
    )
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);