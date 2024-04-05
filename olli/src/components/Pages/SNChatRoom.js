import React, { useEffect, useState } from 'react'
import ChatRoom from './ChatRoom'
import SnNavBar from '../NavBars/SnNavBar'

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
            <SnNavBar user={user} />
            <ChatRoom />
        </div>
    )
}
