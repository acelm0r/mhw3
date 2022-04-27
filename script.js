function onJsonFilm(json){
    console.log('JSON film ricevuto');
    console.log(json);
    const risultati = document.querySelector('#risultati');
    risultati.innerHTML = '';

    const results_film = json.results;
    if(results_film.length === 0){
        console.log('Nessun risultato!');
        const errore = document.createElement('h1');
        const messaggio_errore = document.createTextNode("Nessun risultato!");
    }  
    for(const result of results_film){
        const locandina = result.image;
        const titolo = result.title;
        const anno = result.description;

        const film = document.createElement('div');
        film.classList.add('film');
        const img = document.createElement('img');
        img.src = locandina;
        const caption = document.createElement('span');
        caption.textContent = titolo + ' Anno: ' + anno;
        film.appendChild(img);
        film.appendChild(caption);
        risultati.appendChild(film);
    }
}

function onJsonSerieTv(json){
    console.log('JSON serie TV ricevuto');
    console.log(json);
    const risultati = document.querySelector('#risultati');
    risultati.innerHTML = '';

    const results_serietv = json.results;
    for(const result of results_serietv){
        const locandina = result.image;
        const titolo = result.title;
        const anno = result.description;
        const serie_tv = document.createElement('div');
        serie_tv.classList.add('film');
        const img = document.createElement('img');
        img.src = locandina;
        const caption = document.createElement('span');
        caption.textContent = titolo + ' Anno: ' + anno;
        serie_tv.appendChild(img);
        serie_tv.appendChild(caption);
        risultati.appendChild(serie_tv);
    }
}

function onJsonAnime(json){
    console.log('JSON Anime ricevuto');
    console.log(json);
    const risultati = document.querySelector('#risultati');
    risultati.innerHTML = '';
    const results_anime = json.data;

    for(let i=0; i<results_anime.length; i++){
        const titolo = results_anime[i].attributes.canonicalTitle;
        const anno = results_anime[i].attributes.startDate;
        const img = document.createElement('img');
        if(results_anime[i].attributes.coverImage !== null){
            const copertina = results_anime[i].attributes.coverImage.tiny;
            img.src = copertina;
        } else {
            img.src = "immagini/non_disponibile.jpeg"
        }

        const anime = document.createElement('div');
        anime.classList.add('anime');
        const caption = document.createElement('span');
        caption.textContent = titolo + 'Anno: ' + anno;
        anime.appendChild(img);
        anime.appendChild(caption);
        risultati.appendChild(anime);
    }
}

function onResponse(response){
    return response.json();
}

function cerca(event){
    event.preventDefault();

    const content = document.querySelector('#content').value;
    if(content){
        const text = encodeURIComponent(content);
        console.log('Cerco elementi dal titolo: ' +content);

        const type = document.querySelector('#tipo').value;
        console.log('Cerco elementi di tipo: ' +type);

        if(type === "film"){
            film_request = film_api_endpoint + imdb_key + '/' + text;
            fetch(film_request, requestOptions).then(onResponse).then(onJsonFilm).catch(error => console.log('error', error));
        } else if(type === "serie_tv"){
            serie_tv_request = serie_tv_api_endpoint + imdb_key + '/' + text;
            fetch(serie_tv_request, requestOptions).then(onResponse).then(onJsonSerieTv).catch(error => console.log('error', error));
        } else if(type === "anime"){
            fetch('https://kitsu.io/api/edge/anime?filter[text]'+ text,{
                headers: {
                    'Accept':'application/vnd.api+json',
                    'Authorization':token_data.token_type + '' + token_data.access_token,
                    'Content-Type':'application/x-wwwform-urlencoded'
                }
            }).then(onResponse).then(onJsonAnime);
        }
    } else {
        alert('Inserisci un titolo e il tipo di ricerca da effettuare!');
    }
}


function onResponse(response){
    return response.json();
}

function prevent(event){
    event.preventDefault();
}

function getToken(json){
    token_data = json;
    console.log(json);
}

//event listener per la ricerca
const form = document.querySelector('#cerca');
form.addEventListener('submit', cerca);

/* ------------------------------------------------------------------------------------------------------------------ */

// IMDb KEYS
const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};
const imdb_key = 'k_h3948wb7';
const film_api_endpoint = 'https://imdb-api.com/it/API/SearchMovie/';
const serie_tv_api_endpoint = 'https://imdb-api.com/it/API/SearchSeries/';


// KITSU API
const CLIENT_ID = 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd';
const CLIENT_SECRET = '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151';
const email = 'carmelop98@gmail.com';
const password = encodeURIComponent('prova1234');


let token_data;
fetch('https://kitsu.io/api/oauth/token',{
    method:'POST',
    body:'grant_type=password&username='+email+'&password='+password,
    headers:{ 
        'Content-Type':'application/x-www-form-urlencoded'
    }
}).then(onTokenResponse).then(getToken);

function onTokenResponse(response){
    return response.json();
}