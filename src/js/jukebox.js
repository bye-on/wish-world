import { db } from "../content/firebase.js";


document.addEventListener("DOMContentLoaded", function () {
    loadSongList(); // 페이지 로드 시 방명록 목록 불러오기

    document.getElementById("songForm").addEventListener("submit", function (event) {
        event.preventDefault();
        addSong();
    });
});

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/embed/";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "0",
    width: "0",
    videoId: "u0JxxLZpc3E",
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: "u0JxxLZpc3E",
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function addSong() {
    const isPlaying = document.getElementById("isPlay").checked;
    const no = document.getElementById("no").value;
    const id = document.getElementById("id").value;
    const url = document.getElementById("path").value;
    const title = document.getElementById("title").value;
    const artist = document.getElementById("artist").value;

    if (!no || !id || !title || !artist || !url)
        return alert("올바른 정보를 입력하세요!");

  const jukeboxRef = db.collection("jukebox");
    jukeboxRef.add({
        no: no,
        id: id,
        isPlay: isPlaying,
        path: url,
        title: title,
        artist: artist,
    })
    .then((data) => {
      if (data.success) {
        document.getElementById("songList").reset();
        loadSongList();
      }
    })
    .catch((error) => console.error("Error:", error));
}

function loadSongList() {
    const jukeboxList = document.getElementById("song-list");
    jukeboxList.innerHTML = ""; // 기존 목록 초기화

    db.collection('jukebox').get().then((element) => {
        element.forEach((doc) => {
            const music = doc.data();

            const musicElement = document.createElement("div");
            musicElement.className = "song-post"
            musicElement.innerHTML = `
                <div class="song-form">
                    <input type="checkbox" ${music.isPlay ? "checked" : ""} />
                    <span>${music.id}</span>
                    <span>${music.title}</span>
                    <span>${music.artist}</span>
                </div>
            `
            jukeboxList.appendChild(musicElement);
        });
    })
    .catch((error) => console.error("Error:", error));
}

// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.ENDED) {
//     console.log("onPlayerStateChange:", event.data, "ENDED");
//   } else if (event.data == YT.PlayerState.PLAYING) {
//     console.log("onPlayerStateChange:", event.data, "PLAYING");
//   } else if (event.data == YT.PlayerState.PAUSED) {
//     console.log("onPlayerStateChange:", event.data, "PAUSED");
//   } else if (event.data == YT.PlayerState.BUFFERING) {
//     console.log("onPlayerStateChange:", event.data, "BUFFERING");
//   } else if (event.data == YT.PlayerState.CUED) {
//     console.log("onPlayerStateChange:", event.data, "CUED");
//   }
// }

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    // done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

function searchMusic() {
  const query = document.getElementById("search").value;
  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const videoId = data.items[0].id.videoId;
      addToPlaylist(data.items[0].snippet.title, videoId);
    })
    .catch((error) => console.error("Error:", error));
}

function addToPlaylist(title, videoId) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `${title} <button onclick="playMusic('${videoId}')">재생</button>`;
  document.getElementById("playlist").appendChild(listItem);
}

function playMusic(videoId) {
  if (!player) {
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId: videoId,
      playerVars: { autoplay: 1, controls: 1 },
    });
  } else {
    player.loadVideoById(videoId);
  }
}
