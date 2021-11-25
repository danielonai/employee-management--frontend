import { TextField } from "@material-ui/core"
import { useForm } from "../hooks/useForm"
import { useNavigate } from 'react-router-dom'



export const Login = () => {
    const [credentials, handleChange, setCredentials] = useForm({ phoneNumber: null, password: null })
    const navigate = useNavigate()

    const check = (ev) => {
        ev.preventDefault()
       
    }
    return (
        <section>
            <form className="login-container">
                <p className="login-header fs20 fh22">Please log in to continue</p>
                <div className="seperation-line"></div>
                <div className="login-main-container flex column align-center">
                    <div className="login-input-continer flex column gap10">
                        <TextField
                            id="outlined-basic"
                            label="Enter Phone Number"
                            variant="outlined"
                            name='phoneNumber'
                            onChange={handleChange}
                        />
                        <TextField
                            id="outlined-basic-2"
                            label="Enter password"
                            variant="outlined"
                            name='password'
                            type='password'
                            onChange={handleChange}
                        />
                    </div>
                    <button onClick={check} className="sign-in-btn fs16 fh20">Sign-in</button>
                </div>
            </form>
        </section>
    )
}