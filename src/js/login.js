import "./../style/login.scss";

import { loginUrl, generalErrorMessage } from './config/api';

import { vanillaPopUp } from './utils/helpers';

import { headers } from './config/api';

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

let emailInput = document.getElementById('emailInput');

let passwordInput = document.getElementById('passwordInput');

let loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', () => {

    let email = emailInput.value.trim();
    
    let password = passwordInput.value;

    if(email == '') {

        emailInput.setAttribute('style', 'border: 1.25px solid red');

        return;
    }

    if(password == '') {

        passwordInput.setAttribute('style', 'border: 1.25px solid red');

        return;
    }

    const data = new FormData();

    data.append('email', email);

    data.append('password', password);

    fetch(loginUrl, {
        method: 'POST',
        body: data,
        headers,

    }).then(response => response.json()).then((result) => {

        if(! result.hasOwnProperty('status')  || ! result.status) {
            

            if(result.hasOwnProperty('msg')) {

                vanillaPopUp.alert('login failed', result.msg, 'ok');
                return null;
            }

            vanillaPopUp.alert('login failed', generalErrorMessage, 'ok');

            return null;
        }

        return result;

    }).then((result) => {

        if(result == null) return;

        stateManeger.login(result.data);

    }).catch((error) => {

        vanillaPopUp.alert('login failed', error, 'ok');
    });

});