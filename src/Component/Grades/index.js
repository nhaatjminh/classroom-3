
import React, { useState} from 'react';
import { NavLink, useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Modal, Form } from "react-bootstrap"
import './index.css'
import GradeOfStudent from '../GradeOfStudent';
import * as XLSX from 'xlsx';

const Grades = () => {
    const [loadFirst, setLoadFirst] = useState(true);
    const [role, setRole] = useState("student");
    const [dataTable, setDataTable] = useState([]);
    const [header, setHeader] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [dataMappingStudent, setDataMappingStudent] = useState({
        studentID: '',
        name: '',
        phone: '',
        address: ''
    })
    let params = useParams();

    const [fileData, setFileData] = useState("student");
    const [showUploadModal, setShowUploadModal] = useState(false);

    const onHandleModalClose = () => setShowUploadModal(false);
	const onHandleModalShow = () => setShowUploadModal(true);
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
        };
    };

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

        fetch(process.env.REACT_APP_API_URL + "classes/uploadListStudent/" + params.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert(result.message);
            setShowUploadModal(false);
        })
        .catch(error => console.log('error', error));
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
        })
        .catch(error => console.log('error', error));
    }
    
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";
    const memberURL = '/classes/members/' + params.id;
    const detailURL = '/classes/detail/' + params.id;

    const onUpdateGrade = () => {
        setIsUpdate(true);
    }

    //5th
    const renderRow = (grade, listAssignMent , studentid) => {
        console.log(grade);
        var listData = [];
        var totalGrade = 0;
        var total = 0;
        for (let index = 0; index <listAssignMent.length; index++) {   
            let flag = false;
            let dataGrade = {
                assignment_id: listAssignMent[index].id,
                student_id: studentid
            };
            total += listAssignMent[index].grade;
            for (let indexGrade = 0; indexGrade < grade.length; indexGrade++) {
                if (grade[indexGrade].assignmentID === listAssignMent[index].id) {
                    dataGrade.grade= grade[indexGrade].grade
                    listData.push(<GradeOfStudent key={index} dataGrade={dataGrade} onUpdateGrade={onUpdateGrade}></GradeOfStudent>)
                    flag = true;
                    totalGrade += grade[indexGrade].grade * listAssignMent[index].grade;
                }
            }
            if (!flag) {
                dataGrade.grade= null
                listData.push(<GradeOfStudent key={index} dataGrade={dataGrade} onUpdateGrade={onUpdateGrade}></GradeOfStudent>)
            }
        }
        totalGrade = totalGrade / total;
        listData.push(<td>{totalGrade.toFixed(2)}</td>)

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

        await fetch(process.env.REACT_APP_API_URL + "grades/members/" + idClass, requestOptions)
        .then(response => response.json())
        .then(result => {
            
            renderTableData(listStudent, listAssignMent, result);
            
        })
        .catch(error => console.log('error', error));
    }
    const checkExistStudentInStudentsList = (students, listAllStudentOfClass, listStudentHaveAccount) => {
        const newList = [];
        
        console.log(students);
        console.log(listAllStudentOfClass);
        for (let indexListMember= 0; indexListMember < listAllStudentOfClass.length; indexListMember++) {
            let flag = false;
            for (let indexStudent = 0; indexStudent < students.length; indexStudent++) {
                if (listAllStudentOfClass[indexListMember].studentID === students[indexStudent].studentid){
                    students[indexStudent].studentid += '';
                    newList.push(students[indexStudent]);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                const newObj = {
                    studentid : listAllStudentOfClass[indexListMember].studentID + '',
                    name : listAllStudentOfClass[indexListMember].name,
                    grade: []
                }
                newList.push(newObj); 
            }  
        }
        for (let indexStudents= 0; indexStudents < listStudentHaveAccount.length; indexStudents++) {
            for (let indexNewList = 0; indexNewList < newList.length; indexNewList++) {
                if (newList[indexNewList].studentid === listStudentHaveAccount[indexStudents].studentID){
                    newList[indexNewList].haveAccount = true;
                }
            }
        }
        
        return newList;
        
    }
    //4th
    const renderTableData = async (students, listAssignMent, listAllStudentOfClass) => {
        //get member dont join to class
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch(process.env.REACT_APP_API_URL + "grades/membersHaveAccount/" + params.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            
            students = checkExistStudentInStudentsList(students, listAllStudentOfClass, result);
            console.log("student:");
            console.log(students);
            const listData = [];
            students.map((student, index) => {
                listData.push(
                <tbody key={student.studentid} className={student.haveAccount? "" : "dontHaveAccount"}>
                    <tr>
                        <td>{student.studentid} - {student.name}
                        
                            <br></br>
                            <div hidden={student.haveAccount? false : true}>
                                <button  className="btn-showIn4" onClick={ () => {onHandleShow(student.studentid)}} >Show</button>
                            </div>
                        </td>
                        {renderRow(student.grade, listAssignMent, student.studentid)}
                    </tr>
                </tbody>
            )
            })
            setDataTable(listData);
            
        })
        .catch(error => console.log('error', error));
        
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
                header.push(<th key={-1} className="headerStudentID"> Student ID </th>);
                result.map((ele, key) => header.push(<th key={key}>
                    {ele.topic}
                    <br></br>
                    {ele.grade}/{totalGrade}
                </th>))
                header.push(<th className="total"> Total grade </th>)
                
                loadGradeBoard(result);
            }
            setHeader(header);
            
        })
        .catch(error => {
            console.log('error', error);
        })
    }
    
    const onHandleShow = async (id) => {
        setShowDialog(true);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch(process.env.REACT_APP_API_URL + "grades/onemember/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            setDataMappingStudent({
                studentID: result[0].studentID,
                name: result[0].name,
                phone: result[0].phone,
                address: result[0].address
            });
            console.log(dataMappingStudent);
        })
        .catch(error => console.log('error', error));
    }
    const onHandleClose = () => {
        setShowDialog(false);
        setDataMappingStudent({
            studentID: '',
            name: '',
            phone: '',
            address: ''
        });
    }
    if (loadFirst) {
        getListAssignment();
        getRole();
        setLoadFirst(false);
        
    }

    if (isUpdate) {
        getListAssignment();
        setIsUpdate(false);
    }
    
    return(
            <div>
                
                <Navbar bg="dark" variant="dark">
                    <Navbar.Toggle />

                    <div className="invitebtn" hidden={!(role === "teacher")}>
                        <a className="btn btn-success m-2" href="/Template/list_student_template.xlsx"> Download Template Student List </a>
                        <button className="btn btn-success m-2" onClick={onHandleModalShow}> Upload List Member </button> 
                    </div>

                    <Navbar.Collapse className="justify-content-end">
                    <NavLink className="nav-link" to={detailURL} >
                        
                        Detail
                    </NavLink>
                    <NavLink className="nav-link" to={memberURL}>
                        Member
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
                <div>
                    <Modal show={showDialog} onHide={onHandleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5>Student ID: {dataMappingStudent.studentID}</h5>
                            <h5>Name: {dataMappingStudent.name}</h5>
                            <h5>Phone: {dataMappingStudent.phone}</h5>
                            <h5>Address: {dataMappingStudent.address}</h5>
                        </Modal.Body>
                        
                    </Modal>
                </div>

                <Modal show={showUploadModal} onHide={onHandleModalClose}>
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
        
        )
}
export default Grades;