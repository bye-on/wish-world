import { db } from "../content/firebase.js";

// 📅 오늘 날짜 포맷 (YYYY-MM-DD)
const getTodayDate = () => {
    let today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

// 방문자 수 업데이트 함수
const updateVisitorCount = async () => {
    const today = getTodayDate();
    const visitorRef = db.collection("visitors").doc("counts");

    try {
        const doc = await visitorRef.get();

        if (doc.exists) {
            let data = doc.data();
            let lastUpdated = data.lastUpdated || ""; // 마지막 업데이트 날짜
            let totalVisitors = data.totalVisitors || 0;
            let todayVisitors = data.todayVisitors || 0;

            // 🔹 날짜 변경 시 오늘 방문자 수 초기화
            if (lastUpdated !== today) {
                todayVisitors = 0;
            }

            // 🔥 방문자 수 증가
            await visitorRef.set({
                lastUpdated: today,
                totalVisitors: totalVisitors + 1,
                todayVisitors: todayVisitors + 1
            });

            console.log("✅ 방문자 수 업데이트 완료!");
            displayVisitorCount(totalVisitors + 1, todayVisitors + 1);
        } else {
            // 🔹 문서가 없으면 새로 생성
            await visitorRef.set({
                lastUpdated: today,
                totalVisitors: 1,
                todayVisitors: 1
            });
            console.log("✅ 첫 방문자 등록 완료!");
            displayVisitorCount(1, 1);
        }
    } catch (error) {
        console.error("🔥 방문자 수 업데이트 오류:", error);
    }
};

// 방문자 수 표시 함수
const displayVisitorCount = (total, today) => {
    const visitorElement = document.querySelector(".inner-page.left.inner-top p");
    if (visitorElement) {
        visitorElement.textContent = `TODAY ${today} | TOTAL ${total}`;
    } else {
        console.warn("⚠️ 방문자 수를 표시할 요소를 찾을 수 없음.");
    }
};

// ✅ 페이지 로드 시 방문자 업데이트 실행
window.onload = () => {
    updateVisitorCount();
};
