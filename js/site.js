"use strict";

const trackTitles = [
	"Nick Newhouse - Overfalls",
	"Nick Newhouse - Let Me Cry",
	"Walter - Call of the Wild",
	"High Tide Lofi - Sneezy Groove",
	"Walter - The Inside",
	"Walter - Edge",
	"Baircave & Catmosphere - The Siren Song [Radio Edit]",
	"High Tide Lofi - Secunda",
	"Baircave & arthur x medic - Alice",
	"Baircave & Voia - Folds",
	"Jay Sean - Down [NN Bootleg]",
	"Nick Newhouse - Every Night (In My Dreams)",
	"Buoy Afuru - Light Up",
	"High Tide Lofi - Coloring",
	"Buoy Afuru - Ocean Wave"
];
const trackFilenames = [
	'Overfalls.mp3', 
	'Let_Me_Cry.mp3',
	'cotw.mp3',
	'sneezy_groove.mp3',
	'the_inside.mp3',
	'edge.mp3',
	'the_siren_song.mp3',
	'secunda.mp3',
	'Alice.mp3',
	'Folds.mp3',
	'down.mp3',
	'every_night.mp3',
	'light_up.mp3',
	'Coloring.mp3',
	'ocean_wave.mp3'
];
const credits = [
	'songwriting, production, mixing, & mastering', 
	'songwriting, production, mixing, & mastering',
	'production, mixing, & mastering',
	'songwriting, production, mixing, & mastering',
	'songwriting, production, mixing, & mastering',
	'songwriting, production, mixing, & mastering',
	'songwriting, production, mixing, & mastering',
	'production & mixing',
	'songwriting, production, mixing, & mastering',
	'songwriting, production, mixing, & mastering',
	'remixing (w/o permission, don\'t tell)',
	'songwriting, production, mixing, & mastering',
	'vocal production, mixing, & mastering',
	'songwriting, production, mixing, & mastering',
	'vocal production, mixing, & mastering'
];
const audio = document.getElementById('audio-player');
const elapsedTime = document.getElementById('elapsed-time');
const duration = document.getElementById('duration');
const trackTitle = document.getElementById('track-info');

var isPlaying = 0;
var isHeadshot = 0;
var isCredits = 0;
var currentTrack = 0;
var playPauseButton = document.getElementById("play-pause");

function secondsToString(seconds) {
	var secondsInt = Math.floor(seconds);
	var formattedSeconds = (secondsInt % 60) >= 10 ? secondsInt % 60 : `0${secondsInt % 10}`;
	
	return `${Math.floor(secondsInt / 60)}:${formattedSeconds}`; 
}

function setElapsedTime() {
	elapsedTime.innerHTML = `${secondsToString(audio.currentTime)}`;
}

function setDuration() {
	duration.innerHTML = `${secondsToString(audio.duration)}`;
}

function pause() {
	audio.pause();
	isPlaying = 0;
	playPauseButton.src = 'images/play_button_2.png';
}

function play() {
	audio.play();
	isPlaying = 1;
	playPauseButton.src = 'images/pause_button_2.png';
}

function playPause() {
	isPlaying ? pause() : play();
}

function fastForward() {
	if ((audio.currentTime + 10) < audio.duration) {
		audio.currentTime += 10;
	}
}

function rewind() {
	if ((audio.currentTime - 10) < 0) {
		audio.currentTime = 0;
	} else {
		audio.currentTime -= 10;
	}
}

function nextTrack() {
	audio.pause();
	audio.currentTime = 0;

	if ((currentTrack + 1) < trackTitles.length) {
		currentTrack += 1;
	} else {
		currentTrack = 0;
	}

	rotateCreditsWithTitle(1);
	audio.src = `audio/${trackFilenames[currentTrack]}`;
	play();
}

function previousTrack() {
	if (audio.currentTime > 2) {
		audio.currentTime = 0;
	} else {
		if ((currentTrack - 1) < 0) {
			currentTrack = trackTitles.length - 1;
		} else {
			currentTrack -= 1;
		}
	
		rotateCreditsWithTitle(1);
		audio.src = `audio/${trackFilenames[currentTrack]}`;
		play();
	}
}

function rotateCreditsWithTitle(setTitle) {
	trackTitle.style.opacity = 0;

	setTimeout(() => {
		if (isCredits || setTitle) {
			trackTitle.innerHTML = trackTitles[currentTrack];
			isCredits = 0;
		} else {
			trackTitle.innerHTML = credits[currentTrack];
			isCredits = 1;
		}

		trackTitle.style.opacity = 1;
	}, 700);
}

function toggleMenu() {
    const menu = document.querySelector(".nav-links");
	if (window.innerWidth < 700) {
		if (menu.style.display === "flex") {
			menu.style.display = "none";
		} else {
			menu.style.display = "flex";
		}
	}
}

trackTitle.innerHTML = trackTitles[currentTrack];

audio.onended = () => nextTrack();
audio.onloadeddata = () => {
	setElapsedTime();
	setDuration();
};
audio.ontimeupdate = () => setElapsedTime();
audio.src = `audio/${trackFilenames[currentTrack]}`;
audio.load();
setInterval(() => {
	rotateCreditsWithTitle();
}, 10000);

