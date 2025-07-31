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

// Animated submitting text function
function startSubmittingAnimation(button, originalText) {
    let dotCount = 0;
    const baseText = 'Submitting';
    
    const animationInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4; // Cycle through 0, 1, 2, 3 dots
        const dots = '.'.repeat(dotCount);
        button.textContent = baseText + dots;
    }, 500); // Change every 500ms
    
    // Store the interval ID on the button so we can clear it later
    button.animationInterval = animationInterval;
}

function stopSubmittingAnimation(button, originalText) {
    // Clear the animation interval
    if (button.animationInterval) {
        clearInterval(button.animationInterval);
        button.animationInterval = null;
    }
    
    // Reset button text and state
    button.textContent = originalText;
    button.disabled = false;
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

class Carousel {
    constructor(container, options = {}) {
        // Store DOM elements
        this.container = container;
        this.slides = container.querySelectorAll('.slide');
        this.dots = container.querySelectorAll('.dot');
        
        // Setup options with defaults
        this.options = Object.assign({
            interval: options.interval || 5000,
            autoplay: options.autoplay !== undefined ? options.autoplay : true
        }, options);
        
        // State
        this.currentSlide = 0;
        this.slideTimer = null;
        this.sliding = false;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the carousel
     */
    init() {
        // Show the first slide
        this.showSlide(this.currentSlide);
        
        // Set up dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (this.sliding) return;
                this.currentSlide = index;
                this.showSlide(this.currentSlide);
                this.resetTimer();
            });
        });
        
        // Preload lazy images if any
        this.preloadLazyImages();
        
        // Set up autoplay if enabled
        if (this.options.autoplay) {
            this.startTimer();
        }
        
        // Setup swipe events for mobile
        this.setupSwipeEvents();
    }
    
    /**
     * Preload lazy images
     */
    preloadLazyImages() {
        this.slides.forEach(slide => {
            const lazyImage = slide.querySelector('img[data-src]');
            if (lazyImage) {
                lazyImage.src = lazyImage.getAttribute('data-src');
                lazyImage.removeAttribute('data-src');
            }
        });
    }
    
    /**
     * Show a specific slide
     */
    showSlide(index) {
        // Prevent additional clicks during transition
        this.sliding = true;
        
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active state from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide and dot
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        // Allow interactions after a brief delay
        setTimeout(() => {
            this.sliding = false;
        }, 200);
    }
    
    /**
     * Advance to the next slide
     */
    nextSlide() {
        if (this.sliding) return;
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    /**
     * Go to the previous slide
     */
    prevSlide() {
        if (this.sliding) return;
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    /**
     * Start the timer for autoplay
     */
    startTimer() {
        this.slideTimer = setInterval(() => {
            this.nextSlide();
        }, this.options.interval);
    }
    
    /**
     * Reset the timer (used after manual navigation)
     */
    resetTimer() {
        clearInterval(this.slideTimer);
        if (this.options.autoplay) {
            this.startTimer();
        }
    }
    
    /**
     * Setup touch swipe events for mobile
     */
    setupSwipeEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    /**
     * Handle swipe events
     */
    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum swipe distance
        
        // Left swipe (next slide)
        if (startX - endX > threshold) {
            this.nextSlide();
            this.resetTimer();
        }
        
        // Right swipe (previous slide)
        if (endX - startX > threshold) {
            this.prevSlide();
            this.resetTimer();
        }
    }
}

