import firebaseConfig from "../content/config.js";
import { db } from "../content/firebase.js";
import { formatDateUsingLocale } from "./utils.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

function getImg(path)
{
    const imageRef = ref(storage, path);

    getDownloadURL(imageRef)
    .then((url) => {
      document.getElementById("photoContainer").innerHTML = `<img src="${url}" alt="Firebase Image" style="width: 300px;">`;
    })
    .catch((error) => {
      console.error("이미지를 불러오는 중 오류 발생:", error);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
    const diaryList = document.getElementById("photo-list");
    diaryList.innerHTML = ""; // 기존 목록 초기화

    try {
        const diarySnapshot = await db.collection("photobook").orderBy("created_at", "desc").get();

        diarySnapshot.forEach(async (doc) => {
            const diary = doc.data();
            const diaryId = doc.data().id

            const path = diary.img;
            getImg(path);

            const diaryDiv = document.createElement("div");
            diaryDiv.classList.add("diary");
            diaryDiv.id = `diary-${diaryId}`; // Firestore 문서 ID 사용
            const diaryContent = diary.content.replace(/\\n/g, "\n");

            // 게시글 내용
            diaryDiv.innerHTML = `
                <div class="diaryFrame">
                    <div class="diaryHeader">
                        <p>${diary.header}</p>
                    </div>
                    <div class="date">${formatDateUsingLocale(diary.created_at)}</div>
                    <div class="diaryContent">
                        <div id="photoContainer"></div>
                        <p>${diaryContent.replace(/\n/g, "<br>")}</p>
                    </div>
                    <div class="divideLine"></div>
                    <p>공개 설정: 전체 공개</p>
                    <div class="commentFrame" id="comments-${diaryId}">
                        <!-- 댓글 불러오기 -->
                    </div>
                </div>
            `;

            diaryList.appendChild(diaryDiv);

            // 🔽 Firestore에서 댓글 불러오기 🔽
            const commentFrame = document.getElementById(`comments-${diaryId}`);
            const commentsSnapshot = await db.collection("photo_comments")
                .where("post_id", "==", diaryId) // 해당 게시글의 댓글만 필터링
                .orderBy("created_at", "asc")
                .get();

            let comments = [];
            commentsSnapshot.forEach((commentDoc) => {
                comments.push({ id: commentDoc.id, ...commentDoc.data() });
            });

            // 대댓글을 제외한 댓글만 먼저 출력
            comments.filter(comment => !comment.parent_id).forEach(comment => {
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");
                commentDiv.innerHTML = `
                    <span class="userName">${comment.author}</span> ${comment.content}
                    <span class="created_at">(${formatDateUsingLocale(comment.created_at)})</span>
                `;

                // 해당 댓글의 대댓글 출력
                const replies = comments.filter(reply => reply.parent_id === comment.id);
                replies.forEach(reply => {
                    const recommentDiv = document.createElement("div");
                    recommentDiv.classList.add("recomment");
                    recommentDiv.innerHTML = `
                        <span class="userName">${reply.author}</span> ${reply.content}
                        <span class="created_at">(${formatDateUsingLocale(comment.created_at)})</span>
                    `;
                    commentDiv.appendChild(recommentDiv);
                });

                commentFrame.appendChild(commentDiv);
            });
        });

    } catch (error) {
        console.error("데이터 불러오기 실패:", error);
    }
});
