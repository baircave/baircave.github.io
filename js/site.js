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
    // menu.style.display = menu.style.display === "flex" ? "none" : "flex";
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