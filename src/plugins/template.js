// The following is a template plugin. For more information
// about building your own plugins, take a look at the
// plugin tutorial and jsFiddle example code on GitHub


(function (root, plugin) {
// =================== Plugin Name =================== \\
//                                                     \\
    var name = 'myAwsomePlugin';
//                                                     \\
// =================================================== \\
    root.flexpoint.prop[name] = plugin;
})(this,
// =================== Plugin Code =================== \\
//                                                     \\
{
    // ------------ getCurrentValue ------------- \\
    // getCurrentValue pulls the current value
    // we are watching for changes. When the
    // watchEvent fires, it should mean that this
    // value has changed.
    // 
    // RETURNS: any value
    // 
    // -- REQUIRED
    getCurrentValue: function () {
        
    },


    // ------------- getAllClasses -------------- \\
    // getAllClasses gets all possible classes
    // that this config could return. This lets
    // flexpoint know if there are additional 
    // classes we are in charge of.
    // 
    // PARAMETERS:
    // className: class that was setup in config
    // configObject: config options in init
    // 
    // RETURNS: Array of class names
    // 
    // -- OPTIONAL
    // getAllClasses: function (className, configObject) {},


    // ------------ getActiveClasses ------------ \\
    // getActiveClasses returns the classes
    // that are currently active based on the
    // properties passed in
    // 
    // PARAMETERS:
    // currentValue: returned by getCurrentValue
    // className: class that was setup in config
    // configObject: config options in init
    // 
    // RETURNS: Array of class names that should
    //      be on the body tag currently
    // 
    // -- REQUIRED
    getActiveClasses: function (currentValue, className, configObject) {

    },


    // -------------- watchElement -------------- \\
    // watchElement is the element that we will
    // attach an eventListener to
    // 
    // DEFAULT: window
    // 
    // -- OPTIONAL
    // watchElement: window,


    // --------------- watchEvent --------------- \\
    // watchEvent is the event we will listen to
    // example: 'scroll', 'resize', 'hover', etc
    // 
    // -- REQUIRED
    watchEvent: ''
}
//                                                     \\
// =================================================== \\
);