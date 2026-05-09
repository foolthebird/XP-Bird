import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'


const Signin = () => {
  const[loading,setLoading]= useState("")
    const[error,setError]= useState("")
    const[password,setPassword]=useState("")
    const[email,setEmail]=useState("")
    const navigate = useNavigate()
    const { login } = useAuth()

    // function to submit data to the database
    const submit = async (e) => {
      // preventing the default behavour of the form reloding
      e.preventDefault()
      // updating the loading message
      setLoading("please wait as we log you in")
      // updating data into the database
      try {
        // adding user inputs to data variable
        const data = new FormData()
        data.append("email",email)
        data.append("password",password)

        // connecting and hoasting data to the database
        const response = await axios.post("http://johnson.alwaysdata.net/api/signin", data)
        
        // updating the loading message to empty
        setLoading("")

        // checking if a user exist
        if (response.data.user){
          // storing the user using auth context
          login(response.data.user)
          // redirecting the logged in user to landing page
          navigate("/")
        }
        else{
          // error for login failed
          setError(response.data.Message)
        }
        
      } catch (error) {
        // updating loading message to empty
        setLoading("")
        // update the error message
        setError(error.response.data.message)
      }
    }

    





  return (
    <div className="auth-page-bg d-flex align-items-center justify-content-center">
  <div className="col-md-5 glass-signin-card p-5 shadow">
    <h2 className="text-center auth-title mb-4">Sign In</h2>
    <form onSubmit={submit}>
      {loading}
      {error}

      <div className="mb-4">
        <input 
          className='glass-input-field'
          type="email"  
          placeholder='Email Address'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>

      <div className="mb-4">
        <input 
          className='glass-input-field'
          type="password" 
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </div>

      <button className='neon-signin-btn w-100 mb-4' type='submit'>
        Sign In
      </button>

      <div className="text-center">
        <p className="auth-footer-text">
          Don't have an account? <Link to='/signup' className="neon-link">Sign UP</Link>
        </p>
      </div>
    </form>
  </div>
</div>
  )
}

export default Signin