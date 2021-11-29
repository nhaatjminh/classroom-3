
import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { Form, Modal, Row, Col  } from 'react-bootstrap';
import { Card} from 'react-bootstrap';
// import {Link} from 'react-router-dom';
import './index.css';

const Assignment = ({dataAssignment, onDeleteSuccess, onUpdateSuccess, role}) => {
    const [show, setShow] = useState(false);
    const [topic, setTopic] = useState(dataAssignment.topic);
    const [grade, setGrade] = useState(dataAssignment.grade);
    const [description, setDescription] = useState(dataAssignment.description);
    const [minus, setMinus] = useState("0");
    const [hour, setHour] = useState("0");
    const [day, setDay] = useState("1");
    const [month, setMonth] = useState("1");
    const [year, setYear] = useState("2020");
    const params = useParams();

    const topicOnChangeHandler = (e) => setTopic(e.target.value);
    const gradeOnChangeHandler = (e) => setGrade(e.target.value);
    const descriptionOnChangeHandler = (e) => setDescription(e.target.value);
    const minusOnChangeHandler = (e) => setMinus(e.target.value);
    const hourOnChangeHandler = (e) => setHour(e.target.value);
    const dayOnChangeHandler = (e) => setDay(e.target.value);
    const monthOnChangeHandler = (e) => setMonth(e.target.value);
    const yearOnChangeHandler = (e) => setYear(e.target.value);
	const onHandleModalClose = () => setShow(false);
	const onHandleModalShow = () => setShow(true);

    const getNumberOptionForCombobox = (from, to) => {
        let options = [];
        for (let i = from; i <= to; i++) {
            options.push(<option value={i}>{i}</option>);
        }
        return options;
    }
    
    const deleteAssignment = (e) => {
        e.preventDefault();

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        console.log(process.env.REACT_APP_API_URL + "assignment/delete/" + params.id + "/" + dataAssignment.id);
        fetch(process.env.REACT_APP_API_URL + "assignment/delete/" + params.id + "/" + dataAssignment.id, requestOptions)
        .then(response =>  {
            console.log(response);
            return response.text();
        })
        .then(result => {
            console.log(result);
            alert("Assignment Deleted!");
            //window.location.reload();
            onDeleteSuccess();
        })
        .catch(error => {
            console.log('error', error)
            alert("An error occur");
        });
    }

    const updateAssignment = (e) => {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "topic": topic,
            "description": description,
            "deadline": minus + ":" + hour + " " + day + "-" + month + "-" + year,
            "grade": grade
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "assignment/update/" + params.id + "/" + dataAssignment.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            //onUpdateSuccess();
            alert("Assignment Updated!");
            window.location.reload();
        })
        .catch(error => console.log('error', error));
    }

    return( 
    <div>
    <Card className="assignment mx-auto">
        <Card.Header as= "h2" className="head-center"> {dataAssignment.topic} </Card.Header>
        <Card.Body>            
            {/* <Card.Title> Abc </Card.Title> */}
            <Card.Text> {dataAssignment.description} </Card.Text> 
            <Card.Text> Point: {dataAssignment.grade} / 10</Card.Text>   
            <Card.Text> {dataAssignment.deadline} </Card.Text>   
        </Card.Body>
        <Card.Footer className="text-center">
            <div className="footer-createAssignBtn text-center">
                <button className="btn btn-danger btnDeleteAssign"
                        onClick={deleteAssignment}
                        hidden={!(role === 'teacher')}> Delete </button>
                <button className="btn btn-info btnDeleteAssign" 
                        onClick={onHandleModalShow}
                        hidden={!(role === 'teacher')}> Update </button>
            </div>
        </Card.Footer>

    </Card>

    <Modal show={show} onHide={onHandleModalClose} dialogClassName="modal-70w">
                <Modal.Header closeButton>
                <Modal.Title>Update Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col sm={10}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Topic </Form.Label>
                                    <Form.Control type="text" defaultValue={dataAssignment.topic} 
                                                onChange={topicOnChangeHandler} />
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                            <Form.Group className="mb-3">
                                <Form.Label> Grade </Form.Label>
                                <Form.Control type="number" defaultValue={dataAssignment.grade}
                                            onChange={gradeOnChangeHandler} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label> Description </Form.Label>
                            <Form.Control as="textarea" defaultValue={dataAssignment.description}
                                        style={{ height: '100px' }}
                                        onChange={descriptionOnChangeHandler} />
                        </Form.Group>

                        <Row>
                            <Col sm={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Minus </Form.Label>
                                    <Form.Select onChange={minusOnChangeHandler}>
                                        {getNumberOptionForCombobox(0, 60)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Hour </Form.Label>
                                    <Form.Select onChange={hourOnChangeHandler}>
                                        {getNumberOptionForCombobox(0, 24)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={1}></Col>
                            <Col sm={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Day </Form.Label>
                                    <Form.Select onChange={dayOnChangeHandler}>
                                        {getNumberOptionForCombobox(1, 31)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Month </Form.Label>
                                    <Form.Select onChange={monthOnChangeHandler}>
                                        {getNumberOptionForCombobox(1, 12)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Year </Form.Label>
                                    <Form.Select onChange={yearOnChangeHandler}>
                                        {getNumberOptionForCombobox(2020, 2040)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="footer-createAssignBtn text-center">
                        <button className="btn btn-dark btnCreateAssign" onClick={updateAssignment}> Update </button>
                    </div>
                </Modal.Footer>
    </Modal>
    </div>
    )
};

export default Assignment;