// Initialize all carousels on the page
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    const carouselInstances = [];
    
    carouselContainers.forEach((container, index) => {
        // Customize options per carousel if needed
        const options = {
            interval: 5000,  // 5 seconds between slides
            autoplay: true   // Set to false to disable autoplay
        };
        
        // Specific carousel customizations
        if (container.classList.contains('studio-carousel')) {
            options.interval = 6000; // Slightly longer interval for studio carousel
        }
        
        // Create and store the carousel instance
        const carousel = new Carousel(container, options);
        carouselInstances.push(carousel);
        
    });
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
    // Filter past dates first
    filterPastDates();
    
    // Add event listeners for date selection (only for non-past dates)
    document.querySelectorAll('.option-btn:not(.past-date)').forEach(btn => {
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

function isDateInPast(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    const [year, month, day] = dateString.split('-');
    const dateToCheck = new Date(year, parseInt(month) - 1, parseInt(day));
    
    return dateToCheck < today;
}

function filterPastDates() {
    // Get all option buttons with date attributes
    const optionButtons = document.querySelectorAll('.option-btn[data-date]');
    
    optionButtons.forEach(button => {
        const dateString = button.getAttribute('data-date');
        
        if (isDateInPast(dateString)) {
            // Find the parent day element
            const dayElement = button.closest('.day');
            
            // Add past-date class to the day
            if (dayElement) {
                dayElement.classList.add('past-date');
            }
            
            // Disable the button
            button.disabled = true;
            button.classList.add('past-date');
        }
    });
}

// Handle date selection
function handleDateSelection(event) {
    const button = event.target;
    const date = button.getAttribute('data-date');
    const option = button.getAttribute('data-option');
    
    // Check if this is a past date - if so, prevent selection
    if (isDateInPast(date) || button.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    
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
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx7wMdUS7Oevjd1ETUFjyMu_8-fFbmcSQhwnZurq8HcAEq4lsn7vQPpnHKrxyzwR6xgrA/exec';
    
    // Show animated loading state
    const submitBtn = document.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    startSubmittingAnimation(submitBtn, originalText);
    
    // Format data for submission
    const formattedData = {
        referrer: window.location.origin,
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
                        console.log("Request verified with ID:", verification.id);
                        successAlert.textContent = "Your request has been received! We manually review each request and will confirm via e-mail within 24 hours.";
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
                        errorAlert.textContent = "Your request may not have been received. Please try again or contact us directly.";
                        errorAlert.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error("Verification error:", error);
                    errorAlert.textContent = "We couldn't confirm your request. Please contact us to ensure your spot is reserved.";
                    errorAlert.style.display = 'block';
                })
                .finally(() => {
                    // Stop animation and reset button
                    stopSubmittingAnimation(submitBtn, originalText);
                });
        }, 2000); // Wait 2 seconds before verification
    })
    .catch(error => {
        console.error("Submission error:", error);
        errorAlert.textContent = 'There was an error submitting your request. Please try again or contact us.';
        errorAlert.style.display = 'block';
        
        // Stop animation and reset button
        stopSubmittingAnimation(submitBtn, originalText);
    });
}

function scrollToCurrentWeek() {
    const today = new Date();
    const currentDateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Find a button with today's date or the closest future date
    let targetWeekElement = null;
    let closestFutureDate = null;
    let closestDistance = Infinity;
    
    // Look through all option buttons to find the current or next available date
    document.querySelectorAll('.option-btn[data-date]').forEach(button => {
        const buttonDate = button.getAttribute('data-date');
        const buttonDateObj = new Date(buttonDate);
        
        // If this is today or a future date, consider it
        if (buttonDateObj >= today.setHours(0, 0, 0, 0)) {
            const distance = Math.abs(buttonDateObj - today);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestFutureDate = buttonDate;
                targetWeekElement = button.closest('.week');
            }
        }
    });
    
    // If we found a target week, scroll to it
    if (targetWeekElement) {
        const scrollContainer = document.querySelector('.horizontal-scroll-calendar');
        const containerRect = scrollContainer.getBoundingClientRect();
        const targetRect = targetWeekElement.getBoundingClientRect();
        
        // Calculate the scroll position to show the target week
        const scrollLeft = scrollContainer.scrollLeft + 
                          (targetRect.left - containerRect.left) - 
                          20; // Small offset from the left edge
        
        // Scroll to the target week
        scrollContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        
        console.log(`Auto-scrolled to week containing ${closestFutureDate}`);
    }
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

    setTimeout(() => {
        scrollToCurrentWeek();
    }, 100);
});

