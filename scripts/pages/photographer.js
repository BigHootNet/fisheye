// Récupérer les paramètres de l'URL pour obtenir l'ID du photographe
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const dataID = parseInt(urlParams.get('id'));

// Sélectionner les éléments nécessaires
const sortSelect = document.getElementById('sortSelect');
let photographerMedias = [],
    photographerName = '',
    logo = document.querySelector('.logo'),
    contactButton = document.querySelector('.contact_button'),
    input = document.querySelector('.input'),
    totalLikes = 0,
    photographerPrice = 0;

const mediaSection = document.querySelector('.medias_section'),
      cta = document.getElementById('cta');

// Fonction pour récupérer les données JSON
async function getPhotographers() {
    const response = await fetch('data/photographers.json'),
          data = await response.json();
    let photographers = data.photographers;
    let media = data.media;
    return {
        photographers: [...photographers],
        media: [...media]
    };
}

// Récupère les informations du photographe
async function getPhotographerInfo() {
    const { photographers } = await getPhotographers();
    return photographers.find(function (photographer) {
        return photographer.id === dataID;
    });
}

// Récupère les médias du photographe
async function getPhotographerMedias() {
    const { media } = await getPhotographers();
    return media.filter(function (medias) {
        return medias.photographerId === dataID;
    });
}

// Affiche les informations du photographe
getPhotographerInfo().then((photographer) => {
    displayData(photographer);
    return photographer;
});

function displayData(data) {
    let nameSplitter = data.name.split(" ");
    photographerName = nameSplitter[0];
    const section = document.querySelector(".photograph-info"),
          article = document.createElement("article"),
          photoPh = document.querySelector(".photograph-picture");
    
    article.innerHTML = `
        <h1>${data.name}</h1>
        <h2>${data.city}, ${data.country}</h2>
        <h3>${data.tagline}</h3>`;
    
    photoPh.innerHTML = `<img src="assets/photographers/${data.portrait}" class="portrait" alt="portrait du photographe">`;
    photographerPrice = parseInt(data.price);
    section.appendChild(article);
}

// Affiche les médias du photographe
getPhotographerMedias().then((medias) => {
    parse_media(medias);
});

// Constructeur de médias (Factory)
function Media(title, type, like, date, price) {
    this.title = title;
    this.type = type;
    this.like = like;
    this.date = date;
    this.price = price;
    
    // Vérifie l'extension et retourne le code HTML approprié
    this.getHtmlCode = function () {
        const extension = this.type.split(".");
        switch (extension[1]) {
            case "mp4":
                return `<video width="320" height="240" src="assets/medias/${photographerName}/${this.type}" 
                type="video/${extension[1]}" class="vid_media" alt="${this.title}" aria-label="${this.title}" tabindex="0">`;
            default:
                return `<img src="assets/medias/${photographerName}/${this.type}" class="img_media" alt="${this.title}" aria-label="${this.title}" tabindex="0">`;
        }
    };
}

// Analyse les médias et affiche les articles correspondants
function parse_media(medias) {
    photographerMedias = [];
    let index = -1;
    totalLikes = 0;

    // Produits de la Factory
    medias.forEach(function (media) {
        index++;
        let mediaObject = new Media(
            media.title,
            media.image === undefined ? media.video : media.image,
            media.likes,
            media.date,
            media.price
        );
        totalLikes += parseInt(mediaObject.like);

        var article = document.createElement("article"),
            mediaType = mediaObject.getHtmlCode(),
            txt = mediaType.split('>'),
            ext = mediaObject.type.split('.'),
            mediaTypeData = "";

        if (ext[1] === "mp4") {
            mediaTypeData = txt[0] + ` data-id="${medias[index].id}"` + txt[1] + `</video>`;
        } else {
            mediaTypeData = txt[0] + ` data-id="${medias[index].id}"` + ">";
        }
        article.innerHTML = `
        <div class="media_container">
            <div class="media_holder">
                ${mediaTypeData}
             </div>
            <div class="media_title_container">
                <h3>${mediaObject.title}</h3>
                <div class="media_like_holder">
                    <h4 class="like">${mediaObject.like}</h4>
                    <em class="fa-solid fa-heart like_button" data-id=${medias[index].id} tabindex="0" aria-label="Like"></em>
                </div>
            </div>
        </div>
        `;
        mediaSection.appendChild(article);
        let mediaInfo = medias[index];
        photographerMedias.push(mediaInfo);
    });

    ctaDisplay();
    like();
    carouselInit();
}

