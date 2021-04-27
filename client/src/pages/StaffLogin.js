import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'
import GoogleLogin from '../components/GoogleLogin';

class StaffLogin extends Component {

    constructor() {
        super();
    
        this.state = {
          email: null,
          password: null
        }
      }

    render() {
        return (
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://static.bandicam.com/img/mainbanner_02.jpg"
                        alt="First slide"
                    />
                    <Carousel.Caption style={{ top: "60%", transform: "translateY(-50%)" }}>
                        <h2>Welcome to PD Record System</h2>
                        <p>For AIT Academic Staff PD Activities Recording</p>
                        {!this.state.username && <GoogleLogin />}
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

        );
    }
}


export default withRouter(StaffLogin);

