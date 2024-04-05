import React, { useEffect, useState } from 'react'
import ChatRoom from './ChatRoom'
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
            <ChatRoom />
        </div>
    )
}
