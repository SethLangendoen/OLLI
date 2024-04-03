import React, { useEffect, useState } from 'react'
import UserSettings from '../UserSettings/UserSettings'
import AdminNavBar from '../NavBars/AdminNavBar'
export default function AdminUserSettingPage() {
    const [user, setUser] = useState([])
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <>
            <AdminNavBar user={user} />
            <UserSettings />
        </>
    )
}