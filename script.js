
 let songs
let currFolder
let playing = document.querySelector("#play")
let currentsong = new Audio()


async function get_songs(folder ) {
currFolder=folder
let a = await fetch(`${folder}/`);
  

  let response = await a.text()
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

   songs = []
  for (let i = 0; i < as.length; i++) {
    const element = as[i]
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
  
  let songurl = document.querySelector(".list").getElementsByTagName("ul")[0]
  songurl.innerHTML=" "
  for (const song of songs) {
    songurl.innerHTML = songurl.innerHTML + `<li>
                            <img src="images/music.svg" alt="">
                            <div class="info">
                                <p>${song.replaceAll("%20", " ").split(".mp3")[0]}</p>
                                
                            </div>
                            <div class="playsong">
                                <span>play now</span>
                                <img src="play.svg" alt="">

                            </div>
                        </li>`
  }





  let play = Array.from(document.querySelector(".list").getElementsByTagName("li"))

  play.forEach(e => {
    e.addEventListener("click", e2 => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  });

}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(secs).padStart(2, '0');
  return `${paddedMins}:${paddedSecs}`;
}

const playmusic = (track) => {
  currentsong.src = `/${currFolder}/` + track + ".mp3"

    currentsong.play()
    playing.src = "pause.svg"

  document.querySelector(".songtime").innerHTML =
    `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;

  document.querySelector(".songname").innerHTML = decodeURI(track)

}


async function displayAlbums() {
  let a = await fetch(`songs/`)
  let response = await a.text()
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let card_container=document.querySelector(".card_con")
  let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

    
    if(e.href.includes("/songs/"))
    {
      
      let f_name=e.href.split("/").slice(-1)[0]
      let a=await fetch(`http://127.0.0.1:5500/songs/${f_name}/info.json`)
      let response=await a.json();
      card_container.innerHTML=card_container.innerHTML+`<div data-folder="${f_name}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${f_name}/${response.img}" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.discripton}</p>
                    </div>`
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
       songs=await get_songs(`songs/${item.currentTarget.dataset.folder}`)
    })
  })

   
}


async function main() {
 
  
  displayAlbums()


  playing.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      playing.src = "pause.svg"
    } else {
      currentsong.pause()
      playing.src = "play.svg"
    }
  })



  document.querySelector("#next").addEventListener("click", () => {
    
    let current = -1;
    let currentName = (decodeURIComponent(currentsong.src.split("/songs/")[1])).split(".mp3")[0];
    play.forEach((e, i) => {
      let nextname = e.querySelector(".info").firstElementChild.innerHTML.trim()
      if (currentName === nextname) {
        current = i;
      }
    })
    if (current > -1 && current + 1 < play.length) {
      let nextsong = play[current + 1].querySelector(".info").firstElementChild.innerHTML.trim();
      playmusic(nextsong);
    } else {
      console.log("No next song found or at end of playlist.");
    }

  })



  document.querySelector("#perv").addEventListener("click", () => {
    let current = -1;
    let currentName = (decodeURIComponent(currentsong.src.split("/songs/")[1])).split(".mp3")[0];
    play.forEach((e, i) => {
      let perviousname = e.querySelector(".info").firstElementChild.innerHTML.trim()
      if (currentName === perviousname) {
        current = i;
      }
    })
    if (current > -1 && current - 1 < play.length) {
      let pervioussong = play[current - 1].querySelector(".info").firstElementChild.innerHTML.trim();
      playmusic(pervioussong);
    } else {
      console.log("No next song found or at end of playlist.");
    }

  })


  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    document.querySelector(".progress").style.width=(currentsong.currentTime / currentsong.duration) * 100 + "%"

  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    currentsong.currentTime = (currentsong.duration * percent) / 100
  })




  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
    
  })
  document.querySelector(".closesvg").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-450px";
    
    
  })


  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    
    currentsong.volume=parseInt(e.target.value)/100
  })

  document.querySelector(".vol_img").addEventListener("click",e =>{
    if(e.target.src.includes("volume.svg")){
      e.target.src="mute.svg"
      currentsong.volume=0
      document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }else{
      e.target.src="volume.svg"
      currentsong.volume=0.2
      document.querySelector(".range").getElementsByTagName("input")[0].value=20
    }
  })


  
}
main() 
