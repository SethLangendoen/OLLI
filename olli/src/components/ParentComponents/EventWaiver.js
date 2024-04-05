import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import "./waiver.css";
import axios from 'axios'

export default function EventWaiver({ eventTitle }) {
    const [user, setUser] = useState(null);
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
    const [waiver, setWaiver] = useState(null);
    const [error, setError] = useState('');
    const [close, setClose] = useState(true)
    const signatureRef = useRef();

    const handleSignatureClear = () => {
        signatureRef.current.clear();
        setIsSignatureEmpty(true);
    };

    const handleSignatureChange = () => {
        if (signatureRef.current.isEmpty()) {
            setIsSignatureEmpty(true);
        } else {
            setIsSignatureEmpty(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetcher(`/waiver/getWaiver/${eventTitle}`, 'GET', storedUser.accessToken, null, setWaiver, () => {
            setError("No Waiver's For this Event");
        });
    }, [eventTitle]);

    async function fetcher(url, method, accessToken, body, setter, errorHandler) {
        let response;
        if (method === 'GET') {
            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${accessToken}`,
                },
            });
        } else {
            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });
        }

        if (!response.ok) {
            errorHandler();
            return;
        } else if (setter) {
            const data = await response.json();
            setter(data);
        }
    }

    function handleSubmit() {
        if (isSignatureEmpty) {
            alert("You Must Sign the Waiver")
            return
        }
        const signatureDataUrl = signatureRef.current.toDataURL();
        console.log(signatureDataUrl)

        fetcher(`/waiver/setSignature/${eventTitle}`, "PUT", user.accessToken, { signature: signatureDataUrl }, null, () => { })
        fetcher("/signed/addWaiverSignature", "POST", user.accessToken, { waiverTitle: eventTitle, email: user.user.email, isSigned: 1 }, null, () => { alert("Could Submit Waiver") })
        setClose(false)
        alert("Waiver Submited")
    }


    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    return (
        <div className="event-waiver-container">
            {waiver && close ? (
                <div>
                    <h2 className="event-waiver-title">{waiver.title}</h2>
                    <p className="event-waiver-description">{waiver.description}</p>
                    <h2 className="event-waiver-date">Parent Signature:</h2>
                    <div className="signature-container">
                        <SignatureCanvas
                            penColor="black"
                            canvasProps={{ width: 300, height: 150, color: "white", className: 'signature-canvas' }}
                            ref={signatureRef}
                            onBegin={() => setIsSignatureEmpty(false)}
                            onEnd={handleSignatureChange}
                        />
                    </div>
                    <div className="button-container">
                        <button className="signature-button" onClick={handleSignatureClear}>Clear Signature</button>
                        <button className="signature-button" onClick={handleSubmit}>Submit Waiver</button>
                    </div>
                </div>
            ) : (
                <p className="error-message">{error}</p>
            )}
        </div>
    );

}
