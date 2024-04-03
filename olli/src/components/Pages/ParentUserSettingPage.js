import React, { useEffect, useState } from 'react'
import UserSettings from '../UserSettings/UserSettings'
import ParentNavBar from '../NavBars/ParentNavBar'

export default function ParentUserSettingPage() {

    const [user, setUser] = useState([])
    useEffect(() => {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    
    return (
        <div>
            <ParentNavBar user={user} />
            <UserSettings />
        </div>
    )
}
