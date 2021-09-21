import VanillaAddPostTemplate from "vanilla/src/VanillaAddPostTemplate/main";

import { generatorTemplateId } from "../utils/generator";

import stateManeger from "../config/stateManeger";

import { convertB64toBlob, vanillaPopUp } from "./../utils/helpers";

import { addPostUrl, generalErrorMessage, headers } from "./../config/api";

import { createPost } from './Post';



const maxNumberOfImages = 6;

const maxNumberOfVideos = 1;

let addPostTemplate = new VanillaAddPostTemplate(maxNumberOfImages, maxNumberOfVideos, null, false, generatorTemplateId.next().value);

export default addPostTemplate;

let postsInnerTemplate = document.getElementById('postsInnerTemplate');



let createPostPlaceHolder = () => {

    let placeHolder = document.createElement('section');

    placeHolder.setAttribute('class', 'post-place-holder');

    let span = document.createElement('span');

    span.textContent = 'post uploading ..';

    placeHolder.appendChild(span);

    return placeHolder;
};

let addPostPlaceHolder = () => {

    if(postsInnerTemplate == null) return;

    if(postsInnerTemplate.children.length < 2) {

        postsInnerTemplate.appendChild(createPostPlaceHolder());

        return;
    }

    postsInnerTemplate.insertBefore(createPostPlaceHolder(), postsInnerTemplate.children[1]);
    
};

let removePlaceHolder = () => {

    let placeHolder = document.querySelector('.post-place-holder');

    if(placeHolder == null) return;

    if(placeHolder.parentElement != postsInnerTemplate) return;

    postsInnerTemplate.removeChild(placeHolder);

};

export let setAddPostButtonEvent = async ( addPostButton,  selectedCategory = null) => {


    let withCategories = selectedCategory == null ? true : false;

    if(withCategories) {

        let storedCategories = stateManeger.categories();

        let categories = [];

        if( storedCategories == null && stateManeger.fetchingCategories ) {

            await stateManeger.wait_fetch_categories();

            storedCategories = stateManeger.categories();
        }
        
        storedCategories.forEach(category => {

            categories.push(category.text);
        });


        addPostTemplate.categories = categories;
    }

    addPostButton.addEventListener('click', () => {

        addPostTemplate.open().then( (result) => {

            addPostPlaceHolder();

            const data = new FormData();

            if(result.hasOwnProperty('images')) if(Array.isArray(result.images)) {

                result.images.forEach(image => {

                    let ImageURL = image;

                    let block = ImageURL.split(";");
    
                    let contentType = block[0].split(":")[1];
    
                    let realData = block[1].split(",")[1];
    
                    let blob = convertB64toBlob(realData, contentType);

                    data.append('images[]', blob);

                });

            }

            if(result.hasOwnProperty('videos')) if(Array.isArray(result.videos)) {

                result.videos.forEach(video => {

                    let VideoURL = video;

                    let block = VideoURL.split(";");
    
                    let contentType = block[0].split(":")[1];
    
                    let realData = block[1].split(",")[1];
    
                    let blob = convertB64toBlob(realData, contentType);

                    data.append('videos[]', blob);

                });

            }

            if(result.hasOwnProperty('content')) if(typeof result.content == "string") {

                data.append('content', result.content);
            }

            if(! withCategories) {
                
                data.append('category_name', selectedCategory);
            }
            else if(result.hasOwnProperty('category')) if(typeof result.category == "string") {

                data.append('category_name', result.category);
            } else {

                vanillaPopUp.alert('add post failed', 'no category selected', 'ok');
                
                return;
            }
            

            fetch(addPostUrl, {
                method: 'POST',
                body: data,
                headers,
        
            }).then(response => response.json()).then((result) => {
        
                if(! result.hasOwnProperty('status')  || ! result.status) {
                    
        
                    if(result.hasOwnProperty('msg')) {
        
                        vanillaPopUp.alert('add post failed', result.msg, 'ok');

                        return null;
                    }
        
                    vanillaPopUp.alert('add post failed', generalErrorMessage, 'ok');
        
                    return null;
                }
        
                return result;
        
            }).then((result) => {
        
                if(result == null) {

                    removePlaceHolder();

                    return;
                }
        
                if(postsInnerTemplate != null && result.hasOwnProperty('data')) {

                    
                    let post = createPost (

                        result.data.id, result.data.images, result.data.videos,
                        result.data.content, result.data.time, 0, false,
                        0, result.data.commentsUrl

                    );

                    removePlaceHolder();

                    if(postsInnerTemplate.children < 2) {

                        postsInnerTemplate.appendChild(post);
                    }

                    postsInnerTemplate.insertBefore(post, postsInnerTemplate.children[1]);

                    return;
                }

                removePlaceHolder();
        
            }).catch((error) => {

                vanillaPopUp.alert('add post failed', error, 'ok');

                removePlaceHolder();
            });

        }).catch(() => { });
    });
};