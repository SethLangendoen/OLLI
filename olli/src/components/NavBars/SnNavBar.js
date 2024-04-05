import React from 'react'
import NavBar from "./NewNavBar.js";
import NavButton from "./NavButton.js";
import crown from "./crown.png";
import chat from "./chat.png";
import useSpeechSynthesis from '../HomeComponents/Helpers/TextToSpeech';

export default function SnNavBar({ user }) {
    const Speak = useSpeechSynthesis();

    const buttons = [
        <img src={crown} alt="Logo" className="crown" linkTo={"game-container"} />,
        <NavButton
            name={"Game"}
            linkTo={"game-container"}
            scrollLink={true}
            onMouseOver={() => { Speak('Game') }}
        />,
        <img src={chat} alt="Logo" className="chat" linkTo={"/snPage/chat"} />,
        <NavButton
            name={"Chat"}
            linkTo={"/snPage/chat"}
            scrollLink={false}
            onMouseOver={() => { Speak('Chat') }}
        />
    ]

    return (
        <NavBar
            userSpecificButtons={buttons}
            user={user}
        />
    )
}
