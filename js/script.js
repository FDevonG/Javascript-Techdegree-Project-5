/* jshint esversion: 6 */

//VARS
let employeeArray = [];//used to store the retrieved array of employees
let currentArray = []; //used to keep track of the current array that is being displyed
const gallery = document.querySelector('#gallery');//used to store the gallery div for referring to when needed
let modalArrayIndex = 0;//used to store the employee array number so we can easily
let searchInput;

fetchData('https://randomuser.me/api/?results=12&nat=CA');//calls the initial function to fecth the data at program start

//fetches and returns data from a fetch call.
function fetchData (url) {
	'use strict';
	fetch(url)//fecth the passed url
	.then(response => response.json())//convert the data into JSon
	.then(data => setLocalArray(data.results))//add the data item to the local array)
	.then( () => generateEmployeeList(employeeArray))//pass the converted data to the function to dislay the data
	.catch(err => console.log(err.text));
}

//stores the retrived data into a local array
function setLocalArray (data) {
	'use strict';
	employeeArray = data;
}

//displays the data retireved by the fetch data funtion
function generateEmployeeList(data) {
	'use strict';
	//clear out the current array
	while(currentArray[0]) {
		currentArray.pop();
	}
	
	const employeeGallery = document.querySelector('#gallery');
	while(employeeGallery.firstChild) {
		 employeeGallery.firstChild.remove();
	}
	
	for (let i = 0; i < data.length; i++) { //loop through the passed array of employees to build the html and add them a stored array
		currentArray.push(data[i]);//add item to the current array
		const div = document.createElement('DIV');//create a new div element to hold our employee content
		div.classList.add('card');//add the appropriate class to the div we just created
		div.style.boxShadow = '5px 5px 2.5px 0px rgba(0,0,0,0.75)';
		const html = `<div class="card-img-container">
						<img class="card-img" src="${data[i].picture.large}" alt="profile picture">
					</div>
					<div class="card-info-container">
						<h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
						<p class="card-text">${data[i].email}</p>
						<p class="card-text cap">${data[i].location.city} ${data[i].location.state}</p>
					</div>
				</div`; //build the html to be insterted into our new div
		div.innerHTML = html;//add the html to the div
		
		gallery.append(div);//add the newly created div and its html onto the page
	}
	
}

//we are adding an event listener to the gallery so we can listen for mouse clicks on the gallery items to create modal window
gallery.addEventListener('click', event => {
	'use strict';
	if (event.target.classList.contains('card') || event.target.parentElement.classList.contains('card') || event.target.parentElement.parentElement.classList.contains('card')) { //checks to make sure we did indeed click on a gallery item
		const galleryItems = document.querySelectorAll('.card');//gathers all the employee card items
		for (let i = 0; i < galleryItems.length; i++) {
			if (galleryItems[i] === event.target || galleryItems[i] === event.target.parentElement || galleryItems[i] === event.target.parentElement.parentElement) {
				modalArrayIndex = i;//sets the array index to the proper one before calling the function to build the modal
			}
		}
		createModal();
	}
});

