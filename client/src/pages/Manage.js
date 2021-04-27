import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import Axios from "axios";
import { withRouter } from "react-router-dom";
import { Tabs, Tab, Button, Accordion, Card, Form } from 'react-bootstrap';

Axios.defaults.withCredentials = true;



const columns = [
    { key: 'ID', name: 'ID' },
    { key: 'Name', name: 'Name' },
    { key: 'Professional Development Total Hours', name: 'Professional Development Total Hours' },
    { key: 'Scholarly Activity Total Hours', name: 'Scholarly Activity Total Hours' }
];

const userCol = [{ key: 'Email', name: 'Email' }]


class ManageSite extends Component {
    constructor() {
        super();
        this.addUser = this.addUser.bind(this);
        this.state = {
            record_list: [],
            eligible_users_list: [],
            email: null
        }
    }



    async componentDidMount() {

        var response = await fetch("http://localhost:3001/getAllRecord");
        var newList = await response.json();
        this.setState({
            record_list: newList
        });

        response = await fetch("http://localhost:3001/getEligibleUser");
        newList = await response.json();
        this.setState({
            eligible_users_list: newList
        });


    }

    redirectToIndividual = (id, name) => {
        const { history } = this.props;
        if (history) history.push('/individual', { user_id: id, name: name });
    }

    addUser = () => {
        Axios.post("http://localhost:3001/addToStaffTable", {
            email: this.state.email,
        }).then((response) => {
            console.log(response);
            if (response.data.exits) {
                alert(
                    `Operation failed, user already exits.`
                );
            }
            else if (response.data.length > 0) {
                    alert(
                        `New user has been added successfully.`
                    );
                
            }else{
                alert(
                    `Operation failed, please try again later.`
                );
            }
            window.location.reload()
        });
    }

    render() {
        return (

            <Tabs defaultActiveKey="Records" transition={false} id="noanim-tab-example">
                <Tab eventKey="Records" title="Total Records">
                    <ReactDataGrid
                        rows={this.state.record_list}
                        columns={columns}
                        onRowClick={rowid => this.redirectToIndividual(this.state.record_list[rowid].ID, this.state.record_list[rowid].Name)}
                        rowGetter={i => this.state.record_list[i]}
                        rowsCount={this.state.record_list.length}
                        minHeight={150}
                    />
                </Tab>
                <Tab eventKey="Accessability" title="Accessability">
                    <Accordion >
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    View eligible users
      </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <ReactDataGrid
                                        rows={this.state.eligible_users_list}
                                        columns={userCol}
                                        rowGetter={i => this.state.eligible_users_list[i]}
                                        rowsCount={this.state.eligible_users_list.length}
                                        minHeight={150}
                                    />
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Add new eligible user
      </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Form >
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Google Email</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email"
                                                onChange={(e) => {
                                                    this.setState({ email: e.target.value });
                                                }} />
                                        </Form.Group>

                                        <Button variant="primary" type="button" onClick={this.addUser}>
                                            Confrim
                                            </Button>

                                    </Form>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>

                    </Accordion>
                </Tab>
            </Tabs>

        );
    }
}


export default withRouter(ManageSite);
