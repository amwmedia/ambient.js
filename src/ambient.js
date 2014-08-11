(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {
            return (root.ambient = factory());
        });
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = root.ambient = factory();
    } else {
        // Browser globals
        root.ambient = factory();
    }
}(this, function () {
    var timeout, config,
        toDelay = 0,
        initialized = false,
        props = {},
        allClasses = [],
        activeClasses = [],
        currentClasses = [],
        handlers = {},
        w = window,
        d = document,
        b = d.body,
        rAF = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };

    function rafDoUpdate() { rAF(doUpdate); }
    // executed on every resize event (debounced to 100ms)
    function doUpdate () {
        var cls, propName, prop,
            propVals = {},
            classes, propClasses;

        activeClasses = [];

        for (cls in config) {
            // skip if in prototype
            if (!config.hasOwnProperty(cls)) { continue; }

            classes = [];
            config[cls].updated = false;

            for (propName in config[cls]) {
                // skip if in prototype
                if (!config[cls].hasOwnProperty(propName)) { continue; }

                // skip if we don't have a prop to handle this property
                if (!props[propName]) { continue; }

                prop = props[propName];

                // have we not seen this prop yet?
                if (propVals[propName] == null) {
                    // better go get its current value
                    propVals[propName] = prop.getCurrentValue();

                    // has it changed since last time?
                    if (propVals[propName] !== prop.currentValue) {
                        // update the cache
                        prop.currentValue = propVals[propName];

                        // this prop has changed, we'll need to go get
                        // updated active classes for anything that uses it
                        prop.updated = true;
                    } else {
                        // no change, we can pull values from cache
                        prop.updated = false;
                    }
                }

                // if this prop has updated, then so will the classes
                config[cls].updated = config[cls].updated || prop.updated;

                // has this value changed?
                if (prop.updated) {
                    // calculate active classes
                    propClasses = prop.getActiveClasses(prop.currentValue, cls, config[cls][propName]);

                    // update cached classes value
                    prop.cache[cls].activeClasses = propClasses;
                } else {
                    // cached value is the same as new
                    // use the cached values
                    propClasses = prop.cache[cls].activeClasses;
                }

                // if this property is invalid, the whole class is
                // not active, kill classes and go to the next class
                if (!propClasses.length) {
                    classes = [];
                    break;
                } else {
                    // add the active classes to the list
                    classes = classes.concat(propClasses);
                }
            }

            activeClasses = activeClasses.concat(classes);
        }

        // de-duplicate classes
        activeClasses = activeClasses.filter(function (val, idx, arr) {
            return arr.indexOf(val) === idx;
        });

        // push the changes to the page
        updateBodyClasses();

        // clear the timeout value so it can be set again
        timeout = null;
    }

    function updateBodyClasses() {
        var i, cls,
        bodyClasses = b.className;

        // update currentClasses with active body classes
        currentClasses = bodyClasses.split(' ').filter(function (val, idx) {
            // filter out anything we're not in charge of
            return allClasses.indexOf(val) !== -1;
        });

        // search for classes that are not currently active,
        // but should be, and add them
        i = activeClasses.length;
        for (; i-- ;) {
            cls = activeClasses[i];
            // check if the point is not longer active and the class is on body
            if (currentClasses.indexOf(cls) === -1) {
                // add the class to body
                bodyClasses += ' ' + cls;
                // fire any handlers attached to this event
                if (config[cls]) {
                    fire('enter', cls);
                }
            }

            if (config[cls]) {
                fire('update', cls);
            }
        }

        // search for classes that are active,
        // but shouldn't be, and remove them
        i = currentClasses.length;
        for (; i-- ;) {
            cls = currentClasses[i];
            // check if the point is not longer active and the class is on body
            if (activeClasses.indexOf(cls) === -1) {
                // remove the class from body
                bodyClasses = bodyClasses.replace(new RegExp('(^|\\s)' + cls + '($|\\s)', 'g'), ' ');
                // fire any handlers attached to this event
                if (config[cls]) {
                    fire('leave', cls);
                }
            }
        }

        // push the new classes to body... and filter out extra spaces
        b.className = bodyClasses.split(' ').filter(function(e){return e;}).join(' ');
    }

    // resize debouncing, will execute resize code no more
    // than once every 100ms
    function debounceUpdate() {
        if (!timeout) {

            if (!toDelay) {
                // no delay, schdedule a rAF for updating
                rafDoUpdate();
            } else {
                // delay execution and then schedule an
                // update during an animationFrame
                timeout = setTimeout(rafDoUpdate, toDelay);
            }
        }
    }
    
    // initializes confg and attaches to events
    // ---------------------------------- //
    function init(configure, delay) {
        var cls, prop, propName, classes, wE, watchEvent,
            events = {};

        // only init once
        if (initialized) { return; }

        config = configure || {};
        allClasses = [];

        // spin over each class (cls) and check out the
        // condition properties for each
        for (cls in config) {
            // skip if in prototype
            if (!config.hasOwnProperty(cls)) { continue; }

            for (propName in config[cls]) {
                // skip if in prototype
                if (!config[cls].hasOwnProperty(propName)) { continue; }
                
                // skip if we don't have a prop to handle this property
                if (!props[propName]) { continue; }

                prop = props[propName];

                // setup the object for storing cached values
                prop.cache = prop.cache || {};
                prop.cache[cls] = prop.cache[cls] || {};

                // default to window
                prop.watchElement = prop.watchElement || w;

                classes = prop.getAllClasses ? prop.getAllClasses(cls, config[cls][propName]) : [cls];
                allClasses = allClasses.concat(classes);

                if (typeof prop.watchEvent === 'string') { prop.watchEvent = [prop.watchEvent]; }

                wE = prop.watchEvent.length;
                for (; wE-- ;) {
                    watchEvent = prop.watchEvent[wE];
                    // initialize the watchEvent once only
                    if (!events[watchEvent] || events[watchEvent].indexOf(prop.watchElement) === -1) {

                        // setup the resize handlers
                        if (prop.watchElement.addEventListener) {
                            prop.watchElement.addEventListener(watchEvent, debounceUpdate, false);
                        } else {
                            prop.watchElement.attachEvent('on' + watchEvent, debounceUpdate);
                        }

                        // Add this event to the list of hooks so it doesn't 
                        // get added again by another property
                        events[watchEvent] = events[watchEvent] || [];
                        events[watchEvent].push(prop.watchElement);
                    }
                }
                
            }
        }

        if (typeof delay === 'number') { toDelay = delay; }

        initialized = true;
        
        // do the initial resize logic to kick things off
        doUpdate();
    }

    // ================================== //
    // Event Bus API methods
    // ================================== //

    function on(action, cls, handler) {
        var actionArr = action.split(' '),
            i, a;
        handlers[cls] = handlers[cls] || {};

        i = actionArr.length;
        for (; i-- ;) {
            a = actionArr[i];
            handlers[cls][a] = handlers[cls][a] || [];
            handlers[cls][a].push(handler);
        }
    }

    function off(action, cls, handler) {
        var actionArr = action.split(' '),
            i, j, a;

        j = actionArr.length;
        for (; j-- ;) {
            a = actionArr[j];
            if (handlers[cls] && handlers[cls][a] && handlers[cls][a].length) {
                i = handlers[cls][a].length;
                for (; i-- ;) {
                    if (handlers[cls][a][i] === handler) {
                        handlers[cls][a].splice(i, 1);
                    }
                }
            }
        }
    }

    function fire(action, cls) {
        var len, i = 0;

        if (!config[cls].updated) { return; }
        
        if (handlers[cls] && handlers[cls][action] && handlers[cls][action].length) {
            for (len = handlers[cls][action].length; i < len; i++) {
                handlers[cls][action][i](action, cls);
            }
        }
    }

    // ================================== //
    // Javascript API Helpers
    // ================================== //

    function getPropValue(propName) {
        // get the latest value from cache if available
        return props[propName].currentValue || props[propName].getCurrentValue();
    }

    function styleIsActive(cls) {
        return currentClasses.indexOf(cls) !== -1;
    }

    return {
        init: init,
        on: on,
        off: off,
        prop: props,
        getPluginValue: getPropValue,
        isActive: styleIsActive
    };
}));