// Trie les médias en fonction du critère sélectionné
sortSelect.addEventListener("change", function () {
    mediaSection.innerHTML = "";
    let inputValue = sortSelect.value;
    switch (inputValue) {
        case 'Popularite':
            photographerMedias.sort((a, b) => (a.likes > b.likes) ? 1 : ((b.likes > a.likes) ? -1 : 0));
            parse_media(photographerMedias);
            break;
        case 'Date':
            photographerMedias.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));
            parse_media(photographerMedias);
            break;
        case 'Titre':
            photographerMedias.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
            parse_media(photographerMedias);
            break;
    }
});

// Affiche le CTA avec le prix et le nombre total de likes
function ctaDisplay() {
    cta.innerHTML = "";
    let div = document.createElement("div");
    div.setAttribute("class", "photographer_price");
    div.innerHTML = `${photographerPrice}€ / jour</em>`;
    var totalLikeHTML = `<div class="total_likes">${totalLikes} <em class="fa-solid fa-heart" aria-label="Like"></div>`;
    cta.appendChild(div);
    cta.innerHTML += totalLikeHTML;
}

// Gestion des likes
function like() {
    let like_buttons = document.querySelectorAll('.like_button');

    like_buttons.forEach(function (e) {
        e.addEventListener("click", function () {
            let like_button_id = this.getAttribute("data-id");
            let indexOf = photographerMedias.findIndex(x => x.id == like_button_id);

            if (this.classList.contains('active')) {
                this.classList.remove('active');
                photographerMedias[indexOf].likes -= 1;
                let likes = document.querySelectorAll('.like');
                likes[indexOf].innerHTML = photographerMedias[indexOf].likes;
                totalLikes--;
                ctaDisplay();
            } else {
                this.classList.add('active');
                photographerMedias[indexOf].likes += 1;
                let likes = document.querySelectorAll('.like');
                likes[indexOf].innerHTML = photographerMedias[indexOf].likes;
                totalLikes++;
                ctaDisplay();
            }
        });

        e.addEventListener("keypress", function (event) {
            if (event.keyCode === 13) { // Vérifiez si la touche appuyée est "Entrée" (code 13)
                let like_button_id = this.getAttribute("data-id");
                let indexOf = photographerMedias.findIndex(x => x.id == like_button_id);

                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    photographerMedias[indexOf].likes -= 1;
                    let likes = document.querySelectorAll('.like');
                    likes[indexOf].innerHTML = photographerMedias[indexOf].likes;
                    totalLikes--;
                    ctaDisplay();
                } else {
                    this.classList.add('active');
                    photographerMedias[indexOf].likes += 1;
                    let likes = document.querySelectorAll('.like');
                    likes[indexOf].innerHTML = photographerMedias[indexOf].likes;
                    totalLikes++;
                    ctaDisplay();
                }
            }
        });
    });
}

//////////////////////////////////////// CAROUSEL ////////////////////////////////////////

