import { db } from "../content/firebase.js";
import { getUserId, initializeUserPlayList, trueSongLists, setSongLists } from "./init.js";
import { parseAfterDelimiter } from "./utils.js";

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

let playlist = [];
var videoIndex = 0;

const delimiter = "watch?v=";

document.addEventListener("DOMContentLoaded", async function () {
  await initializeUserPlayList(); // 새로운 사용자인지 확인 ? 초기화 : ""
  await setSongLists();
  await init(); // 초기화된 플레이리스트 재생

  document.getElementById("play").addEventListener("click", playVideo);
  document.getElementById("pause").addEventListener("click", pauseVideo);
  document.getElementById("prev").addEventListener("click", prevVideo);
  document.getElementById("next").addEventListener("click", nextVideo);
});

function init() {
  const userId = getUserId(); // 현재 사용자 ID 가져오기
  const userRef = db.collection("playlist").doc(userId);

  userRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.warn(`⚠️ ${userId}의 플레이리스트가 없음.`);
        return Promise.reject("플레이리스트 없음");
      }

      const userPlayList = doc.data().playList || []; // 사용자의 플레이리스트 가져오기

      // 🔹 isPlay === true인 노래만 playlist에 담기
      playlist = userPlayList
        .filter((song) => song.isPlay)
        .map((song) => parseAfterDelimiter(song.path, delimiter));

      console.log(`🎵 ${userId}의 활성화된 유튜브 ID 리스트:`, playlist);
      setUpPlayer();
    })
    .catch((error) => {
      console.error("🔥 플레이리스트 초기화 오류:", error);
    });
}

function setUpPlayer() {
  window.YT.ready(function () {
    player = new YT.Player("player", {
      height: "0",
      width: "0",
      videoId: playlist[videoIndex],
      playerVars: {
        autoplay: 1,
        loop: 0,
        playlist: playlist[videoIndex],
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    // 비디오가 끝나면
    videoIndex = (videoIndex + 1) % playlist.length; // 다음 비디오로 이동 (리스트 순환)
    player.loadVideoById(playlist[videoIndex]); // 다음 비디오 로드 및 재생
  }
}

function playVideo() {
  player.playVideo();
}

function pauseVideo() {
  player.pauseVideo();
}

function prevVideo() {
  videoIndex = videoIndex - 1 < 0 ? playlist.length - 1 : videoIndex - 1;
  player.loadVideoById(playlist[videoIndex]);
}

function nextVideo() {
  videoIndex = (videoIndex + 1) % playlist.length; // 다음 비디오로 이동 (리스트 순환)
  player.loadVideoById(playlist[videoIndex]);
}

const listButton = document.getElementById("list");
const playlistContainer = document.getElementById("playlist-container");
const playlistTable = document.getElementById("playlist-table");

let isPlaylistOpen = false; // 리스트 열린 상태 확인 변수

// 리스트 토글 기능
listButton.addEventListener("click", function () {
    if (isPlaylistOpen) {
        playlistContainer.style.display = "none";
        isPlaylistOpen = false;
    } else {
        showPlaylist();
    }
});

// 플레이리스트 표시 및 위치 고정
function showPlaylist() {
  playlistTable.innerHTML = ""; // 기존 목록 초기화

  trueSongLists.forEach((song, index) => { // 인덱스를 추가로 가져옴
      let row = document.createElement("tr");
      let playBtn = document.createElement("td");
      playBtn.className = "playBtn";
      let titleCell = document.createElement("td");
      let artistCell = document.createElement("td");

      playBtn.innerHTML = `<img src="../img/musicBtn.png">`;
      titleCell.textContent = song.title;
      artistCell.textContent = song.artist;

      row.appendChild(playBtn);
      row.appendChild(titleCell);
      row.appendChild(artistCell);

      // 클릭하면 해당 행번호(index)에 맞는 곡 재생
      playBtn.addEventListener("click", function () {
          selectVideo(index); // selectVideo 함수 호출
      });

      playlistTable.appendChild(row);
  });

  updatePlaylistPosition();
  playlistContainer.style.display = "block";
  isPlaylistOpen = true;
}

// 선택한 곡을 재생하는 함수
function selectVideo(num) {
  videoIndex = num;
  player.loadVideoById(playlist[videoIndex]); // 유튜브 플레이어에서 해당 곡 재생
}

// 리스트 위치 업데이트 함수
function updatePlaylistPosition() {
    let rect = listButton.getBoundingClientRect();
    playlistContainer.style.top = `${rect.bottom + window.scrollY + 7}px`;
    playlistContainer.style.left = `${rect.left + window.scrollX - 250}px`;
}

// 화면 크기 변경 시 위치 재조정
window.addEventListener("resize", function () {
  if (isPlaylistOpen) {
      updatePlaylistPosition();
  }
});