//creates the modal window and displays the info
function createModal () {
	'use strict';
	//remove the current modal, if it exists
	if (document.querySelector('.modal-container')) {
		document.querySelector('.modal-container').remove();
	}
	console.log(currentArray[modalArrayIndex]);
	const div = document.createElement('DIV');//creates a div to contain our modal window
	div.classList.add('modal-container');//adds the modal class to our modal window
	const birthdayHolder = currentArray[modalArrayIndex].dob.date;//used to store the birthday date so we can extract what we need
	const html = `<div class="modal">
				<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
				<div class="modal-info-container">
					<img class="modal-img" src="${currentArray[modalArrayIndex].picture.large}" alt="profile picture">
					<h3 id="name" class="modal-name cap">${currentArray[modalArrayIndex].name.first} ${currentArray[modalArrayIndex].name.last}</h3>
					<p class="modal-text">${currentArray[modalArrayIndex].email}</p>
					<p class="modal-text cap">${currentArray[modalArrayIndex].location.city}</p>
					<hr>
					<p class="modal-text">${currentArray[modalArrayIndex].phone}</p>
					<p class="modal-text">${currentArray[modalArrayIndex].location.street}, ${currentArray[modalArrayIndex].location.city}, ${currentArray[modalArrayIndex].location.state} ${currentArray[modalArrayIndex].location.postcode}</p>
					<p class="modal-text">Birthday: ${birthdayHolder[5]}${birthdayHolder[6]}/${birthdayHolder[8]}${birthdayHolder[9]}/${birthdayHolder[2]}${birthdayHolder[3]}</p>
				</div>
			</div>

			<div class="modal-btn-container">
				<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
				<button type="button" id="modal-next" class="modal-next btn">Next</button>
			</div>
		</div>`;//build the html to add to our modal window
	div.innerHTML = html;//add the newly created html to the newly creted div
	document.querySelector('body').append(div);//find the body element and append the modal window
	document.querySelector('#modal-close-btn').addEventListener('click', () => closeModal());//finds the button used to close the modal and adds the event to close it
	//add the event listeners to the buttons on the modal to change the current employee
	document.querySelector('#modal-prev').addEventListener('click', () => prevModalEmployee());
	document.querySelector('#modal-next').addEventListener('click', () => nextModalEmployee());
}

//navigates to the previous employee in the modal
function prevModalEmployee() {
	'use strict';
	modalArrayIndex--;//change the index tracker
	if (modalArrayIndex < 0) {//check to see it is below 0
		modalArrayIndex = currentArray.length - 1;//resets the index tracker to the max number
	}
	console.log(modalArrayIndex);
	createModal();//creats the modal window with the new data
}

//nagivates us to the next employee in the list in modal view
function nextModalEmployee() {
	'use strict';
	modalArrayIndex++;//increment the index tracker
	if (modalArrayIndex >= currentArray.length) {//check to make sure our index tracker is not bigger than the current array
		modalArrayIndex = 0;//reset the index tracker if it has grown to big
	}
	createModal();//creats the modal window with the new data
}

//closes the modal window
function closeModal() {
	'use strict';
	if (document.querySelector('.modal-container')) {//checks to see if the modal window is avalible
		document.querySelector('.modal-container').remove();//removes the modal window
	}
}

/*******************
Search Bar
*******************/

const searchBar = document.createElement('FORM');//create a form element
searchBar.setAttribute('type', 'text');//sets the searchbar input type to text
searchBar.setAttribute('action', '#');//sets the searchbar action
searchBar.setAttribute('method', 'get');//sets the searchbar method
const html = `<input type="search" id="search-input" class="search-input" placeholder="Search...">
              <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`;//builds the html to add to the form
searchBar.innerHTML = html;//adds the new html to the form
document.querySelector('.search-container').append(searchBar);//finds the appropriate conatainer and appends the search form
searchInput = document.querySelector('#search-input');//finds the newly created search field and stores it in the searchInput var
searchInput.addEventListener('input', event => search(event));//adds input event to the search field
document.querySelector('#search-submit').addEventListener('click', event => search(event));//adds a click event to search button

//searches the employees to determine which ones match 
function search (event) {
	'use strict';
	event.preventDefault();
	const searchValue = searchInput.value;//gets the searh value
	const searchArray = [];//builds a new array to store items in
	
	for (let i = 0; i < employeeArray.length; i++) {//loops through the array
		
		const name = employeeArray[i].name.first + ' ' + employeeArray[i].name.last;//makes a value to compare the search value with
		
		let nameFound = true;//a boolean to act as a desicion maker on if they match or not
		
		for (let x = 0; x < searchValue.length; x++) {//loops through the array to determine if the name value and search value match
			if (searchValue[x] !== name[x]) {
				nameFound = false;//they do not match
			} 
		}
		if (nameFound) {
			searchArray.push(employeeArray[i]);//add the employee to the matched results
		}
		
	}

	if (searchValue !== '') {
		generateEmployeeList(searchArray);
	} else {
		generateEmployeeList(employeeArray);
	}
	
}


