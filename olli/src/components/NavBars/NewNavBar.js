import React, { useState, useEffect } from 'react';
import NavButton from "./NavButton";

import "../../CSS/NavBar/SnNavBar.css";
import AOS from 'aos';
import 'aos/dist/aos.css';




export default function NavBar({ userSpecificButtons, style, user }) {
    const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [isNavbarFaded, setNavbarFaded] = useState(false);
    const profilePick = "../../assets/NavBarIcons/profile.png"

    const toggleBurgerMenu = () => {
        setBurgerMenuOpen(!isBurgerMenuOpen);
    };



    const handleScroll = React.useCallback(() => {
        const currentScrollPos = window.scrollY;
        console.log(user)
        if (currentScrollPos > prevScrollPos) {
            console.log("schrodingers up");
            setNavbarFaded(true);
        } else if (currentScrollPos < prevScrollPos) {
            console.log("schrodingers down");
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

            <div className={`snNavBar ${isBurgerMenuOpen ? 'hidden' : ''} ${isNavbarFaded ? 'faded' : ''}`} style={style}>
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

                {<div className='loginButton'>
                    <NavButton name="Logout" linkTo="/login"></NavButton>
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

                {user ? <img src={require("../../assets/NavBarIcons/profile.png")} className="profile" /> : <div className='loginButton'>
                    <NavButton name="Logout" linkTo="/login"></NavButton>
                </div>}



            </div>

        </div>

    );
}

