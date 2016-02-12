/*!
 * ImageLoader v1.1
 * by William Tumeo - https://github.com/williamd1k0/
 *
 * License
 * -------
 * Copyright 2015 William Tumeo
 * Released under the MIT license
 * https://raw.githubusercontent.com/williamd1k0/img-loader/master/LICENSE
 *
 */

function ImageLoader(){
    var _count = 0;
    var _images = [];
    var _container = document.createElement('load');
    document.head.appendChild(_container);

    function isObject(variable){
        return variable instanceof Object && !(variable instanceof Array) && typeof variable !== 'function';
    }

    this.getCount = function(){
        return _count;
    }

    this.getContainer = function(){
        return _container;
    }

    this.getImages = function(){
        return _images;
    }

    this.clearImages = function(){
        _images = [];
    }

    this.isLoaded = function(){
        return _count === 0 ? true : false;
    }

    this.onload = function(callback, interval){
        if(typeof callback === 'undefined'){
            console.warn("The onload method requires a callback, use isLoaded instead of onload!");
            return this.isLoaded();
        }else if(typeof callback === 'function'){
            interval = typeof interval == 'number' ? interval : 100;
            var event_callback = function(){
                if(_count === 0){
                    callback();
                }else {
                    setTimeout(event_callback, interval);
                }
            }
            event_callback();
        }else{
            throw new Error("Invalid callback!");
        }
    }

    this.load = function(imageurl, attributes){
        attributes = attributes || {};
        _count++;
        var img = document.createElement('img');
        if(isObject(attributes)){
            var j = 0;
            var keys = Object.keys(attributes);
            for(i in attributes){
                img.setAttribute(keys[j], attributes[i]);
                j++;
            }
        }else{
            console.warn(
                '%s%c%s%c%s%s%s%c%s',
                'The attributes argument must be an ',
                'color:#159',
                'object',
                'color:none','!',
                '\nImage: ' + imageurl,
                '\nAttributes: ',
                'color:#f22', attributes
            );
        }
        img.src = imageurl;
        _container.appendChild(img);
        img.onload = function(){
            _container.removeChild(img);
            _count--;
            this.onload = undefined;
        }
        _images.push(img);
        return img;
    }
}
