import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CSVLink } from "react-csv";

const AsyncDownloadButton = (assign) => {
    const params = useParams();

    const [dataForDownload, setDataForDownload] = useState([]);
    const [downloadReady, setDownloadReady] = useState(false);

    const csvLink = React.createRef();
    const headers = [
        { label: 'Student ID', key: 'student_id' },
        { label: 'Grade', key: 'grade' }
    ]

    useEffect(() => {
        if (csvLink && csvLink.current && downloadReady) {
            csvLink.current.link.click();
            setDownloadReady(false);
        }
    }, [downloadReady]);

    const downloadAssignmentGrades = () => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "grades/" + params.id + "/" + assign.assignId, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result) {
                setDataForDownload(result);

                setDownloadReady(true);
            }
        })
        .catch(error => {
            alert("An error occur");
        });
    }

    return ( <div> 
        <input type ="button" value="Download assignment grades" onClick={downloadAssignmentGrades}/>
        <CSVLink headers={headers}
                data={dataForDownload}
                filename="AssignmentGrades.csv"
                ref={csvLink} />
    </div>)
}

export default AsyncDownloadButton;