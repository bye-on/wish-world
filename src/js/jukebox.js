import { db } from "../content/firebase.js";
// import { playlist } from "./music_play.js";
import { parseAfterDelimiter } from "./utils.js";
import { getUserId, songLists, Song, setSongLists } from "./init.js";

let playLists = [];

document.addEventListener("DOMContentLoaded", async function () {
    await getPlayList();
    await setSongLists();
    
    document.getElementById("updateList").addEventListener('click', updateIsPlaying);

    // document.getElementById("songForm").addEventListener("submit", function (event) {
    //     event.preventDefault();
    //     addSong();
    // });
});

/*
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
*/

async function getPlayList() {
  const userId = getUserId();
  const userRef = db.collection('playlist').doc(userId);

  try {
    const doc = await userRef.get();
    if (doc.exists) {
      playLists = doc.data().playList || [];
      renderSongList(playLists);
    } else {
      console.warn(`⚠️ ${userId}의 플레이리스트가 없음.`);
    }
  } catch (error) {
    console.error("🔥 플레이리스트 가져오기 오류:", error);
  }
}

function renderSongList(songList) {
  const jukeboxTable = document.getElementById("song-list");
  // jukeboxTable.innerHTML = ""; // 기존 목록 초기화

  songList.forEach((song, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td style="width:20px"><input type="checkbox" class="song-checkbox" data-id="${song.id}" ${song.isPlay ? "checked" : ""} /></td>
          <td align="center">${index + 1}</td>
          <td><span style="padding-left: 10px; padding-right: 10px;">${song.title}</span></td>
          <td><span style="padding-left: 10px; padding-right: 10px;">${song.artist}</span></td>
      `;
      jukeboxTable.appendChild(row);
  });
}

const changeList = new Map();
document.getElementById("song-list").addEventListener("change", function (event) {
  if (event.target.classList.contains("song-checkbox")) {
      const songId = event.target.dataset.id;

      // 플레이리스트 내에서 해당 노래 찾아서 isPlay 변경
      songLists.forEach(song => {
          if (song.id == songId) {
              song.isPlay = !song.isPlay;
              changeList.set(song.id, song.isPlay);
          }
      }); 
  }
});

document.getElementById("checkAll").addEventListener("change", function(event) {
  const checkBoxes = document.querySelectorAll('.song-checkbox');
  const trigger = event.target.checked;
  let index = 1;

  for(let checkbox of checkBoxes)
  {
    checkbox.checked = trigger;
    changeList.set(index++, trigger);
  }
});

async function updateIsPlaying() {
  const userId = getUserId();
  const userRef = db.collection('playlist').doc(userId);

  try {
    const doc = await userRef.get();
    if (!doc.exists) return console.warn("⚠️ 플레이리스트 데이터 없음.");

    let userPlayList = doc.data().playList;

    for (let [songId, isPlay] of changeList) {
      userPlayList = userPlayList.map(song => song.id === songId ? { ...song, isPlay } : song);
    }

    await userRef.update({ playList: userPlayList });
    console.log(`✅ ${userId}의 플레이리스트 업데이트 완료`);
    changeList.clear();
    await reloadPlayList(); // 최신 플레이리스트 다시 불러오기/
  } catch (error) {
    console.error("🔥 플레이리스트 업데이트 오류:", error);
  }
}

async function reloadPlayList() {
  const userId = getUserId(); // 현재 사용자 ID 가져오기
  const userRef = db.collection('playlist').doc(userId); // 사용자의 플레이리스트 문서 참조

  try {
      const doc = await userRef.get();
      if (!doc.exists) {
          console.warn(`⚠️ ${userId}의 플레이리스트가 없음.`);
          return;
      }

      const userPlayList = doc.data().playList || []; // 사용자의 플레이리스트 가져오기

      // isPlay가 true인 노래만 필터링하여 playLists에 저장
      playLists = userPlayList
          .filter(song => song.isPlay)
          .map(music => new Song(music.no, music.id, music.isPlay, music.title, music.artist, music.path));

      console.log(`🎵 ${userId}의 활성화된 플레이리스트:`, playLists);
    } catch (error) {
        console.error("🔥 플레이리스트 가져오기 오류:", error);
    }
}
