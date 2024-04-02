import React, { useEffect, useState } from 'react'
import StaffCard from './StaffCard'
import AddStaff from './AddStaff'
import EditStaff from './EditStaff'
import "../../CSS/AdminManagement/StaffMangement.css"

export default function ManageStaff() {
    const [user, setUser] = useState()
    const [update, setUpdate] = useState()
    const [onlineStaff, setOnlineStaff] = useState([])
    console.log(onlineStaff)

    const [onlineError, setOnlineError] = useState("")
    const [offlineStaff, setOfflineStaff] = useState([])
    const allStaff = [...onlineStaff, ...offlineStaff]
    const [offlineError, setOfflineError] = useState("")
    const [deleteError, setDeleteError] = useState("")
    const pngContext = require.context('../../assets/StaffPhotos', false, /\.png$/);
    const [staffImages, setStaffIamges] = useState(pngContext.keys().map(pngContext));


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])

    useEffect(() => {
        if (user) {
            fetcher('/staff/staffStatus/1', "GET", user.accessToken, {}, setOnlineStaff, errorHandler("There are no Online Staff", setOnlineError))
            fetcher('/staff/staffStatus/0', "GET", user.accessToken, {}, setOfflineStaff, errorHandler("There are no Offline Staff", setOfflineError))
        }

    }, [user, update])

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
    function getTimeDifference(startTime, endTime) {
        // Parse start time
        var startParts = startTime.split(":");
        var startHours = parseInt(startParts[0], 10);
        var startMinutes = parseInt(startParts[1], 10);
        var startSeconds = parseInt(startParts[2], 10);
        var startAMPM = startTime.split(" ")[1];

        // Adjust hours for AM/PM
        if (startAMPM === "PM" && startHours < 12) {
            startHours += 12;
        } else if (startAMPM === "AM" && startHours === 12) {
            startHours = 0;
        }

        // Parse end time
        var endParts = endTime.split(":");
        var endHours = parseInt(endParts[0], 10);
        var endMinutes = parseInt(endParts[1], 10);
        var endSeconds = parseInt(endParts[2], 10);
        var endAMPM = endTime.split(" ")[1];

        // Adjust hours for AM/PM
        if (endAMPM === "PM" && endHours < 12) {
            endHours += 12;
        } else if (endAMPM === "AM" && endHours === 12) {
            endHours = 0;
        }

        // Calculate the difference in seconds
        var startTotalSeconds = (startHours * 3600) + (startMinutes * 60) + startSeconds;
        var endTotalSeconds = (endHours * 3600) + (endMinutes * 60) + endSeconds;
        var differenceSeconds = endTotalSeconds - startTotalSeconds;

        // Convert difference to hours, minutes, seconds
        var hours = Math.floor(differenceSeconds / 3600);
        var minutes = Math.floor((differenceSeconds % 3600) / 60);
        var seconds = differenceSeconds % 60;
        console.log(seconds)
        return { hours: hours, minutes: minutes, seconds: seconds };
    }


    return (
        <div>
            <h1>Hire Staff</h1>
            <AddStaff Update={setUpdate} />
            <br />
            <h1>Fire Staff</h1>
            {allStaff && allStaff.map(staff => (
                <div>
                    <StaffCard email={staff.email} name={staff.name} wage={staff.wage} tHours={staff.clockIn && staff.clockOut ? getTimeDifference(staff.clockIn.split(" ")[4] + " " + staff.clockIn.split(" ")[5], staff.clockOut.split(" ")[4] + " " + staff.clockOut.split(" ")[5]) : ""} />
                    <button onClick={() => { fetcher(`/staff/deleteStaff/${staff.email}`, "DELETE", user.accessToken, {}, null, errorHandler(`Cannot Delete ${staff.name}`, setDeleteError)); setUpdate(Math.random() * 1000000); }}>Fire {staff.name}</button>
                </div>
            ))}
            <h3>{deleteError}</h3>
            <br />
            <h1>Edit Staff</h1>
            <EditStaff Update={setUpdate} changed={update} />
            <br />
            <h1>Online Staff</h1>
            {onlineStaff && onlineStaff.map(staff => (

                <StaffCard email={staff.email} name={staff.name} wage={staff.wage} tHours={staff.clockIn && staff.clockOut ? getTimeDifference(staff.clockIn.split(" ")[4] + " " + staff.clockIn.split(" ")[5], staff.clockOut.split(" ")[4] + " " + staff.clockOut.split(" ")[5]) : ""} url={"./emptyImage.png"} />
            ))}
            <h3>{onlineError}</h3><br />
            <h1>Offline Staff</h1>
            {offlineStaff && offlineStaff.map(staff => (
                <StaffCard email={staff.email} name={staff.name} wage={staff.wage} tHours={staff.clockIn && staff.clockOut ? getTimeDifference(staff.clockIn.split(" ")[4] + " " + staff.clockIn.split(" ")[5], staff.clockOut.split(" ")[4] + " " + staff.clockOut.split(" ")[5]) : ""} url={"./emptyImage.png"} />
            ))}
            <h3>{offlineError}</h3>
        </div>
    )

}
