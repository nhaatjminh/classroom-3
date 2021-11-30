
import React, { useState} from 'react';
import { NavLink, useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from "react-bootstrap"
import './index.css'
import GradeOfStudent from '../GradeOfStudent';
const Grades = () => {
    const [loadFirst, setLoadFirst] = useState(true);
    const [role, setRole] = useState("student");
    const [dataTable, setDataTable] = useState([]);
    const [header, setHeader] = useState([]);
    const [studentsListFromGetMember, setStudentsListFromGetMember] = useState([]);
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
    
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";
    const memberURL = '/classes/members/' + params.id;
    const detailURL = '/classes/detail/' + params.id;
    //5th
    const renderRow = (grade, listAssignMent) => {
        var listData = [];
        for (let index = 0; index <listAssignMent.length; index++) {   
            let flag = false;
            for (let indexGrade = 0; indexGrade < grade.length; indexGrade++) {
                if (grade[indexGrade].assignmentID === listAssignMent[index].id) {
                    listData.push(<GradeOfStudent key={index} dataGrade={grade[indexGrade].grade}></GradeOfStudent>)
                    flag = true;
                }
            }
            if (!flag) {
                listData.push(<GradeOfStudent key={index} dataGrade={" - "}></GradeOfStudent>)
            }
        }

        return listData;
    }
    // third
    const getMembers = async (idClass, listStudent, listAssignMent) => {
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
            renderTableData(listStudent, listAssignMent, result.students);
        })
        .catch(error => console.log('error', error));
    }
    const checkExistStudentInStudentsList = (students, listAllStudentOfClass) => {
        const newList = [];
        for (let indexListMember= 0; indexListMember < listAllStudentOfClass.length; indexListMember++) {
            let flag = false;
            for (let indexStudent = 0; indexStudent < students.length; indexStudent++) {
                if (listAllStudentOfClass[indexListMember].id === students[indexStudent].studentid){
                    newList.push(students[indexStudent]);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                const newObj = {
                    studentid : listAllStudentOfClass[indexListMember].id,
                    name : listAllStudentOfClass[indexListMember].name,
                    grade: []
                }
                newList.push(newObj);
            }  
        }
        return newList;
        
    }
    //4th
    const renderTableData = (students, listAssignMent, listAllStudentOfClass) => {
        students = checkExistStudentInStudentsList(students, listAllStudentOfClass);
        const listData = [];
        students.map((student, index) => {
            listData.push(
            <tbody key={student.studentid}>
                <tr>
                    <td>{student.studentid} : {student.name}</td>
                    {renderRow(student.grade, listAssignMent)}
                </tr>
            </tbody>
          )
        })
        setDataTable(listData);
    }
    const checkExistsStudentInGradeBoard = (listStudent, student) => {
        for (let index = 0; index < listStudent.length; index++) {
            if (listStudent[index].studentid === student.studentid) return true;
        }
        return false;
    }
    //second
    const loadGradeBoard = (listAssignMent) => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "grades/" + params.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            
            let listStudent = [];
            for (let index = 0; index < result.length; index++) {
                const temp = {
                    studentid: result[index].student_id,
                    name: result[index].name
                }
                if (checkExistsStudentInGradeBoard(listStudent, temp)) {
                    continue;
                };
                let grade = [];
                for (let indexStudent = 0; indexStudent < result.length; indexStudent++) {   
                    if (result[indexStudent].student_id === result[index].student_id)
                    {
                        let objectGrade = {
                            assignmentID: result[indexStudent].assignment_id,
                            grade: result[indexStudent].grade
                        }
                        grade.push(objectGrade);
                    }
                }
                temp.grade = grade;
                listStudent.push(temp);
            }
            getMembers(params.id, listStudent, listAssignMent);
        })
        .catch(error => {
            console.log('error', error);
        })
    }
    // first
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
                
                loadGradeBoard(result);
            }
            setHeader(header);
            
        })
        .catch(error => {
            console.log('error', error);
        })
    }
    
    if (loadFirst) {
        getListAssignment();
        getRole();
        setLoadFirst(false);
        
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