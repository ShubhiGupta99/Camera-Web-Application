let request= indexedDB.open("camera",2); 
//opens if does not exist else creates

let db;
request.onsuccess = function(e){
    db=request.result; //database as result of request
}

request.onupgradeneeded=function(e){
    db=request.result;
    db.createObjectStore("gallery",{keyPath:"nId"})  //creating obj or table gallery with primary key nid
}

function showMediaOnIcon(){
    let showGallery = document.querySelector(".show-gallery");
    let tx = db.transaction("gallery","readonly");
    let store =tx.objectStore("gallery");
    let req= store.openCursor();
    
    req.onsuccess = function (e){
        let cursor=req.result;
        if(cursor){ 
            if(cursor.value.type=="image"){
          showGallery.innerHTML="";
          showGallery.innerHTML=`<img style="height: 58px; width: 58px;" src="${cursor.value.data}"></img>`;
        }
        cursor.continue();
      }
    }
 }
   

function addData(type,data){
    let tx = db.transaction("gallery","readwrite");
    let store= tx.objectStore("gallery"); //choose table
    store.add({nId:Date.now() ,type:type,data:data});

}

function getData(){
    let tx = db.transaction("gallery","readonly");
    let store =tx.objectStore("gallery");
    let req= store.openCursor();
    let allImage=document.querySelector(".all-images");
    allImage.innerHTML="";
    let allVideo=document.querySelector(".all-videos");
    allVideo.innerHTML="";
    req.onsuccess = function (e) {
        let cursor=req.result;
        if(cursor){
            if(cursor.value.type=="image"){  
                let image = document.createElement("div");
                image.classList.add("image");
                image.innerHTML = `<img class="photo" id="${cursor.value.nId}" src='${cursor.value.data}'></img>`;
                allImage.append(image);
                
             }
             else{
                let videoUrl = URL.createObjectURL(cursor.value.data);   
                let video= document.createElement("div");
                video.classList.add("video");
                video.innerHTML = `<video class="vid" id= "${cursor.value.nId}" autoplay src="${videoUrl}" loop></video>`;
                allVideo.append(video);
            }
        
            cursor.continue();
        }
        let media=document.getElementsByClassName("photo"); 
        addClassActive(media); 
        let vid =document.getElementsByClassName("vid");  
        addClassActive(vid);
        
 } 
}

function addClassActive(media){   
    let active=false;
    for(let i=0;i<media.length;i++){
        media[i].addEventListener("click",function(e){
            if(!active){
                
              media[i].classList.add("active");
              active=true;
            }               
            else{
                media[i].classList.remove("active"); 
                active=false;
            }  
        })
    }
}


function deleteFromGallery(data){
    let tx = db.transaction("gallery","readwrite");
    let store =tx.objectStore("gallery"); 
    let media;
    if(data=="images")
        media=document.querySelectorAll(".active.photo"); 
    else 
       media =document.querySelectorAll(".active.vid");    
    for(let i=0;i<media.length;i++){
            let id=media[i].getAttribute("id");       
            store.delete(Number(id)); 
         }  
    getData();                              
}

function downloadFromGallery(data){
    if(data=="images")
        media=document.querySelectorAll(".active.photo"); 
    else 
       media =document.querySelectorAll(".active.vid");  
    for(let i=0;i<media.length;i++){
        let name=media[i].getAttribute("id"); 
        let url= media[i].getAttribute("src");

        let a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
    }   
}
