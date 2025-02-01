async function loadPosts() {
    let response = await fetch("http://localhost:3000/diarys");
    let posts = await response.json();
    let html = "";

    posts.forEach(post => {
        html += `<div>
            <h3>${post.title} (${post.author})</h3>
            <p>${post.content}</p>
            <button onclick="deletePost(${post.id})">삭제</button>
        </div>`;
    });

    document.getElementById("post-list").innerHTML = html;
}

async function createPost() {
    let content = prompt("내용:");
    let author = prompt("작성자:");

    await fetch("http://localhost:3000/diarys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author })
    });

    loadPosts();
}

async function deletePost(id) {
    await fetch(`http://localhost:3000/diarys/${id}`, { method: "DELETE" });
    loadPosts();
}

loadPosts();
