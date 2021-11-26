export const EmployeePreview = ({ employee }) => {

    const getMonthlyHours = () => {
        let hours = 0
        employee?.sessions?.forEach(session => {
            hours += session.duration
        })
        return hours
    }

    return (
        <tr>
            <td className="outline">{employee?.fullName}</td>
            <td className="outline">{getMonthlyHours()}</td>
            <td className="outline">{employee?.sessions?.length || 0}</td>
            <td className={employee?.isWorking ? 'working outline' : 'not-working outline'}>{employee?.isWorking ? 'Working' : 'Isn\'t working'}</td>
        </tr>
    )
}