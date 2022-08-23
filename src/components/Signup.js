import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

export const Signup = (props) => {

    const [credentials,setCredentials] = useState({name: "", email:"", password: "", cpassword: ""})
    let navigate = useNavigate()


    const validateEmail = (input) => {

      let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (input.match(validRegex)) {
    
        return true;
    
      } else {
  
    
        return false;
    
      }

    
    }

    const handleChange = (e) => {

        setCredentials({...credentials, [e.target.name]: e.target.value})
        
    
      }

      const handleSubmit = async (e) => {

        e.preventDefault()
        /* console.log(credentials) */
        


        const url = 'http://localhost:5000/api/auth/createuser'
        const {name, email, password, cpassword} = credentials
        
        /* console.log(cpassword)
        console.log(credentials) */

        if(name.length < 2){
          props.showAlert("The name should be at least 2 characters", "danger")
          return;
        }

        if(!validateEmail(email)){
          props.showAlert("Please enter a valid email", "danger")
          return;

        }

        if(password.length < 6){
          props.showAlert("Length of the password should be at least 6 characters", "danger")
          return;

        }

        if(password !== cpassword){
          props.showAlert("Please enter the same password twice", "danger")
          return;

        }

        





        const response = await fetch(url, {

            
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
  
            headers: {
              'Content-Type': 'application/json',
              
            },

            body: JSON.stringify({name: name, email: email, password: password}) 
          });

        const json = await response.json()


       /*  console.log(json)
        console.log(json.success) */
          let token = localStorage.getItem('token')
          console.log(token)
        if(!json.success){

           props.showAlert(json.error, "danger")
        }
        else{

            //redirect
            props.showAlert("Account created successfully", "success")
            localStorage.setItem('token', json.authtoken)
            navigate("/")
        }
        
        
    }
  return (

    <div className='container my-3'>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name = "name"  onChange = {handleChange}  required aria-describedby="emailHelp"/>
                
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="text" className="form-control" id="email" name = "email"  onChange = {handleChange} required aria-describedby="emailHelp"/>
                
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name = "password"  onChange = {handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" name = "cpassword"  onChange = {handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
   
  )
}
