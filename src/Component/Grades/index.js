
import React, { useState} from 'react';
import { NavLink, useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from "react-bootstrap"
import './index.css'
const Grades = () => {
    const [loadFirst, setLoadFirst] = useState(true);
    const [role, setRole] = useState("student");
    const [dataTable, setDataTable] = useState([]);
    const [header, setHeader] = useState([]);
    let params = useParams();
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
        })
        .catch(error => console.log('error', error));
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
            let header=[];
            let totalGrade = 0;
            for (var index = 0; index <result.length;index++) {
                totalGrade += result[index].grade;
            }
            if (result) {
                header.push(<th key={-1}> Student ID </th>);
                result.map((ele, key) => header.push(<th key={key}>
                    {ele.topic}
                    <br></br>
                    {ele.grade}/{totalGrade}
                </th>))
                header.push(<th className="w-100"></th>)
            }
            setHeader(header);
        })
        .catch(error => {
            console.log('error', error);
        })
    }
    
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";
    const memberURL = '/classes/members/' + params.id;
    const detailURL = '/classes/detail/' + params.id;
    const renderTableData = () => {
        const students= [
               { idStudent: 5, grades1: '10', grades2: '5'  },
               { idStudent: 15, grades1: '8', grades2: '5'  },
               { idStudent: 25, grades1: '7', grades2: '5'   },
               { idStudent: 35, grades1: '6', grades2: '5'   }
            ];
        const listData = [];
        students.map((student, index) => {
            listData.push(
            <tbody key={student.idStudent}>
                <tr>
                    <td>{student.idStudent}</td>
                    <td>{student.grades1}</td>
                    <td>{student.grades2}</td>
                    <td className="w-100"></td>
                </tr>
            </tbody>
          )
        })
        setDataTable(listData);
    }
    if (loadFirst) {
        getListAssignment();
        getRole();
        setLoadFirst(false);
        
        renderTableData();
    }
    return(
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                    <NavLink className="nav-link" to={detailURL} >
                        Detail
                    </NavLink>
                    <NavLink className="nav-link" to={memberURL}>
                        People
                    </NavLink>
                    <NavLink className="nav-link" to={listAssignmentURL}>
                        List Assignment
                    </NavLink>
                    <NavLink className="nav-link" to='#' hidden={!(role === 'teacher')}>
                        Grades Structure
                    </NavLink>
                    </Navbar.Collapse>
                </Navbar>
                <h1 className="text-center mt-3 mb-3">
                       Grades Of Class
                </h1>
                <table>
                    <thead>   
                        <tr> 
                        {header}
                        </tr>    
                    </thead>
                    {dataTable}
                </table>
            </div>
        
        )
}
export default Grades;