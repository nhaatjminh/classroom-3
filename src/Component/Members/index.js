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

export default function MembersList() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loadFirst, setLoadFirst] = useState(true);
    const [role, setRole] = useState("student");
    const headers = [
        { label: 'Student ID', key: 'id' },
        { label: 'Fullname', key: 'name' }
    ]

    const exportExcel = {
        filename: 'Member.csv',
        headers: headers,
        data: students
    }

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

    if (loadFirst) {
        getMembers(params.id);
        getRole();
        setLoadFirst(false);
    }

    const gradesStructure = '/grades/' + params.id;
    const detailURL = '/classes/detail/' + params.id;
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";

    return (
      <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Toggle />

            <div className="invitebtn" hidden={!(role === "teacher")}>
                <button className="btn btn-success m-2"> <CSVLink {...exportExcel}> Download Student List </CSVLink> </button>
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
      </div>

  );
}
