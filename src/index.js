import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import App from './App';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Auth0Provider
    domain="cultivo-virgen.us.auth0.com"
    clientId="rLSyuaaXWzngOO9fS8cFtg9VN53wdoDa"
    redirectUri={"https://admin.cultivo-virgen.link/blog-overview"}
    // redirectUri={"http://localhost:3000/blog-overview"}
  >
    <App />
  </Auth0Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
