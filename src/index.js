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
  if (
    pictureApiService.query.toLowerCase().trim() === 'шоні' ||
    pictureApiService.query.toLowerCase().trim() === 'гобі' ||
    pictureApiService.query.toLowerCase().trim() === 'артур' ||
    pictureApiService.query.toLowerCase().trim() === 'arthur' ||
    pictureApiService.query.toLowerCase().trim() === 'shoni'
  ) {
    refs.galleryEL.innerHTML = `<a class="card__link" href="">
          <div class="card">
              <img src="https://sun9-54.userapi.com/impf/c836631/v836631488/4b02e/hY22z58s5sY.jpg?size=1280x1280&quality=96&sign=3ac9220c43abd0adff7153b704554738&c_uniq_tag=rRHG65Bt1sQcLLnNeaERlVjpmPPZSMpZ0jus2gwOIAQ&type=album" alt="ya" loading="lazy" width='330' height='230'/>
            <div class="card__meta">
              <p class="card__name"><b>Likes: </b>1</p>
              <p class="card__name"><b>Views: </b>2</p>
              <p class="card__name"><b>Comments: </b>3</p>
              <p class="card__name"><b>Downloads: </b>4</p>
            </div>
          </div>
        </a>`;

    Notiflix.Notify.failure('Гобі, будь добра тіряйся.');
  }
  pictureApiService.resetPage();
  clearGallery();

  const data = await pictureApiService.fetchPictures();
  console.log(data);
  const totalPages = Math.ceil(data.totalHits / 40);
  if (data.hits.length === 0) {
    loadMoreBtnHide();
    clearGallery();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    loadMoreBtnShow();
    if (pictureApiService.page > totalPages) {
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

  if (pictureApiService.page > totalPages) {
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
