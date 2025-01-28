let date = new Date();
let today = new Date(); // 실제 오늘 날짜를 저장하는 변수
let currYear = date.getFullYear(),
    currMonth = date.getMonth();

let currentDate = document.querySelector('.current-date');
let daysTag = document.querySelector('.days');
let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();

const renderCalendar = () => {
    currentDate.innerHTML = `${currYear}.${String(currMonth + 1).padStart(2, '0')}`;

    let liTag = '';

    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
     
    for (let i = firstDayofMonth; i > 0; i--) {
        // liTag += `<li class = "inactive">${lastDateofLastMonth - i + 1}</li>`;
        liTag += `<li class = "inactive"></li>`; // 공백 처리
    }

    for (let i = 1; i <= lastDateofMonth; i++)
    {
        const currentDay = new Date(currYear, currMonth, i).getDay();
        let isToday = i === today.getDate() && currMonth === today.getMonth() 
            && currYear === today.getFullYear() ? 'active' : '';

        if(currentDay == 0) // 일요일일 때
            liTag += `<li class="sun">${i}</li>`;
        else
            liTag += `<li class="${isToday}">${i}</li>`;
    }

    daysTag.innerHTML = liTag;
}

const buttonIcon = document.querySelectorAll('.material-icons');
buttonIcon.forEach((icon) => {
    icon.addEventListener('click', () => {
        currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1;
        
        if(currMonth < 0 || currMonth > 11)
        {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
        else
        {
            date = new Date();
        }

        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
        renderCalendar();
    })
});

renderCalendar();
