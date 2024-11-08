console.log("Script loaded!");

const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const speakerCards = document.querySelectorAll('.speaker-card');
const speakerDetail = document.querySelector('.speaker-detail');
const closeDetailButton = document.querySelector('.close-detail');

// Fetch speaker details from JSON
let speakersData = [];
fetch('speakers.json')
  .then(response => response.json())
  .then(data => {
    speakersData = data;
  })
  .catch(error => console.error("Error fetching speaker data:", error));

// Calculate the width of one slide (for one card at a time on mobile)
const isMobile = window.innerWidth <= 360; // Mobile check
const slideWidth = isMobile ? track.getBoundingClientRect().width : track.getBoundingClientRect().width / 4; // Show 1 slide on mobile, multiple on desktop

let currentIndex = 0;  // Track the current slide index

// Set each slide's position so they are next to each other
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

// Function to move to a specific slide
const moveToSlide = (index) => {
    const offset = slideWidth * index;
    track.style.transform = 'translateX(-' + offset + 'px)';
    currentIndex = index;
    updateArrowState();  // Update arrow buttons' state after every slide change
};

// Function to update the state of the arrow buttons (disable/enable)
const updateArrowState = () => {
    if (currentIndex === 0) {
        leftArrow.disabled = true;
        leftArrow.style.display = 'none';  // Hide left arrow on the first slide
    } else {
        leftArrow.disabled = false;
        leftArrow.style.display = 'block';  // Show left arrow on other slides
    }
    if (currentIndex === slides.length - 1) {  // Show 1 card, so last index is total slides - 1
        rightArrow.disabled = true;
        rightArrow.style.display = 'none';  // Hide right arrow on the last slide
    } else {
        rightArrow.disabled = false;
        rightArrow.style.display = 'block';  // Show right arrow on other slides
    }
};

// Event listener for the Left Arrow (Previous Slide)
leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        moveToSlide(currentIndex);
    }
});

// Event listener for the Right Arrow (Next Slide)
rightArrow.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {  // Ensure we don't go beyond the last slide
        currentIndex++;
        moveToSlide(currentIndex);
    }
});

// Initial setup - make sure we start at the first slide
moveToSlide(0);

// Event listener for opening speaker details
speakerCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h3').textContent;
      const role = card.querySelector('.role').textContent;
      const company = card.querySelector('.company').textContent;
      const imageSrc = card.querySelector('img').src;

      document.querySelector('.speaker-detail-img').src = imageSrc;
      document.querySelector('.speaker-name').textContent = name;
      document.querySelector('.speaker-role').textContent = role;
      document.querySelector('.speaker-company').textContent = company;

      // Find and display the bio from the JSON data
      const speaker = speakersData.find(s => s.name === name && s.company === company);
      document.querySelector('.speaker-bio').textContent = speaker ? speaker.bio : "Bio not available.";

      // Show the speaker detail div
      speakerDetail.style.display = 'block';
    });
});

// Event listener for closing the detail view
closeDetailButton.addEventListener('click', () => {
    speakerDetail.style.display = 'none';
});
