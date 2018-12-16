import React, { Component } from 'react';
import { TopBar } from './TopBar';
import { Main } from './Main';
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
class App extends Component {
  render() {
    return (
      <div className="App">
        <TopBar />
        <Main />
      </div>
    );
  }
}

export default App;
