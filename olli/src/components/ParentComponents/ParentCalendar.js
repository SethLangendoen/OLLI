import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import EventsList from './ParentEvents';
import ParentNavBar from '../NavBars/ParentNavBar';
import "../../CSS/Calendar/calendar.css"
import axios from 'axios'
const eventPhotoPath = "../../assets/EventPhotos";



const localizer = momentLocalizer(moment);

const MyCalendar = ({ user: initialUser }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const updatedImageContext = require.context('../../assets/EventPhotos', false, /\.(png|jpg|jpeg|gif|svg)$/);
    const [file, setFile] = useState(updatedImageContext.keys().map(updatedImageContext));
    const [user, setUser] = useState(initialUser); // Declaring the user state and setUser

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        fetchEvents(); // load all of the events into the calendar. 
    }, [user]) // empty array to run only once (when the component mounts)

    const fetchEvents = async () => {
        try {
            const response = await fetch(`/events/getAllEvents`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${user.accessToken}`
                }
            });
            if (!response.ok) {
                console.error("Failed to get all events");
                return;
            }
            const data = await response.json();
            if (data.error) {
                console.error("Error getting all events");
                return;
            }
            console.log('This is the data. ' + JSON.stringify(data))
            setEvents(JSON.stringify(data)); // [{}] // data is an array of objects I believe. 

            if (Array.isArray(data)) { // Check if data is an array

                const eventsWithDateObjects = data.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));

                setEvents(eventsWithDateObjects); // Set events to the array data

            } else {
                console.error("Data is not an array:", data);
            }

        } catch (error) {
            console.error("Error getting all events:", error);
            return;
        }
    }




    return (
        <div>
            <ParentNavBar user={user} />
            <div>
                <h1 className="calendarTitle">Welcome to the OLLI Calendar!</h1>
            </div>
            <div className="containingDiv">
                <Calendar
                    // selectable
                    // onSelectSlot={handleSelectSlot}
                    // onSelectEvent={handleSelectEvent}
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ margin: '50px' }}
                />
                <EventsList events={events} user={user} />
            </div>
        </div>
    );
};

export default MyCalendar;
