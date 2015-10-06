Polymer({
  is: 'decode-html',

  properties: {
    text: String,
    lines: {
      type: Array,
      computed: 'splitLines(text)'
    }
  },

  decodeHtml(str) {
    var element = document.createElement('div');
    // strip script/html tags
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    element.innerHTML = str;
    str = element.textContent;
    element.textContent = '';
    return str;
  },

  splitLines(str) {
    return this.decodeHtml(str).split('\n');
  }
});
