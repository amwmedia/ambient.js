// inView allows you to trigger classes when certain
// elements are within the viewport.


(((root, plugin) => {
// ================= Plugin Name ================= //
//                                                 //
    var name = 'inView';
//                                                 //
// =============================================== //
    root.ambient.prop[name] = plugin;
}))(this,
// ================= Plugin Code ================= //
//                                                 //
{
    getCurrentValue() {
        var w = window;
        var d = document;
        var b = d.body;
        var e = d.documentElement;
        var top = (w.pageYOffset != null) ? w.pageYOffset : (e.clientHeight && e || b).scrollTop;
        var width = w.innerWidth || b.clientWidth;
        var height = Math.max(e.clientHeight, w.innerHeight || 0);

        // the location of the element could change if the
        // page width changes, so watch that too and include
        // it in the current value so it can be checked 
        // for changes
        return top + '_' + width + '_' + height;
    },

    getAllClasses(className, props) {
        return [
            className,
            className + '-above',
            className + '-below'
        ];
    },
    
    getActiveClasses(topWidthHeight, className, cfg) {
        var d = document;
        var vals = topWidthHeight.split('_').map(v => parseInt(v, 10));
        var h = vals[2];
        var top = vals[0];
        var bottom = top + h;
        var obj = cfg.element = (typeof cfg.element === 'string') ? d.getElementById(cfg.element) : cfg.element;
        var elTop = 0;
        var elBottom = 0;
        var classes = [];

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