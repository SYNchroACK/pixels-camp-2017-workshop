import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './resources/pixelsCamp.svg';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Filters from './components/Filters';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2 className="app-title">Pixels Camp Todo App</h2>
                </div>
                <Router>
                    <div className="Todo-App">
                        <TodoForm />
                        <Route path='/:filter?' render={({ match }) => (
                            <TodoList filter={match.params.filter} />
                        )} />
                        <Filters />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
