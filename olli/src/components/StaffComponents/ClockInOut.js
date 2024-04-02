import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ClockInOut = () => {
    const [clockedIn, setClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [user, setUser] = useState()
    const [error, setError] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, [])

    // Function to handle clocking in
    const handleClockIn = () => {
        const date = new Date();
        setClockedIn(true);
        setStartTime(date);

        if (user) {

            fetcher("/staff/clockIn", "PUT", user.accessToken, { time: date.toDateString() + " " + date.toLocaleTimeString(), email: user.user.email }, null, errorHandler("Server Error: Could Not ClockIn", setError))
        }
    };

    function errorHandler(message, setter) {
        return () => {
            setter(message)
        }
    }

    // Function to handle clocking out
    const handleClockOut = () => {
        if (window.confirm("Are you sure you want to clock out? You will be logged out of this Account")) {
            const date = new Date();
            setClockedIn(false);
            setEndTime(date);
            if (user) {
                fetcher("/staff/clockOut", "PUT", user.accessToken, { time: date.toDateString() + " " + date.toLocaleTimeString(), email: user.user.email }, null, errorHandler("Server Error: Could Not ClockOut", setError));
            }
            localStorage.setItem('user', "");
            navigate('/login')
        }
    }

    async function fetcher(url, method, accessToken, body, setter, errorHandler) {
        let response;
        if (method === "GET") {
            response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`
                },

            })
        }
        else {
            response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(body)
            })
        }

        if (!response.ok) {
            errorHandler()
            return;
        }
        else if (setter) {
            const data = await response.json()
            setter(data)
        }
    }

    // Function to calculate the duration
    const calculateDuration = () => {
        if (startTime && endTime) {
            const duration = endTime.getTime() - startTime.getTime();
            const hours = Math.floor(duration / (1000 * 60 * 60));
            const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((duration % (1000 * 60)) / 1000);
            return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        } else {
            return "Not Available";
        }
    };

    // UseEffect to update clock display every second
    useEffect(() => {
        const interval = setInterval(() => {
            if (clockedIn) {
                setEndTime(new Date());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [clockedIn]);

    return (
        <div>
            <h1>Work Time Tracker</h1>
            <div>
                {clockedIn ? (
                    <div>
                        <p>Clocked In: {startTime.toLocaleTimeString()}</p>
                        <button onClick={() => { handleClockOut(); }}>Clock Out</button>
                    </div>
                ) : (
                    <div>

                        <button onClick={handleClockIn}>Clock In</button>
                    </div>
                )}
            </div>
            <div>
                <p>Duration: {calculateDuration()}</p>
            </div>
            <p>{error}</p>
        </div>
    );
};

export default ClockInOut;