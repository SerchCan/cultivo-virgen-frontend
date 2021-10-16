import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import { useAuth0 } from "@auth0/auth0-react";

export default () => { 
  const { logout, user } = useAuth0();
  return(
    <Nav navbar className="border-left flex-row">
      <Notifications />
      <UserActions logout={logout} user={user}/>
    </Nav>
  )};
