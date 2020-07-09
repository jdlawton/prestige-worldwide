window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQCci1bq3YryhZblbOUsf7H0e6DYcEim-BJDy8TFzHZANtkxyG0sUnBd9EydBd7rNo8Gb0nbo32sddXIBKghDvqv-xtSsKntYkBqLBlhruaoVhDumVSxfVx8NJrrnKAjHTeGGqWQCV1sYJf9X3tGZPiVmybU1BkgNf3RUvnkvDhpRQieefVGuts';
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
  
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    player.addListener('player_state_changed', state => { 
        console.log('state_change', state);
        trackInfo();
    });
  
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();

    var pauseEl = document.querySelector("#pause");
    var resumeEl = document.querySelector("#resume");
    var nextEl = document.querySelector("#next");
    var previousEl = document.querySelector("#previous");
    var butContainEl = document.querySelector("#button-container");
    var connectEl = document.querySelector("#connect");

    var pauseEventHandler = function () { 	
        player.pause().then(() => {
            console.log('Paused!');
        });
    }

    var resumeEventHandler = function () { 	
        player.resume().then(() => {
            console.log('Resumed!');
        });
    }

    var nextEventHandler = function () {
        player.nextTrack().then(() => {
            console.log('Skipped to next track!');
        });
    }

    var previousEventHandler = function () {
        player.previousTrack().then(() => {
            console.log('Set to previous track!');
        });
    }

    var connectEventHandler = function () {
      
    }

    var trackInfo = function () {
        player.getCurrentState().then(state => {
            if (!state) {
              console.error('User is not playing music through the Web Playback SDK');
              return;
            }
          
            let {
              current_track,
              next_tracks: [next_track]
            } = state.track_window;
          
            console.log('Currently Playing', current_track);
            console.log('Playing Next', next_track);
          });
    }


    //event listener for buttons
    pauseEl.addEventListener("click", pauseEventHandler);
    resumeEl.addEventListener("click", resumeEventHandler);
    nextEl.addEventListener("click", nextEventHandler);
    previousEl.addEventListener("click", previousEventHandler);
    connectEl.addEventListener("click", connectEventHandler);

};