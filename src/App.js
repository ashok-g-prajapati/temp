
import React, { Component } from 'react';
import Signupdoc from './components/Signupdoc';
import SignUp from './components/SignUp';
import Login from './components/Login';
import './App.css';
import Clinic from './components/Clinic';
import Temp from './components/Temp';
import ClinicDate from './components/ClinicDate';
import History from './components/History';
class App extends Component {
  render() {
    return (
      <div className="App">
      <ClinicDate/>
      </div>
    );
  }
}

export default App;
