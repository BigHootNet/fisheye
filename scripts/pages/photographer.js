//Mettre le code JavaScript lié à la page photographer.html
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const dataID = parseInt(urlParams.get('id'));
const sortSelect = document.getElementById('sortSelect');

let photographerMedias = [],
    photographerName = '';
currentCarouselIndex = 0;
totalLikes = 0;
photographerPrice = 0;

const mediaSection = document.querySelector('.medias_section'),
    cta = document.getElementById('cta');
// fetch json data
async function getPhotographers() {
    const response = await fetch('data/photographers.json'),
        data = await response.json();
    photographers = data.photographers
    media = data.media
    return ({
        photographers: [...photographers],
        media: [...media]
    })
}
// Récupère les datas du photographe
async function getPhotographerInfo() {
    const {
        photographers
    } = await getPhotographers();
    return photographers.find(function (photographer) {
        return photographer.id === dataID;
    });
}
// Récupère les medias du photographe
async function getPhotographerMedias() {
    const {
        media
    } = await getPhotographers();
    return media.filter(function (medias) {
        return medias.photographerId === dataID;
    });
}
//display photographer information
getPhotographerInfo().then((photographer) => {
    displayData(photographer);
});

function displayData(data) {
    let nameSplitter = data.name.split(" ");
    photographerName = nameSplitter[0];
    const section = document.querySelector(".photograph-info"),
        article = document.createElement("article")
    photoPh = document.querySelector(".photograph-picture");
    article.innerHTML = `
          <h1>${data.name}</h1>
          <h2>${data.city}, ${data.country}</h2>
          <h3>${data.tagline}</h3>`;
    photoPh.innerHTML = `<img src="assets/photographers/${data.portrait}" class="portrait" alt="portrait du photographe">`
    photographerPrice = parseInt(data.price)
    section.appendChild(article);
}
// display photographer medias
getPhotographerMedias().then((medias) => {
    parse_media(medias);
});
// Factory Media
function Media(title, type, like, date, price) {
    this.title = title;
    this.type = type;
    this.like = like;
    this.date = date;
    this.price = price;
    //extension checker, return img or vid html
    this.getHtmlCode = function () {
        //extension splitter
        const extension = this.type.split(".");
        switch (extension[1]) {
            case "mp4":
                return `<video width="320" height="240" controls src="assets/medias/${photographerName}/${this.type}" 
                type="video/${extension[1]}" class="vid_media" alt="${this.title}" aria-label="${this.title}" tabindex="0">`;
            default:
                return `<img src="assets/medias/${photographerName}/${this.type}" class="img_media" alt="${this.title}" aria-label="${this.title}" tabindex="0">`;
        }
    }
}

