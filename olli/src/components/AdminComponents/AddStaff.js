// AddStaff.js

import React, { useState, useEffect } from 'react';
import '../../CSS/AdminManagement/AdminManagement.css'; // css file


export default function AddStaff({ Update }) {
    const [user, setUser] = useState()
    const [error, setError] = useState()
    const [staffInfo, setStaffInfo] = useState({
        name: "",
        email: "",
        wage: "",
        clockIn: "",
        clockOut: "",
        isOnline: 0,
    })
    const [userInfo, setUserInfo] = useState({
        email: staffInfo.email,
        username: "empty",
        password: "",
        phone_number: "",
        user_type: 'staff',
        fName: "empty",
        lName: "empty",
        isVerified: 0,
        isSubscribed: 1
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])
    function errorHandler(message, setter) {
        return () => {
            setter(message)
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
    const handleChange = (e, regex) => {
        let { name, value } = e.target;
        value = value.replace(regex, "")
        setStaffInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (userInfo.hasOwnProperty(name)) {
            setUserInfo(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleChangeUser = (e, regex) => {
        let { name, value } = e.target;
        value = value.replace(regex, "")
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="add-staff-container">
            <div className="hire-input-group">
                <input
                    type="text"
                    placeholder="Enter Full Name"
                    name="staffname"
                    value={staffInfo.name}
                    onChange={(e) => {
                        handleChange(e, /[^ a-zA-Z]/g);
                    }}
                />
                <input
                    type="text"
                    placeholder='Enter Email'
                    name="staffemail"
                    value={staffInfo.email}
                    onChange={(e) => { handleChange(e, /[^a-zA-Z0-9@.]/g) }}
                />
                <input
                    type="text"
                    placeholder='Enter Password'
                    name="staffpassword"
                    value={userInfo.password}
                    onChange={(e) => { handleChangeUser(e, /[^a-zA-Z0-9]/g) }}
                />
                <input
                    type="text"
                    placeholder='Enter Wage'
                    name="staffwage"
                    value={staffInfo.wage}
                    onChange={(e) => { handleChange(e, /[^0-9.]/g) }}
                />
                <input
                    type="text"
                    placeholder='Enter Phone Number'
                    name="staff_phone_number"
                    value={userInfo.phone_number}
                    onChange={(e) => { handleChangeUser(e, /[^0-9]/g) }}
                />
                {user && <button className="hire-button" onClick={() => {

                    if (userInfo.email === "" || userInfo.password === "") {

                        setError("You Must Enter At least the email and Password ")
                        return
                    }
                    fetcher("/signUp/addUser", "POST", user.accessToken, [userInfo], null, errorHandler("Could Not Add Staff Member", setError))
                    fetcher("/staff/addStaff", "POST", user.accessToken, staffInfo, null, errorHandler("Could Not Add Staff Member", setError));
                    Update(Math.random() * 1000000);

                }}>Hire Staff Member</button>}
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    )
}
