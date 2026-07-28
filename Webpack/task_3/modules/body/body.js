import $ from 'jquery';
import { debounce } from 'lodash';
import './body.css';

let count = 0;

function updateCounter() {
  count += 1;
  $('#count').text(`${count} clicks on the button`);
}

$(document).ready(() => {
  $('body').append('<p>Dashboard data for the students</p>');
  $('body').append('<button>Click here to get started</button>');
  $('body').append("<p id='count'></p>");

  $('button').on('click', debounce(updateCounter, 500));
});
