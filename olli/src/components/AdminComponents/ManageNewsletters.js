import React, { useEffect, useState } from 'react'
import PdfLoader from "./PDFLoader"
import axios from 'axios'
import AdminNavBar from '../NavBars/AdminNavBar'



export default function ManageNewsletters() {

    const [user, setUser] = useState()
    const updatedPdfContext = require.context('../../assets/Newsletters', false, /\.pdf$/);
    const [pastNewsletter, setPastNewsletter] = useState([])
    const [currentletter, setCurrentNewsletter] = useState()
    const [file, setFile] = useState()
    const [errorMessage, setErrorMessage] = useState("")
    const [pdfFiles, setPdfFiles] = useState(updatedPdfContext.keys().map(updatedPdfContext));
    const localPath = "../../assets/Newsletters/"



    // Fetches the newsletter
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])


    useEffect(() => {
        if (user) {
            fetchPastLetters()
            fetchCurrentLetter()
        }
    }, [user])

    async function fetchPastLetters() {
        const response = await fetch("/newsletters/getPast", {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.accessToken}`,
            }
        })
        if (!response.ok) {
            setErrorMessage("No Past Newsletters Found");
            return;
        }
        const data = await response.json()

        setPastNewsletter(data);
    }

    async function fetchCurrentLetter() {
        const response = await fetch("/newsletters/getCurrent", {
            headers: {
                "Content-Type": "application/json",

            }

        })
        if (!response.ok) {
            setErrorMessage("Current Newsletter Not Found");
            return;
        }
        const currentData = await response.json();
        setCurrentNewsletter(currentData);

        const updatedPdfFiles = updatedPdfContext.keys().map(updatedPdfContext);
        setPdfFiles(updatedPdfFiles);

    }

    async function setCurrent(image_name) {
        const response = await fetch(`/setCurrent/${image_name}`, {
            method: "PUT",
            headers: {

                "Content-Type": "application/json",
                authorization: `Bearer ${user.accessToken}`,
            }

        })
        if (!response.ok) {
            setErrorMessage(`Could Not Set Current Letter to ${image_name}`);
            return;
        }
    }

    async function addLetter(image_name, path) {
        const response = await fetch("/newsletters/addNewsletter", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify({ image_name: image_name, path: path })

        })
        if (!response.ok) {
            setErrorMessage("Could not add Newsletter");
            return;
        }
        fetchPastLetters()
        fetchCurrentLetter()
    }
    async function createFile(data) {
        await axios.post('http://localhost:8080/email/createFile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${user.accessToken}` // Include JWT token in the Authorization header
            }
        })

    }

    async function sendEmail(path) {


        const response = await fetch('/email/sendNewsLetter', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify({ path: path })

        })
        if (!response.ok) {
            setErrorMessage("Could Email the Newsletter");
            return;
        }

    }

    function handleFileInput(event) {
        const file = event.target.files[0]

        setFile(file)

    }

    function uploadFile() {

        if (!file) {
            setErrorMessage("No File Selected")
            return
        }

        const filePath = localPath + `${file.name}`;
        const formData = new FormData()
        formData.append('file', file)

        createFile(formData)
        addLetter(file.name, filePath)
        sendEmail(file.name)

    }
    function refreshPage() {
        window.location.reload();
    }


    async function setCurrent(image_name) {
        console.log(image_name)
        await fetch(`/newsletters/setCurrent/${image_name}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.accessToken}`,
            }
        })
        fetchCurrentLetter()
        fetchPastLetters()
    }

    async function deleteLetter(image_name) {
        await fetch(`/newsletters/remove/${image_name}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.accessToken}`,
            }
        })
        fetchPastLetters()

    }
    return (
        <div>
            <AdminNavBar user={user} />
            <h1> Manage Newsletters</h1>
            <h2>Current NewsLetters</h2>

            {currentletter && <PdfLoader fileName={require("../../assets/Newsletters/" + currentletter.image_name)} />}

            <h2>Past Newsletters</h2>

            {pdfFiles && pdfFiles.map((letter, index) => (

                <div key={letter.image_name}>
                    <PdfLoader fileName={pdfFiles[index]} />
                    {pdfFiles.length > 0 && <button onClick={() => { setCurrent(pdfFiles[index].split('/')[3].split('.')[0] + ".pdf") }}>Set {pdfFiles[index].split('/')[3].split('.')[0] + ".pdf"} To Current Letter</button>}
                    {pdfFiles.length > 0 && <button onClick={() => { deleteLetter(pdfFiles[index].split('/')[3].split('.')[0] + ".pdf") }}>Delete {pdfFiles[index].split('/')[3].split('.')[0] + ".pdf"} </button>}
                </div>

            ))}

            <h2>Upload Newsletter</h2>
            <input type="file" accept="application/pdf" onChange={(e) => (handleFileInput(e))} /><br />

            <button onClick={() => { uploadFile() }}>Upload</button>

            {errorMessage}

        </div>
    )
}
