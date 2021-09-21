import stateManeger from "./stateManeger";

let user = stateManeger.user();

export let host = 'http://localhost:80/';

let baseUrl = host + 'paintopaedia_api/api/v1';

export let api_secret = 'api_secret';

let apikey = '?api_key=' + api_secret;


export let loginUrl = baseUrl + '/auth/login.php' + apikey;

export let registerUrl = baseUrl + '/auth/register.php' + apikey;

export let editProfileUrl = baseUrl + '/auth/edit_profile.php' + apikey;

export let allCategoriesUrl = baseUrl + '/category/all.php' + apikey;

export let addPostUrl = baseUrl + '/post/add.php' + apikey;

export let getPostsUrl = baseUrl + '/post/get.php' + apikey;

export let addCommentUrl = baseUrl + '/comment/add.php' + apikey;

export let addReplyUrl = baseUrl + '/reply/add.php' + apikey;

export let toggleLikeUrl = baseUrl + '/like/toggle.php' + apikey;

export let getLikesListUrl = baseUrl + '/like/list.php' + apikey;

export let getFollowingListUrl = baseUrl + '/follow/following.php' + apikey;

export let getFollowersListUrl = baseUrl + '/follow/follower.php' + apikey;

export let userDataUrl = baseUrl + '/auth/user.php' + apikey;

export let toggleFollowUrl = baseUrl + '/follow/toggle.php' + apikey;

export let getNotificationsUrl = baseUrl + '/notification/get.php' + apikey;

export const RealTimeNotificationsUrl = baseUrl + '/notification/sse.php' + apikey;

export const SSENotificationsAuthUrl = baseUrl + '/notification/authenticate_sse.php' + apikey

export const headers = ( user != null ? new Headers( {
    'Authorization' : `Bearer ${user.jwt}`
} ) : new Headers() );

export let generalErrorMessage = 'error in fetch data please check your connections !';
