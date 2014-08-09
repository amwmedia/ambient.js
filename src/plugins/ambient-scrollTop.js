// scrollTop is an example of a basic plugin for ambient
// it's designed to show off how with just a little bit of code
// you can do pretty amazing things.
// 
// For a blank template that you can use as a staring
// point for building your own plugins, please see
// the template.js plugin.


(function (root, plugin) {
// ================= Plugin Name ================= //
//                                                 //
    var name = 'scrollTop';
//                                                 //
// =============================================== //
    root.ambient.prop[name] = plugin;
})(this,
// ================= Plugin Code ================= //
//                                                 //
{
    getCurrentValue: function () {
        var w = window,
            d = document,
            b = d.body,
            e = d.documentElement;

        return (w.pageYOffset != null) ? w.pageYOffset : (e.clientHeight && e || b).scrollTop;
    },
    getActiveClasses: function (top, className, cfg) {
        cfg.min = cfg.min || 0;
        cfg.max = cfg.max || Infinity;
        return (top >= cfg.min && top < cfg.max) ? [className] : [];
    },
    watchEvent: 'scroll'
}
//                                                 //
// =============================================== //
);