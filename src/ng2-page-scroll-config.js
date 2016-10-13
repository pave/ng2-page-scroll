"use strict";
var PageScrollConfig = (function () {
    function PageScrollConfig() {
    }
    Object.defineProperty(PageScrollConfig, "defaultEasingFunction", {
        // Getter and setter to avoid auto completion to suggest calling the method
        get: function () {
            return PageScrollConfig._easingFunction;
        },
        set: function (easingFunction) {
            PageScrollConfig._easingFunction = easingFunction;
        },
        enumerable: true,
        configurable: true
    });
    PageScrollConfig._easingFunction = function (t, b, c, d) {
        // Linear easing
        return c * t / d + b;
    };
    PageScrollConfig._interval = 10;
    PageScrollConfig.defaultDuration = 1250;
    PageScrollConfig.defaultScrollOffset = 0;
    return PageScrollConfig;
}());
exports.PageScrollConfig = PageScrollConfig;
//# sourceMappingURL=ng2-page-scroll-config.js.map