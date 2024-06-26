// This component will display all events and allow for event signup.
import "../../CSS/Calendar/events.css"

import EventWaiver from "./EventWaiver";
// path to event images folder: 
import { useState, useEffect } from "react";

export default function EventsList({ events, user }) {
    const updatedImageContext = require.context('../../assets/EventPhotos', false, /\.(png|jpg|jpeg|gif|webp|svg)$/);
    const [file, setFile] = useState(updatedImageContext.keys().map(updatedImageContext))
    // const [signup, setSignup] = useState(false); 
    const [pick_time, setPick_time] = useState(''); // pickup date
    const [drop_time, setDrop_time] = useState(''); // dropoff date. 
    const [username, setUsername] = useState(''); // stores the username of the SN user that is signing up
    const [participants, setParticipants] = useState([]);
    const [showDetails, setShowDetails] = useState([]);


    // const [tempEventParts, setTempEventParts] = useState([]);


    useEffect(() => {
        // this will be used to populate the currently signed up users. 
        setParts();
    }, [])



    // need to get all of the people signed up for an associated 
    // participants
    // pick_time VARCHAR(255) NOT NULL,
    // drop_time VARCHAR(255) NOT NULL,
    // title VARCHAR(64) NOT NULL,
    // username VARCHAR(255) NOT NULL,

    // PRIMARY KEY (title, username),  
    // FOREIGN KEY (title) REFERENCES events(title),  
    // FOREIGN KEY (username) REFERENCES sn(username) 
    const setParts = async () => {
        console.log('setting parts');
        try {
            const response = await fetch(`/events/getAllParticipants`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${user.accessToken}`
                }
            });
            if (!response.ok) {
                console.error("Failed to get all participants");
                return;
            }
            const data = await response.json();


            if (data.error) {
                console.error("Error signing up participant");
                return;
            }

            // successful participant retrieval
            console.log('This is the participant data: . ' + JSON.stringify(data))
            setParticipants(data);

        } catch (error) {
            console.error("Error signing up participant:", error);
            return;
        }
    }


    // called when the user's click the sign up button 
    function handleSignup(eventTitle) {
        signUpParticipant(eventTitle);
    }





    const signUpParticipant = async (eventTitle) => {

        if (!pick_time || !drop_time || !username) {
            console.log("This is the user: " + user.user);

            console.log(' Sign up information: ' + pick_time + ' ' + drop_time + ' ' + username);
            alert('you must enter all information to sign up for an event!');
            return;
        }
        try {
            const response = await fetch(`/events/eventSignUp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({
                    // const { pickTime, dropTime, title, username } = req.body;
                    pickTime: pick_time,
                    dropTime: drop_time,
                    title: eventTitle,
                    username: username,
                })
            });
            if (!response.ok) {
                console.error("Failed to sign up participant");
                alert('Error singing up participant');
                return;
            }
            const data = await response.json();
            if (data.error) {
                console.error("Error signing up participant");
                return;
            }

            alert('successful user signup')

            console.log('This is the data. ' + JSON.stringify(data.message))

        } catch (error) {
            console.error("Error signing up participant:", error);
            return;
        }
    }





    function handleDrop(dropTime) {
        setDrop_time(dropTime);
    }
    function handlePick(pickTime) {
        setPick_time(pickTime);
    }
    function handleUsername(username) {
        setUsername(username);
    }
    const handleToggleDetails = (eventTitle) => {
        setShowDetails(prevState => {
            if (prevState.includes(eventTitle)) {
                return prevState.filter(title => title !== eventTitle); // Remove eventId if it's already in the array
            } else {
                return [...prevState, eventTitle]; // Add eventId if it's not in the array
            }
        });
    };

    return (
        <div className="events-list">
            {events && (
                <div>
                    <h1 className="events-list-title">Upcoming Events</h1>
                    <div className="events-container">
                        {events.map((event) => (
                            <div className="event" key={event.id}>
                                <div className="event-info">
                                    <h2 className="event-title">{event.title}</h2>
                                    <p className="event-description" style={{ maxWidth: '50rem' }}>{event.descrip}</p> {/* Set max width */}
                                    <p className="event-start">Start: {event.start.toLocaleString()}</p>
                                    <p className="event-end">End: {event.end.toLocaleString()}</p>
                                    <button className="toggle-details" onClick={() => handleToggleDetails(event.title)}>
                                        {showDetails.includes(event.title) ? 'Hide Details' : 'Show Details'}
                                    </button>
                                    {showDetails.includes(event.title) && (
                                        <>
                                            <p>Drop off time: <input className="time-input" type='time' onChange={(e) => handleDrop(e.target.value)}></input></p>
                                            <p>Pick up time: <input className="time-input" type='time' onChange={(e) => handlePick(e.target.value)}></input></p>
                                            <p>Loved one's username: <input className="username-input" type='text' placeholder="Type your loved one's username here" onChange={(e) => handleUsername(e.target.value)}></input></p>
                                            <EventWaiver eventTitle={event.title} />
                                            <p>Sign up your loved one <button className="signup-button" onClick={() => handleSignup(event.title)}>Sign Up</button></p>
                                        </>
                                    )}
                                </div>
                                <div className='event-image'>
                                    {event.path && file.map((imagePath) => {
                                        try {
                                            const imageName = imagePath.split('/')[3].split('.')[0];
                                            if (event.path.includes(imageName)) {
                                                return (
                                                    <img
                                                        key={imagePath}
                                                        src={imagePath}
                                                        className="event-image"
                                                        alt="Event"
                                                    />
                                                );
                                            }
                                        } catch (e) {
                                            console.log('error ' + e)
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}