navigator.mediaSession.setActionHandler('play', () => play());
navigator.mediaSession.setActionHandler('pause', () => pause());
navigator.mediaSession.setActionHandler('seekbackward', () => rewind());
navigator.mediaSession.setActionHandler('seekforward', () => fastForward());
navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());

// Image carousel animation

document.addEventListener('DOMContentLoaded', function() {
	const slides = document.querySelectorAll('.slide');
	const dots = document.querySelectorAll('.dot');
	let currentSlide = 0;
	
	// Function to show a specific slide
	function showSlide(n) {
		// Hide all slides
		slides.forEach(slide => {
			slide.classList.remove('active');
		});
		
		// Remove active state from all dots
		dots.forEach(dot => {
			dot.classList.remove('active');
		});
		
		// Show the current slide and dot
		slides[n].classList.add('active');
		dots[n].classList.add('active');
	}
	
	// Function to advance to the next slide
	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
		showSlide(currentSlide);
	}
	
	// Set up dot navigation
	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			currentSlide = index;
			showSlide(currentSlide);
			resetTimer(); // Reset timer when manually changing slides
		});
	});
	
	// Set up automatic slide advancement
	let slideTimer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
	
	// Reset timer function
	function resetTimer() {
		clearInterval(slideTimer);
		slideTimer = setInterval(nextSlide, 5000);
	}
	
	// Initialize first slide
	showSlide(currentSlide);
});

// Day Camp RSVP system

// Global state
let selectedDates = {}; // Format: { "YYYY-MM-DD": "half"|"full" }

// DOM Elements
const selectedDatesList = document.getElementById('selected-dates-list');
const noDatesMsgElem = document.getElementById('no-dates-message');
const registrationForm = document.getElementById('registration-form');
const successAlert = document.getElementById('success-alert');
const errorAlert = document.getElementById('error-alert');

// Initialize the form
function init() {
    // Add event listeners for date selection
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', handleDateSelection);
    });
    
    // Form submission
    registrationForm.addEventListener('submit', handleSubmit);
}

