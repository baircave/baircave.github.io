"use strict";

const trackTitles = [
	"Nick Newhouse - Overfalls",
	"Nick Newhouse - Let Me Cry",
	"Walter - Call of the Wild",
	"Walter - The Inside",
	"Baircave & Catmosphere - The Siren Song [Radio Edit]",
	"Baircave & arthur x medic - Alice",
	"Baircave & Voia - Folds",
	"Jay Sean - Down [NN Bootleg]",
	"Nick Newhouse - Every Night (In My Dreams)",
	"Buoy Afuru - Light Up",
	"Buoy Afuru - Ocean Wave"
];
const trackFilenames = [
	'Overfalls.mp3', 
	'Let_Me_Cry.mp3',
	'cotw.mp3',
	'the_inside.mp3',
	'the_siren_song.mp3',
	'Alice.mp3',
	'Folds.mp3',
	'down.mp3',
	'every_night.mp3',
	'light_up.mp3',
	'ocean_wave.mp3'
];
const credits = [
	'written, produced, mixed, & mastered by me', 
	'written, produced, mixed, & mastered by me',
	'produced, mixed, & mastered by me',
	'produced, mixed, & mastered by me; written by me & Walter',
	'written & mastered by me; produced & mixed by me & Catmosphere',
	'mixed & mastered by me; produced & written by me & arthur x medic',
	'mixed & mastered by me; produced & written by me & voia',
	'remixed by me (w/o permission, so SHH!!!)',
	'written, produced, mixed, & mastered by me',
	'vocal production, mixing, & mastering by me',
	'vocal production, mixing, & mastering by me'
];
const audio = document.getElementById('audio-player');
const elapsedTime = document.getElementById('elapsed-time');
const duration = document.getElementById('duration');
const trackTitle = document.getElementById('track-info');

const backgroundNN = document.getElementById('nn-video');
const headshot = document.getElementById('headshot');
const glitch = document.getElementById('glitch');

var videosLoaded = 0;
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

function switchVideos() {
	if (isHeadshot) {
		headshot.style.zIndex = -2;
		setTimeout(() => {
			isHeadshot = 0;
			backgroundNN.style.zIndex = 0;
		}, 500);
	} else {
		backgroundNN.style.zIndex = -2
		setTimeout(() => {
			isHeadshot = 1;
			headshot.style.zIndex = 0;
		}, 500);
	}
}

function fixVideoSources() {
	if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
		backgroundNN.src = "images/NN_logo_CRT_floating.mov";
		backgroundNN.type = "video/mp4";
		glitch.src = "images/CRT_static.mov";
		glitch.type = "video/mp4";
		headshot.src = "images/CRT_headshot_w_text.mov";
		headshot.type = "video/mp4";
	}
}

function syncVideos() {
	if (videosLoaded < 3) {
		setTimeout(() => {
			syncVideos();
			
		}, 200);
		return;
	}

	backgroundNN.play();
	glitch.play();
	headshot.play();
}

// spacebar play pause
document.body.onkeyup = function(e) {
	if (e.key == " " ||
		e.code == "Space" ||      
		e.keyCode == 32      
	) {
	    e.preventDefault();
	    playPause();
	}
}

document.body.onkeydown = function(e) {
	if (e.key == " " ||
		e.code == "Space" ||      
		e.keyCode == 32      
	) {
	    e.preventDefault();
	}
}

trackTitle.innerHTML = trackTitles[currentTrack];
backgroundNN.onloadeddata = () => videosLoaded += 1;
headshot.onloadeddata = () => videosLoaded += 1;
glitch.onloadeddata = () => videosLoaded += 1;
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
setInterval(() => {
	switchVideos();
}, 60000);
fixVideoSources();
syncVideos();

navigator.mediaSession.setActionHandler('play', () => play());
navigator.mediaSession.setActionHandler('pause', () => pause());
navigator.mediaSession.setActionHandler('seekbackward', () => rewind());
navigator.mediaSession.setActionHandler('seekforward', () => fastForward());
navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());

// // canvas stuff!

// // wait for the content of the window element
// // to load, then performs the operations.
// // This is considered best practice.
// window.addEventListener('load', ()=>{
// 	resize(); // Resizes the canvas once the window loads
// 	document.addEventListener('mousemove', sketch);
// 	window.addEventListener('resize', resize);
// });

// const canvas = document.querySelector('#canvas');

// // Context for the canvas for 2 dimensional operations
// const ctx = canvas.getContext('2d');

// // Resizes the canvas to the available size of the window.
// function resize() {
// 	ctx.canvas.width = window.innerWidth;
// 	ctx.canvas.height = window.innerHeight;
// }

// // Stores the initial position of the cursor
// let coord = {x:500 , y:500};

// let mouseUpdateCounter = 1; 

// // Updates the coordianates of the cursor when
// // an event e is triggered to the coordinates where
// // the said event is triggered.
// function getPosition(event){
// 	if (mouseUpdateCounter % 50 == 0) {
// 		mouseUpdateCounter = 1

// 		coord.x = event.clientX - canvas.offsetLeft;
// 		coord.y = event.clientY - canvas.offsetTop;
// 	} else {
// 		mouseUpdateCounter += 1;
// 	}
// }

// function startPainting(event){
// 	getPosition(event);
// }

// function sketch(event){
// 	ctx.beginPath();

// 	ctx.lineWidth = 2;

// 	ctx.strokeStyle = 'rgba(40,25,100, 1)';
	
// 	// The cursor to start drawing
// 	// moves to this coordinate
// 	ctx.moveTo(coord.x, coord.y);

// 	// The position of the cursor
// 	// gets updated as we move the
// 	// mouse around.
// 	getPosition(event);

// 	// A line is traced from start
// 	// coordinate to this coordinate
// 	ctx.lineTo(coord.x , coord.y);

// 	// Draws the line.
// 	ctx.stroke();
// }