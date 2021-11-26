import { TextField } from "@material-ui/core"
import { useForm } from "../hooks/useForm"
import { useNavigate } from 'react-router-dom'
import { userService } from "../services/user.service"
import {  useState } from "react"



export const Login = () => {
    const [credentials, handleChange] = useForm({ phoneNumber: null, password: null })
    const [msg, setMsg] = useState(null)
    const navigate = useNavigate()


    const onLogin = async (ev) => {
        ev.preventDefault()
        try {
            const user = await userService.login(credentials)
            user.isEmployer ? navigate('/employer') : navigate('/employee')
        }
        catch (err) {
            setMsg('Incorrect phone number / password')
            console.log('err', err);
        }
    }

    return (
        <section>
            <form className="login-container">
                <h1 className="login-header fs20 fh22">Please log in to continue</h1>
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
                    {msg && <div>{msg}</div>}
                    <button onClick={onLogin} className="sign-in-btn fs16 fh20">Sign-in</button>
                </div>
            </form>
        </section>
    )
}