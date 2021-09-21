import "./../style/edit_profile.scss";

import { setChangeImageEvents } from "./utils/helpers";

import header from "./components/header";

import stateManeger from "./config/stateManeger";

import { editProfileUrl, generalErrorMessage, headers } from "./config/api";

import { vanillaPopUp, convertB64toBlob, removePlaceHolders } from './utils/helpers';

let user = stateManeger.user();

document.body.appendChild(header);

let parameters = stateManeger.current_hash_parameters();

if( parameters.post != undefined ) {

    document.location = stateManeger.homeUrl + document.location.hash;

}

let profilePicChangeButton = document.getElementById('profilePicChangeButton');
let profilePicInputFile = document.getElementById('profilePicInputFile');
let profilePicViewer = document.getElementById('profilePicViewer');

profilePicViewer.src = header.profilePicture;

setChangeImageEvents(profilePicChangeButton, profilePicViewer, profilePicInputFile, true, 200, 200);

let editButton = document.getElementById('editButton');

let firstNameInput = document.getElementById('firstNameInput');
let lastNameInput = document.getElementById('lastNameInput');
let emailInput = document.getElementById('emailInput');
let newPasswordInput = document.getElementById('passwordInput');

firstNameInput.value = user.first_name;
lastNameInput.value = user.last_name;
emailInput.value = user.email;

editButton.addEventListener('click', () => {

    const data = new FormData();

    let weHaveDataChange = false;

    let firstName = firstNameInput.value.trim();

    if(firstName != user.first_name && firstName != '') {

        data.append('first_name', firstName);

        weHaveDataChange = true;
    }

    let lastName = lastNameInput.value.trim();

    if(lastName != user.last_name && lastName != ''){

        data.append('last_name', lastName);

        weHaveDataChange = true;
    } 

    let email = emailInput.value.trim();

    if(email != user.email && email != '') {

        data.append('email', email);

        weHaveDataChange = true;
    }

    let newPassword = newPasswordInput.value;

    if(newPassword != '') {

        data.append('password', newPassword);

        weHaveDataChange = true;
    }

    if(profilePicViewer.src != header.profilePicture) {

        let ImageURL = profilePicViewer.src;

        let block = ImageURL.split(";");

        let contentType = block[0].split(":")[1];

        let realData = block[1].split(",")[1];

        let blob = convertB64toBlob(realData, contentType);

        data.append('profile_picture', blob);

        weHaveDataChange = true;
    }

    if(weHaveDataChange == false) {

        vanillaPopUp.alert('no change on data', 'you don\'t change data to save it !!', 'ok');

        return;
    }

    fetch(editProfileUrl, {
        method: 'POST',
        body: data,
        headers,

    }).then(response => response.json()).then((result) => {

        if(! result.hasOwnProperty('status')  || ! result.status) {
            

            if(result.hasOwnProperty('msg')) {

                vanillaPopUp.alert('edit profile failed', result.msg, 'ok');
                return null;
            }

            vanillaPopUp.alert('edit profile failed', generalErrorMessage, 'ok');

            return null;
        }

        return result;

    }).then((result) => {

        if(result == null) return;

        stateManeger.store_user(result.data);

        vanillaPopUp.alert('edit profile successed', 'New Data Seved', 'ok');

        stateManeger.refresh();

        profilePicViewer.src = header.profilePicture;

    }).catch((error) => {

        vanillaPopUp.alert('edit profile failed', error, 'ok');
    });

});

window.addEventListener('load', () => {
    removePlaceHolders();
});
