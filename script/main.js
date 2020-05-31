const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2/";
const API_KEY = "7970460db61d25c2815c2e7f38053cbe";
const SERVER = "https://api.themoviedb.org/3";

const leftMenu = document.querySelector(".left-menu");
const hamburger = document.querySelector(".hamburger");
const tvShowsList = document.querySelector(".tv-shows__list");
const modal = document.querySelector(".modal");
const tvShows = document.querySelector(".tv-shows");
const tvCardImg = document.querySelector(".tv-card__img");
const modalTitle = document.querySelector(".modal__title");
const genresList = document.querySelector(".genres-list");
const rating = document.querySelector(".rating");
const description = document.querySelector(".description");
const modalLink = document.querySelector(".modal__link");
const searchForm = document.querySelector(".search__form");
const searchFormInput = document.querySelector(".search__form-input");
const preloader = document.querySelector(".preloader");
const dropdown = document.querySelectorAll(".dropdown");
const tvShowsHead = document.querySelector(".tv-shows__head");
const pagination = document.querySelector(".pagination");
let searchValue;

const loading = document.createElement("div");
loading.className = 'loading';


const DBService = class {
    constructor() {
        this.SERVER = "https://api.themoviedb.org/3";
        this.API_KEY = "7970460db61d25c2815c2e7f38053cbe";
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не получені дані по адресу ${url}`);
        }

    }

    getTestData = () => {
        return this.getData("test.json")
    }

    getTestCard = () => {
        return this.getData("card.json")
    }

    async getSearchResult(query) {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
        return await this.getData(this.temp);
    }

    async getNextPage(url, query, page) {
        return await this.getData(`${url}&query=${query}&page=${page}`);
    }

    getTvShow = id => {
        return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getTopRated = () => {
        return this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getPopular = () => {
        return this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getToday = () => {
        return this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getWeek = () => {
        return this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
    }
}

const dbService = new DBService;

const renderCard = (response, target) => {
    // console.log(response);

    if (response.total_results) {
        tvShowsList.textContent = '';
        tvShowsList.style = '';

        tvShowsHead.textContent = target ? target.textContent : "Результат поиска:";

        response.results.forEach(item => {

            const {
                backdrop_path: backdrop,
                name: title,
                poster_path: poster,
                vote_average: vote,
                id
            } = item;

            const posterImg = poster ? IMG_URL + poster : "img/no-poster.jpg";
            const backdropIMG = backdrop ? IMG_URL + backdrop : "";
            const voteValue = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

            const card = document.createElement('li');
            card.idTV = id;
            card.classList.add("tv-shows__item")
            card.innerHTML = `
                <a href="#" id="${id}" class="tv-card">
                    ${voteValue}
                    <img class="tv-card__img"
                        src="${posterImg}"
                        data-backdrop="${backdropIMG}"
                        alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
            `;
            loading.remove();
            tvShowsList.append(card);
        });
    } else {
        loading.remove();
        tvShowsList.textContent = '';
        tvShowsList.style = '';
        tvShowsList.style = "display: flex";
        tvShowsList.innerHTML = `<h1 style="justify-content: center; align-items: center;">Немає результатів!</h1>`;
    }
    pagination.textContent = '';
    if (!target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            if (i > 10) {
                break;
            }
            else {
                pagination.innerHTML += `<li><a href="${SERVER}/search/tv?api_key=${API_KEY}&language=ru-RU" class="pages">${i}</a></li>`;
            }
        }
    }
};

searchForm.addEventListener("submit", event => {
    event.preventDefault()
    const value = searchFormInput.value.trim();
    searchValue = value;

    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = "";
});

//NOTE Menu

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    })
};

//NOTE Відкритя / закритя меню

hamburger.addEventListener("click", () => {
    leftMenu.classList.toggle("openMenu");
    hamburger.classList.toggle("open");
    closeDropdown();
});

document.addEventListener("click", event => {
    const target = event.target;

    if (!target.closest(".left-menu")) {
        leftMenu.classList.remove("openMenu");
        hamburger.classList.remove("open");
        closeDropdown();
    }
    // console.log(event.target.closest(".left-menu"));

});

//NOTE Відкритя dropdown в left-menu

leftMenu.addEventListener("click", event => {
    const target = event.target;
    const dropdown = target.closest(".dropdown");

    if (dropdown) {
        event.preventDefault();
        dropdown.classList.toggle("active");
        leftMenu.classList.add("openMenu");
        hamburger.classList.add("open");
    }


    if (target.closest("#top-rated")) {
        tvShows.append(loading);
        new DBService().getTopRated().then((response) => renderCard(response, target));
    }

    if (target.closest("#popular")) {
        tvShows.append(loading);
        new DBService().getPopular().then((response) => renderCard(response, target));
    }

    if (target.closest("#week")) {
        tvShows.append(loading);
        new DBService().getWeek().then((response) => renderCard(response, target));
    }

    if (target.closest("#today")) {
        tvShows.append(loading);
        new DBService().getToday().then((response) => renderCard(response, target));
    }

    if (target.closest("#search")) {
        tvShows.append(loading);
        tvShowsList.textContent = '';
        tvShowsHead.textContent = '';
        loading.remove();
    }
});

//NOTE Зміна картинок при наведені

//NOTE СПОСІБ ВЧИТЕЛЯ
const changeImage = event => {
    const card = event.target.closest(".tv-shows__item");

    if (card) {
        const img = card.querySelector(".tv-card__img");
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
        }

    }
};

tvShowsList.addEventListener("mouseover", changeImage);
tvShowsList.addEventListener("mouseout", changeImage);

//NOTE МІЙ СПОСІБ ВИРІШЕННЯ ЗАВДАННЯ
// for (let i = 0; i < posterImg.length; i++) {
//     const posterImg = document.querySelectorAll(".tv-card__img");
//     let src = posterImg[i].src;
//     let backdrop = posterImg[i].dataset.backdrop;

//     posterImg[i].addEventListener("mouseover", () => {
//         posterImg[i].src = backdrop;
//     });

//     posterImg[i].addEventListener("mouseout", () => {
//         posterImg[i].src = src;
//     });
// }
// console.dir(tvCardImg)
//NOTE Open modal window

const openModal = event => {

    event.preventDefault()

    const target = event.target;
    const card = target.closest(".tv-card");

    if (card) {
        // FIXME Коли користувач клікає ще раз на картку, то з'являється ще один прел оадер
        // const loading = document.createElement("div");
        // loading.className = 'loading';
        // card.append(loading);
        preloader.style.display = "block";

        new DBService()
            .getTvShow(card.id)
            .then(response => {
                tvCardImg.src = response.poster_path ? IMG_URL + response.poster_path : "img/no-poster.jpg";
                tvCardImg.alt = response.name;
                modalTitle.textContent = response.name;
                genresList.textContent = "";
                // for (const item of response.genres) {
                //     genresList.innerHTML += `<li>${item.name}`;
                // }
                if (response.genres != 0) {
                    response.genres.forEach(item => {
                        genresList.innerHTML += `<li>${item.name}</li>`;
                    })
                } else if (response.genres.length == 0) {
                    genresList.innerHTML = "<li>Данні відсутні</li>";
                }
                rating.textContent = response.vote_average;
                description.textContent = response.overview ? response.overview : "Опис відсутній";
                modalLink.href = response.homepage ? response.homepage : "no-site.html";
            })
            .then(() => {
                document.body.style.overflow = "hidden";
                modal.classList.remove("hide");
                loading.remove();
            })
            .finally(() => {
                preloader.style.display = '';
            });
    }
}

tvShowsList.addEventListener("click", openModal);


//NOTE Close modal window

modal.addEventListener("click", event => {
    if (event.target.closest(".cross") ||
        event.target.classList.contains("modal")) {
        document.body.style.overflow = "";
        modal.classList.add("hide");
    }
});



// NOTE Pagination
pagination.addEventListener("click", event => {
    const page = document.querySelector(".pages");
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains("pages")) {
        tvShows.append(loading);
        dbService.getNextPage(page.href, searchValue, target.textContent).then(renderCard);
    }
})