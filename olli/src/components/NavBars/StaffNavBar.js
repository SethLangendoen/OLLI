import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import NavButton from './NavButton'
export default function StaffNavBar() {
    const [user, setUser] = useState()
    const buttons = [
        <NavButton
            name={"Clock In/Out"}
            linkTo={"/staff"}
            scrollLink={false}
        />,
        <NavButton
            name={"User Settings"}
            linkTo={"/staffSettings"}
            scrollLink={false}
        />,
        <NavButton
            name={"Chat"}
            linkTo={"/staffchat"}
            scrollLink={false}
        />
    ]
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])
    return (
        <div>
            <NavBar userSpecificButtons={buttons} user={user} />

        </div>
    )
}

