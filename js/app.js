'use strict';

const allHorns1 = [];
const allHorns2 = [];
let isPage1 = true;

//Horn constructor function
function Horn(horn, page) {
  this.title = horn.title;
  this.image_url = horn.image_url;
  this.description = horn.description;
  this.horns = horn.horns;
  this.keyword = horn.keyword;

  //new parameter page that determines which array to push in.
  if(page === 1) {
    allHorns1.push(this);
  } else {
    allHorns2.push(this);
  }
}

//render using handlebar template
Horn.prototype.render = function(){
  let source = $('#horn-template').html();
  let template = Handlebars.compile(source);
  return template(this);
};

//render options in drop down menu based on which page was picked.
function optionRender(page) {
  const uniqueKeywords = [];
  //ternary condition to check which array to use for options
  let hornPage = (page === 1) ? allHorns1 : allHorns2;
  //reset select back to 'default'
  $('select').prop('selectedIndex',0);
  //remove all option tags except the first one (default)
  $('option').not(':first-child').remove();
  //push unique keywords to array
  hornPage.forEach(image => {
    if(!uniqueKeywords.includes(image.keyword)){
      uniqueKeywords.push(image.keyword);
    }
  });
  //for each unique keyword, generate a new option tag and append to drop down menu
  uniqueKeywords.forEach(keyObj => {
    let optionTag = `<option value=${keyObj}>${keyObj}</option>`;
    $('select').append(optionTag);
  });
  //add event listener to select tag on 'change'
  $('select').on('change', clickHandler);
}

//show or hide sections depend on keyword in dropdown menu
function clickHandler(event){
  let keyValue = event.target.value;
  if(keyValue !== 'default'){
    $('section').hide();
    $(`section.${keyValue}`).fadeIn(500);
  } else {
    $('section').fadeIn(500);
  }
}

function pageSwap(event){
  const pageId = event.target.id;
  let pageArr = (pageId === 'page1') ? allHorns1 : allHorns2;
  let optNum = (pageId === 'page1') ? 1 : 2;
  //remove content in main
  $('main').empty();

  pageArr.forEach(horn => {
    let hornObj = horn.render();
    $('main').append(hornObj);
  });
  optionRender(optNum);
}

function fetchData(page){
  let dataURL;
  let pageArr;
  //define variable values based on page1 or page2
  if(page === 'page1') {
    dataURL = 'data/page-1.json';
    pageArr = 1;
  } else if(page === 'page2'){
    dataURL = 'data/page-2.json';
    pageArr = 2;
  }

  //instantiate new Horn based on given variable values
  $.get(dataURL, data => {
    data.forEach(horn => {
      new Horn(horn, pageArr);
    });
  });
}

function sortArr(event){
  $('main').empty();
  let allHorns = (isPage1) ? allHorns1 : allHorns2;
  let sort = event.target.id;
  let sortTypeA;
  let sortTypeB;
  allHorns.sort((a,b) =>{
    if(sort === 'sortTitle'){
      sortTypeA = a.title;
      sortTypeB = b.title;
    }
    else if(sort === 'sortHorn'){
      sortTypeA = a.horns;
      sortTypeB = b.horns;
    }
    if(sortTypeA < sortTypeB) {return -1;}
    else if (sortTypeA > sortTypeB) {return 1;}
    else {return 0;}
  });
  allHorns.forEach(obj =>{
    let hornObj = obj.render();
    $('main').append(hornObj);
  });
}

$(function() {
  //instantiate Horn objects and store them in separate arrays
  fetchData('page1');
  fetchData('page2');

  $('#page1').on('click', pageSwap).trigger('click');
  $('#page2').on('click', pageSwap);
  $('#sortTitle').on('click', sortArr);
  $('#sortHorn').on('click', sortArr);
});

