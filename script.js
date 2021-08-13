let constraints = { video: true };

let videoPlayer = document.querySelector("video");
let frame = document.querySelector(".frame");
frame.style["max-width"] = videoPlayer.offsetWidth + "px";

let recordState = false;
let mediaRecorder;
let chunks = [];
let zoom = 1;

let Vbtn = document.querySelector("#record-video");
let clickBtn = document.querySelector("#click-pic");
let menuBtn = document.querySelector("#menu-open");

let filterMenu = false;

let container;

menuBtn.addEventListener("click", function () {
    if (!filterMenu) {
        container = document.createElement("div");
        container.classList.add("filter-container");
        container.innerHTML = ` 
        <div class="filter"><img  class="pic" src="./camera2.jpg"></div>
        <div style="background-color: #f4a2613d;" class="filter"><img  class="pic" src="./camera2.jpg"></div>
        <div style="background-color: #e85d0440;" class="filter"><img  class="pic" src="./camera2.jpg"></div>
        <div style="background-color: #ad5d6d7a;" class="filter"><img  class="pic" src="./camera2.jpg"></div>
        <div style="background-color: #2195f323;" class="filter"><img  class="pic" src="./camera2.jpg"></div>
        <div style="background-color: #4caf4f31;" class="filter"><img  class="pic" src="./camera2.jpg"></div> 
        <div style="background-color: rgba(31, 20, 22, 0.719);" class="filter"><img  class="pic" src="./camera2.jpg"></div>`

        document.querySelector("body").append(container);
        menuBtn.style.transform = "rotate(180deg)";
        filterMenu = true;
    } else {
        menuBtn.style.transform = "";
        container.remove();  
        filterMenu = false;
    }
    let allFilters = document.querySelectorAll(".filter");

    for (let i of allFilters) {
        
    i.addEventListener("click", function (e) {
        filter = e.currentTarget.style.backgroundColor;
        addFilterToScreen(filter);
    })
}
})

clickBtn.addEventListener("click", function () {
        capture();
    
})

let timeInterval;
let minutes = 0;
let seconds = 0;
let body = document.querySelector("body");

window.addEventListener("load",event=>{
    showMediaOnIcon();
});
let timeModal;

Vbtn.addEventListener("click", function (e) {
    if (!recordState) {
        mediaRecorder.start();
        Vbtn.innerText="stop";
        recordState = true;
        timeModal = document.createElement("div");
        timeModal.classList.add("timer");
        timeModal.innerHTML = ` 
                                <span class="mins">00</span>
                                <span>:</span>
                                <span class="secs">00</span>`;
        body.append(timeModal);
        timeInterval = setInterval(() => {
            seconds++;
            if (seconds == 60) {
                minutes++;
                seconds = 0;
            }
            if (minutes < 10) {
                document.querySelector(".mins").innerText = "0" + minutes;
            } else {
                document.querySelector(".mins").innerText = minutes;
            } if (seconds < 10) {
                document.querySelector(".secs").innerText = "0" + seconds;
            } else {
                document.querySelector(".secs").innerText = seconds;
            }
        }, 1000);
    } else {
        mediaRecorder.stop();
        recordState = false;
        Vbtn.innerText="radio_button_checked"
        timeModal.remove();
        clearInterval(timeInterval);
        minutes = 0;
        seconds = 0;

    }
})

let userAskPromise = navigator.mediaDevices.getUserMedia(constraints);

userAskPromise.then(function (mediaStream) {
    playMedia(mediaStream);
})

function playMedia(mediaStream) {
    //console.log(mediaStream.getVideoTracks()[0].getCapabilities());
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function (e) {
        let blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        addData("video", blob);
       
    }
}

let filter = "";

function capture() {
    let canvas = document.createElement("canvas");
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;
    let ctx = canvas.getContext("2d");
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
    ctx.drawImage(videoPlayer, 0, 0);
    if (filter) {
        ctx.fillStyle = filter;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    addData("image", canvas.toDataURL());
    let showGallery = document.querySelector(".show-gallery");
    showGallery.innerHTML="";
    showGallery.innerHTML=`<img style="height: 58px; width: 58px;" src="${canvas.toDataURL()}"></img>`;
    // let link =document.createElement("a");
    // link.download="img.png";
    // link.href= canvas.toDataURL();
    // link.click();
}



function addFilterToScreen(filter) {
    let prevFilter = document.querySelector(".screen-filter");
    if (prevFilter) {
        prevFilter.remove();
    }
    let filterScreen = document.createElement("div");
    filterScreen.classList.add("screen-filter");
    filterScreen.style.height = videoPlayer.offsetHeight + "px";
    filterScreen.style.width = videoPlayer.offsetWidth + "px";
    filterScreen.style.backgroundColor = filter;
    document.querySelector(".filter-screen-parent").append(filterScreen);
}

// navigator.mediaDevices.enumerateDevices(function(devices){
//     console.log(devices);
// })

let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");

zoomIn.addEventListener("click", function () {
    if (zoom < 2.5) {
        zoom += 0.1;
        videoPlayer.style.transform = `scale(${zoom})`;
    }

})

zoomOut.addEventListener("click", function () {
    if (zoom > 1) {
        zoom -= 0.1;
        videoPlayer.style.transform = `scale(${zoom})`;
    }

})

 let showGallery = document.querySelector(".show-gallery");

showGallery.addEventListener("click", function () {
    let div = document.createElement("div");
    div.classList.add("modal-gallery");
    div.innerHTML = `   <div class="bg-img">
                          <img style="width:100vw; opacity: 0.8;"  src="./camera3.jpg">
                         </div>
                        <div class="title">
                            <span style"display:inline-block margin-top:10px; color:white">Gallery</span>
                            <span style="float:right;" class="close">x</span>
                        </div>
                        <div class="gallery">
                            <div class="show-images">
                              <div class="download-del">
                              <span class="name">Images</span> 
                                <div class="download material-icons">file_download</div>
                                <div class="delete material-icons">delete</div>
                              </div> 
                              <div class="all-images"></div> 
                            </div>
                            <div class="show-videos">
                            <div class="download-del">
                              <span class="name">Videos</span> 
                                <div class="download material-icons">file_download</div>
                                <div class="delete material-icons">delete</div>
                            </div>
                            <div class="all-videos"></div> 
                            </div>

                        </div>`
    body.append(div);
    
   

    getData();
    let btn =document.querySelector(".close");
    btn.addEventListener("click",function(){
        div.remove();
    })

    document.querySelector(".show-images .delete").addEventListener("click",function(e){
        deleteFromGallery("images");
    }) 
    document.querySelector(".show-videos .delete").addEventListener("click",function(e){
        deleteFromGallery("videos");
    })
    document.querySelector(".show-images .download").addEventListener("click",function(e){
        downloadFromGallery("images");
    })
    document.querySelector(".show-videos .download").addEventListener("click",function(e){
        downloadFromGallery("videos");
    })

})







