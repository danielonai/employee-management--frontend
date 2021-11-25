import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { userService } from "../services/user.service"

export const Employee = () => {


    const [user, setUser] = useState(null)

    // const [sec, setSec] = useState(0)
    // const [min, setMin] = useState(0)
    // const [hr, setHr] = useState(0)

    const [clock, setclock] = useState({
        sec: 58,
        min: 0,
        hr: 0
    })


    const [btnTxt, setbtnTxt] = useState(null)

    const intervalId = useRef()
    const navigate = useNavigate()

    //componetDidMount
    useEffect(() => {
        setbtnTxt('Start Working!')
        loadUser()
        return () => {
            clearInterval(intervalId.current)
        }
    }, [])

    const loadUser = () => {
        const user = userService.getLoggedinUser()
        if (!user) navigate('/')
        setUser(user)
    }

    const onBtnClick = () => {
        if (!intervalId.current) {
            setbtnTxt('Pause Work')
            setUser({ ...user, isWorking: true })
            intervalId.current = setInterval(() => {
                if (clock.sec === 59) {
                    if (clock.min === 59) setclock({ ...clock,sec: 0, min: 0, hr: clock.hr++ })
                    else setclock({ ...clock, sec: 0, min: clock.min++ })
                }
                else setclock({ ...clock, sec: clock.sec++ })
            }, 1000);
        } else {
            setbtnTxt('Start Work')
            setUser({ ...user, isWorking: false })
            clearInterval(intervalId.current)
            intervalId.current = null
        }
    }

    return (
        <section className="employee-main-container flex column align-center">
            <div className="employee-header">Hello {user?.fullName}!</div>
            <div className="clock-container">{clock.hr < 10 ? '0' + clock.hr : clock.hr}:{clock.min < 10 ? '0' + clock.min : clock.min}:{clock.sec < 10 ? '0' + clock.sec : clock.sec}</div>
            <button onClick={onBtnClick} className="start-btn">{btnTxt}</button>
            <button className="end-btn">End session and sign out</button>
            <table className="monthly-table">
                <thead className="outline">
                    <tr>
                        <th className="outline">Monthly Hours</th>
                        <th className="outline">Monthly Sessions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-align outline">15</td>
                        <td className="text-align outline">3</td>
                    </tr>
                </tbody>
            </table>

        </section>
    )
}