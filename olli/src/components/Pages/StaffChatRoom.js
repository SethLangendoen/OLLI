import React, { useEffect, useState } from 'react'
import ChatRoom from './ChatRoom'
import StaffNavBar from '../NavBars/StaffNavBar'

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
            <StaffNavBar user={user} />
            <ChatRoom />
        </div>
    )
}
