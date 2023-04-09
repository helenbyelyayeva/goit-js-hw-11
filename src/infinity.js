import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import ApiServices from './fetchinfo';


const formEl = document.querySelector(".search-form");
const galleryEL = document.querySelector(".gallery");
const targetEl = document.querySelector(".target-element");
const lightbox = new SimpleLightbox(".gallery a", {});
const api = new ApiServices();


const options = {
    root: null,
    rootMargin: '300px',
    threshold: 1,
}


const onSearch = async event => {
    event.preventDefault();
    api.query = event.target.elements.searchQuery.value.trim();
    observer.observe(targetEl);
    if (api.query === '') {
        Notiflix.Notify.failure('Enter data you want to find');
        clearGallery();
        return;
    }
    try {
        const { hits, totalHits } = await api.fetchInformation();
        clearGallery();
        createGallery(hits);
        if (hits.length === 0) {
            Notiflix.Notify.warning(
                'Sorry, there are no images matching your search query. Please try again.'
            );
            lightbox.refresh();
            return;
        } else if (hits.length < api.perPage) {
        Notiflix.Notify.info(` Hooray! We found ${totalHits} images.`);
        onScroll();
        lightbox.refresh();
        return;
        }
    } catch (err) {
        console.log;
    }

    lightbox.refresh();

};


const observer = new IntersectionObserver( async (entries, observer) => {
    const [targetEl] = entries;
    if (targetEl.isIntersecting) {
        api.page += 1;
        const { hits, totalHits } = await api.fetchInformation();
        let totalPages = Math.ceil(totalHits / api.perPage);
        lightbox.refresh();
        if (totalPages === api.page) {
            Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results."
            );

            observer.unobserve(targetEl);
       
        }
        createGallery(hits);
    }
}, options);



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
    for (markup of array) {
        createMarkup(markup);
    }
}

function clearGallery() {
    galleryEL.innerHTML = "";
}


function onScroll(e) {
    const { height: cardHeight } = galleryEL.firstElementChild.getBoundingClientRect();
    console.log(cardHeight);
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

formEl.addEventListener("submit", onSearch);

