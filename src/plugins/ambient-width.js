(((root, plugin) => {
// ================= Plugin Name ================= //
//                                                 //
    name = 'width';
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

        return w.innerWidth || b.clientWidth;
    },

    getAllClasses(className, props) {
        var i;
        var classes = [];
        var max;

        props.min = props.min || 0;
        props.max = props.max || Infinity;
        props.bend = props.bend || 0;

        classes = classes.concat([
            className,
            className + '-gte',
            className + '-lte'
        ]);

        if (props.bend) {
            max = (props.max === Infinity) ? 8192 : props.max;
            i = ~~((max-props.min) / props.bend);

            for (; i-- ;) {
                classes.push(className + '-' + (i+1));
            }
        }
        return classes;
    },
    getActiveClasses(winSize, className, props) {
        var shiftEvery;
        var i;
        var aboveMin;
        var belowMax;
        var classes = [];

        aboveMin = winSize >= props.min;
        belowMax = winSize < props.max;

        if (aboveMin && belowMax) {
            classes.push(className);

            if (props.bend) {
                i = ~~((winSize-props.min) / props.bend);

                for (; i-- ;) {
                    classes.push(className + '-' + (i+1));
                }
            }
        }

        if (aboveMin) { classes.push(className + '-gte'); }
        if (belowMax) { classes.push(className + '-lte'); }

        return classes;
    },
    watchEvent: 'resize'
}
//                                                 //
// =============================================== //
);