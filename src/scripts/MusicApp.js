function musicApp() {

    let canvas = document.getElementById('myCanvas');
    let audio = document.getElementById('myAudio');

    // Audio Source
    // Create audio context
    // let audioCtx = new AudioContext() || new webkitAudioContext();
    let audioCtx = new AudioContext();

    // Create audio node so that the analyser can work with
    let source = audioCtx.createMediaElementSource(audio);

    // Create analyser
    let analyser = audioCtx.createAnalyser();

    // Make 2d context
    let ctx = canvas.getContext('2d');

    // Make connections
    source.connect(analyser);
    source.connect(audioCtx.destination);

    // analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.6;
    analyser.fftSize = 512;

    // Buffer length
    let bufferLength = analyser.frequencyBinCount;
    let data = new Uint8Array(bufferLength);

    // Draw function
    function draw(data) {
        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1,'#ff0033');
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';

        let cx = canvas.width / 2;
        let cy = canvas.height / 2;
        let radius = 140;
        let barWidth = 2;
        let barHeight = 2;
        let barSpacing = 7;
        let maxBarNum = Math.floor((radius * 2 * Math.PI) / (barWidth +barSpacing));
        let slicedPercent = Math.floor((maxBarNum * 25) / 100);
        let barNum = maxBarNum - slicedPercent;
        let freqJump = Math.floor(data.length / maxBarNum);

        for(let i = 0; i < barNum; i++) {
            let amplitude = data[i * freqJump];
            let alfa = (i * 2 * Math.PI) / maxBarNum;
            let beta = (3 * 45 - barWidth) * Math.PI / 280;
            let x = 0;
            let y = radius - (amplitude / 12 - barHeight);
            let w = barWidth;
            let h = amplitude / 6 + barHeight;

            ctx.save();
            ctx.translate(cx + barSpacing, cy + barSpacing);
            ctx.rotate(alfa - beta);
            ctx.fillRect(x, y, w, h);
            ctx.restore();
        }
    }

    // Loop function
    function loopingFunction() {
        requestAnimationFrame(loopingFunction);
        analyser.getByteFrequencyData(data);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(data);
    }

    loopingFunction();

    // Play music
    let play = document.querySelector('.icon-play-pause');
    let musicIcon = document.querySelector('.icon-play-pause img');

    function playMusic() {
        audioCtx.resume();
        canvas.classList.remove('opacity-js');
    
        if(audio.paused) {
            audio.play();
            musicIcon.src = 'assets/images/player/pause.png';
        } else {
            audio.pause();
            musicIcon.src = 'assets/images/player/play.png';
        }
    }
    play.addEventListener('click', playMusic);

    // Stop music
    let stop = document.querySelector('.music-stop');

    function stopMusic() {
        audio.pause();
        audio.currentTime = 0;
        musicIcon.src = 'assets/images/player/play.png';
    }

    stop.addEventListener('click', stopMusic);

    // Load track functionality
    let songs = document.querySelectorAll('.song-select');
    let songArr = [];

    songs.forEach(function(song) {
        songArr.push({
            songName: song.dataset.name,
            songAuthor: song.dataset.author,
            songPath: song.dataset.path
        });
    });

    let musicName = document.querySelector('.music-name p');
    let counter = 0;
    let maxSongs = songArr.length;

    function loadMusic(counter) {
        audio.src = `${songArr[counter].songPath}`;
        audio.load();
        musicName.textContent = `${songArr[counter].songAuthor} - ${songArr[counter].songName}`;
    }
    
    loadMusic(counter);

    // Next and prev song
    let next = document.querySelector('.music-next');
    let prev = document.querySelector('.music-prev');

    next.addEventListener('click', function() {
        if(counter < maxSongs -1) {
            counter++;
            loadMusic(counter);
        } else {
            counter = 0;
            loadMusic(counter);
        }
        playMusic();
    });

    prev.addEventListener('click', function() {
        if (counter === 0) {
            counter = maxSongs; 
        }
        
        counter--;
        loadMusic(counter);
        playMusic();
    });

    // Music end
    audio.addEventListener('ended', function() {
        audio.currentTime = 0;
        musicIcon.src = 'assets/images/player/play.png';
    });

    // Toggle music player
    let musicPlayer = document.querySelector('.music-player');
    let openMusicPlayer = document.querySelector('.music-button-js');
    let closeMusicPlayer = document.querySelector('.music-close-button');

    function openPlayer() {
        musicPlayer.classList.remove('music-hidden-js');
        musicPlayer.classList.add('music-active-js');
        audioCtx.resume();
        document.querySelector('body').classList.add('music-scroll-js');
    }

    function closePlayer() {
        musicPlayer.classList.remove('music-active-js');
        musicPlayer.classList.add('music-hidden-js');
        stopMusic();
        counter = 0;
        loadMusic(counter);
        audioCtx.suspend();
        canvas.classList.add('opacity-js');
        document.querySelector('body').classList.remove('music-scroll-js');
    }

    openMusicPlayer.addEventListener('click', openPlayer);
    closeMusicPlayer.addEventListener('click', closePlayer);

    document.addEventListener('keyup', function(e) {
        if(e.key === 'Escape') {
            closePlayer();
        }
    });

    // Toggle controls
    let toggleControl = document.querySelector('.controls');

    toggleControl.addEventListener('click',() => {
        if(audio.hasAttribute('controls')) {
            audio.removeAttribute('controls')
        } else {
            audio.setAttribute('controls', 'controls');
        }
    })

    // Toggle video
    let vid = document.querySelector('.video-background video');
    let toggleVid = document.querySelector('.vid');

    toggleVid.addEventListener('click', function() {
        if(vid.paused || vid.ended) {
            vid.play()
            vid.style.opacity = '0.15';
        } else {
            vid.style.opacity = '0';
            vid.pause();
        }
    });
}

export default musicApp;