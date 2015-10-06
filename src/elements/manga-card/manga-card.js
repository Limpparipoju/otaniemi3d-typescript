Polymer({
  is: 'manga-card',

  properties: {
    manga: Object,
    image: {
      type: String,
      computed: 'getImageUrl(manga)'
    }
  },

  getImageUrl: function(manga) {
    let baseUrl = 'https://cdn.mangaeden.com/mangasimg/';

    return baseUrl + manga.im;
  }
});
