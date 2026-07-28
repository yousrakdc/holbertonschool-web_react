import $ from 'jquery';
import './header.css';
import logo from '../../assets/holberton-logo.jpg';

console.log('Init header');

$(document).ready(() => {
  $('body').prepend(`<h1>Holberton Dashboard</h1>`);
  $('body').prepend(`<div id="logo" style="background-image: url(${logo})"></div>`);
});
