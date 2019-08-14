import { Redirect, Route } from 'react-router-dom';
import React, { Component } from 'react';

class PrivateRoute extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoggedIn: null
    }
    this.getSession()
  }

  getSession(){
    if(this.sessionPromise) return this.sessionPromise
    return this.sessionPromise = new Promise((resolve, reject) => {
      fetch('https://dev-cocoa.atlantishomecare.com/api/v1/user/session').then(res => res.json())
      .then(res => {
        delete this.sessionPromise
        if(res.status !== 'success'){
          this.setState({isLoggedIn: false})
        } else {
          this.setState({isLoggedIn: true, session: res.data})
        }
        resolve(res)
      })
    })
  }

  onLogout(){
    return new Promise((resolve, reject) => {
      fetch('api/v1/logout').then(res => res.json())
      .then( res => {
        this.setState({isLoggedIn: false})
      })
    })
  }

  onLogin(data){
    this.setState({redirectHome: true})
  }

  ViewComponent(){

    return (
      <Route 
      render={props => (
        <this.props.component {...props} 
          onLogout={() => this.onLogout()} 
          onLogin={() => this.onLogin()}
          session={this.state.session} 
        />
      )} />
    )
  }

  RedirectLoginComponent(){
    return (
      <Route render={props => (
        <Redirect to='/login' />
      )} />
    )
  }

  LoadingComponent(props){
    return (
      <div className="animated fadeIn pt-1 text-center">Loading...</div>
    )
  }

  render(){
    if (this.state.isLoggedIn === null) {
      return this.LoadingComponent()
    }

    if (this.state.isLoggedIn === false){
      return this.RedirectLoginComponent()
    }

    return this.ViewComponent()
  }
}

export default PrivateRoute