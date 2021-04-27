import React, { Component } from "react";
import Axios from "axios";
import "../App.css";
import { Form, Button, Container } from 'react-bootstrap';
import { withRouter } from "react-router-dom";



Axios.defaults.withCredentials = true;


class Registration extends Component {
  constructor() {
    super();

    this.state = {
      email: null,
      password: null
    }
  }




  //   function wait(ms){
  //     var start = new Date().getTime();
  //     var end = start;
  //     while(end < start + ms) {
  //       end = new Date().getTime();
  //    }
  //  }


  login=()=>{
    console.log(this.state.email+','+ this.state.password)
    Axios.post("http://localhost:3001/login", {
      email: this.state.email,
      password: this.state.password,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        window.location.replace('/manage')
      }
    });

    
    
  

  };

  useEffect=() => {
    Axios.get("http://localhost:3001/getStaffID").then((response) => {
      if (response.data.loggedIn) {
       console.log(response.data.user.username);
      }
    });

  }
  render() {
    return (
      // // <div className="App">
      //   {/*<div className="registration">
      //     <h1>Registration</h1>
      //     <label>Username</label>
      //     <input
      //       type="text"
      //       onChange={(e) => {
      //         setUsernameReg(e.target.value);
      //       }}
      //     />
      //     <label>Password</label>
      //     <input
      //       type="text"
      //       onChange={(e) => {
      //         setPasswordReg(e.target.value);
      //       }}
      //     />
      //     <button onClick={register}> Register </button>
      //     </div>*/}
      <Container>
        <div className="h-100 d-flex justify-content-center align-items-center">


          <Form >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" 
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }} />
              <Form.Text className="text-muted" >
                For admin user login only.
    </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => {
                this.setState({password:e.target.value});
              }} />
            </Form.Group>
            <Button variant="primary" type="button" onClick={this.login}>
              Submit
  </Button>
          </Form>
        </div>
      </Container>
      //     {/* <div className="login">
      //       <h1>Welcome to PD Record System</h1>
      //       <input
      //         type="text"
      //         placeholder="Username..."
      //         onChange={(e) => {
      //           setUsername(e.target.value);
      //         }}
      //       />
      //       <input
      //         type="password"
      //         placeholder="Password..."
      //         onChange={(e) => {
      //           setPassword(e.target.value);
      //         }}
      //       />

      //       <button onClick={login}> Login </button>
      //     </div>
      //      */}

      // {/* </div> */ }
    );
  }
}

export default withRouter(Registration);
