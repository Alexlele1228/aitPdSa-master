import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import Axios from "axios";
import { withRouter } from "react-router-dom";
import moment from 'moment';
import { Tabs, Tab, Alert, Container, Button, Badge } from 'react-bootstrap';


Axios.defaults.withCredentials = true;

const defaultColumnProperties = {
    resizable: true,
    width: 200
};

const columns = [
    { key: 'ID', name: 'ID' },
    { key: 'Activity Type', name: 'Activity Type' },
    { key: 'Activity_Date', name: 'Activity_Date' },
    { key: 'Activity Duration', name: 'Activity Duration' },
    { key: 'Skill Level', name: 'Skill Level' },
    { key: 'Topic', name: 'Topic' },
    { key: 'Description', name: 'Description' },
].map(c => ({ ...c, ...defaultColumnProperties }));


class Individual extends Component {
    constructor() {
        super();
        this.levelUp = this.levelUp.bind(this);
        this.state = {
            individual_record_list: [],
            isAdmin: null,
            user_id: -1,
            username: null
        }
    }



    async componentDidMount() {
        console.log(this.props.location.state.name)
        this.setState({ user_id: this.props.location.state.user_id });
        this.setState({ username: this.props.location.state.name });


        Axios.post("http://localhost:3001/getIndividualRecord", {
            user_id: this.props.location.state.user_id,

        }).then((response) => {
            if (response.data.message) {
                console.log(response.data.message);
            } else {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].Activity_Date = moment(response.data[i].Activity_Date).utc().format('DD/MM/YYYY');
                }
                this.setState({
                    individual_record_list: response.data
                })
            }
        });

        Axios.post("http://localhost:3001/checkIfSpecificUserAdmin", {
            user_id: this.props.location.state.user_id,
        }).then((response) => {
            if (response.data.length > 0) {
                this.setState({ isAdmin: true });
            } else {
                this.setState({ isAdmin: false });
            }
        });
    }

    levelUp() {
        Axios.post("http://localhost:3001/levelUpUser", {
            user_id: this.state.user_id
        }).then((response) => {
            console.log(response)
            window.location.reload()
        });
    }


    render() {
        return (
            <div>
                <Button variant="info">
                    Records <Badge variant="light">{this.state.individual_record_list.length}</Badge>
                    <span className="sr-only"></span>
        </Button><strong > of {this.state.username}</strong>
                <Tabs defaultActiveKey="Records" transition={false} id="noanim-tab-example">
                    <Tab eventKey="Records" title="Records">
                        <ReactDataGrid
                            rows={this.state.individual_record_list}
                            columns={columns}
                            rowGetter={i => this.state.individual_record_list[i]}
                            rowsCount={this.state.individual_record_list.length}
                            minHeight={0}
                            onColumnResize={(idx, width) =>
                                console.log(`Column ${idx} has been resized to ${width}`)
                            } />
                    </Tab>
                    <Tab eventKey="Setting" title="Setting">
                        {
                            this.state.isAdmin ?
                                <Alert key='alert' variant='warning'>
                                    This user is an admin user.
                   </Alert>
                                : (<Container>
                                    <Alert key='alert' variant='success'>
                                        This user is not an admin user. make him/her to become an administrator ?
                   </Alert>
                                    <Button variant="danger" onClick={this.levelUp}>Yes </Button>
                                </Container>)
                        }
                    </Tab>
                </Tabs>
            </div>

        );
    }
}


export default withRouter(Individual);
