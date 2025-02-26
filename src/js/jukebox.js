import { db } from "../content/firebase.js";

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

  // isPlay 상태를 토글하는 메서드
  togglePlay() {
      this.isPlay = !this.isPlay;
  }
}

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

            const song = 
              new Song(music.no, music.id, music.isPlay, music.title, music.artist, music.path);
            playLists.push(song);
        });
        renderSongList(playLists); // UI에 출력
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
      playLists.forEach(song => {
          if (song.id == songId) {
              song.togglePlay();
              // db.collection('jukebox').where("id", "==", song.id).get().then(function(f) {
              //   f.forEach(function(document) {
              //     document.ref.update({
              //       isPlay: song.isPlay
              //     });
              //   });
              // })

              db.collection('jukebox').get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    if (doc.data().id === song.id) {
                      doc.ref.update({ isPlay: song.isPlay });
                    }
                  });
                });

          }
      });
  }
});

function updateIsPlaying()
{
  const playListRef = db.collection('jukebox');
      for(let [key, value] of changeList)
      {
        playListRef.where("id", "==", key).get().then((e)=>
        {
          e.forEach(element => {
            console.log(element.data());
          });
        })
      }
}