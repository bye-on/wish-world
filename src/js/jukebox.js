const API_KEY = 'YOUR_YOUTUBE_API_KEY';
let player;

function searchMusic() {
    const query = document.getElementById('search').value;
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const videoId = data.items[0].id.videoId;
            addToPlaylist(data.items[0].snippet.title, videoId);
        })
        .catch(error => console.error('Error:', error));
}

function addToPlaylist(title, videoId) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${title} <button onclick="playMusic('${videoId}')">재생</button>`;
    document.getElementById('playlist').appendChild(listItem);
}

function playMusic(videoId) {
    if (!player) {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: videoId,
            playerVars: { 'autoplay': 1, 'controls': 1 },
        });
    } else {
        player.loadVideoById(videoId);
    }
}
