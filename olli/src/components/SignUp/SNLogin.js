import { React, useState, useEffect } from 'react';
import '../../CSS/SignUp/SNLogin.css';
import { useNavigate } from "react-router-dom";


export default function SNLogin({ setUser, onLoginClick }) {

    const [SNUsername, setSNUsername] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const pureURLS = ["../../assets/SnImages/lion.png", "../../assets/SnImages/bear.png", "../../assets/SnImages/panda.png", "../../assets/SnImages/moose.png", "../../assets/SnImages/sheep.png", "../../assets/SnImages/tiger.png"]
    const animalURLs = [require("../../assets/SnImages/lion.png"), require("../../assets/SnImages/bear.png"), require("../../assets/SnImages/panda.png"), require("../../assets/SnImages/moose.png"), require("../../assets/SnImages/sheep.png"), require("../../assets/SnImages/tiger.png")]
    const [snSaveFailMessage, setSNSaveFailMessage] = useState('')
    const navigate = useNavigate();
    const ANSanitizer = (event, setFunc) => {
        // Sanitization logic
        const userInput = event.target.value;
        const sanitizedInput = userInput.replace(/[^a-zA-Z0-9!@#$*_]/g, '');
        setFunc(sanitizedInput);
    };



    const toggleImageSelection = (index, url) => {
        // Check if the image is already selected
        const isSelected = selectedImages.findIndex(image => image.index === index) !== -1;
        // If the image is not already selected and less than 2 images are selected, add it
        if (!isSelected && selectedImages.length < 2) {
            const newImageSelected = { index, url };
            setSelectedImages([...selectedImages, newImageSelected]);
            console.log(selectedImages);
        } else { // If the image is already selected, remove it
            const updatedSelectedImages = selectedImages.filter(image => image.index !== index);
            setSelectedImages(updatedSelectedImages);

        }
    };




    async function handleLogin() {

        if (selectedImages.length === 0 || selectedImages.length === 1) {
            setSNSaveFailMessage("Invalid Username or Password")
            return
        }

        const response = await fetch('/login/SNUserLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // user is a singular object, child is an array of objects.

            body: JSON.stringify({ username: SNUsername, image1: selectedImages[0].url, image2: selectedImages[1].url }),
        })



        if (!response.ok) { // the fetch was not ok (some sort of server issue)
            setSNSaveFailMessage('Invalid Username or Password')
            return
        }
        const responseData = await response.json();
        if (responseData.error) { // Could not find the user in the table 
            setSNSaveFailMessage('Invalid Username or Password')
            return
        }

        // successful login
        localStorage.setItem('user', JSON.stringify(responseData));
        setUser(responseData)
        setSNSaveFailMessage('');
        navigate('/snPage')
    }

    return (
        <div id="SNSignupContainer">
            <h1>Special Needs User Login</h1>
            <input type="text" id="username" maxLength="30" name="username" placeholder="Username"
                value={SNUsername}
                onChange={(e) => ANSanitizer(e, setSNUsername)}
            />
            <h2>Select Your 2 Image Password</h2>
            <div id='animalPasswordPhotos'>
                {animalURLs.map((url, index) => (
                    <div
                        key={index}
                        className={selectedImages.some(image => image.index === index) ? 'animalPhoto selected' : 'animalPhoto'}
                        onClick={() => toggleImageSelection(index, pureURLS[index])}
                    >
                        <img src={(url)} />
                    </div>
                ))}
            </div>
            <p className='FailMessage'>{snSaveFailMessage}</p>
            <button className='loginBtn' onClick={handleLogin}>Login</button>
            <button className='backBtn' onClick={onLoginClick}>Back to User Login</button>
        </div>
    )
}