import React from "react";
import ContactInfo from "./ContactInfo";
import WidgetLinks from "./WidgetLinks";
import "../../../CSS/ContactUs/Contact.css";
import map from "./map.png";
import location from "./location.png";
import gmail from "./gmail.png";
import phone from "./phone.png";


export default function ContactUs() {
	// Function to handle button click
	const handleContactSupportClick = () => {
		// Open the Google Form in a new tab
		window.open('https://forms.gle/Y7BjZAcpX3gsRamR8', '_blank');
	};

	return (
		<div id="ContactUsDiv">
			<div data-aos="fade-up" data-aos-once="true">
				<h1 id="ContactTitle">Reach Our Team</h1>
				<p className="header1">We love questions and feedback – and we’re always happy to help!</p>
				<p className="header2">Here are some ways to contact us.</p>
				<p className="header4">Our office hours:</p>
				<p className="header3">Monday: 8:00am-4:00pm</p>
				<p className="header3">Tuesday: 8:00am-4:00pm</p>
				<p className="header3">Wednesday: 10:00am-4:00pm</p>
				<p className="header3">Thursday: 8:00am-4:00pm</p>
				<p className="header3">Friday: 8:00am-4:00pm</p>
				<p className="header3">Saturday: CLOSED</p>
				<p className="header5">Sunday: CLOSED</p>
				<div id="SalesSupportContainer">
					<div id="SalesDiv">
						<h2>Talk to our Staffs</h2>
						<p>Chat with our staff team to discover how our support can work best for you.</p>
						<p>Phone: CA +1 (632) - 960 - 1985</p>
					</div>
				</div>
				<div id="CustomerSupportContainer">
					<div id="SupportDiv">
						<h2>Contact Customer Support</h2>
						<p>We are waiting to help you and your families – so don’t hesitate to reach out! Click on the button below to fill out a form!</p>
						<button onClick={handleContactSupportClick}>CONTACT SUPPORT</button>
					</div>
				</div>
				<ContactInfo></ContactInfo>
				<hr data-aos="fade-up" data-aos-once="true" className="contact-divider" />
				<div data-aos="fade-up" data-aos-once="true" id="HeadquartersAndMapContainer">
					<div id="HeadquartersDiv">
						<h2 className="headquarterTitle">Headquarter's Information</h2>
						<div className="contact-info">
							<div className="info-item">
								<img data-aos="fade-up" data-aos-once="true" src={location} alt="location" className="location" />
								<p data-aos="fade-up" data-aos-once="true" className="address">8685 Rockglen Rd. Arkona ON, N0M 1B0</p>
							</div>
							<div className="info-item">
								<img data-aos="fade-up" data-aos-once="true" src={gmail} alt="mail" className="mail" />
								<p data-aos="fade-up" data-aos-once="true" className="gmail">ongoinglivinglearning@gmail.com</p>
							</div>
							<div className="info-item">
								<img data-aos="fade-up" data-aos-once="true" src={phone} alt="phone" className="phones" />
								<p data-aos="fade-up" data-aos-once="true" className="phone">CA +1 (617) - 555 - 0198</p>
							</div>
							<div className="info-item">
								<WidgetLinks></WidgetLinks>
								<p data-aos="fade-up" data-aos-once="true" className="phone">Family Connections Cheer</p>
							</div>
						</div>
					</div>

					<img data-aos="fade-up" data-aos-once="true" src={map} alt="Vision" className="map-image" />
				</div>
			</div>
		</div>
	);
}