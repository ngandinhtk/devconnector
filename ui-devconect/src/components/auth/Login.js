import React, { Fragment, useState } from 'react'
import {Link} from 'react-router-dom'

function Login() {

   const [formData, setformData] = useState({
    email: '',
    password: '',
   });

   const  { email, password } = formData;

   const onChange = e => {
    setformData({...formData, [e.target.name] : e.target.value});
   }

   const onSubmit = async e => {
    e.preventDefault();
    console.log('SUCCESS');
  }

  return (
    <Fragment>
       <section class="container">
    
      <div class="alert alert-danger"> 
        Invalid Credentials
      </div> 
      <h1 class="large text-primary">
        Sign In
      </h1>
      <p class="lead"><i class="fas fa-user"></i> Sign into your account</p>
      <form action="dashboard.html" class="form"  onSubmit={e => onSubmit(e)} >
        <div class="form-group">
          <input  value={email} type="email" name='email' placeholder="Email Address"  onChange={e=> onChange(e)} />
        </div>
        <div class="form-group">
          <input value={password} type="password" name='password' placeholder="Password" minlength="6"  onChange={e=> onChange(e)} />
        </div>
        <input   type="submit" value="Login" class="btn btn-primary"  />
      </form>
      <p class="my-1">
        Don't have an account? <Link to="register.html">Sign Up</Link>
      </p>
    </section>

    </Fragment>
  )
}

export default Login