import React from 'react';
import '../../CSS/SignUp/SignUp.css';
import { useState } from 'react';



const SignUpPage = ({ onLoginClick }) => {



  // these are for the special needs users.
  const [addUser, setAddUser] = useState(false);
  const [usernameSN, setUsernameSN] = useState('');
  const [firstNameSN, setFirstNameSN] = useState('');
  const [lastNameSN, setLastNameSN] = useState('');
  const [snUsersAdded, setSNUsersAdded] = useState([]);
  const [snSaveFailMessage, setSNSaveFailMessage] = useState('')
  const animalURLs = [require("../../assets/SnImages/lion.png"), require("../../assets/SnImages/bear.png"), require("../../assets/SnImages/panda.png"), require("../../assets/SnImages/moose.png"), require("../../assets/SnImages/sheep.png"), require("../../assets/SnImages/tiger.png")]
  const pureURLS = ["../../assets/SnImages/lion.png", "../../assets/SnImages/bear.png", "../../assets/SnImages/panda.png", "../../assets/SnImages/moose.png", "../../assets/SnImages/sheep.png", "../../assets/SnImages/tiger.png"]


  // these are for the regular guardians of the special needs users.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [saveFailMessage, setSaveFailMessage] = useState('')
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [selectedImages, setSelectedImages] = useState([]);


  // function used to open the content to add a new special needs user.
  function openAddUserContent() {
    setAddUser(!addUser);
    // This will need to load the guys that were added.
  }

  function saveSNUserToDatabase() {
    if (usernameSN == '') {
      setSNSaveFailMessage('You must enter a username');
    } else if (usernameSN.length < 8) {
      setSNSaveFailMessage('Your username must contain at least 8 characters');
    } else if (firstNameSN == '') {
      setSNSaveFailMessage('You must enter a first name');
    } else if (lastNameSN == '') {
      setSNSaveFailMessage('You must enter a last name');
    } else if (selectedImages.length < 2) {
      setSNSaveFailMessage('You must select two images for your password');
    } else {

      // saving the user into the snUsersAdded hook and resetting their information. 
      setSNUsersAdded([...snUsersAdded, { username: usernameSN.trim(), firstNameSN: firstNameSN.trim(), lastNameSN: lastNameSN.trim(), image1: selectedImages[0].url, image2: selectedImages[1].url }])
      console.log(snUsersAdded);
      setUsernameSN('');
      setFirstNameSN('');
      setLastNameSN('');
      setSNSaveFailMessage('');
      setSelectedImages([]);
    }
  }



  function deleteSNUser(index) {
    // Create a copy of the snUsersAdded array
    const updatedUsers = [...snUsersAdded];
    // Remove the user at the specified index
    updatedUsers.splice(index, 1);
    // Update the state with the new array without the deleted user
    setSNUsersAdded(updatedUsers);
  }


  function handleDeleteClick(e, index) {
    // Prevent the click event from propagating to the parent div
    e.stopPropagation();
    // Delete the user
    deleteSNUser(index);
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function checkInput() {
    if (email == '') {
      setSaveFailMessage('You must enter an email');
    } else if (!emailRegex.test(email)) {
      setSaveFailMessage('Incorrect email format');
    } else if (username == '') {
      setSaveFailMessage('You must enter a username');
    } else if (username.length < 8) {
      setSaveFailMessage('Your username must contain at least 8 characters');
    } else if (firstName == '') {
      setSaveFailMessage('You must enter a first name');
    } else if (lastName == '') {
      setSaveFailMessage('You must enter a last name');
    } else if (password == '') {
      setSaveFailMessage('You must enter a password');
    } else if (confPassword == '') {
      setSaveFailMessage('You must confirm the password');
    } else if (confPassword !== password) {
      setSaveFailMessage('The passwords must match');
    } else if (phoneNumber == '') {
      setSaveFailMessage('You must select a phone nuber')
    }

    else {
      setSaveFailMessage('');
      signUpUsers();
    }
  }




  // connecting to the backend:
  // Sign Up
  // url: /signUp/addUser
  // structure [{}, [{},{}....]]
  // child array can be empty
  // req.body info example
  // [{
  //   "email": "example3@example.com",
  //   "username": "pyke",
  //   "password": "123",
  //   "fName": "Pyke",
  //   "lName": "Lord",
  //   "user_type": "parent",
  //   "phone_number": "1234567890"
  // },
  //  [
  //  {
  //  "username": "child" ,
  //   "image1":"url",
  //   "image2":"url"
  //  },
  //  {
  //  "username": "child2" ,
  //   "image1":"url",
  //   "image2":"url"
  //  }
  // ]
  // ]
  // posssible errors:
  // { error: "Server Error: could not add user" }


  const parentUser = {
    username: username.trim(),
    password: password.trim(),
    email: email.trim(),
    fName: firstName.trim(),
    lName: lastName.trim(),
    user_type: "parent",
    phone_number: phoneNumber.trim()
  }



  function signUpUsers() {

    fetch('/signUp/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // user is a singular object, child is an array of objects.
      body: JSON.stringify([parentUser, snUsersAdded]),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log(data.error);
          setSaveFailMessage('This Email Already Exists');


        }
        if (!data.error) {
          setConfirmPassword("")
          setEmail("")
          setUsername("")
          setFirstName("")
          setLastName("")
          setPassword("")
          setPhoneNumber("")
          onLoginClick()
        }
      }
      )
  }



  // Cannot read properties of undefined (reading 'image1')



  var toggleImageSelection = (index, url) => {
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
      console.log(selectedImages);
    }
  };



  const ANSanitizer = (event, setFunc) => {
    // Sanitization logic
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9!@#$*_]/g, '');
    setFunc(sanitizedInput);
  };
  const FNLNSanitizer = (event, setFunc) => {
    // Sanitization logic
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z]/g, '');
    setFunc(sanitizedInput);
  };
  const EmailSanitizer = (event, setFunc) => {
    // Sanitization logic
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9@._-]/g, '');
    setFunc(sanitizedInput);
  };
  const PNSanitizer = (event, setFunc) => {
    // Sanitization logic
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^0-9]/g, '');
    setFunc(sanitizedInput);
  };



  return (
    <div>
      {/* <GuestUserBar /> */}

      <div className="signup-container">
        <div className="signup-box">
          <h2>Caregiver Sign Up</h2>
          <input type="text" id="email" name="email" placeholder="Email Address"
            value={email}
            onChange={(e) => EmailSanitizer(e, setEmail)}
          />
          <input type="text" id="username" maxLength="30" name="username" placeholder="Username"
            value={username}
            onChange={(e) => ANSanitizer(e, setUsername)}
          />
          <input type="text" id="guardian_full_name" name="guardian_full_name" placeholder="First name"
            value={firstName} maxLength='30'
            onChange={(e) => FNLNSanitizer(e, setFirstName)}
          />
          <input type="text" id="dependent_full_name" name="dependent_full_name" placeholder="Last name"
            value={lastName} maxLength='30'
            onChange={(e) => FNLNSanitizer(e, setLastName)}
          />
          <input type="password" id="password" name="password" placeholder="Password"
            value={password} maxLength='30'
            onChange={(e) => ANSanitizer(e, setPassword)}
          />
          <input type="password" id="confirm_password" maxLength="30" name="confirm_password" placeholder="Confirm Password"
            value={confPassword}
            onChange={(e) => { ANSanitizer(e, setConfirmPassword) }}
          />
          <input type="tel" id="phoneNumber" maxLength="11" name="phoneNumber" placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => PNSanitizer(e, setPhoneNumber)}
          />

          <input type="checkbox" id="consentCheckbox" name="consent" />
          <label for="consentCheckbox">I agree to receive emails</label>

          <p className="SNFailMessage">{saveFailMessage}</p>
          <button className="addSNbutton" onClick={() => openAddUserContent()}>Add Your Loved Ones</button>


          {addUser && (
            <div className="sn-signup">
              <h2>Attendee information</h2>
              <input type="text" id="username" name="username" placeholder="Username"
                value={usernameSN}
                onChange={(e) => ANSanitizer(e, setUsernameSN)}
              />
              <input type="text" id="firstName" name="lastname" placeholder="First name"
                value={firstNameSN}
                onChange={(e) => FNLNSanitizer(e, setFirstNameSN)}
              />
              <input type="text" id="lastName" name="lastname" placeholder="Last name"
                value={lastNameSN}
                onChange={(e) => FNLNSanitizer(e, setLastNameSN)}
              />

              <h3>Select 2 photos for the password</h3>

              {/* This portion will iterate through animals and colours and display them */}
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

              <p className="SNFailMessage1">{snSaveFailMessage}</p>
              <button className='saveBtn' onClick={() => saveSNUserToDatabase()}>Save This User</button>
            </div>

          )}

          {snUsersAdded && (
            <div>
              {snUsersAdded.map((user, index) => (
                <div key={index} className="savedSNUser" >
                  <p>Added {user.firstNameSN} {user.lastNameSN}</p>
                  <button className='deleteSNUser' onClick={(e) => handleDeleteClick(e, index)}>X</button>
                </div>
              ))}
            </div>
          )}

          <button className="register" onClick={() => { checkInput() }}>Register</button>
          <div className="signup-link">
            <p>Already have an account?</p>
            <a href="#login" className='login'
              onClick={() => { onLoginClick(); if (addUser) { openAddUserContent() } }}>Login</a>
          </div>

        </div>
      </div>
    </div >
  );
};



export default SignUpPage;