import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './app/LoginPage';
import SignUpPage from './app/SignUpPage';
import UserDashboard from './app/UserDashboard.js';
import PresidentDashboard from './app/PresidentDashboard.js';
import AdminDashboard from './app/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <PrivateRoute path="/user-dashboard" component={UserDashboard} />
          <PrivateRoute path="/president-dashboard" component={PresidentDashboard} />
          <PrivateRoute path="/admin-dashboard" component={AdminDashboard} />
          <Redirect from="/" to="/login" />
        </Switch>
      </div>
    </Router>
  );
}

// PrivateRoute component to protect routes
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem('token') ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default App;