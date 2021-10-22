import React from "react";

import FeedingOverview from "./FeedingOverview";
import { useAuth0 } from "@auth0/auth0-react";

const FeedingMaster = () => {
  const {  user } = useAuth0();

return (<FeedingOverview user={user}/>)
}

export default FeedingMaster;
