import "./../style/profile.scss";

import VanillaGalleryTemplate from "vanilla/src/VanillaGalleryTemplate/main";
import { generatorTemplateId } from "./utils/generator";
import { vanillaPopUp, removePlaceHolders } from "./utils/helpers";
import header from "./components/header";
import { setAddPostButtonEvent } from "./../js/components/addPostTemplate";
import { addPostsIn } from "./components/Post";
import stateManeger from "./config/stateManeger";
import { userDataUrl, headers, generalErrorMessage, host } from "./config/api";
import VanillaLikesList from "vanilla/src/VanillaLikesList/main";

document.body.appendChild(header);

let user = stateManeger.user();

let userId = stateManeger.profile_page_user_id();

let user_data = null;

let parameters = stateManeger.current_hash_parameters();

if( parameters.post != undefined ) {

    document.location = stateManeger.homeUrl + document.location.hash;

}

let EditProfileButtonHandler = () => {
    
    document.location = host + 'paintopaedia/dist/edit_profile/index.html';
};

let profilePic = document.getElementById('profilePic');
let followersButton = document.getElementById('followersButton');
let followingButton = document.getElementById('followingButton');
let postsCount = document.getElementById('postsCount');
let EditProfileButton = document.getElementById('EditProfileButton');

EditProfileButton.addEventListener('click', EditProfileButtonHandler);

let setUserData = (user_data) => {

    if(user_data != null) {

        if(user_data.hasOwnProperty('first_name') || user_data.hasOwnProperty('last_name')) {
            
            let UserName = document.getElementById('UserName');

            if(UserName != null) {

                let UserNamePlaceHolder = document.querySelector('user-name-place-holder');

                if( UserNamePlaceHolder != null ) if ( UserName == UserNamePlaceHolder.parentElement ) UserName.removeChild(UserNamePlaceHolder);

                UserName.textContent = ( user_data.hasOwnProperty('first_name') ? user_data.first_name + ' ' : '' )
                    + ( user_data.hasOwnProperty('last_name') ? user_data.last_name : '' );
            }
        }

        if(user_data.hasOwnProperty('profile_picture')) {
            if (
                user_data.profile_picture != false &&
                user_data.profile_picture != null && 
                user_data.profile_picture != undefined &&
                user_data.profile_picture != ''
            ) if(profilePic != null) profilePic.src = user_data.profile_picture;
        }

        if(user_data.hasOwnProperty('followers')) {

            if(followersButton != null) followersButton.textContent = user_data.followers + ' followers';
        }

        if(user_data.hasOwnProperty('following')) {
            
            if(followingButton != null) followingButton.textContent = user_data.following + ' following';
        }

        if(user_data.hasOwnProperty('posts')) {
            
            if(postsCount != null) postsCount.textContent = user_data.posts + ' posts';
        }

        if(userId != user.id) {

            if(EditProfileButton != null) {

                EditProfileButton.textContent = 'follow';

                if(user_data.hasOwnProperty('follow')) {

                    if(user_data.follow) EditProfileButton.textContent = 'following';

                    EditProfileButton.removeEventListener('click', EditProfileButtonHandler);

                    EditProfileButtonHandler = () => {

                        if(! user_data.hasOwnProperty('followers'))  user_data.followers = 0;

                        if(user_data.follow) {
                            
                            user_data.followers = (user_data.followers < 1 ? 0 : user_data.followers-1);

                        } else {

                            user_data.followers = user_data.followers+1;
                        }

                        if(followersButton != null) followersButton.textContent = user_data.followers + ' followers';


                        user_data.follow = ! user_data.follow;
                        EditProfileButton.textContent = user_data.follow ? 'following' : 'follow';

                        VanillaLikesList.toggleFollowCallBack(userId).then((result) => {

                            if(result.status) return;
                            user_data.follow = ! user_data.follow;
                            EditProfileButton.textContent = user_data.follow ? 'following' : 'follow';
    
                        }).catch((message) => {

                            user_data.follow = ! user_data.follow;
                            EditProfileButton.textContent = user_data.follow ? 'following' : 'follow';
                            vanillaPopUp.alert('error in follow', message, 'ok');
                        });
                    };

                    EditProfileButton.addEventListener('click', EditProfileButtonHandler);
                }
            }
        }
    }

    let vanillaGalleryTemplate  = new VanillaGalleryTemplate([profilePic.src], null, false, generatorTemplateId.next().value);

    profilePic.addEventListener('click', () => {
        
        vanillaGalleryTemplate.open();
    });
};

let fetchUserData = async () => {

    fetch ( userDataUrl + '&user_id=' + userId, {
        headers
    }).then(response => response.json()).then((result) => {

        if(! result.hasOwnProperty('status')  || ! result.status) {
                
    
            if(result.hasOwnProperty('msg')) {

                vanillaPopUp.alert('fetch user data failed', result.msg, 'ok');

                return null;
            }

            vanillaPopUp.alert('fetch user data failed', generalErrorMessage, 'ok');

            return null;
        }

        return result;

    }).then((result) => {

        if(result == null) return;

        if(! result.hasOwnProperty('data')) {

            vanillaPopUp.alert('fetch user data failed', generalErrorMessage, 'ok');

            return;
        }

        user_data = result.data;

        setUserData(user_data);

    }).catch((message) => {

        vanillaPopUp.alert('fetch user data failed', message, 'ok');
    });
};

( async () => {

    await fetchUserData();

    let page = 1;

    let postsInnerTemplate = document.getElementById('postsInnerTemplate');

    let windowScrollHandler = (event) => {

        if(event.target.documentElement.offsetHeight - ( window.innerHeight + window.pageYOffset ) < 50) {

            window.removeEventListener('scroll', windowScrollHandler);

            addPostsIn(postsInnerTemplate, page, null, userId).then(() => {

                page++;
                window.addEventListener('scroll', windowScrollHandler);

            }).catch(() => {

                page++;
            });
        }
    };

    window.addEventListener('load', () => {
        
        removePlaceHolders();

        addPostsIn(postsInnerTemplate, page, null, userId).then(() => {

            page++;
            window.addEventListener('scroll', windowScrollHandler);

        }).catch(() => {
                
            page++;
        });
    });

    let addPostButton = document.getElementById('addPostButton');
    if(userId == user.id) {
        setAddPostButtonEvent(addPostButton);
    } else {
        let parent = addPostButton.parentElement;
        parent.removeChild(addPostButton);
    }

    followersButton.addEventListener('click', () => {

        vanillaPopUp.follower(userId, 'Post', 'follower list', null, true);
    });

    followingButton.addEventListener('click', () => {

        vanillaPopUp.following(userId, 'Post', 'following list', null, true);

    });

})();