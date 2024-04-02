import React from 'react'
import StaffNavBar from '../NavBars/StaffNavBar'
import ClockInOut from '../StaffComponents/ClockInOut';
export default function StaffPage() {

    return (
        <div>
            <StaffNavBar />
            <br />
            <br />
            <h1>Clock In</h1>
            <ClockInOut />
            <h2>Clock Out</h2>
        </div>
    )
}
