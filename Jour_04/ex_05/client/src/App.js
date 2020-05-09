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
        <nav className="navbar navbar-expand-lg navbar-light bg-light"> <div className="navbar-nav"> 
            <Link className="nav-item nav-link" to="/">Home</Link>
            <Link className="nav-item nav-link" to="/register">Register</Link>
            <Link className="nav-item nav-link" to="/login">Login</Link>
            <Link className="nav-item nav-link" to="/logout">Logout</Link>
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
          <Route path='/:login/:id' component={SeeOne} />
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
  constructor() {
    super();
    this.state = {
      user: [],
      billets: [],
    }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/").then((data) => {
      this.setState({ billets: data.data.billets });
    })
  } 
 
  render() {     
		return(
      <div>
        ici on voit les blogs 
			{this.state.billets.map((e) => {
          return (
            <Blog id={e._id}  auteur={e.utilisateur[0].login}/>
         )
       })}
			</div>
		)
	}
  
}

class Blog extends React.Component {
  render() {
    return (
      <div className="container"> <div className="card">
          <div className="card-header">
          <a href={"http://localhost:3000/all/" + this.props.auteur}> Blog de {this.props.auteur}</a></div></div>
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
            <label htmlFor="register[login]">Login</label><input type="text"  ref="usernameItem"/><br/>
            <label htmlFor="register[email]">email</label><input type="email"  ref="emailItem"/><br/>
            <label htmlFor="register[password]">Password</label><input type="password" ref="passwordItem"/><br/>
            <label htmlFor="register[passwordconfirm]">Password Confirm</label><input type="password" ref="passwordconfItem"/><br/>
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
           if (response.data.good === true) {
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
            <label htmlFor="login[email]">email</label><input type="email" ref="emailItem" name="login[email]"/><br/>
            <label htmlFor="login[password]">Password</label><input type="password" ref="passwordItem" name="login[password]"/><br/>
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
    if (cookies.get('id')) {
       if (cookies.get('login') === this.props.match.params.handle) {
         return (
          <div className="container">
          <h1>Bienvenue {cookies.get('login')}!</h1>
          </div>
          )
       }
       else {
         return (
          <div className="container">
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
        if (response.data === true) {
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
          <label htmlFor="titre">Titre</label><input type="text" name="titre" ref="titreItem" /><br />
          <label htmlFor="contenu">contenu</label><textarea type="textarea" name="contenu" ref="contenuItem" /><br />
          <input type="submit" value="Submit" /></form>)
    }
    else {
      window.location = "/login"
    }
  }
}

class Billet extends React.Component {
  render() {
   if (this.props.auteur === cookies.get('id')) 
   {
      return (
      <div className="container"> <div className="card">
          <div className="card-header">
          <a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a>
          <div className="float-right">
            <a href={"http://localhost:3000/billet/edit/" + this.props.id}>editer </a>
            <a href={"http://localhost:3000/billet/delete/" + this.props.id}> supprimer</a>
          </div></div>
      <div className="card-body">       
      <h6 className="card-subtitle mb-2 text-muted">{this.props.date}</h6>
      <div className="card-text">{this.props.contenu}</div>   
      </div></div>
      </div>
      )
   } else 
   {
        return (
        <div className="container">      <div className="card">
        <div className="card-header"><a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a></div>
        <div className="card-body">       
        <h6 className="card-subtitle mb-2 text-muted">{this.props.date}</h6>
        <div className="card-text">{this.props.contenu}</div>   
        </div></div>
        </div>
        )}
  }
}

class CreateComment extends React.Component {
  handleAddCommet = (e) => {
    e.preventDefault();
    var data = {
      commentaire: this.refs.commentaireItem.value,  
      pour: this.props.id,
      de: cookies.get('login')
          }  
    var url = 'http://localhost:3000/billet/'+ this.props.id;
    console.log(url)
    axios.post(url,data)
      .then(function (response) {
        console.log(response);
        if (response.data === true) {
          window.location.reload();
        }
        else {
          alert ("Impossible de creer un billet, réssayez")
        }
      })
    .catch(e => console.log(e))
  }

  render() {
    return (
      <form onSubmit={this.handleAddCommet}>
      <div className="form-group text-left">
      <small> <label htmlFor="exampleInputEmail1">Ajouter un commentaire</label></small></div>
      <textarea  style={{width: '100%'}} className="form-control-lg" rows="5" ref="commentaireItem"></textarea>
      <div className="form-group  text-left">
      <button type="submit" className="btn btn-primary">Submit</button></div>
      </form>
    )
  }
}

class BilletDetails extends React.Component {
  render() {
   if (this.props.auteur === cookies.get('id')) 
   {
      return (
        <div className="container">      
          <div className="card">
            <div className="card-header">
              <a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a><div className="float-right">
            <a href={"http://localhost:3000/billet/edit/" + this.props.id}>editer </a>
            <a href={"http://localhost:3000/billet/delete/" + this.props.id}> supprimer</a>
          </div>
            </div>
            <div className="card-body">       
              <h6 className="card-subtitle mb-2 text-muted">{this.props.date}</h6>
              <div className="card-text">{this.props.contenu}</div>   
            </div>
            <div className="card-footer"><CreateComment id={this.props.id}/></div>
           <div className="list-group list-group-flush"> {this.props.comments.map((e) => {
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
        <div className="container">      
          <div className="card">
            <div className="card-header">
              <a href={"http://localhost:3000/billet/" + this.props.id}> {this.props.titre}</a>
            </div>
            <div className="card-body">       
              <h6 className="card-subtitle mb-2 text-muted">{this.props.date}</h6>
              <div className="card-text">{this.props.contenu}</div>   
            </div>
            <div className="card-footer"><CreateComment id={this.props.id}/></div>
           <div className="list-group list-group-flush"> {this.props.comments.map((e) => {
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
   if(this.props.auteurarticle === cookies.get('id')) { 
    return (  
      <div className="card">
      <div className="card-header">
      <div className="card-title">
      <div className="card-text float-left">{this.props.auteurcomment} </div>
      <div className="float-right"><a href={"http://localhost:3000/commentaire/delete/" + this.props.id}> supprimer</a></div>
      </div>
      </div><div className="card-body">
      <div className="card-text">{this.props.commentaire}</div>
      </div>
      </div>)
  } else {
      return (  
        <div className="card">
        <div className="card-header">
        <div className="card-title">
        <div className="card-text float-left">{this.props.auteurcomment}</div>
        </div>
        </div><div className="card-body">
        <div className="card-text">{this.props.commentaire}</div>
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
      this.setState({ user: data.data.user[0]});
      this.setState({ billets: data.data.user[0].billets});
    })
  } 
  
  render() {     
		return(
      <div>
      <h2>Bienvenue sur le blog de {this.state.user.login}</h2>
        
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
        if (response.data === true) {
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
          <label htmlFor="titre">Titre</label><input type="text" name="titre" ref="titreItem" defaultValue={this.state.billets.titre}/><br />
          <label htmlFor="contenu">contenu</label><textarea type="textarea" name="contenu" ref="contenuItem" defaultValue={this.state.billets.contenu}/><br />
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
    axios.get("http://localhost:5000/"+this.props.match.params.login+"/"+this.props.match.params.id).then((data) => {
      this.setState({ billets: data.data.billets });
      console.log(this.state);
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