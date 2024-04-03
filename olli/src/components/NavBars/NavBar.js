import React, { useState, useEffect } from 'react';
import NavButton from "./NavButton";

import "../../CSS/NavBar/NavBar.css";
import AOS from 'aos';
import 'aos/dist/aos.css';




export default function NavBar({ userSpecificButtons, style, user }) {
  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isNavbarFaded, setNavbarFaded] = useState(false);


  const toggleBurgerMenu = () => {
    setBurgerMenuOpen(!isBurgerMenuOpen);
  };



  const handleScroll = React.useCallback(() => {
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > prevScrollPos) {
      setNavbarFaded(true);
    } else if (currentScrollPos < prevScrollPos) {
      setNavbarFaded(false);
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {

    AOS.init();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [handleScroll, prevScrollPos])

  return (



    <div >
      <div className={`burgerMenu ${isBurgerMenuOpen ? 'open' : ''}`} onClick={toggleBurgerMenu}>
        <div className={`burgerIcon ${isBurgerMenuOpen ? 'open1' : ''}`}></div>
        <div className={`burgerIcon ${isBurgerMenuOpen ? 'open2' : ''}`}></div>
        <div className={`burgerIcon ${isBurgerMenuOpen ? 'open3' : ''}`}></div>
      </div>

      <div className={`navBar ${isBurgerMenuOpen ? 'hidden' : ''} ${isNavbarFaded ? 'faded' : ''}`} style={style}>
        <a href="/"><img className='olliLogo' src={require("./OLLILOGO.png")} alt="OLLI Logo" style={{ backgroundColor: 'transparent' }}></img></a>

        <div className={`homeLink ${isBurgerMenuOpen ? 'hidden' : ''}`}>
          <NavButton name="O.L.L.I" linkTo="/"></NavButton>
        </div>

        <div className='userSpecificButtons'>
          {userSpecificButtons.map((button, index) => (
            <React.Fragment key={index}>
              {button}
            </React.Fragment>
          ))}
        </div>

        {user ? <div onClick={() => { localStorage.setItem("user", "") }}style={{ textAlign: 'left', margin: 30, padding: 0 }}><NavButton name="Logout" linkTo={"/login"} /></div> : <div className='loginButton'>
          <NavButton name="Login" linkTo="/login"></NavButton>
        </div>}


      </div>

      {/* Side Menu HTML */}
      <div className={`sideMenu ${isBurgerMenuOpen ? 'open' : ''}`}>


        <div className='userSpecificButtons'>
          {userSpecificButtons.map((button, index) => (
            <React.Fragment key={index}>
              {button}
            </React.Fragment>
          ))}
        </div>

        {user ? <NavButton name="Logout" linkTo={"/login"} /> : <div className='loginButton'>
          <NavButton name="Login" linkTo="/login"></NavButton>
        </div>}



      </div>

    </div>

  );
}

