import Notiflix from 'notiflix';
import PictureApiService from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryEL: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const pictureApiService = new PictureApiService();
const modal = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  pictureApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  if (pictureApiService.query === '') {
    return Notiflix.Notify.failure(
      'Please, enter the description of the photo you need.'
    );
  }
  pictureApiService.resetPage();
  clearGallery();

  const data = await pictureApiService.fetchPictures();
  console.log(data);
  const totalPages = Math.ceil(data.totalHits / 40);
  if (data.hits.length === 0) {
    clearGallery();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    loadMoreBtnShow();
    if (pictureApiService.page >= totalPages) {
      loadMoreBtnHide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }

  refs.galleryEL.insertAdjacentHTML('beforeend', renderImageGallery(data.hits));
  modal.refresh();
}
async function onLoadMore() {
  const data = await pictureApiService.fetchPictures();
  console.log(data);

  const totalPages = Math.ceil(data.totalHits / 40);

  if (pictureApiService.page >= totalPages) {
    loadMoreBtnHide();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  refs.galleryEL.insertAdjacentHTML('beforeend', renderImageGallery(data.hits));
  modal.refresh();
}

function renderImageGallery(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="card__link" href="${largeImageURL}">
          <div class="card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" width='330' height='230'/>
            <div class="card__meta">
              <p class="card__name"><b>Likes: </b>${likes}</p>
              <p class="card__name"><b>Views: </b>${views}</p>
              <p class="card__name"><b>Comments: </b>${comments}</p>
              <p class="card__name"><b>Downloads: </b>${downloads}</p>
            </div>
          </div>
        </a>`;
      }
    )
    .join('');
}

function clearGallery() {
  refs.galleryEL.innerHTML = '';
}

function loadMoreBtnHide() {
  refs.loadMoreBtn.classList.add('hidden');
}

function loadMoreBtnShow() {
  refs.loadMoreBtn.classList.remove('hidden');
}
