
import React, { Component} from 'react';
import { Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './index.css';

export default class Classroom extends Component {
    constructor(props){
        super(props);
        this.state = {
            url: '/classes/detail/'+ this.props.dataClass.id
        }      
    }

    render(){
        return( 
        <Card className="classroom">
            <Card.Img variant="top" src="classroom.jpg" />
            <Card.Header as= "h5" className="text-center">{this.props.dataClass.name}</Card.Header>
            <Card.Body>            
                <Card.Title className="teacher">{this.props.dataClass.creator}</Card.Title>
                {/* <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle> */}
                <Card.Text className="description"> {this.props.dataClass.description} </Card.Text>   
            </Card.Body>
            <Card.Footer className="text-center">
            <Link className="linkBtn" to={this.state.url}>Detail</Link>
            </Card.Footer>
        </Card>
        )
    }
}