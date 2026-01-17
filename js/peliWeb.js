const getAndShowGenres = async () => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODVjOGQ3Y2UyZDA5ODk2OWZjODAyMTVmNWFjMjA4ZCIsIm5iZiI6MTc2MDU0NjE5NC4zNTEsInN1YiI6IjY4ZWZjZDkyYjE0YWYwNDBkMzA5NjMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5UpG5gCVL4DNv6FqXWrHeJ-zaAtctn4PhK0I-mZ7HyI'
        }
    };
    try {
        const respuestaJson = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options);
        if (respuestaJson.ok) {
            const generos = await respuestaJson.json();
            generos.genres.forEach(genero => {
                const opc = document.createElement("option");
                opc.value = genero.id;
                opc.text = genero.name;
                document.querySelector("#genres").appendChild(opc);
            });
            return true;
        };
        throw new Error("Error en petición");
    } catch (error) { console.log("getAndShowGenres: ", error) };
};
getAndShowGenres();

const PELILISTA = [];

const getMoviesWithGenre = async (numPage = 1) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODVjOGQ3Y2UyZDA5ODk2OWZjODAyMTVmNWFjMjA4ZCIsIm5iZiI6MTc2MDU0NjE5NC4zNTEsInN1YiI6IjY4ZWZjZDkyYjE0YWYwNDBkMzA5NjMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5UpG5gCVL4DNv6FqXWrHeJ-zaAtctn4PhK0I-mZ7HyI'
        }
    };
    const selectedGenre = document.querySelector("#genres").value;
    try {
        const respuestaJson = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${numPage}&sort_by=popularity.desc&with_genres=${selectedGenre}`, options);
        if (respuestaJson.ok) {
            const peliInfo = await respuestaJson.json();
            // console.log(peliInfo)
            return peliInfo;
        };
        throw new Error("Error en petición");
    } catch (error) { console.log("getMovieWithGenre: ") };
};
function showMovie(pelicula) {
    const basePosterUrl = "https://image.tmdb.org/t/p/original/";
    // RESET CONTENT 
    document.querySelector("div.peliCard img").src = "";
    document.querySelector("div.peliCard h3.titulo").textContent = "";
    document.querySelector("div.peliCard figcaption p").textContent = "";

    // NEW CONTENT 
    pelicula.poster_path != null ? document.querySelector("div.peliCard img").src = basePosterUrl + pelicula.poster_path : document.querySelector("div.peliCard img").src = "https://images.pexels.com/photos/4542978/pexels-photo-4542978.jpeg";
    document.querySelector("div.peliCard h3.titulo").textContent = pelicula.title;
    document.querySelector("div.peliCard figcaption p").textContent = pelicula.overview;
};
async function recorreListaPeli(pagina, lista) {
    let indexPeli = 0;
    showMovie(lista[indexPeli]);

    document.querySelectorAll("div.peliButtons button")[1].onclick = async () => {
        if (indexPeli < lista.length - 1) {
            indexPeli++;
            showMovie(lista[indexPeli]);
        } else {
            if (pagina < 500) {
                const newPage = await getMoviesWithGenre(pagina + 1);
                recorreListaPeli(newPage.page, newPage.results);
            } else {
                const firstPage = await getMoviesWithGenre();
                recorreListaPeli(firstPage.page, firstPage.results);
            };
        };
    };
    document.querySelectorAll("div.peliButtons button")[0].onclick = () => {
        const poster = document.querySelector("div.peliCard figure img").src;
        const titulo = document.querySelector("div.peliCard h3.titulo").textContent;
        if (
            PELILISTA.some(peli => {
                return peli.titulo === titulo;
            })) {
            return;
        } else {

            PELILISTA.push({ titulo, poster })
            return true;
        };
    };
};
function showPeliLista(lista) {
    document.querySelector("footer").innerHTML = "";
    if (lista.length === 0) {
        console.log("no");

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = "https://images.pexels.com/photos/4542978/pexels-photo-4542978.jpeg";
        img.alt = "poster";
        figcaption.textContent = "Sin películas";
        figure.appendChild(img);
        figure.appendChild(figcaption);
        figure.classList.add("peliList");
        return document.querySelector("footer").appendChild(figure);
    } else {
        PELILISTA.forEach(peli => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const figcaption = document.createElement("figcaption");

            img.src = peli.poster;
            img.alt = "poster";
            figcaption.classList.add("titulo");
            figcaption.textContent = peli.titulo;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            figure.classList.add("peliList");

            return document.querySelector("footer").appendChild(figure);
        });
    };
};

document.querySelectorAll("header button")[0].addEventListener("click", async () => {
    const respuestaPeli = await getMoviesWithGenre();
    // showMovie(respuestaPeli.results);
    recorreListaPeli(respuestaPeli.page, respuestaPeli.results);
});
document.querySelectorAll("header button")[1].addEventListener("click", () => {
    document.querySelector("footer").classList.toggle("toggleDisplay");
    document.querySelectorAll("header button")[1].classList.toggle("peliActive");
    showPeliLista(PELILISTA);
});
