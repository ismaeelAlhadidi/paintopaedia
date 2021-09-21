
import OpenPostTemplate from "vanilla/src/VanillaOpenPostTemplate/main";

import VanillaComments from "vanilla/src/VanillaComments/main";
import VanillaComment from "vanilla/src/VanillaComments/child/VanillaComment";
import VanillaReplay from "vanilla/src/VanillaComments/child/VanillaReplay";

import { toggleLikeUrl, addCommentUrl, addReplyUrl, headers, generalErrorMessage, api_secret, host } from "./../config/api";

import { setCommmentsCountOfPost } from './Post';

VanillaComments.fetchCommentsCallBack = (commentsUrl) => {

    return new Promise((resolve, reject) => {
        
        fetch(commentsUrl + '&api_key=' + api_secret, {

            headers,
    
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
    
            if(result.hasOwnProperty('data')) {

                resolve(result.data);

                return;
            }

            reject(generalErrorMessage);

        }).catch((error) => {

            reject(error);
        });
    });
};

VanillaComments.postCommentCallBack = (postId, content) => {

    return new Promise((resolve, reject) => {

        const data = new FormData();

        data.append('post_id', postId);
        data.append('content', content);

        fetch(addCommentUrl, {
            method: 'POST',
            body: data,
            headers,
    
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
    
            if(result.hasOwnProperty('data')) {

                setCommmentsCountOfPost(postId);

                resolve(result.data);

                return;
            }
                
            reject(generalErrorMessage);

        }).catch((error) => {

            reject(error);
        });
    });
};

VanillaComment.postReplayCallBack = (commentId, content) => {

    return new Promise((resolve, reject) => {

        const data = new FormData();

        data.append('comment_id', commentId);
        data.append('content', content);

        fetch(addReplyUrl, {
            method: 'POST',
            body: data,
            headers,
    
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
    
            if(result.hasOwnProperty('data')) {

                resolve(result.data);
                return;
            }
            
            reject(generalErrorMessage);
    
        }).catch((error) => {

            reject(error);
        });
    });
};

let toggleLike = (component_id, component_type) => {

    return new Promise((resolve, reject) => {

        const data = new FormData();

        data.append('component_id', component_id);
        data.append('component_type', component_type);

        fetch(toggleLikeUrl, {
            method: 'POST',
            body: data,
            headers,
    
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
    
            if(result.hasOwnProperty('status')) {

                resolve(result.status);
                return;
            }
            
            reject(generalErrorMessage);
    
        }).catch((error) => {

            reject(error);
        });
    });
    
};

VanillaComment.toggleLike = (commentId) => {

    return toggleLike(commentId, 'Comment');
};

VanillaReplay.toggleLike = (replyId) => {

    return toggleLike(replyId, 'Reply');
};

OpenPostTemplate.toggleLike = (postId) => {

    return toggleLike(postId, 'Post');
};

let goToProfileCallBack = (userId) => {

    document.location = host + 'paintopaedia/dist/profile/index.html#' + userId;
};

VanillaComment.goToProfileCallBack = (userId) => {

    goToProfileCallBack(userId);

};

VanillaReplay.goToProfileCallBack = (userId) => {

    goToProfileCallBack(userId);
};

OpenPostTemplate.withSocketIo = true;
OpenPostTemplate.socketIoUrl = 'http://localhost:3000';
OpenPostTemplate.socketIoNameSpace = 'posts';

export default OpenPostTemplate;