// Newsletter signup functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailSignupForm = document.getElementById('email-signup-form');
    const successAlert = document.getElementById('newsletter-success');
    const errorAlert = document.getElementById('newsletter-error');

    if(emailSignupForm) {
        emailSignupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Hide any existing alerts
            successAlert.style.display = 'none';
            errorAlert.style.display = 'none';
            
            // Get the email input value
            const emailInput = document.getElementById('signup-email');
            const email = emailInput.value.trim();
            
            // Validate the email
            if (!email || !isValidEmail(email)) {
                errorAlert.textContent = 'Please enter a valid email address.';
                errorAlert.style.display = 'block';
                return;
            }
            
            // Show loading state
            const submitBtn = emailSignupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            startSubmittingAnimation(submitBtn, originalText);
            
            // Format data for submission
            const formData = {
                email: email,
                source: 'website_newsletter',
                timestamp: new Date().toISOString(),
                referrer: window.location.origin
            };
            
            // Replace with your Google Apps Script Web App URL for newsletter
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyl2kZe52iPa1QDbX8Vj7qFQ1p0wuxUcWOJrtxg8jZV_1VCMOIjNdBTQjwNoqJM38guBw/exec';
            
            // Submit the form data
            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors'
            })
            .then(() => {
                // Show success message
                successAlert.style.display = 'block';
                
                // Reset form
                emailSignupForm.reset();
            })
            .catch(error => {
                console.error("Submission error:", error);
                errorAlert.textContent = 'There was an error processing your subscription. Please try again.';
                errorAlert.style.display = 'block';
            })
            .finally(() => {
                // Reset button
                stopSubmittingAnimation(submitBtn, originalText);
            });
        });
    }
    
    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// DJ Workshop form functionality
document.addEventListener('DOMContentLoaded', function() {
    const djWorkshopForm = document.getElementById('dj-workshop-form');
    const formContainer = document.getElementById('workshop-form-container');

    if (djWorkshopForm) {
        djWorkshopForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get alert elements at the time of submission
            const workshopSuccessAlert = document.getElementById('workshop-success-alert');
            const workshopErrorAlert = document.getElementById('workshop-error-alert');
            
            // Hide any existing alerts
            workshopSuccessAlert.style.display = 'none';
            workshopErrorAlert.style.display = 'none';
            
            // Validate the form
            if (!validateDJWorkshopForm()) {
                workshopErrorAlert.textContent = 'Please fill in all required fields and select at least one workshop date.';
                workshopErrorAlert.style.display = 'block';
                return;
            }
            
            // Collect form data
            const formData = new FormData(djWorkshopForm);
            
            // Convert FormData to an object
            const workshopData = {};
            formData.forEach((value, key) => {
                workshopData[key] = value;
            });
            
            // Submit to Google Sheet - pass the alert elements
            submitDJWorkshopToGoogleSheet(workshopData, workshopSuccessAlert, workshopErrorAlert);
        });
    }
});

// Validate the DJ workshop form
function validateDJWorkshopForm() {
    // Check required fields
    const requiredFields = document.querySelectorAll('#dj-workshop-form [required]');
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            return false;
        }
    }
    
    // Check if at least one workshop date is selected
    const selectedDates = document.querySelectorAll('input[name="workshopDates"]:checked');
    if (selectedDates.length === 0) {
        return false;
    }
    
    return true;
}

