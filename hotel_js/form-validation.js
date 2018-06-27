/* global docCookies: true */

'use strict';

(function() {
  var formElement = document.forms['searchform'];

  var guests = formElement['searchform-guests-number'];
  var rooms = formElement['searchform-guests-rooms'];
  var dateFrom = formElement['date-from'];
  var dateTo = formElement['date-to'];

  guests.min = 1;
  guests.max = 6;
  dateFrom.min = new Date().toGMTString().substring();
  var MAX_GUESTS_PER_ROOM = 3;
  var MIN_DATE_DIFFERENCE = 24 * 60 * 60 * 1000;


  guests.value = docCookies.getItem('guests') || 2;
  setMinAndMaxRooms(rooms, guests.value);
  rooms.value = docCookies.getItem('rooms') || rooms.min;

  dateFrom.value = getFormattedDate(new Date());
  setMinDateTo(dateTo, dateFrom.value);
  dateTo.value = dateTo.min;

  guests.onchange = function() {
    setMinAndMaxRooms(rooms, guests.value);
  };

  dateFrom.onchange = function() {
    setMinDateTo(dateTo, dateFrom.value);
  };

  formElement.onsubmit = function(evt) {

    evt.preventDefault();


    var dateToExpire = +Date.now() + 3 * 24 * 60 * 60 * 1000;

    docCookies.setItem('guests', guests.value, dateToExpire);
    docCookies.setItem('rooms', rooms.value, dateToExpire);

    formElement.submit();
  };

  /**
   * @param {Element} roomsElement
   * @param {number} guestsNumber
   */
  function setMinAndMaxRooms(roomsElement, guestsNumber) {
   
    roomsElement.min = Math.ceil(guestsNumber / MAX_GUESTS_PER_ROOM);


    roomsElement.max = guestsNumber;
  }

  /**
   * @param {HTMLInputElement} dateToElement
   * @param {string} dateFromValue value date-to
   */
  function setMinDateTo(dateToElement, dateFromValue) {
    var from = new Date(dateFromValue);
    var minDateTo = new Date(+from + MIN_DATE_DIFFERENCE);
    dateToElement.min = getFormattedDate(minDateTo);
  }

  /**
   *  yyyy-mm-dd
   * input type=date.
   * @param {Date} date
   * @return {string}
   */
  function getFormattedDate(date) {
    return date.toISOString().substring(0, 10);
  }
})();
