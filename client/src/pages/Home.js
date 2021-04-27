import React, { Component} from "react";
import { Formik} from "formik";
import * as yup from "yup";
import Axios from "axios";
import { Button, Col, Row, InputGroup, Form, Container } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';


Axios.defaults.withCredentials = true;



const schema = yup.object().shape({
    activity_type: yup.number().required(),
     start_date: yup.date().nullable().required(),
    duration: yup.string().required(),
    //skill: yup.string().required(),
    skill_level: yup.number().required(),
    topic: yup.string().required(),
    description: yup.string().required(),
    //main_category: yup.number().required(),
    //sub_category: yup.number().required(),
    terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
});




class RecordForm extends Component {
    constructor() {
        super();

        this.state = {
            activities: [],
            categories: [],
            sub_category: [],
            skill_list: [],
            skill_level: [],

            disable_sub: true,
            user: -1

        }
    }
    // enableSubMenu(params) {
    //     Axios.post("http://localhost:3001/getSubCategories", {
    //         main_category_id: params,
    //     }).then((response) => {
    //         console.log(response.data);

    //         this.setState({
    //             sub_category: response.data,
    //             disable_sub: false
    //         });
    //     });
    // }

    // enableSkillLevel(params) {

    //     Axios.post("http://localhost:3001/getSkillLevel", {
    //         skill_level_id: params,
    //     }).then((response) => {
    //         console.log(response.data);

    //         this.setState({
    //             skill_level: response.data
    //         });
    //     });
    // }

    handleKeypress(e) {
        const characterCode = e.key
        if (characterCode === 'Backspace') return

        const characterNumber = Number(characterCode)
        if (characterNumber >= 0 && characterNumber <= 9) {
            if (e.currentTarget.value && e.currentTarget.value.length) {
                return
            } else if (characterNumber === 0) {
                e.preventDefault()
            }
        } else {
            e.preventDefault()
        }
    }



    async componentDidMount() {
        var response = await fetch("http://localhost:3001/getAvtivities");
        var newList = await response.json();
        this.setState({
            activities: newList
        });

        // response = await fetch("http://localhost:3001/getCategories");
        // newList = await response.json();
        // this.setState({
        //     categories: newList
        // });

        // response = await fetch("http://localhost:3001/getSkills");
        // newList = await response.json();
        // this.setState({
        //     skill_list: newList
        // });
        response = await fetch("http://localhost:3001/getSkillLevel");
        newList = await response.json();
        this.setState({
            skill_level: newList
        });

    
        Axios.get("http://localhost:3001/getStaffID").then((response) => {
            if (response.data.loggedIn) {
                this.setState({
                    user: response.data.user.id
                });
            }
        });

    }




    render() {
        return (
            <Container>

                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Formik
                            validationSchema={schema}
                            onSubmit={(values) => {
                                console.log(values);
                                console.log("---submitting record---");
                                Axios.post("http://localhost:3001/submitRecord", {
                                    uid: this.state.user, 
                                    selected_avtivity_type: values.activity_type,
                                    selected_start_date: values.start_date,
                                    selected_duration: values.duration,
                                    // selected_main_category: values.main_category,
                                    // selected_sub_category: values.sub_category,
                                    // selected_skill: values.skill,
                                    selected_skill_level: values.skill_level,
                                    selected_topic:values.topic,
                                    selected_description: values.description,
                                }).then((response) => {
                                    console.log(response.data);
                                });
                            }}
                            initialValues={
                                {
                                    terms: false,
                                    start_date: new Date()
                                }
                            }
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                values,
                                touched,
                                isValid,
                                errors,
                                setFieldValue
                            }) => (
                                    <Form noValidate onSubmit={handleSubmit}>

                                        {/*------activity type---------*/}
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="activity_type">
                                                <Form.Label>Activity Type</Form.Label>
                                                <Form.Control
                                                    name="activity_type"
                                                    as="select"
                                                    defaultValue="Choose..."
                                                    onChange={(e) => {
                                                        handleChange(e); this.setState({
                                                            selected_avtivity_type: e.currentTarget.value
                                                        });
                                                    }}
                                                    isInvalid={!!errors.activity_type}
                                                >
                                                    <option>Choose...</option>

                                                    {this.state.activities.map(({ ID, Activity_Name }) => (<option
                                                        key={ID}
                                                        value={ID}
                                                    > {Activity_Name}</option>))}

                                                </Form.Control>

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.activity_type}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>

