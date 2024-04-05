import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import EventsList from './Events';
import AdminNavBar from '../NavBars/AdminNavBar';
import "../../CSS/Calendar/calendar.css"
import axios from 'axios'
const eventPhotoPath = "../../assets/EventPhotos";



const localizer = momentLocalizer(moment);

const MyCalendar = ({ user: initialUser }) => {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const updatedImageContext = require.context('../../assets/EventPhotos', false, /\.(png|jpg|jpeg|gif|svg)$/);
  const [file, setFile] = useState(updatedImageContext.keys().map(updatedImageContext))
  const [user, setUser] = useState(initialUser); // Declaring the user state and setUser

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchEvents(); // load all of the events into the calendar. 

    console.log('fetching all events')
  }, [user])


  const fetchEvents = async () => {
    console.log("This is the user: " + initialUser);
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

      // setEvents(JSON.stringify(data)); // [{}] // data is an array of objects I believe. 
      // createEvents(JSON.stringify(data));
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
      // createEvents([...events, newEvent]);
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

      fetchEvents();
    } catch (error) {
      console.error("Error deleting user:", error);
      return;
    }
  };



  const addEvent = async (eventToAdd) => {
    console.log('Sending the data: ' + eventToAdd.title + ' ' + eventToAdd.description + ' ' + eventToAdd.shortDescription + ' ' + eventToAdd.filePath + ' ' + eventToAdd.start);
    // check wether there is an existing event already.

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
          path: eventToAdd.path || 'noImage',
          start: eventToAdd.start,
          end: eventToAdd.end
        })
      });

      if (!response.ok && eventToAdd.path) { // They are just updating the image. 
      }


      if (!response.ok) {
        console.error("Failed to add event");
        alert("This event has already been published!");
        // instead of this, we should call another function that simply just updates the image of an event. 
        return;
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




  const updatePhoto = async (eventToAdd) => {

    console.log('updating photo');
    try {
      // const imageBlobHex = await blobToHex(eventToAdd.file);
      const response = await fetch(`/events/updateEventPhoto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          title: eventToAdd.title,
          path: eventToAdd.path || 'noImage',
        })
      });

      if (!response.ok && eventToAdd.path) { // They are just updating the image. 
      }


      if (!response.ok) {
        console.error("Failed to add event");
        alert("Failed to update photo");
        return;
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

  }




  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log("This is the event: " + JSON.stringify(event));

  };
  const handleAddEvent = (eventToAdd) => {
    addEvent(eventToAdd);
  }

  const handleUpdatePhoto = (eventToAdd) => {
    updatePhoto(eventToAdd);
  }


  const handleDeleteEvent = (eventToDelete) => {
    if (window.confirm(`Are you sure you want to delete the event "${eventToDelete.title}"?`)) {
      deleteEvent(eventToDelete.title); // using the title to delete the event. 
      // const updatedEvents = events.filter((ev) => ev.id !== eventToDelete.id);
      // setEvents(updatedEvents);
      setSelectedEvent(null);
    }
  };








  // posts a photo to the EventsPhotos directory using a backend function. 
  const postEventPhoto = async (data) => {
    await axios.post('http://localhost:8080/events/uploadImage', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user.accessToken}` // Include JWT token in the Authorization header
      }
    })
  }

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
      const updatedEvents = events.map((ev) => {

        if (ev.title === selectedEvent.title) {
          console.log('UPDATING Image path');
          return { ...ev, path: completeFilePath }; // Update the filePath property of the selected event with the complete file path
        }
        return ev;
      });


      // creating data to send to the backend to be published to the directory on the front end....
      const formData = new FormData();
      formData.append('file', file);
      postEventPhoto(formData);

      // once we have mapped an image to an event, add it to the file directory EventPhotos: 
      setSelectedEvent({ ...selectedEvent, path: completeFilePath });
      console.log("Current selected event with image path: " + JSON.stringify(selectedEvent));
      setEvents(updatedEvents);
      // createEvents(updatedEvents);
    };
    reader.readAsDataURL(file); // Read file as data URL
  };





  return (
    <div>
      <AdminNavBar user={user} />
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

            <p>Start: {selectedEvent.start.toLocaleString()}</p>
            <p>End: {selectedEvent.end.toLocaleString()}</p>
            <input type="file" onChange={handleFileChange} />

            {selectedEvent.path && file.map((imagePath) => {
              try {
                const imageName = imagePath.split('/')[3].split('.')[0];
                // const imageSuffix = imagePath.split('.')[2]
                if (selectedEvent.path.includes(imageName)) {
                  return (
                    <img
                      key={imagePath}
                      src={imagePath}
                      style={{ maxWidth: '100%' }}
                    />
                  );
                }
              } catch (e) {
                console.log('Issues' + e);
              }
              return null;
            })}



            <button onClick={() => handleDeleteEvent(selectedEvent)}>Delete Event</button>
            <button onClick={() => handleUpdatePhoto(selectedEvent)}>Update To Selected Photo</button>
            <button onClick={() => handleAddEvent(selectedEvent)}>Save and publish this event</button>
          </div>
        )}

        <EventsList events={events} user={user} />

      </div>
    </div>
  );
};

export default MyCalendar;
