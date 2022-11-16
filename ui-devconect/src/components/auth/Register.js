import React, { Fragment, useState } from 'react'
import{connect } from 'react-redux'
import  axios from 'axios'
import {setAlert} from '../../actions/alert'
import PropTypes from 'prop-types';

function Register( { setAlert }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  
  const {name, email, password, password2} = formData;
  const onChange = e => 
    setFormData({...formData, [e.target.name]: e.target.value})
  const onSubmit = async e => {
    e.preventDefault();
    console.log(e);
    if (password !== password2) {
      setAlert('password do not match!', 'danger');
    } else {
      const newUser = {
        name,
        email,password,password2
      }
      try {
        const config = {
          headers: {
            'Content-Type' : 'Application/json'
          }
        }
        const body = JSON.stringify(newUser);
        const res = await axios.post('/api/user', body, config);
        console.log(res);
      } catch (err) {
        
      }
    }
  }
  return (
    <Fragment>
      <h1 className="large text-primary">
        Sign Up
      </h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form action="dashboard.html" className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Name" name='name' value={name} onChange={e=> onChange(e)} required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address"  name='email' value={email} onChange={e=> onChange(e)} />
          <small className="form-text">
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password"  name='password' value={password} onChange={e=> onChange(e)} minLength="6" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Confirm Password" minLength="6" name='password2'  value={password2} onChange={e=> onChange(e)}   />
        </div>
        <input type="submit" value="Submit" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Already have an account? <a href="login.html">Sign In</a>
      </p>

    </Fragment>
  )
}

Register.prototype = {
  setAlert: PropTypes.func.isRequired
}

export default connect(null, {setAlert})(Register)