// Initialise le carousel
function carouselInit() {
    let medias = document.querySelectorAll('.img_media');
    let modal = document.getElementById('modal');

    medias.forEach(function (media) {
        let id = media.getAttribute("data-id");

        media.addEventListener('click', init);
        media.addEventListener("keypress", function (event) {
            if (event.keyCode === 13) { // Vérifiez si la touche appuyée est "Entrée" (code 13)
                init();
            }
        });

        function init() {
            let imgMedias = document.querySelectorAll('.img_media'),
                vidMedias = document.querySelectorAll('.vid_media'),
                likeButtons = document.querySelectorAll('.like_button');

            likeButtons.forEach(function(elem){
                elem.setAttribute("tabindex",-1);
            });

            logo.setAttribute("tabindex",-1);
            contactButton.setAttribute("tabindex",-1);
            input.setAttribute("tabindex",-1);

            imgMedias.forEach(function (elem) {
                elem.setAttribute("tabindex", "-1");
            });
            vidMedias.forEach(function (elem) {
                elem.setAttribute("tabindex", "-1");
            });
            modal.style.display = "flex";
            document.getElementsByTagName('html')[0].style.overflow = "hidden";
            let indexOf = "";

            // Affichage du carousel
            function display(arg, nextPrevHandler) {
                if (arg !== undefined) {
                    id = arg;
                }

                var media = photographerMedias.filter(function (el) {
                    return el.id === parseInt(id);
                });
                
                indexOf = photographerMedias.map(function (e) {
                    return e.id;
                }).indexOf(media[0].id);

                let extension = [];
                if (media[0].image != undefined) {
                    extension = media[0].image.split(".");
                } else {
                    extension = media[0].video.split(".");
                }

                function getUrlCode() {
                    switch (extension[1]) {
                        case "mp4":
                            return `<video width="320" height="240" controls><source src="assets/medias/${photographerName}/${media[0].video}" 
                            type="video/${extension[1]}" class="vid_media_view" alt="${media[0].title}" aria-label="${media[0].title}" tabindex="0"> </video>`;
                        default:
                            return `<img src="assets/medias/${photographerName}/${media[0].image}" class="img_media_view" alt="${media[0].title}" aria-label="${media[0].title}">`;
                    }
                }

                // Construction de la modal
                modal.innerHTML = "";
                let x = `<em id="close" class="fa-solid fa-xmark" tabindex="0" aria-label="close"></em>`;
                let previous = `<em id="previous" class="fa-solid fa-arrow-left" tabindex="0" aria-label="previous"></em>`;
                let next = `<em  id="next" class="fa-solid fa-arrow-right" tabindex="0" aria-label="next"></em>`;
                modal.innerHTML = `<div class="modal_media_container">${getUrlCode()}</div>`;
                
                if (photographerMedias[indexOf - 1] != undefined) {
                    modal.innerHTML += previous;
                }
                if (photographerMedias[indexOf + 1] != undefined) {
                    modal.innerHTML += next;
                }
                modal.innerHTML += x;

                previous = document.getElementById("previous");
                next = document.getElementById("next");

                // Gérer le bouton précédent
                if (previous != undefined) {
                    previous.addEventListener("click", previousHandler);
                    previous.addEventListener("keypress", function (event) {
                        if (event.keyCode === 13) {
                            previousHandler();
                        }
                    });
                    let prevArg = "previous";

                    function previousHandler() {
                        previousMedia = photographerMedias[indexOf - 1].id;
                        display(previousMedia, prevArg);
                    }
                }

                // Gérer le bouton suivant
                if (next != undefined) {
                    next.addEventListener("click", nextHandler);
                    next.addEventListener("keypress", function (event) {
                        if (event.keyCode === 13) {
                            nextHandler();
                        }
                    });
                    let nextArg = "next";

                    function nextHandler() {
                        nextMedia = photographerMedias[indexOf + 1].id;
                        display(nextMedia, nextArg);
                    }
                }

                // Gérer la fermeture de la modal
                let close = document.getElementById("close");
                close.addEventListener("click", closeHandler);
                close.addEventListener("keypress", function (event) {
                    if (event.keyCode === 13) {
                        closeHandler();
                    }
                });

                function closeHandler() {
                    modal.style.display = "none";
                    const likeButtons = document.querySelectorAll('.like_button');
                    likeButtons.forEach(function(elem){
                        elem.setAttribute("tabindex", 0);
                    });
                    logo.setAttribute("tabindex", 0);
                    contactButton.setAttribute("tabindex", 0);
                    input.setAttribute("tabindex", 0);
                    imgMedias.forEach(function (elem) {
                        elem.setAttribute("tabindex", "0");
                    });
                    vidMedias.forEach(function (elem) {
                        elem.setAttribute("tabindex", "0");
                    });
                    document.getElementsByTagName('html')[0].style.overflow = "scroll";
                }

                // Adapter le bouton de gauche/droite à la fin du carousel
                if (previous !== null && nextPrevHandler == "previous") {
                    previous.focus();
                } else if (next !== null && nextPrevHandler == "next") {
                    next.focus();
                } else if (previous !== null && nextPrevHandler == "next" && next == null) {
                    previous.focus();
                } else if (next !== null && nextPrevHandler == "previous" && previous == null) {
                    next.focus();
                }
            }
            display();
        }
    });
}
