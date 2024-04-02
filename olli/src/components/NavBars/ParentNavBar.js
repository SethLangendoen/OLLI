import React from 'react'
import NavBar from "./NavBar.js";
import NavButton from "./NavButton.js";

export default function ParentNavBar({ user }) {
    const buttons = [
        <NavButton
            name={"Calender/Events"}
            linkTo={"/parentCalender"}
            scrollLink={false}
        />,
        <NavButton
            name={"My Family Members"}
            linkTo={"manageSNContainer"}
            scrollLink={true}
        />,
        <NavButton
            name={"User Settings"}
            linkTo={"/parentuserSettings"}
            scrollLink={false}
        />,
        // <NavButton
        //     name={"Events"}
        //     linkTo={"/parentEvents"}
        //     scrollLink={false}
        // />,

        <NavButton
            name={"Chat"}
            linkTo={"/chat"}
            scrollLink={false}
        />
    ]

    return (
        <NavBar
            userSpecificButtons={buttons}
            user={user}
        />
    )
}
