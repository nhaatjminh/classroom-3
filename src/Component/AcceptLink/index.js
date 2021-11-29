
import {React} from 'react';
import {  useParams} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '../Login';

const AcceptLink = () => {
    const params = useParams();
    const tokenAccount = localStorage.getItem("token");
    const tokenLink = params.tokenlink;
    const PostData = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(process.env.REACT_APP_API_URL + "classes/acceptlink/" + tokenLink + "/" + tokenAccount, requestOptions)
        .then(response => {
            response.json(); 
            localStorage.removeItem("tokenLink");
            window.location.pathname ='/';
        })
        .catch(error => {
            console.log('error', error);
        });
    }
    const CheckToken = () => {
        if (tokenAccount) {
            PostData();
        }
        else {
            window.location.pathname ='/';
            localStorage.setItem("tokenLink", params.tokenlink);
        }
    }
    if(params.tokenlink !== "") {
        CheckToken();
    }
    
    return(
        <div>
            <Login></Login>
        </div>
        )
}

export default AcceptLink;