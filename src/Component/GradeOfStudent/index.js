
import React, { useState} from 'react';
import { NavLink, useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from "react-bootstrap"
const GradeOfStudent = ({dataGrade}) => {
    
    const [grade, setGrade] = useState(dataGrade);
    
    return(
            
            <td>{dataGrade}</td>
        )
}
export default GradeOfStudent;