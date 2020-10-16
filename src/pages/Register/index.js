import React, { useContext, useState } from "react";
import api from "../../services/api";
import {Alert, Button, Form, FormGroup, Container, Input } from "reactstrap";
import {UserContext} from '../../user-context';

export default function Register({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error,setError] = useState(false);
  const[errorMessage,setErrorMessage] = useState('');
  const {setIsloggedIn} = useContext(UserContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(
      email!=='' &&
      password!=='' &&
      firstName!=='' &&
      lastName!=='' 
    ){
      const response = await api.post("/user/register", {firstName,lastName, email, password });
      const user_id = response.data.user_id || false;
      const user = response.data.user || false;
  
      if (user_id && user) {
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("user", user);
        setIsloggedIn(true);
        history.push("/");
      } else {
        const { message } = response.data;
        setError(true)
        setErrorMessage(message)
        setTimeout(()=>{
          setError(false)
          setErrorMessage('')
        },2000)
      }

    }else{
      setError(true);
      setErrorMessage("you need to fill all the input fields!");
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
    }
    
  };

  return (
    <Container>
      <h2>Registration:</h2>
      <p>Please Register for a new account </p>
      <Form onSubmit={handleSubmit}>
        <div className="input-group">
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              type="text"
              name="firstName"
              id="lastName"
              placeholder="Your first name.."
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Your lastName.."
              onChange={(event) => setLastName(event.target.value)}
            />
          </FormGroup>

          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Your Email.."
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormGroup>

          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormGroup>
        </div>
        <FormGroup>
          <Button className="submit-btn">Submit</Button>
        </FormGroup>
        <FormGroup>
          <Button
            className="secondary-btn"
            onClick={() => history.push("/login")}
          >
            Login Instead{" "}
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
    </Container>
  );
}
