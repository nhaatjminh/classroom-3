
import React, { useState} from 'react';
import { NavLink, useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Modal } from "react-bootstrap"
import './index.css'
import SendIcon from '@mui/icons-material/Send';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Typography} from '@material-ui/core';

import { Card} from 'react-bootstrap';

const DetailClass = () => {
    const [data, setData] = useState({
            creator: "",
            description: "",
            id: -1,
            name: "",
            timeCreate: "",
            linkInvite: ""
        });
    const [loadFirst, setLoadFirst] = useState(true);
    const [inviteLinkStudent, setInviteLinkStudent] = useState();
    const [inviteLinkTeacher, setInviteLinkTeacher] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [email, setEmail] = useState("");
    const [roleInvite, setRoleInvite] = useState("Student");
    const [userRole, setUserRole] = useState("student");
    
    const [assignment, setAssignment] = useState([]);
    let params = useParams();
    const getDetail = async (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(process.env.REACT_APP_API_URL + "classes/detail/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            setData({
                creator: result.creator,
                description: result.description,
                id: result.id,
                name: result.name,
                timeCreate: result.timeCreate
            })
        })
        .catch(error => {
            console.log('error', error);
        });
    }

    const getInviteLink = async (id,role) => { //truyen role vo day nhe bro
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(process.env.REACT_APP_API_URL + "classes/invitelink/" + id + "/" + role, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("into")
            if (role === 'teacher') {
                setInviteLinkTeacher(result);
            } else if (role === 'student') {
                setInviteLinkStudent(result);
            }
        })
        .catch(error => {
            console.log('error', error);
        });
    }

    const onHandleShow = () => {
        setShowDialog(true);
    }
    const onHandleClose = () => {
        setShowDialog(false);
    }
    const onChangeHandler = (e) => {
        setEmail(e.target.value);
    }
    const handleChange = (e) => {
        setRoleInvite(e.target.value);
    }

    const sendEmail = async (recipient, inviteLink, role) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "recipient": recipient,
            "inviteLink": inviteLink,
            "role": role,
            "classId": params.id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch(process.env.REACT_APP_API_URL + "sendEmail", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw Error(response.status);
        })
        .then(result => {
            alert("Invitation was sent!");
            onHandleClose();
        })
        .catch(error => {
            alert("Fail to send invitation!");
            onHandleClose();
        });
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
            setUserRole(result[0].role)
            console.log(result[0].role);
        })
        .catch(error => console.log('error', error));
    }
    

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        let link  = "";
        if (roleInvite === "student") {
            link = inviteLinkStudent
        }
        else {
            link = inviteLinkTeacher
        }

        await sendEmail(email, link, roleInvite);
    }

    const getListAssignment = () => {
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
            console.log(result);
            setAssignment(result);
        })
        .catch(error => {
            console.log('error', error);
        })
    }
    if (loadFirst) {
        getDetail(params.id);
        getInviteLink(params.id, 'student');
        getInviteLink(params.id, 'teacher');
        getRole();
        getListAssignment()
        setLoadFirst(false);
    }
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";
    const memberURL = '/classes/members/' + params.id;
    const gradesStructure = '/grades/' + params.id;
    const renderGradeStructure = () => {
        let gradestructure = [];
        console.log(assignment);
        for (let index = 0; index < assignment.length; index++) {
            gradestructure.push(<Card.Text> {assignment[index].topic} : {assignment[index].grade}đ </Card.Text>)
        }
        return gradestructure;
    }
    return(
            <div>
                <Navbar bg="dark" variant="dark">
                    
                    {/* <button className="btn btn-success backbtn" onClick={this.props.backToList}> Back </button> */}
                    <Navbar.Toggle />
                    
                    <div className="invitebtn" hidden={!(userRole === "teacher")}>
                        <button className="btn btn-success" onClick={onHandleShow}> Invite </button>
                        {/* <Link className="btn btn-success m-2" to={listAssignmentURL}></Link> */}
                    </div>
                    <Navbar.Collapse className="justify-content-end">
                    <NavLink className="nav-link" to="#" >
                        Detail
                    </NavLink>
                    <NavLink className="nav-link" to={memberURL}>
                        Member
                    </NavLink>
                    <NavLink className="nav-link" to={listAssignmentURL}>
                        List Assignment
                    </NavLink>
                    <NavLink className="nav-link" to={gradesStructure} hidden={!(userRole === 'teacher')}>
                        Grades Structure
                    </NavLink>
                    </Navbar.Collapse>
                </Navbar>

                <div className="container-fluid mt-5">
                    <h1 className="text-center">
                        Class: {data.name}
                    </h1>
                    <div className="row">
                        <div className="col-6 m-2">
                            <div className="mt-3">
                                ID: {data.id}
                            </div>
                            <div className="mt-3">
                                Class: {data.name}
                            </div>
                            <div className="mt-3">
                                Creator: {data.creator}
                            </div>
                            <div className="mt-3">
                                Description: {data.description}
                            </div>
                        </div>
                        <div className="col-5 m-2">
                        <Card className="w-100">
                            <Card.Header as= "h5" className="text-center">Grades Structure</Card.Header>
                            <Card.Body>            
                                {assignment.length > 0 ?
                                renderGradeStructure(): ""}   
                            </Card.Body>
                            <Card.Footer className="text-center">
                            </Card.Footer>
                        </Card>
                        </div>
                    </div>
                    
                </div>

                <div>
                    <Modal show={showDialog} onHide={onHandleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Invitation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={onSubmitHandler}>
                                <div className="mt-3">
                                    <Typography style={{wordWrap: 'break-word'}}>
                                        Link Invite Student: {inviteLinkStudent}
                                    </Typography>
                                </div>
                                <div className="mt-3 mb-3">
                                    <Typography style={{wordWrap: 'break-word'}}>
                                        Link Invite Teacher: {inviteLinkTeacher}
                                    </Typography>
                                </div>
                                <div>
                                    <FormControl style={{width: 120, margin: '10px 0'}}>
                                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={roleInvite}
                                            label="Role"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={"student"}>Student</MenuItem>
                                            <MenuItem value={"teacher"}>Teacher</MenuItem>
                                        </Select>
                                        </FormControl>
                                </div>
                                <div className="row">
                                    <div className="col-10">
                                        <input type="text" name="name" className="form-control" placeholder="Send this invitaion to email..." onChange={onChangeHandler} />
                                    </div>
                                    <div className="col">
                                        <button type="submit" className="btn btn-success"> <SendIcon/> </button>
                                    </div>
                                </div>
                            </form>
                        </Modal.Body>
                        
                    </Modal>
                </div>
            </div>
        
        )
}
export default DetailClass;