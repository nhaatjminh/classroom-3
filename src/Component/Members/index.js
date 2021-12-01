import React, {useState} from "react";
import { NavLink, useParams} from "react-router-dom";
import { Navbar } from "react-bootstrap";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Grid } from "@material-ui/core";
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';
import { CSVLink } from "react-csv";
import { Modal, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';

export default function MembersList() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loadFirst, setLoadFirst] = useState(true);
    const [role, setRole] = useState("student");
    const [fileData, setFileData] = useState("student");
    const [show, setShow] = useState(false);
    let params = useParams();

    const getMembers = async (idClass) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch(process.env.REACT_APP_API_URL + "classes/members/" + idClass, requestOptions)
        .then(response => response.json())
        .then(result => {
            setStudents(result.students);
            setTeachers(result.teachers);
        })
        .catch(error => console.log('error', error));
    }

    const renderMember = (id, name) => {
        return(
            <div key={id}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                    <Avatar>
                        <PersonIcon/>
                    </Avatar>
                    </ListItemAvatar>
                    <h5>{name}</h5>
                </ListItem>
                <Divider variant="inset" component="li" />
            </div>
        );
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
            setRole(result[0].role)
            console.log(result[0].role);
        })
        .catch(error => console.log('error', error));
    }

    const uploadFile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        console.log(fileData);

        var raw = JSON.stringify({
            "listStudent": fileData
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "classes/uploadListMember/" + params.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert(result.message);
        })
        .catch(error => console.log('error', error));
    }

    if (loadFirst) {
        getMembers(params.id);
        getRole();
        setLoadFirst(false);
    }

    const headers = [
        { label: 'Student ID', key: 'id' },
        { label: 'Fullname', key: 'name' }
    ]

    const exportExcel = {
        filename: 'Member.csv',
        headers: headers,
        data: students
    }
    
    const gradesStructure = '/grades/' + params.id;
    const detailURL = '/classes/detail/' + params.id;
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";

	const onHandleModalClose = () => setShow(false);
	const onHandleModalShow = () => setShow(true);
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
                    } else if (value === "Fullname"){
                        headers[col] = "name";
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

    return (
      <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Toggle />

            <div className="invitebtn" hidden={!(role === "teacher")}>
                <button className="btn btn-success m-2"> <CSVLink {...exportExcel}> Download Student List </CSVLink> </button>
                <a className="btn btn-success m-2" href="/Template/list_student_template.xlsx"> Download Template Student List </a>
                <button className="btn btn-success m-2" onClick={onHandleModalShow}> Upload </button> 
            </div>

            <Navbar.Collapse className="justify-content-end">
            <NavLink className="nav-link" to={detailURL} >
                Detail
            </NavLink>
            <NavLink className="nav-link" to='#'>
                Member
            </NavLink>
            <NavLink className="nav-link" to={listAssignmentURL}>
                List Assignment
            </NavLink>
            <NavLink className="nav-link" to={gradesStructure} hidden={!(role === 'teacher')}>
                Grades Structure
            </NavLink>
            </Navbar.Collapse>
        </Navbar>

        <Grid align='center'>
            
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <Grid style={{margin: '20px 0', color: green[300]}}>
                <h2>Teachers</h2>
                </Grid>
                <Divider sx={{ bgcolor: green[800] }} variant="inset" component="li" />
                {teachers.map((row) => (
                    renderMember(row.id, row.name)
                ))}
                
                <Grid style={{margin: '40px 0 20px 0', color: green[300]}}>
                <h2>Students</h2>
                </Grid>
                <Divider sx={{ bgcolor: green[800] }} variant="inset" component="li" />
                {students.map((row) => (
                    renderMember(row.id, row.name)
                ))}
                
            </List>
            
        </Grid>
        <Modal show={show} onHide={onHandleModalClose}>
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
                    <button className="btn btn-success addClassButton" onClick={onHandleModalClose}> Close </button>
                </div>
            </Modal.Footer>
        </Modal>

      </div>

  );
}
