import React from 'react'

export default function StaffCard({ email, name, wage, tHours, url }) {
    return (
        <div>
            <h1>{name}</h1>
            <img src={url} alt="" />
            <p>
                Email: {email}
            </p>
            <p>
                Wage: {wage}
            </p>
            <p>
                Time Worked : {tHours.hours}h {tHours.minutes}min {tHours.seconds}s
            </p>
        </div>
    )
}
