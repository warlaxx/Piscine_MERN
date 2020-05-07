import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";


class SubComponent extends React.Component {
  render() {
    return (
      <h2>{this.props.nom}</h2>
  )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      produits: [],
      login: '',
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/express_backend").then((data) => {
      this.setState({ produits: data.data.produits });

    })
  } 


  render() {
    return (
      <div className="App">
        <Router>
        <nav class="navbar navbar-expand-lg navbar-light bg-light"> <div class="navbar-nav"> 
            <Link class="nav-item nav-link" to="/">Home</Link>
      
            <Link class="nav-item nav-link" to="/register">Register</Link>
        
            <Link class="nav-item nav-link" to="/login">Login</Link>
          </div>
   </nav>
        <Switch>
          <Route path="/register">
          <Register />
          </Route>
          <Route path="/Login">
            <Login />
          </Route>
          <Route path="/">
          </Route>
        </Switch>
        </Router>
        {/* <div>{this.state.produits.map((e) => {
          return (
            <SubComponent nom={e.nom}/>
         )
       })}</div> */}
      </div>
    );
  }
}

class Register extends Component {

  handleUsernameSubmission = (e) => {
      if(e) e.preventDefault();
      const name = this.refs.usernameItem.value;
      console.log('Your name is', name);
    }

  render() {
    return (
      <form onSubmit={this.handleUsernameSubmission}>
            <label for="register[login]">Login</label><input type="text"  ref="usernameItem"/><br/>
            <label for="register[email]">email</label><input type="email"  name="register[email]"/><br/>
            <label for="register[password]">Password</label><input type="password" name="register[password]"/><br/>
            <label for="register[passwordconfirm]">Password Confirm</label><input type="password" name="register[passwordconfirm]"/><br/>
            <input type="submit" value="Submit"/></form>)
  }
}

class Login extends Component {
  render() {
    return (
 <form>
            <label for="login[email]">email</label><input type="email" name="login[email]"/><br/>
            <label for="login[password]">Password</label><input type="password" name="login[password]"/><br/>
            <input type="submit" value="Submit"/></form>)
  }
}

export default App; 