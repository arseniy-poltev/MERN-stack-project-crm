import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Register extends Component {

  constructor(props){

    super(props)

    this.state = {}

  }
  

  componentWillMount(){

    let activationToken = this.props.match.params.activationToken
    let email = this.props.match.params.email

    fetch('api/v1/activate', {
      method: 'POST',
      headers:{
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({email, activationToken})
    }).then(res => res.json())
    .then(res => {

      if (res.status === 'failure') {

        this.setState({error: res.message})

      } else {

        alert("Your account has been activated. Please login again.")

        this.setState({redirectHome: true})

      }

    })

  }
  
  render() {

    if (this.state.redirectHome){

      return (<Redirect to="/" />)

    }

    if (this.state.error){

      return (
        <div>
          <h2>{this.state.error}</h2>
          <a href="#/login">Login here</a>
        </div>
      )

    }

    return (<div>Activating...</div>)

  }

}

export default Register;