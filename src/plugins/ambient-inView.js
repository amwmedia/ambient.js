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
            e = d.documentElement;

        return (w.pageYOffset != null) ? w.pageYOffset : (e.clientHeight && e || b).scrollTop;
    },
    getActiveClasses: function (top, className, cfg) {
    	var w = window,
            d = document,
            e = d.documentElement
            h = Math.max(e.clientHeight, w.innerHeight || 0),
    		bottom = top + h,
			cfg.element = obj = (typeof cfg.element === 'string') ? d.getElementById(cfg.element) : cfg.element,
    		elTop = 0,
    		elBottom = 0;

		if (obj && obj.offsetParent) {
			do {
				elTop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}

		elBottom = cfg.element.offsetHeight + elTop;

        return (elTop < bottom && elBottom > top) ? [className] : [];
    },
    watchEvent: 'scroll'
}
//                                                 //
// =============================================== //
);