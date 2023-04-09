///////////load-more btn

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import ApiServices from './fetchinfo';


const formEl = document.querySelector(".search-form");
const galleryEL = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox(".gallery a", {});
const api = new ApiServices();



const onSearch = async event => {
    event.preventDefault();
    api.query = event.target.elements.searchQuery.value.trim();
    if (api.query === '') {
        Notiflix.Notify.failure('Enter data you want to find');
        clearGallery();
        loadMoreBtn.classList.add('is-hidden');
        return;
    }
    try {
        const { hits, totalHits } = await api.fetchInformation();
        clearGallery();
        createGallery(hits);
        loadMoreBtn.classList.remove('is-hidden');
        if (hits.length === 0) {
            Notiflix.Notify.warning(
                'Sorry, there are no images matching your search query. Please try again.'
            );
            lightbox.refresh();
            loadMoreBtn.classList.add('is-hidden');
            return;
        } else if (hits.length < api.perPage) {
            Notiflix.Notify.info(` Hooray! We found ${totalHits} images.`);
            onScroll();
            loadMoreBtn.classList.add('is-hidden');
            lightbox.refresh();
            return;
        }

        Notiflix.Notify.info(` Hooray! We found ${totalHits} images.`);

    } catch (err) {
        console.log;
    }

    lightbox.refresh();

};

const onLoadMore = async () => {
    api.page += 1;
    try {
        const { hits, totalHits } = await api.fetchInformation();
        createGallery(hits);
        lightbox.refresh();
        if (Math.ceil(totalHits / api.perPage) === api.page) {
            Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results."
            );
            loadMoreBtn.classList.add('is-hidden');
            return;
        }
        onScroll();
    } catch (err) {
        console.log(err);
    }
};

function createMarkup(markup) {
    const galleryCard = `
       <div class="photo-card">
         <div class="coverup">
           <a class="image" href="${markup.largeImageURL}">
           <img src="${markup.webformatURL}"  loading="lazy"  />
           </a>
         </div>
         <div class="info">
           <p class="info-item">
             <b>Likes</b> ${markup.likes}
           </p>
           <p class="info-item">
             <b>Views</b> ${markup.views}
           </p>
           <p class="info-item">
             <b>Comments</b> ${markup.comments}
           </p>
           <p class="info-item">
             <b>Downloads</b> ${markup.downloads}
           </p>
         </div>
       </div>
     `;
    galleryEL.insertAdjacentHTML('beforeend', galleryCard);

}


function createGallery(array) {
    for ( const markup of array) {
        createMarkup(markup);
    }
}

function clearGallery() {
    galleryEL.innerHTML = "";
}


// function onScroll(e) {
//     const { height: cardHeight } = galleryEL.firstElementChild.getBoundingClientRect();
//     console.log(cardHeight);
//     window.scrollBy({
//         top: cardHeight * 2,
//         behavior: "smooth",
//     });
// }

formEl.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);



