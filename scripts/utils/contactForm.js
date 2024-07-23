// Sélection des éléments nécessaires pour la modal et le formulaire
let nameHolder = document.getElementById("modal_id_name_holder"),
    modalBg = document.querySelector(".modal_bg");
const form = document.getElementById('main-form');
const formData = document.querySelectorAll(".formData");
const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const success = document.getElementById("mail_success");
console.log(modalBg);

let firsNameDiv = document.getElementById('name'),
    lastNameDiv = document.getElementById('lastname'),
    emailDiv = document.getElementById('email'),
    msgDiv = document.getElementById('msg');

// Fonction pour valider l'email en utilisant une expression régulière
function validateEmail(email) {
    return emailRegex.test(email);
}

// Fonction pour afficher la modal
function displayModal() {
    let imgMedias = document.querySelectorAll('.img_media'),
        vidMedias = document.querySelectorAll('.vid_media'),
        sortSelect = document.querySelectorAll('.sortSelect'),
        likeButtons = document.querySelectorAll('.like_button');
    console.log(imgMedias);

    // Désactiver la navigation par tabulation pour certains éléments lors de l'affichage de la modal
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

    // Désactiver le défilement de la page principale
    document.getElementsByTagName('html')[0].style.overflow = "hidden";
    modalBg.style.display = "block";

    // Afficher la modal et activer la navigation par tabulation pour le bouton de fermeture
    const modal = document.getElementById("contact_modal");
    const close = document.getElementById("closeModal");
    modal.style.display = "block";
    close.setAttribute("tabindex", "0");

    // Afficher le nom du photographe dans la modal
    nameHolder.innerHTML = `${photographerName}`;
}

// Fonction pour fermer la modal
function closeModal() {
    document.getElementsByTagName('html')[0].style.overflow = "scroll";
    modalBg.style.display = "none";
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

// Écouter l'événement de soumission du formulaire
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêcher l'envoi par défaut du formulaire
    getEntries(); // Appeler la fonction pour valider les entrées
});

// Fonction pour obtenir et valider les entrées du formulaire
function getEntries() {
    let entries = {
        name: firsNameDiv,
        surname: lastNameDiv,
        mail: emailDiv,
        msg: msgDiv,
    };

    validator(); // Appeler la fonction de validation

    // Fonction pour valider les entrées du formulaire
    function validator() {
        if (entries.name.value.length <= 3) {
            formData[0].setAttribute('data-error', "Le prénom marche pas");
        } else if (entries.surname.value.length <= 5) {
            formData[1].setAttribute('data-error', "Le nom marche pas");
        } else if (validateEmail(entries.mail.value) == false && entries.surname.value.length <= 7) {
            formData[2].setAttribute('data-error', "L'email marche pas");
        } else if (entries.msg.value.length <= 9) {
            formData[3].setAttribute('data-error', "Le msg marche pas");
        } else {
            // Si toutes les validations sont réussies, fermer la modal et afficher un message de succès
            document.getElementsByTagName('html')[0].style.overflow = "scroll";
            modalBg.style.display = "none";
            const modal = document.getElementById("contact_modal");
            modal.style.display = "none";
            success.style.display = "block";
            
            // Réinitialiser le formulaire après un délai de 2 secondes
            setInterval(function () {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const dataID = parseInt(urlParams.get('id'));
                form.submit();
                location.href += "?" + dataID;
                success.style.display = "none";
            }, 2000);
        }
    }
}
