// inView allows you to trigger classes when certain
// elements are within the viewport.


(function (root, plugin) {
// ================= Plugin Name ================= //
//                                                 //
    var name = 'inView';
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
            e = d.documentElement,

            top = (w.pageYOffset != null) ? w.pageYOffset : (e.clientHeight && e || b).scrollTop,
            width = w.innerWidth || b.clientWidth,
            height = Math.max(e.clientHeight, w.innerHeight || 0);

        // the location of the element could change if the
        // page width changes, so watch that too and include
        // it in the current value so it can be checked 
        // for changes
        return top + '_' + width + '_' + height;
    },

    getAllClasses: function (className, props) {
        return [
            className,
            className + '-above',
            className + '-below'
        ];
    },
    
    getActiveClasses: function (topWidthHeight, className, cfg) {
        var d = document,
            vals = topWidthHeight.split('_').map(function (v) {return parseInt(v, 10);}),
            h = vals[2],
            top = vals[0],
            bottom = top + h,
            obj = cfg.element = (typeof cfg.element === 'string') ? d.getElementById(cfg.element) : cfg.element,
            elTop = 0,
            elBottom = 0,
            classes = [];

        if (obj && obj.offsetParent) {
            do {
                elTop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }

        elBottom = cfg.element.offsetHeight + elTop;

        if (elTop > bottom) { classes.push(className + '-below'); }
        if (elBottom < top) { classes.push(className + '-above'); }
        if (elTop < bottom && elBottom > top) { classes.push(className); }

        return classes;
    },
    watchEvent: ['scroll', 'resize']
}
//                                                 //
// =============================================== //
);