import React, { Component } from 'react';
import { TopBar } from './TopBar';
import { Main } from './Main';
import { TOKEN_KEY } from '../constants';

//import '../styles/App.css';
/*
class MyInput extends Component {
  render () {
    return <input />;
  }
}

function fancy(Component) {
  class Fancy extends Component {
    render() {
      return (
        <div style={{ backgroundColor: 'blue'}}>
          <Component />
        </div>
      );
  }
}

const FancyMyInput = fancy(MyInput);
*/
//localStorage.setItem('some_key', 'some_value');


class App extends Component {
  state = {
    isLoggedIn: !!localStorage.getItem(TOKEN_KEY)
  }

  handleLogin = (data) => {
    localStorage.setItem(TOKEN_KEY, data);
    this.setState({isLoggedIn: true});
  }

  handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    this.setState({isLoggedIn: false});
  }

  render() {
    return (
      <div className="App">
        <TopBar isLoggedIn={this.state.isLoggedIn}  handleLogout={this.handleLogout} />
        <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin} />
      </div>
    );
  }
}

export default App;
