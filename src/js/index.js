const menuHome = () => {
    // 왼쪽 iframe의 src 업데이트
    document.getElementById("leftFrame").setAttribute("src", "./content/left_page/home_left.html");
    // 오른쪽 iframe의 src 업데이트
    document.getElementById("rightFrame").setAttribute("src", "./content/right_page/home_right.html");

    document.getElementById("menuHome").style = "color: black; z-index: 2;"
    document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
    document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
    document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
    document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
    document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"  
}

// const menuProfile = () => {
//   // 왼쪽 iframe의 src 업데이트
//   document.getElementById("leftFrame").setAttribute("src", "./content/left_page/profile_left.html");
//   // 오른쪽 iframe의 src 업데이트
//   document.getElementById("rightFrame").setAttribute("src", "./content/right_page/profile_right.html");

//   document.getElementById("menuHome").style = "color: black; z-index: 1;"
//   document.getElementById("menuProfile").style = "color: black; z-index: 2;"  
//   document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
//   document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
//   document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
//   document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"      
// }

const menuDiary = () => {
  // 왼쪽 iframe의 src 업데이트
  document.getElementById("leftFrame").setAttribute("src", "./content/left_page/diary_left.html");
  // 오른쪽 iframe의 src 업데이트
  document.getElementById("rightFrame").setAttribute("src", "./content/right_page/diary_right.html");

  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 2;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"     
}

const menuJukeBox = () => {
  // 왼쪽 iframe의 src 업데이트
  document.getElementById("leftFrame").setAttribute("src", "./content/left_page/jukebox_left.html");
  // 오른쪽 iframe의 src 업데이트
  document.getElementById("rightFrame").setAttribute("src", "./content/right_page/jukebox_right.html");

  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 2;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"     
}

const menuPhoto = () => {
  // 왼쪽 iframe의 src 업데이트
  document.getElementById("leftFrame").setAttribute("src", "./content/left_page/photo_left.html");
  // 오른쪽 iframe의 src 업데이트
  document.getElementById("rightFrame").setAttribute("src", "./content/right_page/photo_right.html");

  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 2;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"     
}

const menuGuestBook = () => {
  // 왼쪽 iframe의 src 업데이트
  document.getElementById("leftFrame").setAttribute("src", "./content/left_page/home_left.html");
  // 오른쪽 iframe의 src 업데이트
  document.getElementById("rightFrame").setAttribute("src", "./content/right_page/guestbook_right.html");
  
  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 2;"     
}