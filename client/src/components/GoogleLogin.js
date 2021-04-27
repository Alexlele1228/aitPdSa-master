import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/RefreshToken';
import Axios from "axios";

const clientId = '241601696449-kat678q5lkg0g36j7kg5cp4s67m7ddfk.apps.googleusercontent.com';

Axios.defaults.withCredentials = true;



export default function Login() {

  const UserExits = (email, name) => {

    Axios.post("http://localhost:3001/judgeUserExits", {
      email: email,
      name:name
    }).then((response) => {
      console.log(response)
      if (response.data.length === 0) {
        alert(
          `You don't have access to PD record system.`
      );
      }else
      window.location.replace('/home')
    });

  }



  const onSuccess = (res) => {
    
    UserExits(res.profileObj.email, res.profileObj.name);
  
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Login failed`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Academic Staff Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px', color: 'black', Width: '300px' }}
        //isSignedIn={true}
      />
    </div>
  );
}

