import VanillaHeader from "vanilla/src/VanillaHeader/main";

import stateManeger from "./../config/stateManeger";

import { getNotificationsUrl, RealTimeNotificationsUrl, SSENotificationsAuthUrl, allCategoriesUrl, host, headers } from './../config/api';

import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';

window.addEventListener('hashchange', () => {

    window.location.reload();
});

VanillaHeader.defaultProfilePicture = host + "paintopaedia_api/api/images/static/defualt_user_profile_pricture.png";
VanillaHeader.logo = host + "paintopaedia_api/api/images/static/paint_logo.png";
VanillaHeader.logoutUrl = document.location.href + '#logout';
VanillaHeader.profileUrl = host + 'paintopaedia/dist/profile/index.html';

let vanillaHeader = new VanillaHeader();

stateManeger.check_logout();

let user = stateManeger.user();

if(user == null) stateManeger.logout();

if(user.profile_picture != undefined && user.profile_picture != null && user.profile_picture != '') {

    vanillaHeader.profilePicture = user.profile_picture;

}

vanillaHeader.userName = user.first_name + ' ' + user.last_name;

let storedCategories = stateManeger.categories();

if(storedCategories == null) {

    stateManeger.fetchingCategories = true;

    fetch(allCategoriesUrl).then(response => response.json()).then((result) => {
        if(result.status) {
    
            if(Array.isArray(result.data)) {
    
                let categories = [];
    
                result.data.forEach(category => {

                    categories.push({ text: category.name, url: host + 'paintopaedia/dist/main/index.html#' +  category.name });
                });
                
                vanillaHeader.vanillaCategoriesList.list = categories;
    
                stateManeger.storeCategoties(categories);
                stateManeger.fetchingCategories = false;

                return;
            }
        }

        console.error('error in fetch categories');
        stateManeger.fetchingCategories = false;
    
    }).catch(() => {
    
        console.error('error in fetch categories');
        stateManeger.fetchingCategories = false;
    });
} else vanillaHeader.vanillaCategoriesList.list = storedCategories;

vanillaHeader.vanillaNotifications.fetchNotificationsFromApi(getNotificationsUrl, 'GET', headers, null, true, 6);

const EventSource = NativeEventSource || EventSourcePolyfill;

( new Promise( ( resolve, reject ) => {

    setTimeout( () => {

        fetch(SSENotificationsAuthUrl, { headers }).then(response => response.json()).then((result) => {

            if(! result.hasOwnProperty('status')  || ! result.status) {
                        
            
                if(result.hasOwnProperty('msg')) {

                    reject (result.msg);

                }

                reject (generalErrorMessage);

            }

            resolve( result.data.st );

        }).catch ( (error) => {
            reject (error); 
        });
    }, 1000);

}) ).then( st => {

    const notificationsSource = new EventSource(RealTimeNotificationsUrl + "&st=" + st);

    notificationsSource.addEventListener('notifications', function (event) {

        let data = null;

        try {

            data = JSON.parse(event.data);

        } catch(e) {

            return;
        }

        vanillaHeader.vanillaNotifications.pushAll(data.notifications, true);
    
    }, false);

});

/*    
    socket io to comments and replies ???? 

    Dash to all videos ???? 
*/

/*
vanillaHeader.vanillaNotifications.setServerSentEvent(url, ( data ) => {

    return new Promise((resolve, reject) => {

        // what i will do after accept data from server ?? 

        // push notification ?? 

        // delete/pop notification ?? 

    }).then( () => {

    }).catch( () => {

    });

}, autoThenAndCatch = false);
*/

export default vanillaHeader;