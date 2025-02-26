import { db } from "../content/firebase.js";
// import { playlist } from "./music_play.js";
import { parseAfterDelimiter } from "./utils.js";

let songLists = [];
let playLists = [];

class Song {
  constructor(no, id, isPlay, title, artist, path) {
      this.no = no;
      this.id = id;           // 고유 식별자
      this.isPlay = isPlay;   // 현재 재생 여부
      this.title = title;     // 노래 제목
      this.artist = artist;   // 아티스트
      this.path = path;       // 노래 경로 (유튜브 ID 등)
  }

  togglePlay() {
      this.isPlay = !this.isPlay;
  }
}

document.addEventListener("DOMContentLoaded", function () {
    loadSongList(); // 페이지 로드 시 방명록 목록 불러오기
    
    document.getElementById("updateList").addEventListener('click', updateIsPlaying);
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
    .then(() => {
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

            const song = 
              new Song(music.no, music.id, music.isPlay, music.title, music.artist, music.path);
            songLists.push(song);
        });
        renderSongList(songLists); // UI에 출력
    }).catch((error) => console.error("Error:", error));
}

function renderSongList(songList) {
  const jukeboxList = document.getElementById("song-list");
  jukeboxList.innerHTML = ""; // 기존 목록 초기화

  songList.forEach((song) => {
      const musicElement = document.createElement("div");
      musicElement.className = "song-post";
      musicElement.innerHTML = `
          <div class="song-form">
              <input type="checkbox" class="song-checkbox" data-id="${song.id}" ${song.isPlay ? "checked" : ""} />
              <span>${song.id}</span>
              <span>${song.title}</span>
              <span>${song.artist}</span>
          </div>
      `;
      jukeboxList.appendChild(musicElement);
  });
}

const changeList = new Map();
document.getElementById("song-list").addEventListener("change", function (event) {
  if (event.target.classList.contains("song-checkbox")) {
      const songId = event.target.dataset.id;

      // DTO 리스트에서 해당 노래 찾아서 isPlay 변경
      songLists.forEach(song => {
          if (song.id == songId) {
              song.togglePlay();
              changeList.set(song.id, song.isPlay);
          }
      });
  }
});

function updateIsPlaying() {
  const playListRef = db.collection('jukebox');
  let updatePromises = []; // 비동기 업데이트를 추적할 배열

  for (let [key, value] of changeList) {
    let promise = playListRef.where("id", "==", key).get().then(snapshot => {
      let batchUpdates = [];
      snapshot.forEach(doc => {
        batchUpdates.push(doc.ref.update({ isPlay: value }));
      });
      return Promise.all(batchUpdates); 
    });

    updatePromises.push(promise); 
  }

  // 모든 업데이트가 완료된 후 실행
  Promise.all(updatePromises).then(() => {
    changeList.clear();
    return getPlayList(); // getPlayList 실행
  }).catch(error => {
    console.error("업데이트 중 오류 발생:", error);
  });
}

function getPlayList() {
  playLists.length = 0; // 기존 배열 초기화

  return db.collection('jukebox').where("isPlay", "==", true).get().then(snapshot => {
    snapshot.forEach(doc => {
      const music = doc.data();

      const song = new Song(music.no, music.id, music.isPlay, music.title, music.artist, music.path);
      playLists.push(song);
    });
  }).catch(error => {
    console.error("플레이리스트 가져오기 오류:", error);
  });
}

