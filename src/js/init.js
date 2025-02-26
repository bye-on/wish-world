import { db } from "../content/firebase.js";

document.addEventListener("DOMContentLoaded", async function () {
    await initializeUserPlayList();
    await getPlayList();
  
    // document.getElementById("updateList").addEventListener("click", updateIsPlaying);
});

function getUserId() {
    let userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substring(2, 15); // 랜덤한 userId 생성
      document.cookie = `userId=${userId}; path=/; max-age=31536000`; // 1년 동안 저장
    }
    return userId;
}

async function initializeUserPlayList() {
    const userId = getUserId();
    const userPlayListRef = db.collection('playList').doc(userId);
  
    try {
      const userDoc = await userPlayListRef.get();
  
      if (!userDoc.exists) {
        console.log("🆕 새로운 사용자 감지: 기본 플레이리스트 생성");
  
        const jukeboxRef = db.collection("jukebox").orderBy('id');
        const snapshot = await jukeboxRef.get();
  
        let defaultPlayList = [];
        snapshot.forEach((doc) => {
          const music = doc.data();
          defaultPlayList.push({
            id: music.id,
            title: music.title,
            artist: music.artist,
            path: music.path,
            isPlay: true // 처음에는 모두 true로 설정
          });
        });
  
        await userPlayListRef.set({ playList: defaultPlayList });
        console.log(`✅ ${userId}의 기본 플레이리스트 저장 완료`);
      } else {
        console.log(`🎵 기존 사용자 ${userId}의 플레이리스트 불러오기 완료`);
      }
    } catch (error) {
      console.error("🔥 플레이리스트 초기화 오류:", error);
    }
  }

  async function updateIsPlaying() {
    const userId = getUserId();
    const userRef = db.collection('playList').doc(userId);
  
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
    } catch (error) {
      console.error("🔥 플레이리스트 업데이트 오류:", error);
    }
  }

async function getPlayList() {
    const userId = getUserId();
    const userRef = db.collection('playList').doc(userId);
  
    try {
      const doc = await userRef.get();
      if (doc.exists) {
        playLists = doc.data().playList || [];
        console.log(`🎵 ${userId}의 플레이리스트:`, playLists);
        renderSongList(playLists);
      } else {
        console.warn(`⚠️ ${userId}의 플레이리스트가 없음.`);
      }
    } catch (error) {
      console.error("🔥 플레이리스트 가져오기 오류:", error);
    }
  }
  