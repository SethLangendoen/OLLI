import React, { useState, useEffect } from 'react';
import { useFetcher, useNavigate } from "react-router-dom";

import SignUpPage from '../SignUp/signUp';
import SNLogin from '../SignUp/SNLogin';

import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../CSS/Login/Login.css';
import imageSrc from "../../CSS/Login/im1.png";

function LoginPage({ setUser }) {
  const [isSignUpClicked, setIsSignUpClicked] = useState(false);
  const [isSNLoginClicked, setIsSNLoginClicked] = useState(false);
  const [isLoginClicked, setIsLoginClicked] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 800
    });
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSignUpClick = () => {
    setIsSignUpClicked(true);
  };

  const handleSNLogin = () => {
    setIsSNLoginClicked(true);
    setIsLoginClicked(false);
  };

  const handleLoginClick = () => {
    setIsSignUpClicked(false);
    setIsSNLoginClicked(false);
    setIsLoginClicked(true);
  };
  async function fetcher(url, method, accessToken, body, setter, errorHandler) {
    let response;
    if (method === "GET") {
      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`
        },

      })
    }
    else {
      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      })
    }

    if (!response.ok) {
      errorHandler()
      return;
    }
    else if (setter) {
      const data = await response.json()
      setter(data)
    }
  }

  async function handleLogin() {
    const response = await fetch(`/login/${email}/${password}`)

    if (!response.ok) {
      const errorData = await response.json();
      alert("Cannot Login");
      return;
    }


    const user = await response.json()
    console.log(user);
    if (parseInt(user.user.isVerified) === 0) {
      alert("Verify Your Email First")
      return
    }
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user)


    if (user.user.user_type === "sn") navigate("/sn")
    if (user.user.user_type === "parent") navigate("/parentPage")
    if (user.user.user_type === "admin") navigate("/adminPage")
    if (user.user.user_type === "staff") {
      fetcher("/staff/updateStaffStatus", "PUT", user.accessToken, { email: user.user.email, isOnline: 1 }, null, () => alert("Could Not set Staff Status"))
      navigate("/staff")

    }
  }

  const EmailSanitizer = (event, setFunc) => {
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9@._-]/g, '');
    setFunc(sanitizedInput);
  };

  const ANSanitizer = (event, setFunc) => {
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9!@#$*_]/g, '');
    setFunc(sanitizedInput);
  };

  return (
    <div>
      <div className="login-container">
        <div className={`signup-page ${isSignUpClicked ? 'move-right' : ''}`}>
          <SignUpPage onLoginClick={handleLoginClick} />
        </div>

        <div className={`stripe-pattern ${(isVisible && !isSignUpClicked) ? 'mounted' : ''}${isSignUpClicked ? 'move-right' : ''}`}></div>

        <div className={`login-form ${isSignUpClicked ? 'move-right' : ''}${isSNLoginClicked ? 'move-up' : ''}`}>
          {isLoginClicked && (
            <div className='login-content'>
              <div className="logo-container">
                <img data-aos="fade-right" src={imageSrc} alt="Logo" className="logo" onClick={() => navigate('/')} />
                <h1 data-aos="fade-right">O.L.L.I</h1>
              </div>
              <p className="p" data-aos="fade-right">Welcome back!</p>
              <input
                data-aos="fade-right"
                id="email1"
                type="email"
                placeholder="Enter your email here"
                value={email}
                maxLength="30"
                onChange={(e) => EmailSanitizer(e, setEmail)}
              />
              <input
                data-aos="fade-right"
                id='pass1'
                maxLength="30"
                type="password"
                placeholder="Enter your password here"
                value={password}
                onChange={(e) => ANSanitizer(e, setPassword)}
              />
              <div className="remember-me">
                <a data-aos="fade-right">Don't remember password?</a>
                <a data-aos="fade-right" className='reset-pass'>Reset password</a>
              </div>
              <button data-aos="fade-right" className="login" onClick={handleLogin}>Sign in</button>
              <hr data-aos="fade-right" className="divider2" />
              <button data-aos="fade-right" className="sign-in-with-images-btn" onClick={handleSNLogin}>Sign in with Images</button>
              <div className="sign-up">
                <p className='p' data-aos="fade-right">Don’t have an account?</p>
                <a className="signup" data-aos="fade-right" onClick={handleSignUpClick}>Sign up</a>
              </div>
            </div>
          )}

          {/* true */}
          {isSNLoginClicked && (
            <div className={`SNsignup-page ${isSNLoginClicked ? 'visible' : ''}`}>
              <SNLogin onLoginClick={handleLoginClick} setUser={setUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
