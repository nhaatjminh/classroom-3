
import React, { useState } from 'react';
import Classroom from '../Classroom';

const ListClassRoom = ({onLogoutSuccess}) => {

    const [arrayClassRoom, setAarrayClassRoom] = useState([]);
    const [loadFirst, setLoadFirst] = useState(true);

    const listClassRoom = (listCls) => {
        return listCls.map((ele) => <Classroom key={ele.id} dataClass={ele}/>)
    }
    
    const loadListClassRoom = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "classes", requestOptions)
        .then(response => response.json())
        .then(result => {
            setAarrayClassRoom(result);

        })
        .catch(error => {
            console.log('error', error);
            logout();
        });
    }   

    const logout = () => {
        localStorage.removeItem("token");
        onLogoutSuccess();
        console.log("Logout success");
    }

    if (loadFirst){
        loadListClassRoom();
        setLoadFirst(false);
    }

    return (
        <div>
            <div className="p-3">
                <div>
                    {listClassRoom(arrayClassRoom)}
                </div>
            </div>
        </div>
    )
}

export default ListClassRoom;