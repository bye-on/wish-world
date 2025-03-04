import { db } from "../content/firebase.js";

// 최신 글을 가져오는 함수
async function fetchLatestPosts() {
    try {
        const latestPostsContainer = document.getElementById('contents__body'); // 최신 글 표시할 div

        // 두 컬렉션에서 각각 최신 3개 문서 가져오기
        const photobookSnapshot = await db.collection("photobook")
            .orderBy("created_at", "desc")
            .limit(3) // 최대한 많이 가져오기
            .get();

        const diarySnapshot = await db.collection("diary")
            .orderBy("created_at", "desc")
            .limit(3) // 최대한 많이 가져오기
            .get();

        // 두 컬렉션의 데이터를 하나의 배열로 합치기
        let posts = [];

        photobookSnapshot.forEach(doc => {
            const data = doc.data();
            posts.push({
                type: "photo",
                header: data.header,
                created_at: data.created_at
            });
        });

        diarySnapshot.forEach(doc => {
            const data = doc.data();
            const diaryContent = data.content.replace(/\\n/g, " ").replace(/\n/g, " ");
            posts.push({
                type: "diary",
                content: diaryContent,
                created_at: data.created_at
            });
        });

        // created_at 기준으로 최신순 정렬 후, 3개만 선택
        posts.sort((a, b) => b.created_at - a.created_at);
        posts = posts.slice(0, 3);

        // HTML 생성
        let postsHTML = posts.map(post => {
            if (post.type === "photo") {
                return `<li>📸 ${post.header}</li>`;
            } else {
                return `<li>📖 ${post.content}</li>`;
            }
        }).join("");

        latestPostsContainer.innerHTML = `<ul id="latest-posts">${postsHTML}</ul>`;

    } catch (error) {
        console.error("🔥 최신 글 불러오기 실패:", error);
    }
}

// 페이지 로드 시 최신 글 불러오기 실행
document.addEventListener("DOMContentLoaded", fetchLatestPosts);
