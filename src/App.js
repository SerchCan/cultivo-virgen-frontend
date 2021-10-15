import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { useAuth0 } from "@auth0/auth0-react";

export default () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return(
  <Router basename={process.env.REACT_APP_BASENAME || ""}>
    <div>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={withTracker(props => {
              console.log({isAuthenticated, user});
              if(!isAuthenticated && route.path != "/login"){
                return (<Redirect to="/login" />)
              } 
              return (
                <route.layout {...props}>
                  <route.component {...props} />
                </route.layout>
              );
            })}
          />
        );
      })}
    </div>
  </Router>
)};
