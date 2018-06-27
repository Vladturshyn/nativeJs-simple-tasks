'use strict';

(function() {
  /**
   * Массив соотсветствий рейтинга отеля DOM-классу элементам
   * со звездами.
   * @type {Array.<string>}
   */
  var starsClassName = [
    'hotel-stars',
    'hotel-stars',
    'hotel-stars-two',
    'hotel-stars-three',
    'hotel-stars-four',
    'hotel-stars-five'
  ];

  /**
   * Соответствие округленного вниз рейтинга классу
   * для блока с рейтингом.
   * @type {Object.<string, string>}
   */
  var ratingClassName = {
    'undefined': 'hotel-rating-none',
    '4': 'hotel-rating-four',
    '5': 'hotel-rating-five',
    '6': 'hotel-rating-six',
    '7': 'hotel-rating-seven',
    '8': 'hotel-rating-eight',
    '9': 'hotel-rating-none'
  };

  /**
   * Соответствие id дополнительных удобств
   * классам блоков с удобствами.
   * @type {Object.<string, string>}
   */
  var amenityClassName = {
    'breakfast': 'hotel-amenity-breakfast',
    'parking': 'hotel-amenity-parking',
    'wifi': 'hotel-amenity-wifi'
  };

  /**
   * Соответствие id дополнительных удобств
   * названиям удобств в разметке.
   * @type {Object.<string, string>}
   */
  var amenityName = {
    'breakfast': 'Завтрак',
    'parking': 'Парковка',
    'wifi': 'WiFi'
  };

  var container = document.querySelector('.hotels-list');
  var activeFilter = 'filter-all';
  var hotels = [];
  var filteredHotels = [];
  var currentPage = 0;
  var PAGE_SIZE = 9;

  // Чтобы добавить обработчики на клики, приходится пройти по всем
  // элементам и каждому из них добавить обработчик. Это трудоемкая
  // операция. Можно ли сделать так, чтобы добавлялся только один
  // обработчик сразу на все фильтры? Можно через делегирование.
  // Делегирование — прием основанный на всплытии событий.
  var filters = document.querySelector('.hotels-filters');

  // При делегировании обработчик события добавленный на один элемент
  // слушает события призошедшие на одном из дочерних элементов
  // этого элемента. На каком элементов произошло событие можно
  // проверить, обратившись к свойству target объекта Event.
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('hotel-filter')) {
      setActiveFilter(clickedElement.id);
    }
  });

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
     
      var footerCoordinates = document.querySelector('footer').getBoundingClientRect();


      var viewportSize = window.innerHeight;

      if (footerCoordinates.bottom - viewportSize <= footerCoordinates.height) {
        if (currentPage < Math.ceil(filteredHotels.length / PAGE_SIZE)) {
          renderHotels(filteredHotels, ++currentPage);
        }
      }
    }, 100);
  });

  getHotels();

  /**
   * render hotel list
   * @param {Array.<Object>} hotels
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderHotels(hotelsToRender, pageNumber, replace) {
    if (replace) {
      container.innerHTML = '';
    }

    var fragment = document.createDocumentFragment();

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageHotels = hotelsToRender.slice(from, to);

    pageHotels.forEach(function(hotel) {
      var element = getElementFromTemplate(hotel);

     
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
  }

  /**
   * setFilter
   * @param {string} id
   * @param {boolean=} force flag
   */
  function setActiveFilter(id, force) {

    if (activeFilter === id && !force) {
      return;
    }

  
    var selectedElement = document.querySelector('#' + activeFilter);
    if (selectedElement) {
      selectedElement.classList.remove('hotel-filter-selected');
    }

    document.querySelector('#' + id).classList.add('hotel-filter-selected');

    //arr copy
    filteredHotels = hotels.slice(0); 

    switch (id) {
      case 'filter-expensive':
        
        filteredHotels = filteredHotels.sort(function(a, b) {
          return b.price - a.price;
        });
        break;

      case 'filter-cheap':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.price - b.price;
        });
        break;

      case 'filter-2stars':
        
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.stars - b.stars;
        }).filter(function(item) {
          return item.stars > 2;
        });

        break;

      case 'filter-6rating':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.rating - b.rating;
        }).filter(function(item) {
          return item.rating >= 6;
        });
        break;
    }

    currentPage = 0;
    renderHotels(filteredHotels, currentPage, true);

    activeFilter = id;
  }

  
  function getHotels() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/hotels.json');
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadedHotels = JSON.parse(rawData);
      updateLoadedHotels(loadedHotels);
    };

    xhr.send();
  }

  /**
   * @param {Array.<Object>} loadedHotels
   */
  function updateLoadedHotels(loadedHotels) {
    hotels = loadedHotels;
    document.querySelector('.hotels-title-count-number').innerText = hotels.length;

    setActiveFilter(activeFilter, true);
  }

  /**
   * @param {Object} data
   * @return {Element}
   */
  function getElementFromTemplate(data) {
    var template = document.querySelector('#hotel-template');
    var hotelRating = data.rating || 6.0;
    var element;

    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    element.querySelector('.hotel-stars').classList.add(starsClassName[data.stars]);
    element.querySelector('.hotel-rating').classList.add(ratingClassName[Math.floor(hotelRating)]);

    element.querySelector('.hotel-name').textContent = data.name;
    element.querySelector('.hotel-rating').textContent = hotelRating.toFixed(1);
    element.querySelector('.hotel-price-value').textContent = data.price;

    var amenitiesContainer = element.querySelector('.hotel-amenities');

    data.amenities.forEach(function(amenity) {
      var amenityElement = document.createElement('li');
      amenityElement.classList.add('hotel-amenity', amenityClassName[amenity]);
      amenityElement.innerHTML = amenityName[amenity];
      amenitiesContainer.appendChild(amenityElement);
    });

    /**
     * @type {Image}
     */
    var backgroundImage = new Image();

   
    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
    };

    //if 404 
    backgroundImage.onerror = function() {
      element.classList.add('hotel-nophoto');
    };

    /**
     * @const
     * @type {number}
     */
    var IMAGE_TIMEOUT = 10000;

  
    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = ''; // finish
      element.classList.add('hotel-nophoto'); // show error
    }, IMAGE_TIMEOUT);

    backgroundImage.src = data.preview;

    return element;
  }
})();
