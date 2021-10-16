import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "shards-react";


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="d-flex justify-content-center">
      <Button 
        className="btn text" pill 
        onClick={() => loginWithRedirect()}
      >
        Click aquí para iniciar sesión
      </Button>
    </div>
  )

};

export default LoginButton;