import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Button, Accordion, Card, Form } from 'react-bootstrap';
import Axios from "axios";
Axios.defaults.withCredentials = true;

class Setting extends Component {
    constructor() {
        super();
        this.change = this.change.bind(this);
        this.state = {
            password: null,
            confirm_password: null,
            msg: '',
            user_id: -1
        }
    }
    componentDidMount() {

        Axios.get("http://localhost:3001/getStaffID").then((response) => {
          if (response.data.loggedIn) 
            this.setState({user_id: response.data.user.id });       
        });
      }

    change() {
        if (this.state.password === this.state.confirm_password) {
            Axios.post("http://localhost:3001/changePassword", {
                password: this.state.password, user_id: this.state.user_id
            }).then((response) => {
                if(!response.data.affectedRows>0)
                console.log("not changed");
            });
        }else {
                this.setState({ msg: "password not match." })
            }
            window.location.replace('/login')
    }

        render() {
            return (
                <Accordion >
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                Change Password
      </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Form >
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control type="password" placeholder="Enter Password"
                                            onChange={(e) => {
                                                this.setState({ password: e.target.value });
                                            }} />
                                        <Form.Text className="text-muted" >{this.state.msg}</Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Comfirm Password" onChange={(e) => {
                                            this.setState({ confirm_password: e.target.value });
                                        }} />
                                    </Form.Group>
                                    <Button variant="primary" type="button" onClick={this.change}>
                                        Confrim
  </Button>
                                </Form>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </Accordion>

            );
        }
    }


    export default withRouter(Setting);
