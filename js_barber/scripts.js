 var link = document.querySelector('.login');
 var popup = document.querySelector('.modal-content');
 var overlay = document.querySelector('.modal-overlay');
 var close = popup.querySelector('.modal-content-close');
 var form = popup.querySelector('form');
 var login = popup.querySelector('[name=login]');
 var password = popup.querySelector('[name=password]');
 var storage = localStorage.getItem('login');
 var mapOpen = document.querySelectorAll('.js-open-map');
 var mapPopup = document.querySelector('.modal-content-map');
 var mapClose = mapPopup.querySelector('.modal-content-close');


  link.addEventListener('click', function(evt) {
    evt.preventDefault();
    overlay.classList.add('modal-overlay-show');
    popup.classList.add('modal-content-show');

    if (storage) {
      login.value = storage;
      password.focus();
    } else {
      login.focus();
    }
  });

  close.addEventListener('click', function(evt) {
    evt.preventDefault();
    overlay.classList.remove('modal-overlay-show');
    popup.classList.remove('modal-content-show');
    popup.classList.remove('modal-error');
  });

  form.addEventListener('submit', function(evt) {
    if (!login.value || !password.value) {
      evt.preventDefault();
      popup.classList.remove('modal-error');
      popup.offsetWidth = popup.offsetWidth;
      popup.classList.add('modal-error');
    } else {
      localStorage.setItem('login', login.value);
    }
  });

  w.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 27) {
      if (popup.classList.contains('modal-content-show')) {
        overlay.classList.remove('modal-overlay-show');
        popup.classList.remove('modal-content-show');
        popup.classList.remove('modal-error');
      }
    }
  });

  (function () {
    for (var i = 0; i < mapOpen.length; i++) {
        mapOpen[i].addEventListener('click', function(evt) {
          evt.preventDefault();
          overlay.classList.add('modal-overlay-show');
          mapPopup.classList.add('modal-content-show');
        });
    }
  })();

  mapClose.addEventListener('click', function(evt) {
    evt.preventDefault();
    overlay.classList.remove('modal-overlay-show');
    mapPopup.classList.remove('modal-content-show');
  });

  w.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 27) {
      if (mapPopup.classList.contains('modal-content-show')) {
        overlay.classList.remove('modal-overlay-show');
        mapPopup.classList.remove('modal-content-show');
      }
    }
  });

  overlay.addEventListener('click', function(evt) {
    this.classList.remove('modal-overlay-show');
    d.querySelector('.modal-content-show').classList.remove('modal-content-show');
  });




