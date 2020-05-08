import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class App extends Component {
  constructor() {
    super();
    this.state = {
      produits: [],
      user: [],
      billets: [],

    }
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
          <Route path='/all/:handle' component={SeeAll} />
          <Route path='/billet/edit/:handle' component={Edit} />
          <Route path='/billet/delete/:handle' component={DeleteBillet} />
          <Route path='/commentaire/delete/:handle' component={DeleteCommentaire} />
          <Route path='/billet/create' component={CreateBillet} />
          <Route path='/billet/:id' component={SeeOne} />
          <Route path='/:handle' component={Dashboard} />
          <Route path="/" component={Home} />
        </Switch>
        </Router>
        <div></div>
      </div>
    );
  }
}

class Home extends React.Component { 
  render() {     
		return(
      <div>
        home
		
			</div>
		)
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
            <label for="register[email]">email</label><input type="email"  ref="emailItem"/><br/>
            <label for="register[password]">Password</label><input type="password" ref="passwordItem"/><br/>
            <label for="register[passwordconfirm]">Password Confirm</label><input type="password" ref="passwordconfItem"/><br/>
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

class Dashboard extends React.Component {constructor() {
    super();
    this.state = {
      user: [],
      billets: [],
    }
  }
  render() {
    // console.log(this.props.match.params.handle);
    // console.log(cookies.get('type'));
              // console.log(cookies.get('login'));
    console.log( this.state );
    if (cookies.get('id')) {
       if (cookies.get('login') == this.props.match.params.handle) {
         return (
          <div class="container">
          <h1>Bienvenue {cookies.get('login')}!</h1>
          </div>
          )
       }
       else {

         
         return (
          <div class="container">
             <h1>Bienvenue sur le blog de {this.props.match.params.handle} !</h1>
             <a href={"http://localhost:3000/all/"+ this.props.match.params.handle}>voir tous ses billets</a>
          </div>
          )
      }
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

class CreateBillet extends React.Component {
  handleCreate = (e) => {
    e.preventDefault();
    var data = {
      titre: this.refs.titreItem.value,  
      contenu: this.refs.contenuItem.value,
      user: cookies.get('id')
          }  
    var url = 'http://localhost:3000/billet/create';
    axios.post(url,data)
      .then(function (response) {
        console.log(response);
        if (response.data == true) {
          window.location = "/all/"+cookies.get('login');
        }
        else {
          alert ("Impossible de creer un billet, réssayez")
        }
      })
    .catch(e => console.log(e))
  }

  render() {
    if (cookies.get('id')) {
      return (
        <form onSubmit={this.handleCreate}>
      <h2>creer un billet {new Date().getDate()}</h2>
          <label for="titre">Titre</label><input type="text" name="titre" ref="titreItem" /><br />
          <label for="contenu">contenu</label><textarea type="textarea" name="contenu" ref="contenuItem" /><br />
          <input type="submit" value="Submit" /></form>)
    }
    else {
      window.location = "/login"
    }
  }
}

class Billet extends React.Component {
  render() {
   if (this.props.auteur == cookies.get('id')) 
   {
      return (
      <div class="container"> <div class="card">
          <div class="card-header">
          <a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a>
          <div class="float-right">
            <a href={"http://localhost:3000/billet/edit/" + this.props.id}>editer </a>
            <a href={"http://localhost:3000/billet/delete/" + this.props.id}> supprimer</a>
          </div></div>
      <div class="card-body">       
      <h6 class="card-subtitle mb-2 text-muted">{this.props.date}</h6>
      <div class="card-text">{this.props.contenu}</div>   
      </div></div>
      </div>
      )
   } else 
   {
        return (
        <div class="container">      <div class="card">
        <div class="card-header"><a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a></div>
        <div class="card-body">       
        <h6 class="card-subtitle mb-2 text-muted">{this.props.date}</h6>
        <div class="card-text">{this.props.contenu}</div>   
        </div></div>
        </div>
        )}
  }
}

class BilletDetails extends React.Component {
  render() {
   if (this.props.auteur == cookies.get('id')) 
   {
      return (
        <div class="container">      
          <div class="card">
            <div class="card-header">
              <a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a><div class="float-right">
            <a href={"http://localhost:3000/billet/edit/" + this.props.id}>editer </a>
            <a href={"http://localhost:3000/billet/delete/" + this.props.id}> supprimer</a>
          </div>
            </div>
            <div class="card-body">       
              <h6 class="card-subtitle mb-2 text-muted">{this.props.date}</h6>
              <div class="card-text">{this.props.contenu}</div>   
            </div>
           <div class="list-group list-group-flush"> {this.props.comments.map((e) => {
              console.log(e.commentaire)
          return (
            <Comments auteurcomment={e.de} commentaire={e.commentaire} id={e._id} auteurarticle={this.props.auteur}/>
         )
       })}
       </div>
          </div>
        </div>
      )
   } else  {
        return (
        <div class="container">      
          <div class="card">
            <div class="card-header">
              <a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a>
            </div>
            <div class="card-body">       
              <h6 class="card-subtitle mb-2 text-muted">{this.props.date}</h6>
              <div class="card-text">{this.props.contenu}</div>   
            </div>
           <div class="list-group list-group-flush"> {this.props.comments.map((e) => {
              console.log(e.commentaire)
          return (
            <Comments auteurcomment={e.de} commentaire={e.commentaire} id={e._id} auteurarticle={this.props.auteur}/>
         )
       })}
       </div>
          </div>
        </div>
        )}
  }
}

class Comments extends React.Component {
 render() {
   console.log(this.props.id)
   if(this.props.auteurarticle == cookies.get('id')) { 
    return (  
      <div class="card">
      <div class="card-header">
      <div class="card-title">
      <div class="card-text float-left">{this.props.auteurcomment} </div>
      <div class="float-right"><a href={"http://localhost:3000/commentaire/delete/" + this.props.id}> supprimer</a></div>
      </div>
      </div><div class="card-body">
      <div class="card-text">{this.props.commentaire}</div>
      </div>
      </div>)
  } else {
      return (  
        <div class="card">
        <div class="card-header">
        <div class="card-title">
        <div class="card-text float-left">{this.props.auteurcomment}</div>
        </div>
        </div><div class="card-body">
        <div class="card-text">{this.props.commentaire}</div>
        </div>
        </div>)
   }
 }
}

class SeeAll extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      billets: [],
    }
  }
    componentDidMount() {
    axios.get("http://localhost:5000/all/"+this.props.match.params.handle).then((data) => {
      this.setState({ billets: data.data.billets });
    })
  } 
  
  render() {     
		return(
      <div>
        "ici on voit les billets de " + {this.props.match.params.handle} + " ewewew"
        
			{this.state.billets.map((e) => {
          return (
            <Billet id={e._id} titre={e.titre} contenu={e.contenu} auteur={e.user}/>
         )
       })}
			</div>
		)
	}
  
}

class Edit extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      billets: [],
    }
  }

  handleEdit = (e) => {
    e.preventDefault();
    var data = {
      titre: this.refs.titreItem.value,  
      contenu: this.refs.contenuItem.value,
      }  

    var url = 'http://localhost:3000/billet/edit/'+this.props.match.params.handle;
    axios.post(url,data)
      .then(function (response) {
        console.log(response);
        if (response.data == true) {
          window.location = "/all/"+cookies.get('login');
        }
        else {
          alert ("Impossible de creer un billet, réssayez")
        }
      })
    .catch(e => console.log(e))
  }

  componentDidMount() {
    axios.get("http://localhost:5000/billet/"+this.props.match.params.handle).then((data) => {
      this.setState({ billets: data.data.billets[0] });
      console.log(this.state.billets)
    })
  } 

  render() {     
		return(
      <form onSubmit={this.handleEdit}>
      <h2>editer un billet {new Date().getDate()}</h2>
          <label for="titre">Titre</label><input type="text" name="titre" ref="titreItem" defaultValue={this.state.billets.titre}/><br />
          <label for="contenu">contenu</label><textarea type="textarea" name="contenu" ref="contenuItem" defaultValue={this.state.billets.contenu}/><br />
          <input type="submit" value="Submit" /></form>
		)
	}
}

