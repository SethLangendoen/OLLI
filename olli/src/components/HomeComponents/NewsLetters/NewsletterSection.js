import React, { useEffect, useState } from "react";
import "../../../CSS/NewsLetter/NewsLetterSection.css"
import PdfLoader from "./PDFLoader";


export default function NewsLetterSection() {
    const [currentletter, setCurrentNewsletter] = useState()
    useEffect(() => {
        fetchCurrentLetter()

    }, [])
    async function fetchCurrentLetter() {
        const response = await fetch("/newsletters/getCurrent", {
            headers: {
                "Content-Type": "application/json",

            }

        })
        const currentData = await response.json();
        setCurrentNewsletter(currentData);
    }
    return (
        <div className="news">
            <div data-aos="fade-right" data-aos-once="true">
                <h1>O.L.L.I News</h1>
            </div>
            <div data-aos="fade-left" data-aos-once="true">
                {console.log(currentletter)}
                {currentletter && <PdfLoader className="pdf" fileName={require('../../../assets/Newsletters/' + currentletter.image_name)}></PdfLoader>}
            </div>
        </div>
    )
}