import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
import EventCard from './EventCard.js';


export default function EventSlider() {
  const [cards, setCards] = useState([]);
  const updatedImageContext = require.context('../../../assets/EventPhotos', false, /\.(png|jpg|jpeg|gif|svg)$/);
  const [file, setFile] = useState(updatedImageContext.keys().map(updatedImageContext))



  useEffect(() => {
    fetchEvents();
  }, []);

  function fetchEvents() {
    fetch('/events/getAllEvents')
      .then(response => response.json())
      .then(data => {
        createCards(data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }



  function createCards(events) {
    const cardsArray = events.map(event => {
      var tempImagePath = null;
      file.map((imagePath) => {
        const imageName = imagePath.split('/')[3].split('.')[0];
        const imageSuffix = imagePath.split('.')[2]
        if (event.path.includes(imageName + '.' + imageSuffix)) {
          tempImagePath = imagePath
        }
      })

      return (
        <SwiperSlide key={event.id}>
          <EventCard
            title={event.title}
            URL={tempImagePath}
            description={event.short_descrip}
          />
        </SwiperSlide>
      );
    });
    setCards(cardsArray);
  }

  return (
    <div className='eventSlider'>
      <Swiper
        slidesPerView={3}
        freeMode={true}
        spaceBetween={20}
        centeredSlides={false}
        mousewheel={true}
        loop={true}
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        className="es"
      >
        {cards}
      </Swiper>
    </div>
  );
}
