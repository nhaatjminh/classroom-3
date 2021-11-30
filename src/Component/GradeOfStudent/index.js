
import React, { useState} from 'react';
import { useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
const GradeOfStudent = ({dataGrade}) => {
    
    const [grade, setGrade] = useState(dataGrade.grade);
    const params = useParams();

    const onChangeHandler = (e) => setGrade(e.target.value);

    const onBlurHandler = async () => {
        // console.log("huhu");
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        // var raw = JSON.stringify({
        //     "student_id": dataGrade.student_id,
        //     "grade": grade
        // });

        // var requestOptions = {
        //     method: 'POST',
        //     headers: myHeaders,
        //     body: raw,
        //     redirect: 'follow'
        // };

        // await fetch(process.env.REACT_APP_API_URL + "grades/update/" + params.id + "/" + dataGrade.assignment_id, requestOptions)
        // .then(response => response.text())
        // .then(result => {
        //     console.log("update grade successful");
        // })
        // .catch(error => console.log('error', error));
    }
    
    return(
        <td>
            <input className="inputGrade" defaultValue={grade} onChange={onChangeHandler} onBlur={onBlurHandler}/>
        </td>
            
            // <td>{dataGrade}</td>
        )
}
export default GradeOfStudent;