let nameHolder = document.getElementById("modal_id_name_holder"),
    modalBg = document.querySelector(".modal_bg");
const form = document.getElementById('main-form');
const formData = document.querySelectorAll(".formData");
const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const success = document.getElementById("mail_success");
console.log(modalBg)



let firsNameDiv = document.getElementById('name'),
    lastNameDiv = document.getElementById('lastname'),
    emailDiv = document.getElementById('email'),
    msgDiv = document.getElementById('msg');

// email regex events
function validateEmail(email) {
    return emailRegex.test(email);
  }


function displayModal() {

    let imgMedias = document.querySelectorAll('.img_media'),
    vidMedias = document.querySelectorAll('.vid_media'),
    sortSelect = document.querySelectorAll('.sortSelect'),
    likeButtons = document.querySelectorAll('.like_button');
    console.log(imgMedias);

    likeButtons.forEach(function(elem){
        elem.setAttribute("tabindex",-1)
    })

    logo.setAttribute("tabindex",-1)
    contactButton.setAttribute("tabindex",-1)
    input.setAttribute("tabindex",-1)

    imgMedias.forEach(function (elem) {
         elem.setAttribute("tabindex", "-1");
    })
    vidMedias.forEach(function (elem) {
        elem.setAttribute("tabindex", "-1");
    })     
    
    
    document.getElementsByTagName('html')[0].style.overflow = "hidden";
    modalBg.style.display = "block";
    const modal = document.getElementById("contact_modal");
    const close = document.getElementById("closeModal");
	modal.style.display = "block";
    close.setAttribute("tabindex", "0");
    nameHolder.innerHTML = `${photographerName}`
}

function closeModal() {
    document.getElementsByTagName('html')[0].style.overflow = "scroll";
    modalBg.style.display = "none";
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}



form.addEventListener('submit', function (event) {
    event.preventDefault();
    getEntries();
  });

  // entries checkers
function getEntries() {
  
    let entries = {
      name: firsNameDiv,
      surname: lastNameDiv,         
      mail: emailDiv,
      msg: msgDiv,
    }

  
    validator();
  
  
    // entries validator
    function validator() {
  
      if (entries.name.value.length <= 3) {
        formData[0].setAttribute('data-error', "Le prénom marche pas");
      } else if (entries.surname.value.length <= 5) {
        formData[1].setAttribute('data-error', "Le nom marche pas");
      } else if (validateEmail(entries.mail.value) == false && entries.surname.value.length <= 7) {
        formData[2].setAttribute('data-error', "L\'email marche pas");
      } else if (entries.msg.value.length <= 9) {
        formData[3].setAttribute('data-error', "Le msg marche pas");
      } else {
        document.getElementsByTagName('html')[0].style.overflow = "scroll";
        modalBg.style.display = "none";
        const modal = document.getElementById("contact_modal");
        modal.style.display = "none";
        success.style.display = "block";
        setInterval(function () {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const dataID = parseInt(urlParams.get('id'));
            form.submit();
            location.href += "?" + dataID
            success.style.display = "none";
        }, 2000)
        // location.reload();
  
      }
    }
  }
