var tag = document.createElement("script");

tag.src = "https://www.youtube.com/embed/";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

const playlist = [ "UrMOr7JCwbM", "yA1r0U-nojg" ]
var videoIndex = 0;

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

// setUpPlayer();

function stopVideo() {
    player.stopVideo();
}
  