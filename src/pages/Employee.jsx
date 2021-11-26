import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { userService } from "../services/user.service"


export const Employee = () => {

    const [second, setSecond] = useState('00')
    const [minute, setMinute] = useState('00')
    const [hour, setHour] = useState('00')
    const [isActive, setIsActive] = useState(false)
    const [counter, setCounter] = useState(0)
    const [finalTime, setFinalTime] = useState(0)
    const [user, setUser] = useState(null)
    const [msg, setMsg] = useState(null)
    const [btnTxt, setbtnTxt] = useState('Start Working!')



    const intervalId = useRef()
    const navigate = useNavigate()

    //componetDidMount
    useEffect(() => {
        loadUser()
        return async () => {
            clearInterval(intervalId.current)
            if (user) {
                setUser({ ...user, isWorking: false })
                await userService.update(user)
            }
        }
    }, [])

    // the function responsible for the timer logic
    useEffect(() => {
        let intervalId

        if (isActive) {
            intervalId = setInterval(() => {
                setCounter(counter => counter + 1)
                const secondCounter = counter % 60
                const minuteCounter = Math.floor(counter / 60) % 60
                const hourCounter = Math.floor(counter / 3600)

                const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}` : secondCounter
                const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}` : minuteCounter
                const computedHour = String(hourCounter).length === 1 ? `0${hourCounter}` : hourCounter

                setSecond(computedSecond)
                setMinute(computedMinute)
                setHour(computedHour)
                setFinalTime(hourCounter + +(minuteCounter / 60).toFixed(2))

            }, 1000)
        }
        return () => clearInterval(intervalId)
    }, [isActive, counter])

    const loadUser = () => {
        const user = userService.getLoggedinUser()
        if (!user) navigate('/')
        setUser(user)
    }

    const onClockBtnClick = async () => {
        setIsActive(!isActive)
        if (isActive) {
            setbtnTxt('Pause work')
            setUser({ ...user, isWorking: true })
            await userService.update(user)
        } else {
            setbtnTxt('Start work')
            setUser({ ...user, isWorking: true })
            await userService.update(user)
        }
    }

    const onSessionEnd = async () => {
        const monthlyHours = user.monthlyHours + finalTime
        console.log('month hours:', monthlyHours);
        setUser({ ...user, monthlyHours, totalSessions: user.totalSessions + 1 })
        await userService.update(user)
        await userService.logout()
        setMsg('Session saved, goodbye!')
        setTimeout(() => {
            setMsg(null)
            navigate('/')
        }, 1500);
    }

    return (
        <section className="employee-main-container flex column align-center">
            <div className="employee-header">Hello {user?.fullName}!</div>
            <div className="time">
                <span className="hour">{hour}</span>
                <span>:</span>
                <span className="minute">{minute}</span>
                <span>:</span>
                <span className="second">{second}</span>
            </div>
            <button onClick={onClockBtnClick} className="start-btn">{btnTxt}</button>
            <button onClick={onSessionEnd} className="end-btn">End session and sign out</button>
            {msg && <div>{msg}</div>}
            <table className="monthly-table">
                <thead className="outline">
                    <tr>
                        <th className="outline">Monthly Hours</th>
                        <th className="outline">Monthly Sessions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-align outline">{user?.monthlyHours}</td>
                        <td className="text-align outline">{user?.totalSessions}</td>
                    </tr>
                </tbody>
            </table>

        </section>
    )
}
