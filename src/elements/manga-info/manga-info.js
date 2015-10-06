/* globals moment*/

Polymer({
  is: 'manga-info',

  properties: {
    mangaAlias: String
  },

  _getMangaByAlias(event) {
    let mangaList = event.detail.response.manga;
    let manga;

    //Loop through manga list and check if mangaAlias matches with any of them
    for (let i = 0; i < mangaList.length; i++) {
      if (mangaList[i].a === this.mangaAlias) {
        manga = mangaList[i];
        break;
      }
    }

    if (manga) {
      this.$.mangaAjax.url = `https://www.mangaeden.com/api/manga/${manga.i}`;
      this.$.mangaAjax.generateRequest();
    } else {
      //document.querySelector('app-router').go('/not-found');
    }
  },

  _imageUrl(imageId) {
    let baseUrl = 'https://cdn.mangaeden.com/mangasimg/';

    return baseUrl + imageId;
  },

  _chapterUrl(chapter) {
    return `/#/${this.mangaAlias}/${chapter[0]}`;
  },

  _chapterDate(chapter) {
    let date = moment.unix(chapter[1]);
    let now = moment();

    if (now.diff(date, 'hours') < 24) {
      return date.fromNow();
    } else {
      return date.format('MMM D, YYYY');
    }
  },

  _chapterTitle(chapter) {
    if (isNaN(Number(chapter[2]))) {
      return `Ch ${chapter[0]}: ${chapter[2]}`;
    } else {
      return `Ch ${chapter[0]}`;
    }
  }
});
