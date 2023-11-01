//Mettre le code JavaScript lié à la page photographer.html
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const dataID = parseInt(urlParams.get('id'));

let photographerInfo = [],
    photographerMedias = [],
    photographerName = ''
const mediaSection = document.querySelector('.medias_section');

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
    const { photographers } = await getPhotographers();

    function photographerInArray(photographer) {
        return photographer.id === dataID;
    }
    return photographers.find(photographerInArray);
}
// Récupère les medias du photographe
async function getPhotographerMedias() {
    const { media } = await getPhotographers();

    function mediasInArray(medias) {
        return medias.photographerId === dataID;
    };
    return media.filter(mediasInArray);
}
//display photographer information
getPhotographerInfo().then((photographer) => {
    photographerInfo.push(photographer);
}).then(() => parse_data(photographerInfo[0]));

function parse_data(data) {
    let nameSplitter = data.name.split(" ");
    photographerName = nameSplitter[0];
    const section = document.querySelector(".photograph-header"),
        article = document.createElement("article");
    article.innerHTML = `
          <h2 id='photographer_name'>${data.name}</h2
          <h3 id='photographer_city'>${data.city}</h3>
          <h4 id='photographer_country'>${data.country}</h4>
          <h5 id='photographer_tagline'>${data.tagline}</h5>`;
    section.appendChild(article);
}

//display photographer medias
getPhotographerMedias().then((medias) => {
    photographerMedias.push(medias);
}).then(() => parse_media(photographerMedias[0]));

function parse_media(result) {

    //Factory
    var media = function (title, type, like, date, price) {
        var media = {
            title,
            type,
            like,
            date,
            price,
        };
        //extension splitter
        const extension = media.type.split(".");

        //extension checker, return img or vid html
        function extensionChecker() {
        switch (extension[1]) {
            case "mp4":
            return `<video width="320" height="240" controls><source src="assets/medias/${photographerName}/${media.type}" 
                    type="video/${extension[1]}" class="vid_media"> </video>`;
            default:
            return `<img src="assets/medias/${photographerName}/${media.type}" class="img_media">`;
            }
        }
        var article = document.createElement("article");
        var entriesInHtml = `
            ${extensionChecker()}
            <div class="media-container">
                <h4>${media.title}</h4>
                <h4>${media.like}</h4>
            </div>`;
        article.innerHTML = entriesInHtml;
        mediaSection.appendChild(article);
    }
    //factory product
    function mediaProduct() {
        for (i = 0; i < result.length; i++) {
            mediaProduct = media(
                result[i].title,
                result[i].image == undefined ? result[i].video : result[i].image,
                result[i].likes,
                result[i].date,
                result[i].price
            );
        }
    }
    mediaProduct();
}