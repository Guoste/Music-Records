"use strict";

// Forma ir mygtukai
const formElement = document.querySelector("form");
const submitBtn = document.querySelector(".modal .modal-footer > .btn-primary");
const closeBtn = document.querySelector(".modal .modal-footer > .btn-default");
const addOther = document.querySelector(".success-message a");

// Formos laukai
const artistInput = document.getElementById("artist");
const albumInput = document.getElementById("album");
const releaseDateInput = document.getElementById("releaseDate");
const imageInput = document.getElementById("image");

const albumListElement = document.querySelector(".album-list");
let albums = [];

// Patikriname ar turime išsaugotą albumą localStorage
// Jei turime, tada atvaizduojame HTML'e
if (localStorage.albums) {
    albums = JSON.parse(localStorage.albums);
    renderAlbums(albums);
}


// Registruojam mygtuko paspausimus
submitBtn.addEventListener("click", saveAlbum);
addOther.addEventListener("click", deleteFormFields);

// Funkcija, kuri saugo ir atvaizduoja albumą
function saveAlbum() {
    let imageName = imageInput.files[0] ? imageInput.files[0].name : "";

    let album = {
        "artist": artistInput.value,
        "album": albumInput.value,
        "releaseDate": releaseDateInput.value,
        "image": imageName
    };

    // Įdedam albumą į albumų masyvą.
    albums.push(album);
    // Išsaugome albumus į localStorage
    localStorage.setItem('albums', JSON.stringify(albums));
    // Atvaizduojame albumą HTML'e
    albumListElement.innerHTML += (`
    <div class="album clearfix panel panel-default">
        <div class="panel-body">
            <img src="upload/${album.image}" alt="" class="pull-left" width="150">
            <h3>${album.artist} - ${album.album}</h3>
            Date: ${album.releaseDate}
        </div>
    </div>
`);
}
// funkcija atvaizduojanti preitos sesijos albumus
function renderAlbums(albums) {
    for(let index = 0; index < albums.length; index++) {
        albumListElement.innerHTML += (`
            <div class="album clearfix panel panel-default">
                <div class="panel-body">
                    <img src="upload/${albums[index].image}" alt="" class="pull-left" width="150">
                    <h3>${albums[index].artist} - ${albums[index].album}</h3>
                    Date: ${albums[index].releaseDate}
                </div>
            </div>
        `);
    }
    
}

// funkcija, kuri ištrina formos laukelius
function deleteFormFields () {
    artistInput.value = "";
    albumInput.value = ""
    releaseDateInput.value = "";
    imageInput.value  = "";
}
