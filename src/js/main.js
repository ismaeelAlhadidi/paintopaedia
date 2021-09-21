import "./../style/main.scss";
import header from "../js/components/header";
import { setAddPostButtonEvent } from "./../js/components/addPostTemplate";
import { addPostsIn, getOpenPostTemplateOfThisPost } from "./components/Post";
import stateManeger from "./config/stateManeger";
import { vanillaPopUp, removePlaceHolders } from "./utils/helpers";

document.body.appendChild(header);

let category = stateManeger.current_category();

let page = 1;

let postsInnerTemplate = document.getElementById('postsInnerTemplate');

if ( category == null ) {

    let parameters = stateManeger.current_hash_parameters();

    if( parameters.post != undefined ) {

        getOpenPostTemplateOfThisPost(parameters.post).then((template) => {

            template.open();

            // if ( parameters.comment != undefined ) template.focusOnComment(parameters.comment);

            // if ( parameters.reply != undefined ) template.focusOnReply(parameters.reply);

            // if ( parameters.like != undefined ) template.focusOnLike(parameters.like);

        }).catch( ( message ) => {
            
            vanillaPopUp.alert('open post error', message, 'ok');

        });

    }

}

let windowScrollHandler = (event) => {

    if(event.target.documentElement.offsetHeight - ( window.innerHeight + window.pageYOffset ) < 50) {

        window.removeEventListener('scroll', windowScrollHandler);

        addPostsIn(postsInnerTemplate, page, category).then(() => {

            page++;
            window.addEventListener('scroll', windowScrollHandler);

        }).catch(() => {

            page++;
        });
    }
};

window.addEventListener('load', () => {

    removePlaceHolders();

    addPostsIn(postsInnerTemplate, page, category).then(() => {

        page++;
        window.addEventListener('scroll', windowScrollHandler);

    }).catch(() => {
            
        page++;
    });
});


let addPostButton = document.getElementById('addPostButton');

setAddPostButtonEvent(addPostButton, category);