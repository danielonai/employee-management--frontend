import { TextField } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { EmployeePreview } from "../cmps/Employee-Preview"
import { useForm } from "../hooks/useForm"
import { userService } from "../services/user.service"



export const Employer = () => {

    const [user, setUser] = useState(null)
    const [employees, setemployees] = useState([])
    const [isAddingEmployee, setIsAddingEmployee] = useState(false)
    const [credentials, handleChange] = useForm({ phoneNumber: null, password: null, fullName: null })
    const [msg, setMsg] = useState(null)


    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadEmployees()
    }, [])

    const loadUser = async () => {
        const user = await userService.getLoggedinUser()
        if (!user || !user.isEmployer) navigate('/')
        setUser(user)
    }

    const loadEmployees = async () => {
        let employees = await userService.getUsers()
        employees = employees.filter(e => !e.isEmployer)
        setemployees(employees)
    }

    const onAddEmployee = async (ev) => {
        ev.preventDefault()
        if (!credentials.phoneNumber || !credentials.password || !credentials.fullName) return setMsg('Please fill out all of the fields')
       await userService.addUser(credentials)
       loadEmployees()
        setMsg(null)
        setIsAddingEmployee(false)
    }

    const onLogout = async () => {
        await userService.logout()
        navigate('/')
    }

    return (
        <section className="employer-page-container flex column align-center">
            <h1 className="header">Hello {user?.fullName}!</h1>
            <table className="employees-table">
                <thead className="outline">
                    <tr>
                        <th className="outline">Full Name</th>
                        <th className="outline">Monthly Hours</th>
                        <th className="outline">Total Sessions</th>
                        <th className="outline">Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => <EmployeePreview employee={employee} key={employee.phoneNumber} />)}
                </tbody>
            </table>
            <button className=" fs16 fh20" onClick={() => setIsAddingEmployee(!isAddingEmployee)}>Add New Employee</button>
            {isAddingEmployee && <div>
                <form className="add-employee-form flex column align-center">
                    <h1 className="form-header">Add A New Employee</h1>
                    <div className="seperation-line"></div>
                    <div className="inputs-container flex column gap10">
                        <TextField
                            id="outlined-basic"
                            label="Enter Phone Number"
                            variant="outlined"
                            name='phoneNumber'
                            onChange={handleChange}
                        />
                        <TextField
                            id="outlined-basic-2"
                            label="Enter Full Name"
                            variant="outlined"
                            name='fullName'
                            onChange={handleChange}
                        />
                        <TextField
                            id="outlined-basic-3"
                            label="Enter password"
                            variant="outlined"
                            name='password'
                            type='password'
                            onChange={handleChange}
                        />
                    </div>
                    {msg && <div>{msg}</div>}
                    <button onClick={onAddEmployee} className="sign-in-btn fs16 fh20">Add Employee</button>
                </form>
            </div>}
            <button onClick={onLogout} className="logout-btn  fs16 fh20">Logout</button>
        </section>
    )
}