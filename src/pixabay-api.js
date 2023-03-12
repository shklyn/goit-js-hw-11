import axios from 'axios';

export default class PictureApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchPictures() {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=34298715-00cdee221b2abcd8542b98799&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      );

      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log('Error fetching pictures:', error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
