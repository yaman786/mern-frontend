import React,{useState,useMemo, useEffect} from "react";
import api from '../../services/api';
import './events.css';
import {Alert,Container,Button,Input,Form,FormGroup,Label,DropdownItem,DropdownMenu,ButtonDropdown,DropdownToggle} from 'reactstrap';
import cameraIcon from '../../assets/camera.png'
export default function EventsPage({history}) {
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [price,setPrice] = useState('');
  const [date, setDate] = useState("");
  const [sport, setSport] = useState("Sport");
  const [thumbnail,setThumbnail] = useState(null);
  const [errorMessage,setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const user = localStorage.getItem('user');
  useEffect(()=>{
    if(!user){
      history.push('/login')
    }
  },[])
  const sportHandler = (sport)=>{
    setSport(sport)
  }
  const preview = useMemo(()=>{
    return thumbnail ? URL.createObjectURL(thumbnail):null;
  },[thumbnail])
  
  const submitHandler = async (event)=>{
    event.preventDefault();
    
    const user = localStorage.getItem("user");
    const eventData = new FormData();
    eventData.append('thumbnail',thumbnail)
    eventData.append('title',title)
    eventData.append('description',description)
    eventData.append("price", price)
    eventData.append("sport", sport)
    eventData.append("date", date)
    try {
      if(
        title!=='' &&
        description!=='' &&
        sport!=='Sport' &&
        price!=='' &&
        date!=='' &&
        thumbnail!==null
      ){
        
        
        await api.post('/event',eventData,{headers:{user}})
          setSuccess(true)
          setTimeout(() => {
            setSuccess(false);
            history.push('/')
          }, 2000);
        
      }else{

        setError(true)
        setErrorMessage('missing input fields!')
        setTimeout(()=>{
          setError(false)
          setErrorMessage('')
        },2000)
      }
      
    } catch (error) {
      console.log(error)
    }
}
  return (
    <Container>
      <h2>Create your Event</h2>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label>Upload Image</Label>
          <Label
            id="thumbnail"
            style={{ backgroundImage: `url(${preview})` }}
            className={thumbnail ? "has-thumbnail" : ""}
          >
            <Input
              type="file"
              onChange={(event) => setThumbnail(event.target.files[0])}
            />
            <img src={cameraIcon} style={{ maxWidth: "50px" }} alt="" />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={"Event title"}
          />
        </FormGroup>
        <FormGroup>
          <Label>Description:</Label>
          <Input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={"Event Description"}
          />
        </FormGroup>
        <FormGroup>
          <Label>Event Price:</Label>
          <Input
            type="text"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder={"event price"}
          />
        </FormGroup>
        <FormGroup>
          <Label>Date:</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            placeholder={"Event Date"}
          />
        </FormGroup>
        <FormGroup>
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
            <Button id="caret" color="primary" disabled value={sport}>{sport}</Button>
            <DropdownToggle caret color="primary" />
            <DropdownMenu>
              <DropdownItem onClick={() => sportHandler('running')} >running</DropdownItem>
              <DropdownItem onClick={() => sportHandler('cycling')} >cycling</DropdownItem>
              <DropdownItem onClick={() => sportHandler('swimming')} >swimming</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </FormGroup>

        <FormGroup>
          <Button type="submit" className="submit-btn">
            Create Event
          </Button>
        </FormGroup>
        <FormGroup>
          <Button
            type="submit"
            onClick={() => history.push("/")}
            className="secondary-btn"
          >
          Cancel
          </Button>
        </FormGroup>
      </Form>
      {error ? (
        <Alert className="event-validation" color="danger">
          {errorMessage}
        </Alert>
      ) : (
        ""
      )}
      {success ? (
        <Alert className="event-validation" color="success">
          Event was created successfully.
        </Alert>
      ) : (
        ""
      )}
    </Container>
  );
}
