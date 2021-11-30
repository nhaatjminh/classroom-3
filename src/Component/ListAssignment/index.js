import React, { useState, useEffect } from "react";
import { Form, Modal, Row, Col, Navbar  } from 'react-bootstrap';
import { NavLink, useParams } from "react-router-dom";
import Assignment from '../Assignment';
import './index.css'
import $ from "jquery";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ListAssignment = () => {
    const params = useParams();
    const detailURL = '/classes/detail/' + params.id;
    const memberURL = '/classes/members/' + params.id;
    const gradesStructure = '/grades/' + params.id;

    const [role, setRole] = useState();
    const [arrayAssignment, setArrayAssignment] = useState([]);
    const [show, setShow] = React.useState(false);
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState(0);
    const [description, setDescription] = useState("");
    const [minus, setMinus] = useState("0");
    const [hour, setHour] = useState("0");
    const [day, setDay] = useState("1");
    const [month, setMonth] = useState("1");
    const [year, setYear] = useState("2020");

    const [loadFirst, setLoadFirst] = useState(true);

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

    const createAssignment = (e) => {
        e.preventDefault();

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        let newAssign = {
            "topic": topic,
            "grade": grade,
            "description": description,
            "deadline": minus + ":" + hour + " " + day + "-" + month + "-" + year
        }

        let raw = JSON.stringify(newAssign);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "assignment/" + params.id, requestOptions)
        .then(response =>  {
            console.log(response);
            return response.text();
        })
        .then(result => {
            console.log(result);
            alert("Assignment Created!");
            //window.location.reload();
            var newArrayAssignment = arrayAssignment.slice();
            newArrayAssignment.push(newAssign);
            setArrayAssignment(newArrayAssignment);
            onHandleModalClose();
        })
        .catch(error => {
            console.log('error', error)
            alert("An error occur");
        });
    }

    const UpdateRank = (list) => {

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(list);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "assignment/updateRank/" + params.id, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    const getListAssignment = () => {
        return arrayAssignment.map((ele) => 
        <Assignment 
            key={ele.id} 
            onDeleteSuccess={() => onDeleteSuccess(ele.id)} 
            onUpdateSuccess={() => onUpdateSuccess(ele.id)} 
            dataAssignment={ele}
            role={role}/>)
    }

    const onDeleteSuccess = (idAssign) => {
        var newArrayAssignment = $.grep(arrayAssignment, function(e){ 
            return e.id !== idAssign; 
       }); 
        setArrayAssignment(newArrayAssignment);
    }

    const onUpdateSuccess = (idAssign) => {
        
    }

    const getNumberOptionForCombobox = (from, to) => {
        let options = [];
        for (let i = from; i <= to; i++) {
            options.push(<option value={i}>{i}</option>);
        }
        return options;
    }
    
    const getRole = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "classId": params.id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

        await fetch(process.env.REACT_APP_API_URL + "accounts/role/" + localStorage.getItem("userId"), requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result[0].role);
            setRole(result[0].role)

        })
        .catch(error => console.log('error', error));
    }

    useEffect(() => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "assignment/" + params.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result) {
                setArrayAssignment(result);
            }
        })
        .catch(error => {
            console.log('error', error);
        })
    }, [params.id]);

    if (loadFirst) {
        getRole();
        setLoadFirst(false);
    }

    var tmpList = arrayAssignment.slice();

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                    
                    {/* <button className="btn btn-success backbtn" onClick={this.props.backToList}> Back </button> */}
                <Navbar.Toggle /> 
                <div className="btn-new" hidden={!(role === 'teacher')}>
                    <button className="btn btn-success" onClick={onHandleModalShow}> Add New </button>
                </div>
                <Navbar.Collapse className="justify-content-end">
                <NavLink className="nav-link" to={detailURL} >
                    Detail
                </NavLink>
                <NavLink className="nav-link" to={memberURL}>
                    Member
                </NavLink>
                <NavLink className="nav-link" to='#'>
                    List Assignment
                </NavLink>
                <NavLink className="nav-link" to={gradesStructure} hidden={!(role === 'teacher')}>
                    Grades Structure
                </NavLink>
                </Navbar.Collapse>
            </Navbar>
            {role !== 'teacher' ? 
            <div className="list-assignment">
            {getListAssignment()}
            </div> 
            
                :
            
            <div>
            <DragDropContext
                onDragEnd={(param) => {
                    const srcI = param.source.index;
                    const desI = param.destination?.index;
                    tmpList.splice(desI, 0, tmpList.splice(srcI, 1)[0]);
                    setArrayAssignment(tmpList);
                    UpdateRank(tmpList);
                }}
            >
                <Droppable droppableId="droppable-1">
                    {(provided, _) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {tmpList.map((item, i) => (
                        <Draggable
                            key={item.id}
                            draggableId={"draggable-" + item.id}
                            index={i}
                        >
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                
                                style={{
                                ...provided.draggableProps.style,
                                }}
                            >
                                
                                <div align='center' {...provided.dragHandleProps}>
                                <DragIndicatorIcon  />
                                </div>
                                <Assignment
                                    key={item.id}  
                                    onDeleteSuccess={() => onDeleteSuccess(item.id)} 
                                    onUpdateSuccess={() => onUpdateSuccess(item.id)} 
                                    dataAssignment={item}
                                    role={role}/>
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
            </DragDropContext>
            </div>
            }
            
            <Modal show={show} onHide={onHandleModalClose} dialogClassName="modal-70w">
                <Modal.Header closeButton>
                <Modal.Title>Adding Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col sm={10}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Topic </Form.Label>
                                    <Form.Control type="text" 
                                                onChange={topicOnChangeHandler} />
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                            <Form.Group className="mb-3">
                                <Form.Label> Grade </Form.Label>
                                <Form.Control type="number" 
                                            onChange={gradeOnChangeHandler} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label> Description </Form.Label>
                            <Form.Control as="textarea" 
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
                        <button className="btn btn-dark btnCreateAssign" onClick={createAssignment}> Create </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ListAssignment;