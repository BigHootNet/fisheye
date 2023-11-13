function displayModal() {
    const modal = document.getElementById("contact_modal");
    const close = document.getElementById("closeModal");
	modal.style.display = "block";
    close.setAttribute("tabindex", "0");
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}
