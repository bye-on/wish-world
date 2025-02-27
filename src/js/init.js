import { db } from "../content/firebase.js";

export let songLists = [];

export class Song {
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

export function getUserId() {
    let userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substring(2, 15); // 랜덤한 userId 생성
      document.cookie = `userId=${userId}; path=/; max-age=31536000`; // 1년 동안 저장
    }
    return userId;
}

export async function initializeUserPlayList() {
    const userId = getUserId();
    const userPlayListRef = db.collection('playlist').doc(userId);
  
    try {
      const userDoc = await userPlayListRef.get();
  
      if (!userDoc.exists) {
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
        // console.log(`✅ ${userId}의 기본 플레이리스트 저장 완료`);
      } else {
        // console.log(`🎵 기존 사용자 ${userId}의 플레이리스트 불러오기 완료`);
      }
    } catch (error) {
      console.error("🔥 플레이리스트 초기화 오류:", error);
    }
}

export async function setSongLists()
{
  const userId = getUserId(); // 현재 사용자 ID 가져오기
  const userRef = db.collection('playlist').doc(userId); // 사용자의 플레이리스트 문서 참조
  
  try {
    const doc = await userRef.get();
    if (!doc.exists) {
        console.warn(`⚠️ ${userId}의 플레이리스트가 없음.`);
        return;
    }
    const userPlayList = doc.data().playList || []; // 사용자의 플레이리스트 가져오기
    songLists = userPlayList
      .map(music => new Song(music.no, music.id, music.isPlay, music.title, music.artist, music.path));
  } catch (error) {
        console.error("🔥 플레이리스트 가져오기 오류:", error);
  }
}