// Submit DJ workshop data to Google Sheet
function submitDJWorkshopToGoogleSheet(data, successAlert, errorAlert) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz4PehhpCJoCoqFsOYZBvR3roPsWiK4CsDyhjgaRQLBzSExzyyPQW3tlTMA2gw3MQ4C/exec';
    
    // Show animated loading state
    const submitBtn = document.querySelector('#dj-workshop-form .form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    startSubmittingAnimation(submitBtn, originalText);
    
    // Get selected workshop dates
    const selectedDates = [];
    document.querySelectorAll('input[name="workshopDates"]:checked').forEach(checkbox => {
        selectedDates.push({
            date: checkbox.value,
            formattedDate: formatWorkshopDate(checkbox.value)
        });
    });
    
    // Format data for submission - match camp form structure
    const formattedData = {
        referrer: window.location.origin,
        timestamp: new Date().toISOString(),
        contactEmail: data.contactEmail,
        participantName: data.participantName,
        relationship: data.relationship,
        participantAge: data.participantAge,
        selectedDates: selectedDates,
        formType: 'dj_workshop_rsvp'
    };
    
    console.log('DJ Workshop RSVP Data:', formattedData);
    
    // Submit the form data with no-cors - exactly like camp form
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formattedData),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    })
    .then(() => {
        console.log("DJ Workshop RSVP submission complete, verifying...");
        
        // Wait a moment for the data to be processed by the server
        setTimeout(() => {
            // Create verification URL with the email and timestamp
            const verifyUrl = `${scriptURL}?verify=true&email=${encodeURIComponent(formattedData.contactEmail)}&timestamp=${encodeURIComponent(formattedData.timestamp)}&type=dj_workshop`;
            
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
                        console.log("DJ Workshop RSVP verified with ID:", verification.id);
                        successAlert.textContent = "Your RSVP has been received! We'll confirm your spot via email within 24 hours.";
                        successAlert.style.display = 'block';
                        errorAlert.style.display = 'none';
                        
                        // Reset form
                        document.getElementById('dj-workshop-form').reset();
                        
                    } else {
                        console.error("DJ Workshop RSVP verification failed:", verification.reason);
                        errorAlert.textContent = "Your RSVP may not have been received. Please try again or contact us directly.";
                        errorAlert.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error("DJ Workshop RSVP verification error:", error);
                    errorAlert.textContent = "We couldn't confirm your RSVP. Please contact us to ensure your spot is reserved.";
                    errorAlert.style.display = 'block';
                })
                .finally(() => {
                    // Stop animation and reset button
                    stopSubmittingAnimation(submitBtn, originalText);
                });
        }, 2000); // Wait 2 seconds before verification
    })
    .catch(error => {
        console.error("DJ Workshop RSVP submission error:", error);
        errorAlert.textContent = 'There was an error submitting your RSVP. Please try again or contact us.';
        errorAlert.style.display = 'block';
        
        // Stop animation and reset button
        stopSubmittingAnimation(submitBtn, originalText);
    });
}
// Format workshop date for display
function formatWorkshopDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, parseInt(month) - 1, day);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Fall Programs form functionality
document.addEventListener('DOMContentLoaded', function() {
    const fallProgramsForm = document.getElementById('fall-programs-form');
    
    if (fallProgramsForm) {
        fallProgramsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get alert elements
            const successAlert = document.getElementById('fall-programs-success');
            const errorAlert = document.getElementById('fall-programs-error');
            
            // Hide any existing alerts
            successAlert.style.display = 'none';
            errorAlert.style.display = 'none';
            
            // Validate the form
            if (!validateFallProgramsForm()) {
                errorAlert.textContent = 'Please fill in all required fields and select at least one program.';
                errorAlert.style.display = 'block';
                return;
            }
            
            // Collect form data
            const formData = new FormData(fallProgramsForm);
            
            // Convert FormData to an object
            const fallProgramsData = {};
            formData.forEach((value, key) => {
                if (key === 'programInterest') {
                    // Handle multiple checkboxes
                    if (!fallProgramsData[key]) {
                        fallProgramsData[key] = [];
                    }
                    fallProgramsData[key].push(value);
                } else {
                    fallProgramsData[key] = value;
                }
            });
            
            // Submit to Google Sheet
            submitFallProgramsToGoogleSheet(fallProgramsData, successAlert, errorAlert);
        });
    }
});

// Validate the Fall Programs form
function validateFallProgramsForm() {
    // Check required fields
    const requiredFields = document.querySelectorAll('#fall-programs-form [required]');
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            return false;
        }
    }
    
    // Check if at least one program is selected
    const selectedPrograms = document.querySelectorAll('input[name="programInterest"]:checked');
    if (selectedPrograms.length === 0) {
        return false;
    }
    
    return true;
}

