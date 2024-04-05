import { useState, useEffect } from "react";
import "../../CSS/Calendar/events.css"
import Participants from "./participants";
const eventImagePath = "../../assets/EventPhotos/";

export default function EventsList({ events, user }) {
    const updatedImageContext = require.context('../../assets/EventPhotos', false, /\.(png|jpg|jpeg|gif|webp|svg)$/);
    const [file, setFile] = useState(updatedImageContext.keys().map(updatedImageContext))
    const [participants, setParticipants] = useState([]);

    // set the participants when the component mounts. 
    useEffect(() => {
        // this will be used to populate the currently signed up users. 
        setParts();
    }, [user])

    // get the participants for each event: 
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
            console.log('This is the participant data: ' + JSON.stringify(data))
            setParticipants(data);
            // console.log('participants: ' + participants);

        } catch (error) {
            console.error("Error signing up participant:", error);
            return;
        }
    }

    return (
        <div className="events-container">
            {events && (
                <div>
                    <h1 className="events-title">Upcoming Events:</h1>
                    <div className="events-wrapper">
                        {events.map((event) => (
                            <div key={event.id} className="event-card">
                                <h2 className="event-title">{event.title}</h2>
                                <p className="event-description">{event.descrip}</p>
                                <p className="event-time">Start: {event.start.toLocaleString()}</p>
                                <p className="event-time">End: {event.end.toLocaleString()}</p>
    
                                <Participants participants={participants} title={event.title} />
    
                                {/* Iterate through images and find the one corresponding to event.path */}
                                {event.path && file.map((imagePath) => {
                                    try {
                                        const imageName = imagePath.split('/')[3].split('.')[0];
                                        // const imageSuffix = imagePath.split('.')[2]
    
                                        if (event.path.includes(imageName)) {
                                            return (
                                                <img
                                                    key={imagePath}
                                                    src={imagePath}
                                                    alt={event.title}
                                                    className="event-image"
                                                />
                                            );
                                        }
                                    } catch (e) {
                                        console.log('Error' + e);
                                    }
                                    return null;
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
