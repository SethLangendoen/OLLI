import React from 'react';

export default function StaffCard({ email, name, wage, tHours, url }) {
    return (
        <div className="staff-card">
            <h1 className="staff-name">{name}</h1>
            <img className="staff-image" src={url} alt="" />
            <p className="staff-info">
                <span className="info-label">Email:</span> <span className="info-value">{email}</span>
            </p>
            <p className="staff-info">
                <span className="info-label">Wage:</span> <span className="info-value">{wage}</span>
            </p>
            <p className="staff-info">
                <span className="info-label">Time Worked:</span> <span className="info-value">{tHours.hours}h {tHours.minutes}min {tHours.seconds}s</span>
            </p>
        </div>
    );
}
