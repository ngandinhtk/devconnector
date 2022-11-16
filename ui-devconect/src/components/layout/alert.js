import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 

 const Alert = ({}) => 
  alert !== null && 
  alert.length > 0 && 
  alert.map(a=>(
    <div key={a.id} className={`alert alert-${a.alertType}`}>{a.message}</div>
  ))




Alert.prototype = {
  alerts: PropTypes.array.isRequired
}

const mapStateToProps = state =>({
    alerts: state.alert
});

export default connect(mapStateToProps) (Alert) ;
