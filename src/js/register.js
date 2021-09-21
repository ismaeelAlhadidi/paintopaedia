import "./../style/register.scss";

import { setChangeImageEvents } from "./utils/helpers";
import { registerUrl, generalErrorMessage, headers } from "./config/api";

import { vanillaPopUp, convertB64toBlob } from './utils/helpers';

import stateManeger from './config/stateManeger';

let user = stateManeger.user();

if(user != null) document.location = stateManeger.homeUrl;

let goToLoginButton = document.getElementById('goToLoginButton');

goToLoginButton.addEventListener('click', () => {

    document.location = stateManeger.loginUrl;
});

let goToRegisterButton = document.getElementById('goToRegisterButton');

goToRegisterButton.addEventListener('click', () => {

    document.location = stateManeger.registerUrl;
});

let profilePicChangeButton = document.getElementById('profilePicChangeButton');
let profilePicInputFile = document.getElementById('profilePicInputFile');
let profilePicViewer = document.getElementById('profilePicViewer');

let oldImage = profilePicViewer.src;

setChangeImageEvents(profilePicChangeButton, profilePicViewer, profilePicInputFile, true, 200, 200);


let registerButton = document.getElementById('registerButton');

let firstNameInput = document.getElementById('firstNameInput');
let lastNameInput = document.getElementById('lastNameInput');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');
let confirmPasswordInput = document.getElementById('confirmPasswordInput');

registerButton.addEventListener('click', () => {


    let firstName = firstNameInput.value.trim();

    if(firstName == '') {

        firstNameInput.setAttribute('style', 'border: 1.25px solid red');

        return;
    }

    let lastName = lastNameInput.value.trim();

    if(lastName == '') {

        lastNameInput.setAttribute('style', 'border: 1.25px solid red');

        return;
    }

    let email = emailInput.value.trim();

    if(email == '') {

        emailInput.setAttribute('style', 'border: 1.25px solid red');

        return;
    }

    let password = passwordInput.value;

    if(password != confirmPasswordInput.value) {

        passwordInput.setAttribute('style', 'border: 1.25px solid red');
        confirmPasswordInput.setAttribute('style', 'border: 1.25px solid red');

        return;
    }

    if(password == '') {

        passwordInput.setAttribute('style', 'border: 1.25px solid red');

        return;
    }

    const data = new FormData();

    data.append('first_name', firstName);

    data.append('last_name', lastName);

    data.append('email', email);

    data.append('password', password);

    if(oldImage != profilePicViewer.src) {

        let ImageURL = profilePicViewer.src;

        let block = ImageURL.split(";");

        let contentType = block[0].split(":")[1];

        let realData = block[1].split(",")[1];

        let blob = convertB64toBlob(realData, contentType);

        data.append('profile_picture', blob);
    }

    fetch(registerUrl, {
        method: 'POST',
        body: data,
        headers,

    }).then(response => response.json()).then((result) => {

        if(! result.hasOwnProperty('status')  || ! result.status) {
            

            if(result.hasOwnProperty('msg')) {

                vanillaPopUp.alert('register failed', result.msg, 'ok');
                return null;
            }

            vanillaPopUp.alert('register failed', generalErrorMessage, 'ok');

            return null;
        }

        return result;

    }).then((result) => {

        if(result == null) return;

        stateManeger.login(result.data);

    }).catch((error) => {

        vanillaPopUp.alert('register failed', error, 'ok');
    });
});

