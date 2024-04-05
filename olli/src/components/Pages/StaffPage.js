import React from 'react';
import StaffNavBar from '../NavBars/StaffNavBar';
import ClockInOut from '../StaffComponents/ClockInOut';
import "./StaffPage.css"; // Import the CSS file for styling

export default function StaffPage() {
    return (
        <div className="staff-page-container"> {/* Unique class name */}
            <StaffNavBar />
            <br />
            <br />
            <h1 className="clock-in-title">Clock In</h1> {/* Unique class name */}
            <ClockInOut />
            <h2 className="clock-out-title">Clock Out</h2> {/* Unique class name */}
        </div>
    );
}
