document.addEventListener("DOMContentLoaded", function () {
    loadGuestBook(); // 페이지 로드 시 방명록 목록 불러오기

    // 방명록 글 작성
    document.getElementById("guestBookForm").addEventListener("submit", function (event) {
        event.preventDefault();
        addGuestBook();
    });
});

// 🟢 방명록 글 추가
function addGuestBook() {
    const content = document.getElementById("content").value;

    if (!content) {
        alert("내용을 입력하세요.");
        return;
    }

    fetch("http://localhost:3000/guest_book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("guestBookForm").reset();
            loadGuestBook(); // 새로고침 없이 목록 갱신
        }
    })
    .catch(error => console.error("Error:", error));
}

// 🟢 방명록 목록 불러오기
function loadGuestBook() {
    fetch("http://localhost:3000/guest_book")
    .then(response => response.json())
    .then(data => {
        const guestBookList = document.getElementById("guestBookList");
        guestBookList.innerHTML = ""; // 기존 목록 초기화

        data.forEach(post => {
            const postElement = document.createElement("div");
            postElement.className = "guest-post";
            postElement.innerHTML = `
            <div class="comment-form">
                <p>NO. <span class="numbering"><strong>${post.id}</strong></span>
                <span class="date">  (${formatDateUsingLocale(post.created_at)})</span></p>
            </div>
            <div class="comments">
                <p>${post.content.replace(/\n/g, "<br>")}</p>
            </div>
            </div>
            `;
            guestBookList.appendChild(postElement);
        });
    })
    .catch(error => console.error("Error:", error));
}

function formatDateUsingLocale(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24시간제
    }).replace(/\//g, '-').replace(',', ''); // 날짜 구분 기호를 "-"로 바꿔줌
}
