import { db } from "../content/firebase.js";

document.addEventListener("DOMContentLoaded", function () {
    loadGuestBook(); // 페이지 로드 시 방명록 목록 불러오기

    // 방명록 글 작성
    document.getElementById("guestBookForm").addEventListener("submit", function (event) {
        event.preventDefault();
        addGuestBook();
    });
});

function addGuestBook() {
    const content = document.getElementById("content").value;

    if (!content) {
        alert("내용을 입력하세요.");
        return;
    }

    const guestBookRef = db.collection('guest_book');
    guestBookRef.add({
        content: content,
        created_at: Date.now() 
    })
    .then(() => {
        console.log("✅ 방명록 글이 성공적으로 저장되었습니다.");
        document.getElementById("guestBookForm").reset(); // 입력창 초기화
        loadGuestBook();
    })
    .catch(error => console.error("❌ 방명록 저장 실패:", error));
}

async function loadGuestBook() {
    const guestBookList = document.getElementById("guestBookList");
    guestBookList.innerHTML = ""; // 기존 목록 초기화

    const snapshot = await db.collection('guest_book').get();
    let totalPosts = snapshot.size;  // 전체 문서 개수

    db.collection('guest_book').orderBy("created_at", "desc").get().then((element) =>
    {
        element.forEach((doc) => {
            const comment = doc.data();
    
            const postElement = document.createElement("div");
            postElement.className = "guest-post";
            postElement.innerHTML = `
            <div class="comment-form">
            <p>NO. <span class="numbering"><strong>${totalPosts--}</strong></span>
            <span class="date">  (${formatDateUsingLocale(comment.created_at)})</span></p>
            </div>
                <div class="comments">
                    <p>${(comment.content || "").replace(/\n/g, "<br>")}</p>
                </div>
            `;
            guestBookList.appendChild(postElement);
        });
    })
}

// 날짜 형식 변환
function formatDateUsingLocale(timestamp) {
    if (!timestamp) return "알 수 없음"; // timestamp가 없을 경우 대비

    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\//g, '-').replace(',', ''); // 날짜 구분 기호를 "-"로 변경
}