                                        {/*------start date---------*/}
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="start_date">
                                                <Form.Label>Activity Start Date </Form.Label>
                                                <Form.Row>
                                                    <DatePicker
                                                        dateFormat="MMMM d, yyyy"
                                                        selected={values.start_date}
                                                        className="form-control"
                                                        name="start_date"
                                                        onChange={date => setFieldValue('start_date', date)}
                                                        isInvalid={!!errors.start_date}
                                                    />
                                                </Form.Row>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.start_date}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>

                                        {/*------duration---------*/}
                                        <Form.Row>
                                            <Form.Group as={Col} md="4" controlId="duration">
                                                <Form.Label>Duration (Hours)</Form.Label>
                                                <InputGroup hasValidation>
                                                    <InputGroup.Prepend>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        type="number"
                                                        step="0.5"
                                                        aria-describedby="inputGroupPrepend"
                                                        name="duration"
                                                        onChange={handleChange}
                                                        min={0}
                                                        onKeyDown={this.handleKeypress}
                                                        isInvalid={!!errors.duration}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.duration}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Form.Row>


                                        {/*------Main category---------*/}
                                        {/* <Form.Row>

                                            <Form.Group as={Col} controlId="main_category">
                                                <Form.Label>Main Category</Form.Label>
                                                <Form.Control
                                                    name="main_category"
                                                    as="select"
                                                    defaultValue="Choose..."
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        this.enableSubMenu(e.currentTarget.value);
                                                    }}
                                                    isInvalid={!!errors.main_category}
                                                >
                                                    <option>Choose...</option>
                                                    {this.state.categories.map(({ ID, category_name }) => (<option
                                                        key={ID}
                                                        value={ID}
                                                    > {category_name}</option>))}
                                                </Form.Control>

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.main_category}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Form.Row> */}


                                        {/*------Sub cate---------*/}
                                        {/* <Form.Row>
                                            <Form.Group as={Col} controlId="sub_category">
                                        //         <Form.Label>Sub Category</Form.Label>
                                        //         <Form.Control
                                        //             name="sub_category"
                                        //             as="select"
                                        //             defaultValue="Choose..."
                                        //             onChange={handleChange}
                                        //             isInvalid={!!errors.sub_category}
                                        //             disabled={this.state.disable_sub}
                                        //         >
                                        //             <option>Choose...</option>
                                        //             {this.state.sub_category.map(({ ID, Subcategory_Name }) => (<option
                                        //                 key={ID}
                                        //                 value={ID}
                                        //             > {Subcategory_Name}</option>))}
                                        //         </Form.Control>

                                        //         <Form.Control.Feedback type="invalid">
                                        //             {errors.sub_category}
                                        //         </Form.Control.Feedback>
                                        //     </Form.Group>
                                        // </Form.Row>

                                        // {/*------Skill---------*/}
                                        {/* // <Form.Row>

                                        //     <Form.Group as={Col} controlId="skill">
                                        //         <Form.Label>Skill</Form.Label>
                                        //         <Form.Control
                                        //             name="skill" 
                                        //             as="select"
                                        //             defaultValue="Choose..."
                                        //             onChange={(e) => {
                                        //                 handleChange(e);
                                        //                 this.enableSkillLevel(e.currentTarget.value);
                                        //             }}
                                        //             isInvalid={!!errors.skill}
                                        //         >
                                        //             <option>Choose...</option>
                                        //             {this.state.skill_list.map(({ ID, Skill_Name }) => (<option
                                        //                 key={ID}
                                        //                 value={ID}
                                        //             > {Skill_Name}</option>))}
                                        //         </Form.Control>

                                        //         <Form.Control.Feedback type="invalid">
                                        //             {errors.skill}
                                        //         </Form.Control.Feedback>
                                        //     </Form.Group>

                                        // </Form.Row> */}

                                        {/*------Skill level---------*/}
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="skill_level">
                                                <Form.Label>Skill Level</Form.Label>
                                                <Form.Control
                                                    name="skill_level"
                                                    as="select"
                                                    defaultValue="Choose..."
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.skill_level}
                                                >
                                                    <option>Choose...</option>
                                                    {this.state.skill_level.map(({ ID, Level }) => (<option
                                                        key={ID}
                                                        value={ID}
                                                    > {Level}</option>))}
                                                </Form.Control>

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.skill_level}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>

                                          {/*------ Topic---------*/}
                                          <Form.Row>
                                            <Form.Group controlId="topic">
                                                <Form.Label>Topic</Form.Label>
                                                <Form.Control
                                                    name="topic"
                                                    onChange={(e)=>{handleChange(e);console.log(e.currentTarget.value)}}
                                                    isInvalid={!!errors.active} as="input"   style={{ width: 300}} />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.topic}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>

                                        {/*------Description---------*/}
                                        <Form.Row>
                                            <Form.Group controlId="description">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    name="description"
                                                    maxLength={250}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.active} as="textarea" rows={4} style={{ width: 550, maxWidth: 550 }} />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.description}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>

        

                                        {/*----------------*/}
                                        <Form.Group>


                                            <Form.Check
                                                required
                                                name="terms"
                                                label="Agree to terms and conditions"
                                                onChange={handleChange}
                                                isInvalid={!!errors.terms}
                                                feedback={errors.terms}
                                                id="validationFormik0"
                                            />
                                        </Form.Group>
                                        <Button type="submit">Submit form</Button>
                                    </Form>
                                )}
                        </Formik>

                    </Col>
                </Row>
            </Container>
        );
    }
}


export default RecordForm;
