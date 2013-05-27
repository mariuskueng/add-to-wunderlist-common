(function (WL) {

  if (window.top !== window.top || /\.xml$/.test(window.location.pathname)) {

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
      data.url = window.location.href;

      var note = '';

      $('.ii').each(function (index, element) {

        var text = $(element).text();

        if (!text) {
          return;
        }

        if (note) {
          note = note + '\n\n';
        }

        note = note + text;
      });

      data.note = note;

      return data;
    },

    'outlook': function  () {

      var data = {};

      data.scraper = 'outlook';
      data.title = $('.ReadMsgSubject').not('style, textarea').text();
      data.url = 'none';
      data.note = $('.ReadMsgBody *').not('style, textarea, .ExternalClass').text();

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
      var price = $('.priceLarge').text();

      if (price) {
        data.title = data.title + ' (' + price + ')';
      }

      data.url = $('link[rel="canonical"]').attr('href');
      data.note = $('meta[name="description"]').attr('content');
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
      data.specialList = 'readLater';

      data.note = data.note && data.note.replace(/\[\d+\]/g, '');

      return data;
    },

    'ebay': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'ebay';
      data.title = openGraph.title;
      data.url = openGraph.url;
      data.note = openGraph.description;
      data.specialList = 'wishlist';

      return data;
    },

    'asos': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      var isMarketplace = /marketplace\./.test(window.location.hostname);

      var mainDescription, careDescription, price;

      data.scraper = 'asos';
      data.title = openGraph.title;
      data.url = openGraph.url;

      if (isMarketplace) {

        price = $.trim($('.price-and-offer .price').text());

        mainDescription = $('#description-panel').html();
      }
      else {

        price = $.trim($('.product_price_details').text());

        mainDescription = $('.product-description').html();
        careDescription = $('#infoAndCare').html();
      }

      mainDescription = mainDescription && mainDescription.replace(/<br>/g, '\n').replace(/<(?:.|\n)*?>/gm, '');
      careDescription = careDescription && careDescription.replace(/<br>/g, '\n').replace(/<(?:.|\n)*?>/gm, '');

      if (price) {
        data.title = data.title + ' (' + price + ')';
      }
      data.note = $.trim(mainDescription + (careDescription ? '\n\n' + careDescription : ''));

      data.specialList = 'wishlist';

      return data;
    },

    'etsy': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      var price = $.trim($('.item-amount').first().text());

      data.scraper = 'etsy';

      data.title = ($('.title-module:visible').text() || openGraph.title);

      if (price) {
        data.title = data.title + ' (' + price + ')';
      }

      data.url = (openGraph.url || window.location.href);
      data.note = ($('.description-item:visible .description').text() || openGraph.description);
      data.specialList = 'wishlist';

      return data;
    },

    'hackerNews': function () {

      var data = {};

      data.scraper = 'hackerNews';
      data.title = window.title;
      data.url = window.location.href;

      var $bodyRow = $('.subtext').closest('tbody').find('tr').eq(3);
      var bodyText = $bodyRow.find('td').eq(1).text();

      if (bodyText) {
        data.note = bodyText;
      }

      data.specialList = 'readLater';

      return data;
    },

    'hackerNewsIndex': function (targetElement) {

      var data = {};

      var $element = $(targetElement);
      var $row = $element.closest('tr');
      var $titleRow = $row.prev('tr');
      var $title = $titleRow.find('.title').eq(1);

      data.title = $title.text();
      data.url = window.location.protocol + '//' + window.location.host + '/' + $element.find('a').last().attr('href');

      data.specialList = 'readLater';

      return data;
    },

    'twitterIndex': function (targetElement) {

      var data = {};

      var $element = $(targetElement);
      var $tweet = $element.closest('.content');

      data.title = $tweet.find('.js-tweet-text').text();
      data.url = window.location.protocol + '//' + window.location.host + $tweet.find('a.details').attr('href');

      return data;
    },

    'txt': function () {

      var data = {};

      data.title = window.location.href;
      data.url = window.location.href;
      data.note = document.childNodes[0].innerText || document.childNodes[0].textContent;

      return data;
    },

   'yelp': function () {

      var data = {};
      var note = '';

      // build the address url
      var address = '';
      $('#bizInfoContent address *').each(function (index, element) {

        var text = $.trim($(element).text());

        if (text) {

          if (address) {
            address += ', ';
          }

          address += text;
        }
      });

      if (address) {
        note += 'https://maps.google.com/maps?z16&q=' + encodeURIComponent(address) + '\n';
      }

      // add the phone number
      var phone = $.trim($('#bizPhone').text());

      if (phone) {

        note += phone + '\n';
      }

      // add the business' url
      var bizUrl = $.trim($('#bizUrl a').text());

      if (bizUrl) {

        note += bizUrl + '\n';
      }

      data.title = $.trim($('#bizInfoHeader h1').text());

      // find the description
      $('head meta').each(function (index, element) {
        if ($(element).attr('property') === 'og:description') {
          data.title += ' - ' + $(element).attr('content');
        }
      });

      // find the rating
      $('#bizRating .rating meta').each(function (index, element) {
        if ($(element).attr('itemprop') === 'ratingValue') {
          data.title += ' [' + $(element).attr('content') + ']';
        }
      });

      data.note = note + '\n';
      data.scraper = 'yelp';
      data.url = window.location.href;

      return data;
    },

    'tripadvisor': function () {

      var data = {};

      data.title = $.trim($('h1').first().text());
      var replaceTitle = data.title + ':';

      var note = $.trim($('meta[name="description"]').attr('content').replace(replaceTitle, '')) + '\n\n';

      // build the address url
      var address = '';
      $('.infoBox address *').each(function (index, element) {

        var text = $.trim($(element).text());

        if (text && address.indexOf(text) < 0) {

          if (address) {
            address += ', ';
          }

          address += text;
        }
      });

      if (address) {
        note += 'https://maps.google.com/maps?z16&q=' + encodeURIComponent(address) + '\n';
      }

      data.note = note;
      data.scraper = 'tripadvisor';
      data.url = window.location.href;
      data.specialList = 'wishlist';

      return data;
    }
  };

  // scrape something based on the current url
  function scrape (data) {

    var hash = window.location.hash;
    var host = window.location.hostname;
    var path = window.location.pathname;
    var search = window.location.search;

    if (/\.txt/.test(path)) {

      return Scrapers.txt();
    }
    else if (/mail\.google\.com/.test(host) && hash.split('/')[1]) {

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
    else if (/news\.ycombinator\.com/.test(host) && path === '/item') {

      return Scrapers.hackerNews();
    }
    else if (/news\.ycombinator\.com/.test(host) && data.scraperTarget) {

      return Scrapers.hackerNewsIndex(data.scraperTarget);
    }
    else if (/twitter\.com/.test(host)) {

        return Scrapers.twitterIndex(data.scraperTarget);
    }
    else if (/\.yelp\.com/.test(host)) {

      return Scrapers.yelp();
    }
    else if (/tripadvisor\./.test(host)) {

      return Scrapers.tripadvisor();
    }

    // return something as nothing
    return {};
  }

  // exports
  WL.scrape = scrape;

})(window.WL);
