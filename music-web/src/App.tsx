import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import routes from './router/router';
import ShellHeader from './pages/ShellHeader';
import { FetchData } from './utils/service';

function App() {
  return (
    <Router>
      
      <ShellHeader />

      <Switch>
        {
          routes.map((ele, key) => (
            <Route path={ele.path} key={key} exact={ele.exact}>
             {ele.component}
            </Route>
          ))
        }
      </Switch>
    </Router>

  );
}

export default App;
