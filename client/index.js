const reviewForm = document.querySelector("#review-form");
const reviewList = document.querySelector("#review-list");

const refreshAllReviews = () => {
    fetch("http://localhost:8000/reviews")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
            reviewList.innerHTML = '<p>No reviews yet.</p>';
            return;
        }
        const html = data.map(
            (review) =>
            `<div class="review-block">
            <h3 class="review-movie-name">${review.movieName}</h3>
            <p class="review-text">${review.review}</p>
            <button onclick="updateReview(${review.id})">Update</button>
            <button onclick="deleteReview(${review.id})">Delete</button>
            </div>`
          )
          .join("");
        reviewList.innerHTML = html;
      });
};

const insertSingleReview = (newReview) => {
    const div = document.createElement('div');
    div.className = 'review-block';
    div.innerHTML = `<h3 class="review-movie-name">${newReview.movieName}</h3>
                     <p class="review-text">${newReview.review}</p>
                     <button onclick="updateReview(${newReview.id})">Update</button>
                     <button onclick="deleteReview(${newReview.id})">Delete</button>`;
    reviewList.insertAdjacentElement("afterbegin", div);
};

reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const newReview = {
      movieName: e.currentTarget['movie-name'].value,
      review: e.currentTarget.review.value,
    };
  
    fetch("http://localhost:8000/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        e.target.reset();
        insertSingleReview(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
});

function deleteReview(id) {
    fetch(`http://localhost:8000/review/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        refreshAllReviews();
    })
    .catch(error => console.error('Error deleting review:', error));
}

function updateReview(id) {
    const newReview = prompt("Enter your updated review:");
    if (newReview) {
        fetch(`http://localhost:8000/review/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ review: newReview })
        })
        .then(response => response.json())
        .then(() => {
            // Re-fetch the reviews after update
            refreshAllReviews();
        })
        .catch(error => console.error('Error updating review:', error));
    }
}

refreshAllReviews();