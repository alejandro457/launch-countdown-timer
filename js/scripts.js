const flipSound = new Audio('./assets/sounds/flip.wav');

const volumeBtn = document.getElementById('volume-btn');
const volume = document.getElementById('volume');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');

const timer = document.getElementById('timer');

let days = document.getElementById('days');
let hours = document.getElementById('hours');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');

const cards = [seconds, minutes, hours, days];

const preset = [59, 59, 23, 99];

let time;

let interval;

let muted = true;


volume.addEventListener('input', () => {
	
	if (!muted) {

		if (volume.value <= 0.5) {
			volumeBtn.firstElementChild.textContent = 'volume_down';

		} else if (volume.value > 0.5) {
			volumeBtn.firstElementChild.textContent = 'volume_up';
		}
	}
	
	volume.style = '--width:' + (volume.value * 100) + '%;';
	flipSound.volume = volume.value;
})

settingsBtn.addEventListener('click', () => {
	settings.classList.toggle('show');
});
volumeBtn.addEventListener('click', () => {
	if (muted) {
		muted = false;
		unMute();
		
	} else {
		muted = true;
		mute();
	}
});

settings.addEventListener('submit', (e) => {
	e.preventDefault();
	clearInterval(interval);

	startTimer(settings.days.value, settings.hours.value, settings.minutes.value, settings.seconds.value);
})

const mute = () => {
	flipSound.muted = true;
	volumeBtn.firstElementChild.textContent = 'volume_off';
	volume.setAttribute('disabled', '')
}
const unMute = () => {
	flipSound.muted = false;
	volumeBtn.firstElementChild.textContent = volume.value <= 0.5 ? 'volume_down' : 'volume_up';
	volume.removeAttribute('disabled');
}

const countdown = () => {

	const setNumber = (index) => {
		let num = time[index] > 9 ? time[index] : '0' + time[index];

		cards[index].parentElement.dataset.timetop = num;
		cards[index].lastElementChild.textContent = num;

		cards[index].classList.add('is-flipped');

		flipSound.play()
		.catch(err => {
			console.log(err);
			volumeBtn.firstElementChild.textContent = 'volume_off';
		});
	} 

	for (let index in time) {
		if (time[index] > 0) {
			time[index]--;

			setNumber(index);

			for (let i = index; i > 0; i--) {
				time[i - 1] = preset[i - 1];

				setNumber(i - 1);
			}
			break;
		}
	}
}

const startTimer = (days, hours, minutes, seconds) => {
	time = [seconds, minutes, hours, days];

	cards.forEach((el, index) => {
		el.parentElement.dataset.time = time[index] > 9 ? time[index] : '0' + time[index];
		el.firstElementChild.textContent = time[index] > 9 ? time[index] : '0' + time[index];
	})

	timer.addEventListener('transitionend', (e) => {
		let num = time[cards.indexOf(e.target)];

		e.target.parentElement.dataset.time = num > 9 ? num : '0' + num;
		e.target.firstElementChild.textContent = num > 9 ? num : '0' + num;
		
		e.target.classList.remove('is-flipped');
	})

	interval = setInterval(countdown, 1000);
}

const main = () => {
	flipSound.volume = volume.value;
	mute();
	startTimer(1, 1, 1, 3);
}

main();
