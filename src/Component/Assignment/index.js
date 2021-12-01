
import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { Form, Modal, Row, Col  } from 'react-bootstrap';
import { Card} from 'react-bootstrap';
import './index.css';
import AsyncDownloadButton from '../AsyncDownloadButton';
import * as XLSX from 'xlsx';

const Assignment = ({dataAssignment, onDeleteSuccess, onUpdateSuccess, role}) => {
    const [show, setShow] = useState(false);
    const [uploadModalShow, setUploadModalShow] = useState(false);
    const [topic, setTopic] = useState(dataAssignment.topic);
    const [grade, setGrade] = useState(dataAssignment.grade);
    const [description, setDescription] = useState(dataAssignment.description);
    const [minus, setMinus] = useState("0");
    const [hour, setHour] = useState("0");
    const [day, setDay] = useState("1");
    const [month, setMonth] = useState("1");
    const [year, setYear] = useState("2020");
    const [fileData, setFileData] = useState("student");
    const params = useParams();

    const [topicUpdate, setTopicUpdate] = useState(dataAssignment.topic);
    const [gradeUpdate, setGradeUpdate] = useState(dataAssignment.grade);
    const [descriptionUpdate, setDescriptionUpdate] = useState(dataAssignment.description);
    const [minusUpdate, setMinusUpdate] = useState("0");
    const [hourUpdate, setHourUpdate] = useState("0");
    const [dayUpdate, setDayUpdate] = useState("1");
    const [monthUpdate, setMonthUpdate] = useState("1");
    const [yearUpdate, setYearUpdate] = useState("2020");

    const topicOnChangeHandler = (e) => setTopicUpdate(e.target.value);
    const gradeOnChangeHandler = (e) => setGradeUpdate(e.target.value);
    const descriptionOnChangeHandler = (e) => setDescriptionUpdate(e.target.value);
    const minusOnChangeHandler = (e) => setMinusUpdate(e.target.value);
    const hourOnChangeHandler = (e) => setHourUpdate(e.target.value);
    const dayOnChangeHandler = (e) => setDayUpdate(e.target.value);
    const monthOnChangeHandler = (e) => setMonthUpdate(e.target.value);
    const yearOnChangeHandler = (e) => setYearUpdate(e.target.value);
	const onHandleModalClose = () => setShow(false);
	const onHandleModalShow = () => setShow(true);
    const onHandleUploadModalClose = () => setUploadModalShow(false);
	const onHandleUploadModalShow = () => setUploadModalShow(true);
    const fileOnChangeHandler = (e) => {
        let file = e.target.files[0];

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => { 
            const bstr = e.target.result;

            const wb = XLSX.read(bstr, {type:'binary'});

            const wsname = wb.SheetNames[0];

            const ws = wb.Sheets[wsname];

            let headers = {};
            let data = [];  

            for(let i in ws) {
                if(i[0] === '!') continue;

                let col = i.substring(0,1);
                let row = parseInt(i.substring(1));
                let value = ws[i].v;

                if(row === 1) {
                    if (value === "Student ID") {
                        headers[col] = "id";
                    } else if (value === "Grade"){
                        headers[col] = "grade";
                    } else {
                        headers[col] = value.toLowerCase();
                    }
                    continue;
                }

                if(!data[row]) data[row]={};
                data[row][headers[col]] = value;
            }

            data.shift();
            data.shift();
            setFileData(Array.from(data));
            uploadFile();
        };
    };

    const uploadFile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        console.log(fileData);

        var raw = JSON.stringify({
            "listGrades": fileData
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "grades/uploadGrades/" + params.id + "/" + dataAssignment.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert(result.message);
            setUploadModalShow(false)
        })
        .catch(error => console.log('error', error));
    }

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
            "topic": topicUpdate,
            "description": descriptionUpdate,
            "deadline": minusUpdate + ":" + hourUpdate + " " + dayUpdate + "-" + monthUpdate + "-" + yearUpdate,
            "grade": gradeUpdate
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
            setTopic(topicUpdate);
            setDescription(descriptionUpdate);
            setGrade(gradeUpdate);
            onHandleModalClose();
        })
        .catch(error => console.log('error', error));
    }

    return( 
    <div>
    <Card className="assignment mx-auto">
        <Card.Header as= "h2" className="head-center"> {topic} </Card.Header>
        <Card.Body>            
            {/* <Card.Title> Abc </Card.Title> */}
            <Card.Text> {description} </Card.Text> 
            <Card.Text> Point: {grade} / 10</Card.Text>   
            <Card.Text> {dataAssignment.deadline} </Card.Text>   
        </Card.Body>
        <Card.Footer className="text-center">
            <div className="footer-createAssignBtn text-center" hidden={!(role === 'teacher')}>
                <button className="btn btn-danger btnDeleteAssign"
                        onClick={deleteAssignment}> Delete </button>
                <button className="btn btn-info btnDeleteAssign" 
                        onClick={onHandleModalShow}> Update </button>
                <AsyncDownloadButton assignId={dataAssignment.id}/>
                <button className="btn btn-success m-2" 
                        onClick={onHandleUploadModalShow}> Upload grades file </button>
                <a className="btn btn-success m-2" href="/Template/grades_assignment_template.xlsx"> Download Template Student List </a>
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
                                    <Form.Control type="text" defaultValue={topicUpdate} 
                                                onChange={topicOnChangeHandler} />
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                            <Form.Group className="mb-3">
                                <Form.Label> Grade </Form.Label>
                                <Form.Control type="number" defaultValue={gradeUpdate}
                                            onChange={gradeOnChangeHandler} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label> Description </Form.Label>
                            <Form.Control as="textarea" defaultValue={descriptionUpdate}
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

        <Modal show={uploadModalShow} onHide={onHandleUploadModalClose}>
            <Modal.Header closeButton>
            <Modal.Title> Upload Student List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label> File </Form.Label>
                    <Form.Control type="file" 
                            onChange={fileOnChangeHandler}/>
                </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <div className="footer-createAssignBtn text-center">
                    <button className="btn btn-dark btnCreateAssign" onClick={uploadFile}> Upload </button>
                    <button className="btn btn-success addClassButton" onClick={onHandleUploadModalClose}> Close </button>
                </div>
            </Modal.Footer>
        </Modal>
    
    </div>
    )
};

export default Assignment;