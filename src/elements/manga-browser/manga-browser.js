Polymer({
  is: 'manga-browser',

  _loadingManga: true,

  _mangaList: [],

  sort: function(opts) {
    let order = this._mapProperties(opts.sortBy);

    let sortedList = this._mangaList.sort((a, b) => {
      if (a[order] > b[order]) {
        return 1;
      }
      if (a[order] < b[order]) {
        return -1;
      }
      return 0;
    });

    if (opts.ascending) {
      this._mangaList = sortedList.reverse();
    } else {
      this._mangaList = sortedList;
    }
  },

  //This function maps human readable names to correct property names.
  _mapProperties: function(propName) {
    switch (propName) {
      case 'title':
        return 't';
      case 'date':
        return 'ld';
      case 'hits':
        return 'hits';
      case 'category':
        return 'c';
      default:
        return propName;
    }
  },

  _mangaLoaded: function() {
    this._loadingManga = false;
    this._mangaList = this.data.manga;
    this.sort({sortBy: 'date', ascending: true});
  },

  _getMangaUrl: function(manga) {
    return `/#/${manga.a}`;
  }
});
