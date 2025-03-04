import { db } from "../content/firebase.js";

// 최신 글을 가져오는 함수
async function fetchLatestPosts() {
    try {
        const latestPostsContainer = document.getElementById('contents__body'); // 최신 글 표시할 div

        // photobook 컬렉션에서 최신 3개 문서 가져오기
        const photobookSnapshot = await db.collection("photobook")
            .orderBy("created_at", "desc") // 최신순 정렬
            .limit(3)
            .get();

        // diary 컬렉션에서 최신 3개 문서 가져오기
        const diarySnapshot = await db.collection("diary")
            .orderBy("created_at", "desc")
            .limit(3)
            .get();

        let postsHTML = "";

        // photobook 글 추가
        photobookSnapshot.forEach(doc => {
            const data = doc.data();
            postsHTML += `<li>📸 ${data.header}</li>`;
        });

        // diary 글 추가
        diarySnapshot.forEach(doc => {
            const data = doc.data();
            const diaryContent = data.content.replace(/\\n/g, " ");

            postsHTML += `<li>📖 ${diaryContent.replace(/\n/g, " ")}</li>`;
        });

        latestPostsContainer.innerHTML = `<ul id="latest-posts">${postsHTML}</ul>`;

    } catch (error) {
        console.error("🔥 최신 글 불러오기 실패:", error);
    }
}

// 페이지 로드 시 최신 글 불러오기 실행
document.addEventListener("DOMContentLoaded", fetchLatestPosts);
