
import React, { useState} from 'react';
import { useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
const GradeOfStudent = ({dataGrade, onUpdateGrade}) => {
    
    const [grade, setGrade] = useState(dataGrade.grade);
    const params = useParams();

    const onChangeHandler = (e) => setGrade(e.target.value);

    const onBlurHandler = (e) => {
        e.preventDefault();
        console.log(dataGrade.student_id + ": " + grade + ": "+ dataGrade.assignment_id);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");


        var raw = JSON.stringify({
            "student_id": dataGrade.student_id,
            "grade": grade
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "grades/update/" + params.id + "/" + dataGrade.assignment_id, requestOptions)
        .then(response => response.json())
        .then(result => {
        })
        .catch(error => console.log('error', error));

        
        onUpdateGrade();
    }
    
    return(
        <td>
            <input type="number" className="inputGrade" defaultValue={grade} onChange={onChangeHandler} onBlur={onBlurHandler}/>
        </td>
        )
}
export default GradeOfStudent;