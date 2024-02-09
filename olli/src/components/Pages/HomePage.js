import React from "react";
import ImageSlider from "../HomeComponents/ImageSlider/ImageSlider";
import Cheers from "../HomeComponents/AboutUS/Cheers";
import EventSection from "../HomeComponents/Events/EventSection";
import NewsLetterSection from "../HomeComponents/NewsLetters/NewsletterSection";
import GuestUserBar from "../NavBars/GuestUserBar";
import AboutUs from "../HomeComponents/AboutUS/AboutUsSection";
import ContactUs from "../HomeComponents/ContactUs/ContactUs";
import { images } from "../HomeComponents/ImageSlider/Images.js";

export default function HomePage(){
    return(
        <div>
            <GuestUserBar />
              <ImageSlider
                imageURLs={images}
              />
              <div className='aboutUsSection'>
                <AboutUs />

              </div>

              <div className='cheers-container'>
                <Cheers />
              </div>

              <div className='news'>
                <NewsLetterSection />
              </div>
              <EventSection />
              <div className='contactUs'>
                <ContactUs />
              </div>
        </div>
    )
}