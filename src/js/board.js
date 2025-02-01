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

document.addEventListener("DOMContentLoaded", () => {
    // 게시글 불러오기
    fetch("http://localhost:3000/diarys")
      .then(res => res.json())
      .then(diarys => {
        const diaryList = document.getElementById("diary-list");
        diaryList.innerHTML = ""; // 기존 목록 초기화
  
        diarys.forEach(diary => {
          const diaryDiv = document.createElement("div");
          diaryDiv.classList.add("diary");
          diaryDiv.id = `diary-${diary.id}`; // 각 게시글에 고유 ID 추가
  
          // 게시글 내용
          diaryDiv.innerHTML = `
          <div class="diaryFrame">
            <div class="diaryHeader">${formatDateUsingLocale(diary.created_at)}</div>
            <div class="diaryContent">
              <p>${diary.content.replace(/\n/g, "<br>")}</p>
            </div>
            <div class="divideLine"></div>
            <p>공개 설정: 전체 공개</p>
            <div class="commentFrame" id="comments-${diary.id}">
              <!-- 댓글은 여기서 불러옴 -->
            </div>
            </div>
          `;
  
          // 댓글 불러오기
          fetch(`http://localhost:3000/diary_comments/${diary.id}`)
            .then(res => res.json())
            .then(comments => {
              const commentFrame = document.getElementById(`comments-${diary.id}`);
  
              // 대댓글을 제외한 댓글만 먼저 출력
              comments.filter(comment => !comment.parent_id).forEach(comment => {
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");
                commentDiv.innerHTML = `
                  <span class="userName">${comment.author}</span> ${comment.content}
                `;
  
                // 해당 댓글에 대한 대댓글을 출력
                const replies = comments.filter(reply => reply.parent_id === comment.id);
                replies.forEach(reply => {
                  const recommentDiv = document.createElement("div");
                  recommentDiv.classList.add("recomment");
                  recommentDiv.innerHTML = `
                    <span class="userName">${reply.author}</span> ${reply.content}
                  `;
                  commentDiv.appendChild(recommentDiv);
                });
  
                commentFrame.appendChild(commentDiv);
              });
            });
  
          diaryList.appendChild(diaryDiv);
        });
      });
  });
  