Polymer({
  is: 'manga-reader',

  properties: {
    manga: String,
    chapter: Number,
    chapterIndex: Number,
    chapterList: Array,
    prevChapter: {
      type: Number,
      readOnly: true,
      computed: '_prevChapter(manga, chapterIndex)'
    },
    nextChapter: {
      type: Number,
      readOnly: true,
      computed: '_nextChapter(manga, chapterIndex)'
    }
  },

  _getManga(event) {
    let mangaList = event.detail.response.manga;
    let manga;

    //Loop through manga list and check if mangaAlias matches with any of them
    for (let i = 0; i < mangaList.length; i++) {
      if (mangaList[i].a === this.manga) {
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

  _getChapter(event) {
    let manga = event.detail.response;
    let chapter;
    this.chapterList = manga.chapters;

    for (let i = 0; i < manga.chapters.length; i++) {
      if (manga.chapters[i][0] === this.chapter) {
        chapter = manga.chapters[i];
        this.chapterIndex = i;
        break;
      }
    }

    if (chapter) {
      this.$.chapterAjax.url = `https://www.mangaeden.com/api/chapter/${chapter[3]}`;
      this.$.chapterAjax.generateRequest();
    } else {
      //document.querySelector('app-router').go('/not-found');
    }
  },

  _pageImage(page) {
    return `https://cdn.mangaeden.com/mangasimg/${page[1]}`;
  },

  _width(page) {
    return page[2];
  },

  _height(page) {
    return page[3];
  },

  _prevChapter(manga, chapterIndex) {
    //Chapter list starts from the latest chapter
    return `/#/${manga}/${this.chapterList[chapterIndex + 1][0]}`;
  },

  _nextChapter(manga, chapterIndex) {
    return `/#/${manga}/${this.chapterList[chapterIndex - 1][0]}`;
  }
});
