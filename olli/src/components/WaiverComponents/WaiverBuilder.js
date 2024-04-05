import React, { useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import "../../CSS/Waiver/WaiverBuilder.css"

export default function WaiverBuilder() {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [waivers, setWaivers] = useState();
    const [events, setEvents] = useState()
    const [signed, setSigned] = useState([])
    const [sWaivers, setsWaivers] = useState([])
    const [final, setFinal] = useState([])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetcher("/waiver/getAllWaivers", "GET", storedUser.accessToken, null, setWaivers, () => { alert("Could Not Fetch Waivers") })
        fetcher("/events/getAllEvents", "GET", storedUser.accessToken, null, setEvents, () => { alert("Could Not Fetch Waivers") });
        fetcher("/signed/getSignedWaivers", "GET", storedUser.accessToken, null, setSigned, () => { })
    }, []);

    useEffect(() => {
        if (signed.length > 0) {
            signed.forEach(element => {
                getWaivers(element.waiver_title)
            });
        }
    }, [signed])

    useEffect(() => {
        if (sWaivers.length > 0) {
            const uniqueArray = Array.from(new Map(sWaivers.map(obj => [JSON.stringify(obj), obj])).values());
            setFinal(uniqueArray)
        }
    }, [sWaivers])

    async function getWaivers(title) {
        const response = await fetch(`/waiver/getWaiver/${title}`)
        const data = await response.json()
        setsWaivers(prev => [...prev, data])
    }

    const convertBlobToDataURI = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    async function fetcher(url, method, accessToken, body, setter, errorHandler) {
        let response;
        if (method === "GET") {
            response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`
                },
            });
        } else {
            response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(body)
            });
        }

        if (!response.ok) {
            errorHandler();
            return;
        } else if (setter) {
            const data = await response.json();
            setter(data);
        }
    }

    const handleCreateWaiver = () => {
        if (title === "" || description === "") {
            alert("You Must Enter a Title and Description")
            return
        }
        const body = {
            title: title,
            description: description
        };

        fetcher("/waiver/addWaiver", "POST", user.accessToken, body, null, errorHandler);
        fetcher("/waiver/getAllWaivers", "GET", user.accessToken, null, setWaivers, () => { alert("Could Not Fetch Waivers") })
    };

    const errorHandler = () => {
        return () => { alert("Could Not Create Waiver") }
    };

    return (
        <div className="waiver-builder-container">
            <h1 className="title">Select Title of The Waiver</h1>
            <select className="select" onChange={(e) => { setTitle(e.target.value) }}>
                <option value="" selected disabled>Select an option</option>
                {events && events.map(event => (
                    <option value={event.title}>{event.title}</option>
                ))}
            </select>
            <input className="inputlol" type="text" placeholder='Select an option above' value={title} onChange={(e) => setTitle(e.target.value)} disabled />
            <h1 className="title">Enter Description of the Waiver</h1>
            <input className="inputlol" type="text" placeholder='Write a description for the waiver' value={description} onChange={(e) => setDescription(e.target.value)} />
            <button className="createbutton" onClick={handleCreateWaiver}>Create Waiver</button>
            <h1 className="title">Current Waivers</h1>
            {waivers && waivers.map(wavier => (
                <div className="waiver-item">
                    <h2 className="waiver-title">{wavier.title}</h2>
                    <p className="waiver-description">{wavier.description}</p>
                    <button className="delete-button" onClick={() => {
                        fetcher(`/waiver/deleteWaiver/${wavier.title}`, "DELETE", user.accessToken, {}, null, () => { alert("Could not Delete Waiver") });
                        fetcher("/waiver/getAllWaivers", "GET", user.accessToken, null, setWaivers, () => { alert("Could Not Fetch Waivers") })
                    }}>Delete Waiver {wavier.title}</button>
                </div>
            ))}
            <h1 className="title">Signed Waivers</h1>
            {final && final.map((wavier, index) => (
                <div className="signed-waiver">
                    <h2 className="signed-waiver-title">{wavier.title}</h2>
                    <p className="signed-waiver-email">{signed[index].email} has Signed this Waiver</p>
                    <p className="signed-waiver-description">{wavier.description}</p>
                    <img className="signed-waiver-image" src={wavier.signature} alt="" />
                </div>
            ))}
        </div>
    );
}
