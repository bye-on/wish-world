const menuHome = () => {
    document.getElementById("contentFrame").setAttribute("src","home.html")

    document.getElementById("menuHome").style = "color: black; z-index: 2;"
    document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
    document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
    document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
    document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
    document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"  
}

const menuProfile = () => {
  document.getElementById("contentFrame").setAttribute("src","home.html")

  document.getElementById("menuHome").style = "color: black; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 2;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"      
}

const menuDiary = () => {
  document.getElementById("contentFrame").setAttribute("src","home.html")

  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 2;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"     
}

const menuJukeBox = () => {
  document.getElementById("contentFrame").setAttribute("src","home.html")

  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 2;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"     
}

const menuPhoto = () => {
  document.getElementById("contentFrame").setAttribute("src","home.html")

  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 2;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 1;"     
}

const menuGuestBook = () => {
  document.getElementById("contentFrame").setAttribute("src","home.html")
  
  document.getElementById("menuHome").style = "color: black; background-color: rgb(255, 255, 255, 0.7);; z-index: 1;"
  document.getElementById("menuProfile").style = "color: black; z-index: 1;"  
  document.getElementById("menuDiary").style = "color: black; z-index: 1;"  
  document.getElementById("menuJukeBox").style = "color: black; z-index: 1;"  
  document.getElementById("menuPhoto").style = "color: black; z-index: 1;" 
  document.getElementById("menuGuestBook").style = "color: black; z-index: 2;"     
}