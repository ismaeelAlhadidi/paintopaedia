class StateManeger {

    static loginPageUrl = 'http://localhost:80/paintopaedia/dist/login/index.html';

    static registerPageUrl =  'http://localhost:80/paintopaedia/dist/register/index.html';

    static homePageUrl =  'http://localhost:80/paintopaedia/dist/main/index.html';

    constructor() {

        this.registerUrl = StateManeger.registerPageUrl;

        this.loginUrl = StateManeger.loginPageUrl;

        this.homeUrl = StateManeger.homePageUrl;

        this.fetchingCategories = false;
    }

    check_logout() {

        let hash = document.location.hash;

        hash = hash.split('#');

        if(hash.lastIndexOf('logout') != -1) {

            this.logout();
        }
    }
    
    logout() {

        if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined") {

            localStorage.setItem('user', null);

            document.location = StateManeger.loginPageUrl;

            return;
        }

        document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

        document.location = StateManeger.loginPageUrl;
    }

    login(data) {

        this.store_user(data);

        document.location = StateManeger.homePageUrl;
    }

    user() {

        if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined") {

            let userAsJson = localStorage.getItem('user');

            if(userAsJson == null) return null;

            return JSON.parse(userAsJson);
        }

        let cookies = get_cookies_as_object();

        if(! cookies.hasOwnProperty('user')) return null;

        return JSON.parse(cookies.user);
    }


    get_cookies_as_object() {

        let tempCookies = document.cookie.split(';');
        let ObjectOfCookies = {};

        for(let i = 0; i < tempCookies.length; i++) {

            key = tempCookies[i].split('=')[0];
            value = tempCookies[i].split('=')[1];
            ObjectOfCookies[key] = value;
        }

        return ObjectOfCookies;
    }


    store_user(data) {

        if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined") {

            localStorage.setItem('user', JSON.stringify(data));

            return;
        }

        let now = new Date();

        now.setMonth(now.getMonth() + 1);

        let afterOneMonth = now.toUTCString();

        document.cookie = "user=" + JSON.stringify(data) + ";expires=" + afterOneMonth + ";";
    }


    refresh() {

        let user = this.user();

        if(user == null) this.logout();

        let innerHeader = document.getElementById('VanillaHeader');

        if(innerHeader == null) return;

        let header = innerHeader.parentElement;

        if(header == null) return;

        header.userName = user.first_name + ' ' + user.last_name;

        if(user.profile_picture != undefined && user.profile_picture != null && user.profile_picture != '') {

            header.profilePicture = user.profile_picture;

            return;
        }
    }

    async wait_fetch_categories() {

        let callBack = (resolve) => {

            if(! this.fetchingCategories) {

                resolve();

                return;
            }

            setTimeout(() => {
                callBack(resolve);
            }, 500);
        };

        return new Promise((resolve) => {

            setTimeout(() => {
                callBack(resolve);
            }, 500);
        });
    }

    categories() {

        if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined") {

            let categoriesAsJson = localStorage.getItem('categories');

            if(categoriesAsJson == null) return null;

            return JSON.parse(categoriesAsJson);
        }

        let cookies = get_cookies_as_object();

        if(! cookies.hasOwnProperty('categories')) return null;

        return JSON.parse(cookies.categories);
    }

    storeCategoties(categories) {

        if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined") {

            localStorage.setItem('categories', JSON.stringify(categories));

            return;
        }

        let now = new Date();

        now.setMonth(now.getMonth() + 1);

        let afterOneMonth = now.toUTCString();

        document.cookie = "categories=" + JSON.stringify(categories) + ";expires=" + afterOneMonth + ";";
    }

    current_category() {

        let hash = document.location.hash;

        hash = hash.replace('#', '');

        let categories = this.categories();

        if(categories == null) return null;

        if(! categories.find(category => category.text == hash)) return null;

        return ( hash == '' ? null : hash );
    }

    profile_page_user_id() {

        let hash = document.location.hash;

        hash = hash.replace('#', '');
        
        if(! /^-?[0-9]+$/.test(hash)) {

            let user = this.user();

            if(user == null) return null;

            hash = user.id;
        }

        return hash;
    }

    current_hash_parameters() {

        let hash = document.location.hash;

        hash = hash.replace('#', '');

        let parameters = {};

        let string_parameters = hash.split('&');

        string_parameters.forEach( string_parameter => {

            let parameter = string_parameter.split('=');

            if(parameter.length != 2) return;

            let parameter_key = parameter[0];

            let parameter_value = parameter[1];

            parameters[parameter_key] = parameter_value;
        });

        return parameters;
    }
}


let stateManeger = new StateManeger();

export default stateManeger;