class DeleteBillet extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      billets: [],
    }
  }
  handleSuppression = (e) => {
    e.preventDefault();
      var data = {
          id: this.props.match.params.handle,
              }
         var url = 'http://localhost:3000/billet/delete/'+this.props.match.params.handle;
      axios.post(url,data)
        .then(function (response) {
          console.log(response);
          if (response.data == true) {
            window.location = "/all/"+cookies.get('login');
          }
          else {
            alert ("Impossible de vous connecter, veillez réessayer")
          }
        })
        .catch(e => console.log(e))
  }

  componentDidMount() {
    axios.get("http://localhost:5000/billet/"+this.props.match.params.handle).then((data) => {
    this.setState({ billets: data.data.billets[0] });
    console.log(this.state.billets);
  });
  } 

  render() {
   if (this.state.billets.user  != undefined)
   {
    if (this.state.billets.user == cookies.get('id'))
    {
      return (
        <form onSubmit={this.handleSuppression}>
         Voulez-vous supprimer ce post ?
        <input type="submit" value="Submit"/></form>)
         
    } else {
             window.location = "/"+cookies.get('login');
    }
   }
  return ('Pas les droit')
  }
  
}

class DeleteCommentaire extends React.Component {
  constructor() {
    super();
    this.state = {
      commentaires: [],
      billet: [],
    }
  }
  handleSuppression = (e) => {
    e.preventDefault();
      var data = {
          id: this.props.match.params.handle,
              }
         var url = 'http://localhost:3000/commentaire/delete/'+this.props.match.params.handle;
         axios.post(url,data)
        .then(function (response) {
          console.log(response);
          if (response.data == true) {
            window.location = "/all/"+cookies.get('login');
          }
          else {
            alert ("Impossible veillez réessayer")
          }
        })
        .catch(e => console.log(e))
  }

  componentDidMount() {
  axios.get("http://localhost:3000/commentaire/"+this.props.match.params.handle).then((data) => {
    this.setState({ commentaires: data.data.commentaire });
    this.setState({ billet: data.data.commentaire.billet[0] });
    console.log(this.state)
  });
  } 

  render() {
   if (this.state.commentaires.de  != undefined && this.state.billet.user  != undefined)
   { 
    if ( (this.state.commentaires.de == cookies.get('login')) || cookies.get('id') ==  this.state.billet.user)
      {
        return (
          <form onSubmit={this.handleSuppression}>
           Voulez-vous supprimer ce commentaire ?
          <input type="submit" value="Submit"/></form>)
      } else {
               window.location = "/"+cookies.get('login');
      }
   }
  return ('Pas les droit')
  }
}

class SeeOne extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      billets: [],
    }
  }
    componentDidMount() {
    axios.get("http://localhost:5000/billet/"+this.props.match.params.id).then((data) => {
      this.setState({ billets: data.data.billets });
      console.log(this.state);
      console.log('bitch')
    })
  } 
  
  render() {     
		return(
      <div>
        Ici on voit une seul billet 
        
			{this.state.billets.map((e) => {
          return (
            <BilletDetails id={e._id} titre={e.titre} contenu={e.contenu} auteur={e.user} comments={e.comments}/>
         )
       })}
			</div>
		)
	}
  
}

export default App; 