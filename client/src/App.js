
import './App.css';
import { BrowserRouter as Router, Route, Routes } from  'react-router-dom'
import React, {Fragment} from 'react'
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App =()=> {
  return (
    <Router>
      <Fragment>
          <Navbar/>
          <Routes>
            <Route exact path='/'  element={< Landing />} />
          </Routes>
          <section className='container'>
          <Routes>
            <Route exact path='/login'  element={< Login />} />
            <Route exact path='/register'  element={< Register />} />
          </Routes>
          </section>
      </Fragment>  
    </Router>
  );
}

export default App;
