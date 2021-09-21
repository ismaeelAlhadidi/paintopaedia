
import VanillaSmallGallery from 'vanilla/src/VanillaSmallGallery/main';

import OpenPostTemplate from './OpenPostTemplate';

import { generatorTemplateId } from './../utils/generator';

import { vanillaPopUp } from './../utils/helpers';

import stateManeger from '../config/stateManeger';

import { getPostsUrl, generalErrorMessage, headers } from './../config/api';

const PostsCountInScroll = 15;

let posts = new Map();

export let setCommmentsCountOfPost = (postId) => {

    if(! posts.has(postId)) return;

    let post = posts.get(postId);

    post.commentsCount = post.commentsTemplate.comments.size + 1;

};

export let createPost = ( postId, images, videos, content, time, likesCount, isLiked, commentsCount, commentsUrl ) => {

    let post = document.createElement('section');

    let gallery = new VanillaSmallGallery('', '',  images, videos, false, generatorTemplateId.next().value);

    post.appendChild(gallery);

    if(! Array.isArray(images) && ! Array.isArray(videos)) return post;
    if( images.length == 0 && videos.length == 0 ) return post;

    if(posts.has(postId)) posts.delete(postId);

    posts.set(postId, new OpenPostTemplate (
        generatorTemplateId.next().value,
        postId,
        post.children[0].images,
        post.children[0].videos,
        content,
        time,
        likesCount,
        isLiked,
        commentsCount,
        stateManeger.user().profile_picture,
        commentsUrl
    ));

    post.addEventListener('dblclick', (e) => {

        posts.get(postId).open();
    });

    return post;
};

export let getOpenPostTemplateOfThisPost = (post_id = null) => {

    return new Promise( ( resolve, reject ) => {

        if(post_id == null) reject();

        if(posts.has(post_id)) resolve( posts.get(post_id) );
        
        fetch (
            getPostsUrl + '&post_id=' + post_id, {
                headers
            }
        ).then(response => response.json()).then((result) => {
            
            if(! result.hasOwnProperty('status')  || ! result.status) {
                    
        
                if(result.hasOwnProperty('msg')) {
    
                    reject(result.msg);

                    return null;
                }
    
                reject(generalErrorMessage);
    
                return null;
            }
    
            return result;
        }).then((result) => {

            if(result == null) return;

            if(! result.hasOwnProperty('data') || ! Array.isArray(result.data)) {

                reject(generalErrorMessage);
                return;
            }

            if(result.data.length != 1) {

                reject(generalErrorMessage);
                return;
            }

            let post = result.data[0];

            resolve( new OpenPostTemplate (
                generatorTemplateId.next().value,
                post.postId,
                post.images,
                post.videos,
                post.content,
                post.time,
                post.likesCount,
                post.isLiked,
                post.commentsCount,
                stateManeger.user().profile_picture,
                post.commentsUrl
            ));

        }).catch((error) => {
    
            reject(error);
    
        });

    });
};

export let fetchPosts = (page = 1, category = null, userId = null) => {

    return new Promise( ( resolve, reject ) => {

        fetch ( 
                getPostsUrl + '&page=' + page + 
                ( category != null ? '&category=' + category : '' ) + 
                ( userId != null ? '&user_id=' + userId: '' ), {

            headers

        }).then(response => response.json()).then((result) => {

            if(! result.hasOwnProperty('status')  || ! result.status) {
                    
        
                if(result.hasOwnProperty('msg')) {
    
                    reject(result.msg);

                    return null;
                }
    
                reject(generalErrorMessage);
    
                return null;
            }
    
            return result;
        }).then((result) => {

            if(result == null) return;

            if(! result.hasOwnProperty('data') || ! Array.isArray(result.data)) {

                reject(generalErrorMessage);
                return;
            }

            let posts_data = result.data;

            let posts = [];

            posts_data.forEach((post_data) => {

                let post = createPost ( 
                    post_data.postId,
                    post_data.images,
                    post_data.videos,
                    post_data.content,
                    post_data.time,
                    post_data.likesCount,
                    post_data.isLiked,
                    post_data.commentsCount,
                    post_data.commentsUrl 
                );

                posts.push(post);
            });

            resolve(posts);

        }).catch((error) => {
    
            reject(error);
    
        });
    });
    
};

let createPlaceHolder = () => {

    let placeHolder = document.createElement('section');

    placeHolder.setAttribute('class', 'post-fetching-place-holder');

    return placeHolder;
};

let addPlaceHolders = (postsTemplate) => {

    for(let i = 0; i < PostsCountInScroll; i++) {

        postsTemplate.appendChild(createPlaceHolder());
    }
};

let removeAllPlaceHolders = (postsTemplate) => {

    let placeHolders = document.querySelectorAll('.post-fetching-place-holder');

    placeHolders.forEach((placeHolder) => {

        if(placeHolder == null) return;

        if(placeHolder.parentElement != postsTemplate) return;

        postsTemplate.removeChild(placeHolder);

    });

};

let removeFirstPlaceHolder = (postsTemplate) => {

    let placeHolder = document.querySelector('.post-fetching-place-holder:first-of-type');

    if(placeHolder == null) return;

    if(placeHolder.parentElement != postsTemplate) return;

    postsTemplate.removeChild(placeHolder);
};

export let addPostsIn = ( postsTemplate = null, page = 1, category = null, userId = null) => {

    return new Promise( ( resolve, reject ) => {

        if(postsTemplate == null) return;

        if(page != 1) addPlaceHolders(postsTemplate);

        fetchPosts(page, category, userId).then((posts) => {

            if(! Array.isArray(posts)) {

                if(page == 1) vanillaPopUp.alert('fetch posts error', generalErrorMessage, 'ok');

                removeAllPlaceHolders(postsTemplate);
                resolve();
                return;
            }

            posts.forEach( post => {

                if(postsTemplate.children.length < 2) {

                    postsTemplate.appendChild(post);

                    removeFirstPlaceHolder(postsTemplate);

                    return;
                }

                postsTemplate.insertBefore(post, postsTemplate.children[1]);

                removeFirstPlaceHolder(postsTemplate);
            } );


            removeAllPlaceHolders(postsTemplate);

            if(posts.length == 0) {

                reject();
                return;
            }

            resolve();

        }).catch((error) => {

            if(page == 1) {

                vanillaPopUp.alert('fetch posts error', error, 'ok');
            }

            removeAllPlaceHolders(postsTemplate);

            resolve();
        });
    });

};