function parse_media(medias) {
    photographerMedias = [],
    index = -1;
    totalLikes = 0;
    // Factory product
    medias.forEach(function (media) {
        index++
        mediaObject = new Media(
            media.title,
            media.image == undefined ? media.video : media.image,
            media.likes,
            media.date,
            media.price
        );
        totalLikes = totalLikes + parseInt(mediaObject.like);

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
                    <i class="fa-solid fa-heart like_button" data-id=${medias[index].id} tabindex="0"></i>
                </div>
            </div>
        </div>
        `;
        mediaSection.appendChild(article);
        let mediaInfo = medias[index];
        photographerMedias.push(mediaInfo);
    });

    ctaDisplay()
    like()
    carouselInit()
}
// sort media
sortSelect.addEventListener("change", function () {
    mediaSection.innerHTML = "";
    let inputValue = sortSelect.value;
    switch (inputValue) {
        case 'Popularite':
            photographerMedias.sort((a, b) => (a.likes > b.likes) ? 1 : ((b.likes > a.likes) ? -1 : 0))
            parse_media(photographerMedias);
            break;
        case 'Date':
            photographerMedias.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
            parse_media(photographerMedias);
            break;
        case 'Titre':
            photographerMedias.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
            parse_media(photographerMedias);
            break;
    }
})

function ctaDisplay() {
    cta.innerHTML = "";
    div = document.createElement("div");
    div.setAttribute("class", "photographer_price")
    div.innerHTML = `${photographerPrice}€ / jour</i>`
    var totalLikeHTML = `<div class="total_likes">${totalLikes} <i class="fa-solid fa-heart"></div>`
    cta.appendChild(div)
    cta.innerHTML += totalLikeHTML;
}

function like() {
    let like_buttons = document.querySelectorAll('.like_button')
    like_buttons.forEach(function (e) {

        e.addEventListener("click", function () {

            let like_button_id = this.getAttribute("data-id");
            //const response = await fetch('data/photographers.json'),
                  //data = await response.json();

            indexOf = photographerMedias.findIndex(x => x.id == like_button_id)
            console.log(indexOf);

            if (this.classList.contains('active')) {
                this.classList.remove('active');
                photographerMedias[indexOf].likes = photographerMedias[indexOf].likes - 1;
                let likes = document.querySelectorAll('.like')
                likes[indexOf].innerHTML = photographerMedias[indexOf].likes
                totalLikes --
                ctaDisplay()
                //fetch('data/photographers.json', {
                        //method: "PUT",
                        //body: JSON.stringify(data),
                        //headers: {
                            //'Content-type': 'application/json'
                        //}
                    //})
                    //.then(response => response.json())
                    //.then(json => console.log(json))
                    //console.log(data);


            } else {
                this.classList.add('active')
                photographerMedias[indexOf].likes = photographerMedias[indexOf].likes + 1;
                let likes = document.querySelectorAll('.like')
                likes[indexOf].innerHTML = photographerMedias[indexOf].likes
                totalLikes ++
                ctaDisplay()
                //fetch('data/photographers.json', {
                       // method: "PUT",
                        //body: JSON.stringify(data),
                        //headers: {
                           // 'Content-type': 'application/json'
                       // }
                  //  })
                   // .then(response => response.json())
                   //.then(json => console.log(json))
                    //console.log(data);
            };
        })
    })
}



//////////////////////////////////////// CAROUSEL //////////////////////////////////////// 

function carouselInit() {

    let medias = document.querySelectorAll('.img_media')
    let modal = document.getElementById('modal')


    // loop sur les images. Elles possèdent toutes un data-id unique 
    // correspondant à leur id respectif dans l'array
    medias.forEach(function (media) {
        let id = media.getAttribute("data-id")

        media.addEventListener('click', init);
        media.addEventListener("keypress", function (event) {
            // Vérifiez si la touche appuyée est "Entrée" (code 13)
            if (event.keyCode === 13) {
                init();
            }
        });

        function init() {
            var imgMedias = document.querySelectorAll('.img_media')
            var vidMedias = document.querySelectorAll('.vid_media')
            imgMedias.forEach(function (elem) {
                elem.setAttribute("tabindex", "-1");
            })
            vidMedias.forEach(function (elem) {
                elem.setAttribute("tabindex", "-1");
            })
            modal.style.display = "flex";
            document.getElementsByTagName('html')[0].style.overflow = "hidden";
            let indexOf = ""

            // affichage du carousel
            function display(arg, nextPrevHandler) {
                if (arg !== undefined) {
                    id = arg
                }

                var media = photographerMedias.filter(function (el) {
                    return el.id === parseInt(id);
                })
                // position of media in array
                indexOf = photographerMedias.map(function (e) {
                    return e.id;
                }).indexOf(media[0].id);
                let extension = []
                // Extension splitter
                if (media[0].image != undefined) {
                    extension = media[0].image.split(".");
                } else {
                    extension = media[0].video.split(".");
                }
                // Extension checker, return html
                function getUrlCode() {
                    switch (extension[1]) {
                        case "mp4":
                            return `<video width="320" height="240" controls><source src="assets/medias/${photographerName}/${media[0].video}" 
                            type="video/${extension[1]}" class="vid_media_view" alt="${media[0].title}" aria-label="${media[0].title}" tabindex="0"> </video>`;
                        default:
                            return `<img src="assets/medias/${photographerName}/${media[0].image}" class="img_media_view" alt="${media[0].title}" aria-label="${media[0].title}">`;
                    }
                }
                // modal builder
                modal.innerHTML = ""
                let x = `<i id="close" class="fa-solid fa-xmark" tabindex="0"></i>`;
                let previous = `<i id="previous" class="fa-solid fa-arrow-left" tabindex="0"></i>`;
                let next = `<i  id="next" class="fa-solid fa-arrow-right" tabindex="0"></i>`;
                modal.innerHTML = getUrlCode();
                if (photographerMedias[indexOf - 1] != undefined) {
                    modal.innerHTML += previous;
                }
                if (photographerMedias[indexOf + 1] != undefined) {
                    modal.innerHTML += next;
                }
                modal.innerHTML += x;

                previous = document.getElementById("previous")
                next = document.getElementById("next")

                // précédent
                if (previous != undefined) {
                    previous.addEventListener("click", previousHandler);
                    previous.addEventListener("keypress", function (event) {
                        // Vérifiez si la touche appuyée est "Entrée" (code 13)
                        if (event.keyCode === 13) {
                            previousHandler();
                        }
                    })
                    prevArg = "previous"

                    function previousHandler() {
                        previousMedia = photographerMedias[indexOf - 1].id
                        display(previousMedia, prevArg)
                    }
                }
                // suivant
                if (next != undefined) {
                    next.addEventListener("click", nextHandler)
                    next.addEventListener("keypress", function (event) {
                        // Vérifiez si la touche appuyée est "Entrée" (code 13)
                        if (event.keyCode === 13) {
                            nextHandler();
                        }
                    })
                    nextArg = "next"

                    function nextHandler() {
                        nextMedia = photographerMedias[indexOf + 1].id
                        display(nextMedia, nextArg)
                    }
                }
                // fermer
                close = document.getElementById("close")
                close.addEventListener("click", closeHandler)
                close.addEventListener("keypress", function (event) {
                    // Vérifiez si la touche appuyée est "Entrée" (code 13)
                    if (event.keyCode === 13) {
                        closeHandler();
                    }
                })

                function closeHandler() {
                    modal.style.display = "none";
                    imgMedias.forEach(function (elem) {
                        elem.setAttribute("tabindex", "0");
                    })
                    vidMedias.forEach(function (elem) {
                        elem.setAttribute("tabindex", "0");
                    })
                    document.getElementsByTagName('html')[0].style.overflow = "scroll";
                }

                // Check if end of carousel, then focus right or left
                if (previous !== null && nextPrevHandler == "previous") {
                    previous.focus();
                } else if (next !== null && nextPrevHandler == "next") {
                    next.focus();
                } else if (previous !== null && nextPrevHandler == "next" && next == null) {
                    previous.focus()
                } else if (next !== null && nextPrevHandler == "previous" && previous == null) {
                    next.focus()
                }
            }
            display()
        }
    })
}