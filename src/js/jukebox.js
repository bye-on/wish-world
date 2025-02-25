import { db } from "../content/firebase.js";

document.addEventListener("DOMContentLoaded", function () {
    loadSongList(); // 페이지 로드 시 방명록 목록 불러오기

    // document.getElementById("songForm").addEventListener("submit", function (event) {
    //     event.preventDefault();
    //     addSong();
    // });
});

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
      document.getElementById("songForm").reset();
      loadSongList();
    })
    .catch((error) => console.error("Error:", error));
}

function loadSongList() {
    const jukeboxList = document.getElementById("song-list");
    jukeboxList.innerHTML = ""; // 기존 목록 초기화

    db.collection('jukebox').orderBy('id').get().then((element) => {
        element.forEach((doc) => {
            const music = doc.data();

            const musicElement = document.createElement("div");
            musicElement.className = "song-post"
            musicElement.innerHTML = `
                <div class="song-form">
                    <input type="checkbox" id="song-checkbox" ${music.isPlay ? "checked" : ""} />
                    <span>${music.id}</span>
                    <span>${music.title}</span>
                    <span>${music.artist}</span>
                </div>
            `
            jukeboxList.appendChild(musicElement);
        });
    }).catch((error) => console.error("Error:", error));
}
