"use strict";

// Forma ir mygtukai
const formElement = document.querySelector("form");
const submitBtn = document.querySelector(".modal .modal-footer > .btn-primary");
const closeBtn = document.querySelector(".modal .modal-footer > .btn-default");
const addOther = document.querySelector(".success-message a");
const deleteBtn = document.querySelector(".delete");
const searchBtn = document.querySelector(".search");
// Formos laukai
const artistInput = document.getElementById("artist");
const albumInput = document.getElementById("album");
const releaseDateInput = document.getElementById("releaseDate");
const imageInput = document.getElementById("image");
const genreInput = document.getElementById("genre");
const searchInput = document.querySelector(".search-input");

const albumListElement = document.querySelector(".album-list");

let allAlbums = [];
const serverName = "http://localhost:3026"; 


// duomenys iš serverio
 fetch(serverName + "/albums")
    .then(function(response){
        response.json()
            .then(function(albums) {
                 // Išsisaugom visus albumus
                 allAlbums = albums;
                // Spausdinam į HTML
                renderAlbums(allAlbums);
            });
    })

// }


// Registruojam mygtuko paspaudimus
submitBtn.addEventListener("click", saveAlbum);
addOther.addEventListener("click", deleteFormFields);
searchBtn.addEventListener("click", filterAlbums);

// Funkcija, kuri saugo albumą
function saveAlbum() {
    let imageName = imageInput.files[0] ? imageInput.files[0].name : "";
    let album = {
        "artist": artistInput.value,
        "album": albumInput.value,
        "releaseDate": releaseDateInput.value,
        "genre": genreInput.value,
        "image": imageName,
        "id": "",
    };
    // Išsaugome albumą į localStorage

    // Saugom į serverį
    fetch(serverName + "/albums", {
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(album)
        }).then(function(response){
            response.json()
              .then(function(result){
                album.id = result.id;
                allAlbums.push(album);
                renderAlbums(allAlbums);
              });
        })
}

function renderAlbums(albums) {
    let resultHtml = '';
            
    // Išsisaugom kiekvieno albumo html
    albums.forEach(function(album) {
        resultHtml += `
            <div class="album clearfix panel panel-default" data-id="${album.id}">
                <div class="panel-body">
                    <img src="upload/${album.image}" alt="" class="pull-left" width="150">
                    <h3>${album.album} <span class="artist-name">${album.artist}</span></h3>
                    <div>${renderGenres(album)}</div>
                    ${album.releaseDate}
                </div>
                <button class="btn btn-danger" onclick="deleteAlbum(${album.id})">Ištrinti</button>
                <a target="_blank" href="https://www.youtube.com/results?search_query=${album.artist}+${album.album}">Klausytis</a>
            </div>
        `;
    });
    
  
    // Viena operacija - įrašau visą rezultatą
    albumListElement.innerHTML = resultHtml;
}

function renderGenres(album) {
    let resultGenres = '';
    if (album.genre !== undefined) {
    let splitedGenres = album.genre.split(", ");
    for(let index = 0; index < splitedGenres.length; index++)
    resultGenres += `<span class="badge badge-pill badge-info">${splitedGenres[index]}</span>`; }

    return resultGenres;
}


// funkcija, kuri ištrina formos laukelius
function deleteFormFields () {
    artistInput.value = "";
    albumInput.value = ""
    releaseDateInput.value = "";
    imageInput.value  = "";
    genreInput.value = "";
}

     // funkcija, kuri ištrina albumą
function deleteAlbum(id) {
    fetch(serverName + "/albums/" + id, {
     method: "delete"
    }).then(
        function(response) {
        console.log("Albumas ištrintas")
    }).catch(
        function(error){
            console.log("Albumas neištrintas", error);
        });

    let albumToRemove = document.querySelector(`[data-id="${id}"]`);
        albumToRemove.remove();
}

// funkcija, kuri vykdo paiešką
function filterAlbums() {
    let filteredAlbums = allAlbums.filter(function(album){
        let result = album.artist.toLowerCase().indexOf(searchInput.value.toLowerCase());
        if (result === -1) {
            return false;
        }
        return  true; 
     });
    renderAlbums(filteredAlbums);
}



