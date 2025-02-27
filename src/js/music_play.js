import { db } from "../content/firebase.js";
import { getUserId } from "./init.js";
import { parseAfterDelimiter } from "./utils.js";

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

let playlist = [ ];
var videoIndex = 0;

const delimiter = "watch?v=";

export function init() {
  const userId = getUserId(); // 현재 사용자 ID 가져오기
  const userRef = db.collection('playlist').doc(userId);

  userRef.get().then((doc) => {
    if (!doc.exists) {
      console.warn(`⚠️ ${userId}의 플레이리스트가 없음.`);
      return Promise.reject("플레이리스트 없음");
    }

    const userPlayList = doc.data().playList || []; // 사용자의 플레이리스트 가져오기

    // 🔹 isPlay === true인 노래만 playlist에 담기
    playlist = userPlayList
      .filter(song => song.isPlay)
      .map(song => parseAfterDelimiter(song.path, delimiter));

    console.log(`🎵 ${userId}의 활성화된 유튜브 ID 리스트:`, playlist);
    setUpPlayer();
  })
  .catch((error) => {
    console.error("🔥 플레이리스트 초기화 오류:", error);
  });
}

function setUpPlayer()
{
    window.YT.ready(function() {
        player = new YT.Player("player", {
            height: "0",
            width: "0",
            videoId: playlist[videoIndex],
            playerVars: {
              autoplay: 1,
              loop: 0,
              playlist: playlist[videoIndex]
            },
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange,
            },
          });
    })
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) { // 비디오가 끝나면
    videoIndex = (videoIndex + 1) % playlist.length; // 다음 비디오로 이동 (리스트 순환)
    player.loadVideoById(playlist[videoIndex]); // 다음 비디오 로드 및 재생
  }
}

function stopVideo() {
    player.stopVideo();
}
  