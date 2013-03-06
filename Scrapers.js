(function (WL) {

  if (window.top !== window.top) {

    return;
  }

  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  // note/url separator
  var nL = " ... \n";

  // get the datas we really want
  var Scrapers = {

		'gmail': function  () {

			var data = {};

      data.scraper = 'gmail';
      data.title = window.title;
      data.note = window.location.href;

      return data;
    },

    'outlook': function  () {

      var data = {};

      data.scraper = 'outlook';
      data.title = $('.ReadMsgSubject').text();
      data.url = 'none';
      data.note = $('.ReadMsgBody').text();

      return data;
    },

    'yahooMail': function  () {

      var data = {};

      var $titleClone = $('.info:visible > h3').clone();
      $titleClone.find('style').remove();

      var $msgClone = $('.msg-body.inner:visible').clone();
      $msgClone.find('style, script, meta').remove();

      data.scraper = 'yahooMail';
      data.title = $.trim($titleClone.text());
      data.url = 'none';
      data.note = $msgClone.text();

      return data;
    },

    'amazon': function  () {

      var data = {};

      data.scraper = 'amazon';
      data.title = $('meta[name="title"]').attr('content');
      data.url = $('link[rel="canonical"]').attr('href');
      data.note = $('meta[name="description"]').attr('content');
      // data.note = (data.note ? data.note + nL +  data.url : undefined);
      data.specialList = 'wishlist';

      return data;
    },

    'imdb': function  () {

      var data = {};

      var stars = $.trim($('.star-box-giga-star').text());
      stars = stars.length ? ' [' + stars + ']' : '';

      data.scraper = 'imdb';
      data.title = $('h1 .itemprop').text();
      data.title = (data.title ? data.title + stars : undefined);
      data.url = $('link[rel="canonical"]').attr('href');

      data.note = $('p[itemprop="description"]').text();
      // data.note = (data.note ? data.note + nL + data.url : undefined);

      data.specialList = 'movies';

      return data;
    },

    'youtube': function  () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'youtube';
      data.title = openGraph.title;
      data.url = openGraph.url;
      data.note = openGraph.description;
      // data.note = (data.note ? data.note + nL + data.url : undefined);

      data.specialList = 'movies';

      return data;
    },

    'wikipedia': function  () {

      var data = {};

      data.scraper = 'wikipedia';

      var $noteSource = $('#mw-content-text').clone();
      $noteSource.find('.infobox').remove();

      data.title = document.title;
      data.url = window.location.href;
      data.note = $noteSource.text();
      // data.note = (data.note ? data.note + nL + data.url : undefined);
      data.specialList = 'readLater';

      return data;
    },

    'ebay': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'ebay';
      data.title = openGraph.title;
      data.url = openGraph.url;
      data.note = openGraph.description;
      // data.note = data.note ? data.note + nL + data.url : undefined;
      data.specialList = 'wishlist';

      return data;
    },

    'asos': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'asos';

      data.title = openGraph.title;
      data.url = openGraph.url;
      data.note = ($('#infoAndCare').text() || openGraph.description);
      // data.note = (data.note ? data.note + nL + data.url : undefined);
      data.specialList = 'wishlist';

      return data;
    },

    'etsy': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'etsy';
      data.title = ($('.title-module:visible').text() || openGraph.title);
      data.url = (openGraph.url || window.location.href);
      data.note = ($('.description-item:visible .description').text() || openGraph.description);
      // data.note = (data.note ? data.note + nL + data.url : undefined);
      data.specialList = 'wishlist';

      return data;
    }
	};

  // scrape something based on the current url
  function scrape () {

    var hash = window.location.hash;
    var host = window.location.hostname;
    var path = window.location.pathname;
    var search = window.location.search;

    if (/mail\.google\.com/.test(host) && hash.split('/')[1]) {

      return Scrapers.gmail();
    }
    else if (/mail\.live\.com/.test(host) && (/&mid=/.test(hash) || /&mid=/.test(search))) {

      return Scrapers.outlook();
    }
    else if (/mail\.yahoo\.com/.test(host)) {

      return Scrapers.yahooMail();
    }
    else if (/amazon\./.test(host)) {

      return Scrapers.amazon();
    }
    else if (/imdb\./.test(host)) {

      return Scrapers.imdb();
    }
    else if (/youtube\.com/.test(host)) {

      return Scrapers.youtube();
    }
    else if (/wikipedia\.org/.test(host)) {

      return Scrapers.wikipedia();
    }
    else if (/ebay\./.test(host)) {

      return Scrapers.ebay();
    }
    else if (/\.asos\./.test(host)) {

      return Scrapers.asos();
    }
    else if (/\.etsy\./.test(host)) {

      return Scrapers.etsy();
    }

    // return something as nothing
    return {};
  }

  // exports
  WL.scrape = scrape;

})(window.WL);