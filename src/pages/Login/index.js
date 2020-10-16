import React,{useContext,useState} from 'react';
import api from '../../services/api';
import {Alert, Button, Form, FormGroup,Container, Input } from "reactstrap";
import {UserContext} from '../../user-context';

export default function Login({history}){
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const [error,setError]=useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {setIsloggedIn} = useContext(UserContext);

    const handleSubmit = async event=>{
        event.preventDefault();
        const response = await api.post('/login',{email,password});
        const user_id = response.data.user_id || false;//axios always bring data object with response
        const user = response.data.user || false;
        console.log(user,user_id)
        try {
          
          if (user_id && user){
            localStorage.setItem('user_id',user_id)
            localStorage.setItem('user',user)
            setIsloggedIn(true)
            history.push('/')
          }else{
            const {message} = response.data
            setError(true)
            setErrorMessage(message)
            setTimeout(()=>{
              setError(false)
              setErrorMessage("")
            },2000)
          }
        } catch (error) {
          console.log(error)
        }

    }

    return (
      <Container>
        <h2>Login:</h2>
        <p>Please Login into your account</p>
        <Form onSubmit={handleSubmit}>
          <div className="input-group">
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
            <Button className="secondary-btn" onClick={()=>history.push('/register')}>New Account</Button>
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