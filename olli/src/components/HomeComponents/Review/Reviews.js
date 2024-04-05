import { useState, useEffect } from "react"
import "../../../CSS/Review/ReviewSection.css"
import Rating from 'react-rating';

export default function Reviews({ user: initialUser }) {
    const [ratings, setRatings] = useState([]); // holds all the reviews as an array. 
    const [reviewData, setReviewData] = useState([]); // holds the review string. 
    const [user, setUser] = useState(initialUser); // hollds the logged in user. 
    const [rating, setRating] = useState(5); // holds the 5 star value provided

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        getAllReviews();
    }, [user])

    const getAllReviews = async () => {
        console.log('updating Reviews');
        try {
            const response = await fetch('/review/getRatings', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const data = await response.json();
            console.log('This is the review data: ', data);
            setRatings(data); 

        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }





    async function addReview() {
        try {
            const response = await fetch('/review/addRating', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user.user.username,
                    review: reviewData,
                    rating: rating
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add review');
            }
            const data = await response.json();
            // refresh the shown reviews to reflect the one that was just put in the db.  
            getAllReviews();
            alert('Your Review has been sent to OLLI!');
        } catch (error) {
            console.error('Error adding review:', error);
        }
    }

    const handleAddReview = () => {
        console.log('handleAddReview called!');
        addReview();
    }

    return (
        <div className='reviewsComponent'>
            <h1>Like What We Do? Leave a review!</h1>
            <div className='reviewsContainer'>
                <div className='reviewInputs'>
                    <div className = 'starRating'>
                        <p className = 'ratingText'>Rating:</p>
                        <Rating
                            initialRating={rating}
                            onChange={(value) => setRating(value)}
                        />
                    </div>
                    <textarea className='reviewTextBox' placeholder="Enter review here..." maxLength={300} onChange={(e) => setReviewData(e.target.value)}></textarea>
                    <button onClick={handleAddReview}>Submit Review!</button>
                </div>
                {ratings && ratings.map((rating, index) => (
                    <div className='review' key={index}>
                        <p>{rating.username} says: {rating.review}</p>
                        <p className = 'ratingText' >Rating: {<Rating initialRating={rating.rating} readonly={true}/>}</p>

                    </div>
                ))}
            </div>
        </div>
    )
}
