function photographerTemplate(data) {
    const { id, name, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const a = document.createElement('a');
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        a.setAttribute('href', 'photographer.html?id='+id);
        img.setAttribute('src', picture);
        img.setAttribute('alt', name);
        img.setAttribute('aria-label', name);
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        a.appendChild(article);
        article.appendChild(img);
        article.appendChild(h2);
        return (a);
    }
    return { name, picture, getUserCardDOM }
}