// Submit Fall Programs data to Google Sheet
function submitFallProgramsToGoogleSheet(data, successAlert, errorAlert) {
    // Google Apps Script Web App URL for Fall Programs
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyZi4PeouyUIbl2Ia4TizRS-EF95o8s7vDkVVYeSxcLb6MOoaObkzRoltjzMEPLx19K/exec';
    
    // Show animated loading state
    const submitBtn = document.querySelector('#fall-programs-form .form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    startSubmittingAnimation(submitBtn, originalText);
    
    // Format data for submission
    const formattedData = {
        referrer: window.location.origin,
        timestamp: new Date().toISOString(),
        parentEmail: data.parentEmail,
        childName: data.childName,
        childAge: data.childAge,
        programsInterested: data.programInterest || [],
        formType: 'fall_programs_request'
    };
    
    console.log('Fall Programs Request Data:', formattedData);
    
    // Submit the form data with no-cors
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formattedData),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    })
    .then(() => {
        console.log("Fall Programs request submission complete, verifying...");
        
        // Wait a moment for the data to be processed by the server
        setTimeout(() => {
            // Create verification URL with the email and timestamp
            const verifyUrl = `${scriptURL}?verify=true&email=${encodeURIComponent(formattedData.parentEmail)}&timestamp=${encodeURIComponent(formattedData.timestamp)}&type=fall_programs`;
            
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
                        console.log("Fall Programs request verified with ID:", verification.id);
                        successAlert.textContent = "Your request has been received! We'll contact you within 24 hours to discuss enrollment details.";
                        successAlert.style.display = 'block';
                        errorAlert.style.display = 'none';
                        
                        // Reset form
                        document.getElementById('fall-programs-form').reset();
                        
                    } else {
                        console.error("Fall Programs request verification failed:", verification.reason);
                        errorAlert.textContent = "Your request may not have been received. Please try again or contact us directly.";
                        errorAlert.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error("Fall Programs request verification error:", error);
                    errorAlert.textContent = "We couldn't confirm your request. Please contact us to ensure we received it.";
                    errorAlert.style.display = 'block';
                })
                .finally(() => {
                    // Stop animation and reset button
                    stopSubmittingAnimation(submitBtn, originalText);
                });
        }, 2000); // Wait 2 seconds before verification
    })
    .catch(error => {
        console.error("Fall Programs request submission error:", error);
        errorAlert.textContent = 'There was an error submitting your request. Please try again or contact us directly.';
        errorAlert.style.display = 'block';
        
        // Stop animation and reset button
        stopSubmittingAnimation(submitBtn, originalText);
    });
}

// Share flyer functionality
async function shareFlyer(programName, flyerPath) {
    const flyerUrl = `${window.location.origin}/${flyerPath}`;
    
    // Check if Web Share API is supported and can share files
    if (navigator.share && navigator.canShare) {
        try {
            // Try to fetch the file and share it directly
            const response = await fetch(flyerPath);
            if (response.ok) {
                const blob = await response.blob();
                const file = new File([blob], `OH_${programName}_Flyer_Fall_25.jpg`, { type: 'image/jpeg' });
                
                const shareData = {
                    title: `[${programName}] - Odd Harmonics Fall Program`,
                    text: `Check out this ${programName} program from Odd Harmonics!`,
                    files: [file]
                };
                
                // Check if we can share files
                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    console.log('file shared successfully');
                    return;
                }
            }
        } catch (error) {
            console.log('File sharing failed, falling back to URL share:', error);
        }
        
        // Fallback to URL sharing if file sharing fails
        try {
            const urlShareData = {
                title: `[${programName}] - Odd Harmonics Fall Program`,
                text: `Check out this [${programName}] after program from Odd Harmonics!`,
                url: flyerUrl
            };
            
            await navigator.share(urlShareData);
            console.log('URL shared successfully');
            return;
        } catch (error) {
            console.log('URL sharing failed:', error);
        }
    }
    
    // Final fallback for browsers without Web Share API
    fallbackShare(flyerUrl, programName);
}

// Fallback share function for browsers without Web Share API
function fallbackShare(url, programName) {
    // Create a temporary input element to copy URL to clipboard
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
        document.execCommand('copy');
        // Show a temporary success message
        showTemporaryMessage(`${programName} flyer link copied to clipboard!`);
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        // Fallback: open in new tab
        window.open(url, '_blank');
        showTemporaryMessage(`${programName} flyer opened in new tab`);
    }
    
    document.body.removeChild(tempInput);
}

// Show temporary success message
function showTemporaryMessage(message) {
    // Create temporary message element
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success);
        color: var(--white-color);
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-family: var(--body-font-family);
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBox = document.getElementById('fall-modal');
  const closeBtn = document.getElementById('modal-close');

  // Clicking X closes modal
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modalOverlay.style.display = 'none';
  });

  // Clicking anywhere on modal box = scroll
  modalBox.addEventListener('click', (e) => {
    e.stopPropagation();
    modalOverlay.style.display = 'none';
    const section = document.querySelector('#after-school-programs');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Clicking outside modal box = dismiss
  modalOverlay.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
  });
});
