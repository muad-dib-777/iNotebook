import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

export const Login = (props) => {


    const [credentials,setCredentials] = useState({email:"", password: ""})
    let navigate = useNavigate()

    const handleChange = (e) => {

        setCredentials({...credentials, [e.target.name]: e.target.value})
    
      }
    const handleSubmit = async (e) => {

        e.preventDefault()

        const url = 'http://localhost:5000/api/auth/login'
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
  
            headers: {
              'Content-Type': 'application/json',
              
            },

            body: JSON.stringify({email: credentials.email, password: credentials.password}) 
          });

        const json = await response.json()
        console.log(json)

        if(!json.success){

            /* alert(json.error) */

            props.showAlert(json.error, "danger")
        }
        else{

            //redirect
            props.showAlert("Logged in successfully", "success")
            localStorage.setItem('token', json.authtoken)
            console.log(localStorage.getItem('token'))
            navigate("/")
        }
    }

  return (
    <div className='container my-3'>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name = "email" value = {credentials.email} onChange = {handleChange} aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name = "password" value = {credentials.password} onChange = {handleChange}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}
