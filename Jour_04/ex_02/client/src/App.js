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
import Cookies from 'universal-cookie';
const cookies = new Cookies();

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
      // login: '',
      // email: '',
      // password: '',
      user: [],
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
            <Link class="nav-item nav-link" to="/logout">Logout</Link>

          </div>
   </nav>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/logout" component={Logout} />
          <Route path="/Login" component={Login} />
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/register" component={Register} />
          <Route path='/:handle' component={Dashboard} />
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

class Register extends React.Component {
  handleRegister = (e) => {
     e.preventDefault();
      var data = {
          login: this.refs.usernameItem.value,
          email: this.refs.emailItem.value,
          password: this.refs.passwordItem.value,
          passwordconf: this.refs.passwordconfItem.value,
              }
       var url = 'http://localhost:3000/register';
       axios.post(url,data)
        .then(response=>console.log(response))
        .catch(e=>console.log(e))
  }

  render() {
    return (
      <form onSubmit={this.handleRegister}>
            <label for="register[login]">Login</label><input type="text"  ref="usernameItem"/><br/>
            <label for="register[email]">email</label><input type="email"  ref="emailItem" name="register[email]"/><br/>
            <label for="register[password]">Password</label><input type="password" ref="passwordItem" name="register[password]"/><br/>
            <label for="register[passwordconfirm]">Password Confirm</label><input type="password" ref="passwordconfItem" name="register[passwordconfirm]"/><br/>
            <input type="submit" value="Submit"/></form>)
  }
}

class Login extends React.Component {
  handleLogin = (e) => {
     e.preventDefault();
      var data = {
          email: this.refs.emailItem.value,
          password: this.refs.passwordItem.value,
              }
       var url = 'http://localhost:3000/login';
       axios.post(url,data)
         .then(function (response) {
           console.log(response);
           if (response.data.good == true) {
             cookies.set('id', response.data.data.id, { path: '/' });
             cookies.set('type', response.data.data.type, { path: '/' });
             cookies.set('login', response.data.data.login , { path: '/' });
             window.location = "/"+response.data.data.login;
           }
           else {
             alert ("Impossible de vous connecter, veillez réessayer")
           }
         })
         .catch(e => console.log(e))
  }

  render() {
    return (
 <form onSubmit={this.handleLogin}>
            <label for="login[email]">email</label><input type="email" ref="emailItem" name="login[email]"/><br/>
            <label for="login[password]">Password</label><input type="password" ref="passwordItem" name="login[password]"/><br/>
            <input type="submit" value="Submit"/></form>)
  }
}

class Dashboard extends React.Component {

  render() {
    console.log(cookies.get('id'));
    console.log(cookies.get('type'));
              console.log(cookies.get('login'));
    if (cookies.get('id')) {
      return (
        <h1>Bienvenue {cookies.get('login')}!</h1>
      )
    }
      else {
        window.location = "/login"
    }
  }
}

class Logout extends React.Component {

  render() {
    cookies.remove('id');
    cookies.remove('type');
    cookies.remove('login');
      return (  window.location = "/login" )
    
  }
}
export default App; 