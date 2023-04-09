import axios from "axios";


export default class ApiServices {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchInformation() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '34999882-fa357dcb5108de4c3df8b432d';
    try {
      const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`);
      return response.data;
    } catch (err) { throw new Error(err.message) }
  };


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


