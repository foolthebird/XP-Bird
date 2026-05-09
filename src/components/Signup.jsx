import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"


const Signup = () => {
   // adding state to all user inputs
    const [username, setUsername] = useState("")
    const [email,setEmail] = useState("")
    const[password,SetPassword] = useState("")
    const[phone,setPhone] = useState("")

    // states for success ,error and loading messages
    const [loading, setLoading] =useState("")
    const[success,setSuccess]=useState("")
    const[error, setError]=useState("")


    // function to host user input in the database
    const submit = async (e) => {
        // prevents the page from reloding before the data is saved in the database
        e.preventDefault()
        setLoading("Please wait as we upload your Data!")
        // sending user input to the database
        try {
            const data = new FormData()
            // appending data to the form data variable
            data.append("username",username)
            data.append("email",email)
            data.append("password",password)
            data.append("phone",phone)

            // using axios to post our data to the database
            const response = await axios.post ("http://johnson.alwaysdata.net/api/signup",data)
            // removing the loading message by setting it to empty
            setLoading("")
            // adding success message after succesful data hosting in the database
            setSuccess(response.data.success)
            // clearing the form fields making the work easier for the user
            setUsername("")
            setEmail("")
            SetPassword("")
            setPhone("")
            
        } catch (error) { 
            setLoading("")
            setError(error.message)
        }

    }
    return(
       <div className="auth-wrapper d-flex justify-content-center align-items-center">
  <div className="glass-card p-5">
    <h2 className="auth-title mb-4">Sign Up</h2>
    <form action="" onSubmit={submit}>
      {loading}
      {success}
      {error}

      <div className="input-group-custom mb-4">
        <input 
          type="text" 
          placeholder="Enter Username" 
          className="glass-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </div>

      <div className="input-group-custom mb-4">
        <input 
          type="email" 
          placeholder="Enter Email" 
          className="glass-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required  
        />
      </div>

      <div className="input-group-custom mb-4">
        <input 
          type="password" 
          placeholder="Enter Password" 
          className="glass-input" 
          value={password}
          onChange={(e) => SetPassword(e.target.value)}
          required
        />
      </div>

      <div className="input-group-custom mb-4">
        <input 
          type="tel" 
          placeholder="Enter Phone number" 
          className="glass-input"
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <button className="neon-btn w-100" type="submit"> 
        Sign UP
      </button>

      <p className="auth-footer mt-4 text-center">
        Already have an account? <Link to="/signin" className="footer-link">Sign In</Link>
      </p>
    </form>
  </div>
</div>
    )
}

export default Signup
