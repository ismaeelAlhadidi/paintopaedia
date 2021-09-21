import VanillaPopup from "vanilla/src/VanillaPopup/main";
import VanillaCropper from "vanilla/src/VanillaCropper/main";
import VanillaLikesList from "vanilla/src/VanillaLikesList/main";

import { toggleFollowUrl, getLikesListUrl, getFollowingListUrl, getFollowersListUrl, headers } from './../config/api';

export let loadImage = (image, src) => {

    return new Promise((resolve) => {
        image.addEventListener('load', resolve);
        image.src = src;
    });
};

export let loadFileReader = (fileReader, file) => {

    return new Promise((resolve) => {
        fileReader.readAsDataURL(file);
        fileReader.addEventListener('load', resolve);
    });
};

VanillaLikesList.fetchLikesCallBack = (componentId, componentType) => {

    return new Promise((resolve, reject) => {

        fetch(getLikesListUrl + '&component_id=' + componentId + '&component_type=' + componentType, {

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

VanillaLikesList.fetchFollowerCallBack = (userId, temp) => {

    return new Promise((resolve, reject) => {

        fetch(getFollowersListUrl + '&user_id=' + userId, {

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

VanillaLikesList.fetchFollowingCallBack = (userId, temp) => {

    return new Promise((resolve, reject) => {

        fetch(getFollowingListUrl + '&user_id=' + userId, {

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
                console.log(result.data);
                resolve(result.data);

                return;
            }
            
            reject(generalErrorMessage);
    
        }).catch((error) => {

            reject(error);
        });
    });
};

VanillaLikesList.toggleFollowCallBack = (userId) => {

    return new Promise((resolve, reject) => {

        let data = new FormData();

        data.append('user_id', userId);

        fetch(toggleFollowUrl, {
            
            method: 'POST',
            headers,
            body: data,

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
    
            resolve(result);
    
        }).catch((error) => {

            reject(error);
        });
    });
};

export let vanillaPopUp = new VanillaPopup();

export let vanillaCropper = new VanillaCropper();

export let setChangeImageEvents = (changeButton = null, imageView = null, inputFile = null, cropp = false, width = 200, height = 200) => {
    if(inputFile == null) {
        inputFile = document.createElement('file');
        inputFile.setAttribute('accept', 'images/*');
    }

    if(changeButton != null) {
        changeButton.addEventListener('click', () => {
            inputFile.click();
        });
    }

    if(inputFile != null && imageView != null) {

        inputFile.addEventListener('change', (event) => {
    
            if(! event.target.files[0]) return;
    
            let fileReader = new FileReader();
            
            loadFileReader(fileReader, event.target.files[0]).then((event) => {
                if(! cropp) {
                 imageView.src = event.target.result;
                 return null;   
                }
                let image = new Image();
                return loadImage(image, event.target.result);
            }).then((event) => {
                if(event == null) return;
                vanillaCropper.start(event.target, width, height, 
                    ( cropedImage ) => {
                        imageView.src = cropedImage.src;
                    },
                    null,
                    () => {
                        vanillaPopup.alert("error in crop image", "crop failed please try agin !", "ok");
                    }
                );
            }).catch( () => {
                vanillaPopup.alert("error in select image", "select image failed please try agin !", "ok");
            });
    
        });
    }
};

export let convertB64toBlob = (b64Data, contentType, sliceSize) => {

    contentType = contentType || '';

    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
};

export let removePlaceHolders = () => {

    let headerPlaceHolder = document.querySelector('.header-place-holder');

    if ( headerPlaceHolder ) {

        let headerParent = headerPlaceHolder.parentElement;

        if ( headerParent ) {

            headerParent.removeChild(headerPlaceHolder);

        }

    }

};