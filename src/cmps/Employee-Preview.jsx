export const EmployeePreview = ({employee}) => {



return(
    <tr>
        <td className="outline">{employee?.fullName}</td>
        <td className="outline">{employee?.monthlyHours}</td>
        <td className="outline">{employee?.totalSessions}</td>
        <td className={employee?.isWorking ? 'working outline' : 'not-working outline'}>{employee?.isWorking ? 'Working' : 'Isn\'t working'}</td>
    </tr>
)
}