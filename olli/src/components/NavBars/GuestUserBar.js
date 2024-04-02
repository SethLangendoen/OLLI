import React from "react";
import NavBar from "./NavBar.js";
import NavButton from "./NavButton.js";
import homeImage from "./home.png"; // Import the image
import calender from "./calendar.png";
import info from "./info.png";
import email from "./email.png";
import events from "./favorite.png";
import news from "./newspaper.png";

export default function GuestUserBar({ user }) {
    const buttons = [
        <img src={homeImage} alt="Logo" className="home" />,
        <NavButton key="1" name="Home" linkTo="/" />,
        // <img src={calender} alt="Logo" className="calendar" />,
        // <NavButton key="2" name="Calendar" linkTo="/calendar" />,
        <img src={info} alt="Logo" className="info" />,
        <NavButton key="3" name="About Us" linkTo="about-us-container" scrollLink={true} />,
        <img src={news} alt="Logo" className="newspaper" />,
        <NavButton key="6" name="News" linkTo="news" scrollLink={true} />,
        <img src={events} alt="Logo" className="events" />,
        <NavButton key="5" name="Events" linkTo="eventSection" scrollLink={true} />,
        <img src={email} alt="Logo" className="email" />,
        <NavButton key="4" name="Contact Us" linkTo="ContactUsDiv" scrollLink={true} />,

    ]
    return (
        <NavBar userSpecificButtons={buttons} user={user}></NavBar>

    );
}

