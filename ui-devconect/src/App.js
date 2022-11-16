
import './App.css';
import { BrowserRouter as Router, Route, Routes } from  'react-router-dom'
import React, {Fragment} from 'react'
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Alert from './components/layout/alert';
import Register from './components/auth/Register';
// redux
import { Provider } from 'react-redux';
import store from './store';

const App =()=> {
  return (
    <Provider store={store}>
    <Router>
      <Fragment>
          <Navbar/>
          <Routes>
            <Route exact path='/'  element={< Landing />} />
          </Routes>
          <section className='container'>
            <Alert />
          <Routes>
            <Route exact path='/login'  element={< Login />} />
            <Route exact path='/register'  element={< Register />} />
          </Routes>
          </section>
      </Fragment>  
    </Router>
    </Provider>
  );
}
 
export default App;
