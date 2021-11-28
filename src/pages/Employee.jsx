import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { userService } from "../services/user.service"





export const Employee = () => {

    const [second, setSecond] = useState('00')
    const [minute, setMinute] = useState('00')
    const [hour, setHour] = useState('00')
    const [day, setDay] = useState(new Date().getDate())
    const [isActive, setIsActive] = useState(false)
    const [counter, setCounter] = useState(0)
    const [finalTime, setFinalTime] = useState(0)
    const [user, setUser] = useState(null)
    const [msg, setMsg] = useState(null)
    const [btnTxt, setbtnTxt] = useState('Start Working!')


    const navigate = useNavigate()

    //componetDidMount
    useEffect(() => {
        loadUser()
        return () => {

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
                checkDate()

            }, 1000)
        }
        return () => clearInterval(intervalId)
    }, [isActive, counter])

    const loadUser = () => {
        const user = userService.getLoggedinUser()
        if (!user) navigate('/')
        setUser(user)
    }

    // resets the clock and submits the session if it flowed to the next day
    const checkDate = async () => {
        const currDay = new Date().getDate()
        if (currDay !== day) {
            const session = {
                date: new Date().toLocaleString(),
                duration: finalTime
            }
            const sessions = user.sessions.push(session)
            setUser({ ...user, sessions })
            await userService.update(user)
            resetClock()
            setDay(currDay)
        }
    }


    const onClockBtnClick = async () => {
        setIsActive(!isActive)
        let updatedUser
        if (isActive) {
            setbtnTxt('Start work')
            updatedUser = { ...user, isWorking: false }
            setUser(updatedUser)
        } else {
            setbtnTxt('Pause work')
            updatedUser = { ...user, isWorking: true }
            setUser(updatedUser)
        }
        await userService.update(updatedUser)
    }


    // adds a session to the user if he had a work session and commiting logout
    const onSessionEnd = async () => {
        if (counter > 120) {
            const session = {
                date: new Date().toLocaleString(),
                duration: finalTime
            }
            user.sessions.push(session)
            const sessions = user.sessions
            setUser({ ...user, sessions, isWorking: false })
            setMsg('Session saved, goodbye!')
        }
        setTimeout(async () => {

            const updatedUser = { ...user, isWorking: false }
            setUser(updatedUser)
            await userService.update(updatedUser)
            setMsg(null)
            await userService.logout()
            navigate('/')
        }, 1000);
    }


    const resetClock = () => {
        setCounter(0)
        setSecond('00')
        setMinute('00')
        setHour('00')
    }

    const getMonthlyHours = () => {
        if (!user) return
        let hours = 0
        user?.sessions.forEach(session => {
            hours += session.duration
        })
        return hours
    }

    const getMonthlysessions = () => {
        const monthlySessions = user?.sessions.filter(session => session.date.slice(3, 5) === new Date().toLocaleString().slice(3, 5))
        return monthlySessions?.length || 0
    }

    return (
        <section className="employee-main-container flex column align-center">
            <h1 className="employee-header  fs26 fh30">Hello {user?.fullName}!</h1>
            <div className="time fs30 fh36">
                <span className="hour">{hour}</span>
                <span>:</span>
                <span className="minute">{minute}</span>
                <span>:</span>
                <span className="second">{second}</span>
            </div>
            <button onClick={onClockBtnClick} className="start-btn fs20 fh22">{btnTxt}</button>
            <button onClick={onSessionEnd} className="end-btn fs20 fh22">End session and sign out</button>
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
                        <td className="text-align outline">{getMonthlyHours()}</td>
                        <td className="text-align outline">{getMonthlysessions()}</td>
                    </tr>
                </tbody>
            </table>

        </section>
    )
}