// Parse a YYYY-MM-DD string to a formatted display date
function parseAndFormatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, parseInt(month) - 1, day);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${dayNames[date.getDay()]})`;
}

// Handle date selection
function handleDateSelection(event) {
    const button = event.target;
    const date = button.getAttribute('data-date');
    const option = button.getAttribute('data-option');
    const parent = button.parentElement;
    
    // Clear any existing selections for this date
    Array.from(parent.children).forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // If already selected the same option, deselect it
    if (selectedDates[date] === option) {
        delete selectedDates[date];
    } else {
        // Otherwise select this option
        selectedDates[date] = option;
        button.classList.add('selected');
    }
    
    // Update the selected dates display
    updateSelectedDatesDisplay();
}

// Update the selected dates display in the form
function updateSelectedDatesDisplay() {
    selectedDatesList.innerHTML = '';
    
    const dates = Object.keys(selectedDates).sort();
    
    if (dates.length === 0) {
        noDatesMsgElem.classList.remove('hidden');
        selectedDatesList.classList.add('hidden');
        return;
    }
    
    noDatesMsgElem.classList.add('hidden');
    selectedDatesList.classList.remove('hidden');
    
    dates.forEach(date => {
        const option = selectedDates[date];
        const li = document.createElement('li');
        const formattedDate = parseAndFormatDate(date);
        
        li.innerHTML = `
            <span><strong>${formattedDate}</strong> - 
            ${option === 'half' ? 'Half Day' : 'Full Day'}</span>
            <button type="button" class="remove-date" data-date="${date}">✕</button>
        `;
        
        selectedDatesList.appendChild(li);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-date').forEach(btn => {
        btn.addEventListener('click', function() {
            const dateToRemove = this.getAttribute('data-date');
            delete selectedDates[dateToRemove];
            
            // Find and unselect the corresponding button in the calendar
            document.querySelectorAll(`.option-btn[data-date="${dateToRemove}"]`).forEach(button => {
                button.classList.remove('selected');
            });
            
            updateSelectedDatesDisplay();
        });
    });
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    // Hide any existing alerts
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    
    // Validate the form
    if (!validateForm()) {
        errorAlert.textContent = 'Please fill in all required fields and select at least one camp date.';
        errorAlert.style.display = 'block';
        return;
    }
    
    // Collect form data
    const formData = new FormData(registrationForm);
    
    // Convert FormData to an object
    const registrationData = {};
    formData.forEach((value, key) => {
        registrationData[key] = value;
    });
    
    // Submit to Google Sheet
    submitToGoogleSheet(registrationData);
}

// Validate the form
function validateForm() {
    // Check required fields
    const requiredFields = registrationForm.querySelectorAll('[required]');
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            return false;
        }
    }
    
    // Check if at least one date is selected
    if (Object.keys(selectedDates).length === 0) {
        return false;
    }
    
    return true;
}

// Submit data to Google Sheet
function submitToGoogleSheet(data) {
    // Replace with your Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx7wMdUS7Oevjd1ETUFjyMu_8-fFbmcSQhwnZurq8HcAEq4lsn7vQPpnHKrxyzwR6xgrA/exec';
    
    // Show loading state
    const submitBtn = document.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Format data for submission
    const formattedData = {
		referrer: window.location.hostname,
        timestamp: new Date().toISOString(),
        parentInfo: {
            name: data.parentName,
            email: data.parentEmail,
            phone: data.parentPhone
        },
        childInfo: {
            name: data.childName1,
            age: data.childAge1
        },
        selectedDates: []
    };
    
    // Process selected dates
    Object.entries(selectedDates).forEach(([date, option]) => {
        formattedData.selectedDates.push({
            date: date,
            option: option,
            formattedDate: parseAndFormatDate(date),
        });
    });
    
    // Submit the form data with no-cors
	console.log(formattedData);
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formattedData),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    })
    .then(() => {
        console.log("Initial submission complete, verifying...");
        
        // Wait a moment for the data to be processed by the server
        setTimeout(() => {
            // Create verification URL with the email and timestamp
            const verifyUrl = `${scriptURL}?verify=true&email=${encodeURIComponent(formattedData.parentInfo.email)}&timestamp=${encodeURIComponent(formattedData.timestamp)}`;
            
            // Make a verification request
            fetch(verifyUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Verification failed');
                    }
                    return response.json();
                })
                .then(verification => {
                    if (verification.verified) {
                        console.log("Registration verified with ID:", verification.id);
                        successAlert.textContent = "Your requested dates have been received! We'll be in touch soon.";
                        successAlert.style.display = 'block';
                        errorAlert.style.display = 'none';
                        
                        // Reset form
                        registrationForm.reset();
                        selectedDates = {};
                        updateSelectedDatesDisplay();
                        
                        // Clear all selected buttons in the calendar
                        document.querySelectorAll('.option-btn.selected').forEach(btn => {
                            btn.classList.remove('selected');
                        });
                        
                    } else {
                        console.error("Verification failed:", verification.reason);
                        errorAlert.textContent = "Your registration may not have been received. Please try again or contact us directly.";
                        errorAlert.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error("Verification error:", error);
                    errorAlert.textContent = "We couldn't confirm your registration. Please contact us to ensure your spot is reserved.";
                    errorAlert.style.display = 'block';
                })
                .finally(() => {
                    // Reset button regardless of outcome
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        }, 2000); // Wait 2 seconds before verification
    })
    .catch(error => {
        console.error("Submission error:", error);
        errorAlert.textContent = 'There was an error submitting your registration. Please try again or contact us.';
        errorAlert.style.display = 'block';
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('DOMContentLoaded', function() {
	const scrollContainer = document.querySelector('.horizontal-scroll-calendar');
	const prevButton = document.querySelector('.nav-prev');
	const nextButton = document.querySelector('.nav-next');
	const weekElements = document.querySelectorAll('.week');

	// Flag to track if animation is in progress
	let isScrolling = false;

	// Get the current visible week index
	function getCurrentWeekIndex() {
		const containerRect = scrollContainer.getBoundingClientRect();
		const containerCenter = containerRect.left + containerRect.width / 2;
		
		let closestIndex = 0;
		let closestDistance = Infinity;
		
		weekElements.forEach((week, index) => {
		const weekRect = week.getBoundingClientRect();
		const weekCenter = weekRect.left + weekRect.width / 2;
		const distance = Math.abs(containerCenter - weekCenter);
		
		if (distance < closestDistance) {
			closestDistance = distance;
			closestIndex = index;
		}
		});
		
		return closestIndex;
	}

	// Scroll to a specific week by index
	function scrollToWeek(index) {
		if (isScrolling) return;
		
		if (index < 0) index = 0;
		if (index >= weekElements.length) index = weekElements.length - 1;
		
		isScrolling = true;
		
		const targetWeek = weekElements[index];
		const containerRect = scrollContainer.getBoundingClientRect();
		const targetRect = targetWeek.getBoundingClientRect();
		
		// Calculate the scroll position to center the target week
		const scrollLeft = scrollContainer.scrollLeft + 
						(targetRect.left - containerRect.left) - 
						(containerRect.width - targetRect.width) / 2;
		
		scrollContainer.scrollTo({
		left: scrollLeft,
		behavior: 'smooth'
		});
		
		// Reset the scrolling flag after animation completes
		setTimeout(() => {
		isScrolling = false;
		}, 500); // Typical smooth scroll animation is ~500ms
	}

	nextButton.addEventListener('click', function() {
		if (!isScrolling) {
		const currentIndex = getCurrentWeekIndex();
		scrollToWeek(currentIndex + 1);
		}
	});

	prevButton.addEventListener('click', function() {
		if (!isScrolling) {
		const currentIndex = getCurrentWeekIndex();
		scrollToWeek(currentIndex - 1);
		}
	});

	// Also add keyboard navigation
	document.addEventListener('keydown', function(e) {
		if (e.key === 'ArrowRight') {
		nextButton.click();
		} else if (e.key === 'ArrowLeft') {
		prevButton.click();
		}
	});
});