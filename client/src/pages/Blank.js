import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'

class Individual extends Component {



    render() {
        return (
            <Alert key='alert' variant='warning'>
                You don't have access to this page. You may need to login first.
            </Alert>

        );
    }
}


export default withRouter(Individual);
