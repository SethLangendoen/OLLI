import { useState, useEffect } from "react";
import Rating from 'react-rating';


export default function ManageReviews({ user: initialUser }){
    const [ratings, setRatings] = useState([]); // holds all the reviews as an array. 
 
    useEffect(() => {
        getAllReviews();
    }, [])

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

	const deleteReview = async (uName, review) => {
        console.log('deleting review');
		console.log("front end delete called" + review + ' ' + uName); 
        try {
            const response = await fetch('/review/deleteRating', {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					username: uName,
					review: review
				})
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            getAllReviews(); // update the reviews to reflect the deleted one. 

        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }



	function handleDeleteReview(username, review){
		deleteReview(username, review); 
	}

	return(
		<div>
			{ratings && ratings.map((rating, index) => (
				<div className='review' key={index}>
					<p>{rating.username} says: {rating.review}</p>
					<p className = 'ratingText' >Rating: {<Rating initialRating={rating.rating} readonly={true}/>}</p>
					<button onClick={() => handleDeleteReview(rating.username, rating.review)}>Delete Review</button>
				</div>
			))}
		</div>
	)
}