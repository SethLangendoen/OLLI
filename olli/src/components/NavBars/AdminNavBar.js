import React from 'react';
import NavBar from './NavBar.js';
import NavButton from './NavButton.js';

export default function AdminNavBar({ user }) {
    const buttons = [
        <NavButton
            name={"Calendar"}
            linkTo={"/calender"}
            scrollLink={false}
        />,
        <NavButton
            name={"Manage Users"}
            linkTo={"/adminPage"}
            scrollLink={false}
        />,
        <NavButton
            name={"Manage Staff"}
            linkTo={"/manageStaff"}
            scrollLink={false}
        />,
        <NavButton
            name={"Manage Newsletters"}
            linkTo={"/manageNewsletters"}
            scrollLink={false}
        />,
        <NavButton
            name={"User Settings"}
            linkTo={"/adminuserSettings"}
            scrollLink={false}
        />


        // Add more NavButton components as needed for other functionalities
    ];

    return (
        <NavBar
            userSpecificButtons={buttons}
            user={user}
        />
    )
}