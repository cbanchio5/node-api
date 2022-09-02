import '@babel/polyfill'
import { login, logout } from './login'
import { displayMap} from './mapBox'


//DOM elemenrs
const mapbox = document.getElementById('map')
const form = document.querySelector('.form')
const logOutBtn = document.querySelector('.nav__el--logout')

//Values



//Delegation
if(form) {
  form.addEventListener('submit', e => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    e.preventDefault();
    login(email, password)
  })
}



if(mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations)
  displayMap(locations)
}

if(logOutBtn) {
  logOutBtn.addEventListener('click', logout)
}
