import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import EventsList from './Events';
import AdminNavBar from '../NavBars/AdminNavBar';
import "../../CSS/Calendar/calendar.css"
const eventPhotoPath = "../../assets/EventPhotos";

const localizer = momentLocalizer(moment);

const MyCalendar = (user) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);


  useEffect(() => {
    fetchEvents(); // load all of the events into the calendar. 
  }, []) // empty array to run only once (when the component mounts)

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
        setEvents(data); // Set events to the array data
      } else {
        console.error("Data is not an array:", data);
      }


    } catch (error) {
      console.error("Error getting all events:", error);
      return;
    }
  }



  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('Enter event title:');
    const description = window.prompt('Enter event description: ');
    const shortDescription = window.prompt('Enter the short description: ')

    if (title && description) {
      const newEvent = {
        id: events.length + 1,
        start,
        end,
        title,
        description,
        shortDescription,
        file: null // Initialize file as null for the new event
      };

      setEvents([...events, newEvent]);
    }
  };



  const deleteEvent = async (title) => {
    console.log("Deleting: " + title);
    try {
      const response = await fetch(`/events/deleteEvent`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          title: title,
        })
      });
      if (!response.ok) {
        console.error("Failed to delete user");
        return;
      }
      const data = await response.json();
      if (data.error) {
        console.error("Error deleting user");
        return;
      }
      fetchEvents();
    } catch (error) {
      console.error("Error deleting user:", error);
      return;
    }
  };


  const addEvent = async (eventToAdd) => {
    console.log('Sending the data: ' + eventToAdd.title + ' ' + eventToAdd.description + ' ' + eventToAdd.shortDescription + ' ' + eventToAdd.filePath + ' ' + eventToAdd.start);

    try {
      // const imageBlobHex = await blobToHex(eventToAdd.file);
      const response = await fetch(`/events/addEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          title: eventToAdd.title,
          descrip: eventToAdd.description,
          shortDescrip: eventToAdd.shortDescription,
          path: eventToAdd.filePath || 'noImage',
          start: eventToAdd.start,
          end: eventToAdd.end
        })
      });

      if (!response.ok) {
        console.error("Failed to add event");
        return;
      }
      if (response.ok && eventToAdd.filePath) { // the event was added and there is an image for associated to it. 

      }


      const data = await response.json();
      if (data.error) {
        console.error("Error adding event");
        return;
      }
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      return;
    }
  };




  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  const handleAddEvent = (eventToAdd) => {
    addEvent(eventToAdd);
  }


  const handleDeleteEvent = (eventToDelete) => {
    if (window.confirm(`Are you sure you want to delete the event "${eventToDelete.title}"?`)) {
      deleteEvent(eventToDelete.title); // using the title to delete the event. 
      const updatedEvents = events.filter((ev) => ev.id !== eventToDelete.id);
      setEvents(updatedEvents);
      setSelectedEvent(null);
    }
  };



  // Adds the complete file path to an event.
  const handleFileChange = (event) => {
    console.log("handleFileChange called");
    const file = event.target.files[0];
    const fileName = file.name; // Get the file name
    const fileExtension = fileName.split('.').pop(); // Extract the file extension
    const completeFilePath = `${eventPhotoPath}/${fileName}.${fileExtension}`; // Combine eventPhotoPath, fileName, and fileExtension
    console.log("Complete file path: " + completeFilePath);

    const reader = new FileReader();

    reader.onload = () => {
      const filePath = reader.result; // Store the file path
      const updatedEvents = events.map((ev) => {
        if (ev.id === selectedEvent.id) {
          return { ...ev, filePath: completeFilePath }; // Update the filePath property of the selected event with the complete file path
        }
        return ev;
      });
      setEvents(updatedEvents);
    };
    reader.readAsDataURL(file); // Read file as data URL
  };





  return (
    <div>
      <AdminNavBar />
      <div>
        <h1 className="calendarTitle">Welcome to the OLLI Calendar!</h1>
      </div>
      <div className="containingDiv">
        <Calendar
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: '50px' }}
        />
        {selectedEvent && (
          <div className="event-details">
            <h1>You have selected this event: </h1>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.descrip}</p>
            <p>{selectedEvent.short_descrip}</p>
            <p>Start: {selectedEvent.start.toLocaleString()}</p>
            <p>End: {selectedEvent.end.toLocaleString()}</p>
            <input type="file" onChange={handleFileChange} />
            {selectedEvent.filePath && (
              <img src={URL.createObjectURL(selectedEvent.filePath)} alt="Selected" style={{ maxWidth: '100%' }} />
            )}
            <button onClick={() => handleDeleteEvent(selectedEvent)}>Delete Event</button>
            <button onClick={() => handleAddEvent(selectedEvent)}>Save and publish this event</button>
          </div>
        )}
        <EventsList events={events} />

      </div>
    </div>
  );
};

export default MyCalendar;