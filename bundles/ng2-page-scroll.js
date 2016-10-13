System.registerDynamic("src/ng2-page-scroll.directive", ["angular2/core", "angular2/router", "./ng2-page-scroll-config"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("angular2/core");
    var router_1 = $__require("angular2/router");
    var ng2_page_scroll_config_1 = $__require("./ng2-page-scroll-config");
    var PageScroll = function () {
        function PageScroll(el, router) {
            var _this = this;
            this.el = el;
            this.router = router;
            this.pageScrollOffset = null;
            this.pageScrollDuration = null;
            this.pageScrollEasing = null;
            this.pageScrollFinish = new core_1.EventEmitter();
            this.listener = function (event) {
                // Stop the scroll animation if the user interferes with it
                if (event.type !== 'keyup' || PageScroll.interfereKeys.indexOf(event.keyCode) >= 0) {
                    PageScroll.stopTimers();
                }
            };
            this.document = el.nativeElement.ownerDocument;
            this.body = el.nativeElement.ownerDocument.body;
            PageScroll.interfereEvents.forEach(function (event) {
                return _this.body.addEventListener(event, _this.listener);
            });
        }
        PageScroll.prototype.ngOnDestroy = function () {
            var _this = this;
            PageScroll.interfereEvents.forEach(function (event) {
                return _this.body.removeEventListener(event, _this.listener);
            });
            return undefined;
        };
        PageScroll.prototype.handleClick = function (event) {
            var _this = this;
            event.preventDefault();
            if (this.routerLink) {
                // Check whether we are at the target page already
                if (this.router.isRouteActive(this.router.generate(this.routerLink))) {
                    // We're already at the correct screen
                    this.scrollView(this.href);
                } else {
                    // We need to navigate their first.
                    // Navigation is handled by the routerLink directive
                    // so we only need to listen for route change
                    this.body.scrollTop = 0;
                    var subscription_1 = this.router.subscribe(function () {
                        subscription_1.unsubscribe();
                        _this.scrollView(_this.href);
                    });
                }
            } else {
                this.scrollView(this.href);
            }
            return false; // to preventDefault()
        };
        PageScroll.prototype.scrollView = function (anchor) {
            var _this = this;
            var anchorTarget = this.document.getElementById(anchor.substr(1));
            if (anchorTarget !== null) {
                var targetScrollTop = anchorTarget.offsetTop;
                var startScrollTop = this.document.documentElement.scrollTop || this.body.scrollTop;
                var distanceToScroll = targetScrollTop - startScrollTop;
                if (distanceToScroll !== 0) {
                    PageScroll.stopTimers();
                    var startTime = new Date().getTime();
                    var intervalConf = {
                        startScrollTop: startScrollTop,
                        targetScrollTop: distanceToScroll - (this.pageScrollOffset === null ? ng2_page_scroll_config_1.PageScrollConfig.defaultScrollOffset : this.pageScrollOffset),
                        startTime: startTime,
                        easing: this.pageScrollEasing === null ? ng2_page_scroll_config_1.PageScrollConfig.defaultEasingFunction : this.pageScrollEasing
                    };
                    intervalConf.duration = this.pageScrollDuration === null ? ng2_page_scroll_config_1.PageScrollConfig.defaultDuration : this.pageScrollDuration;
                    intervalConf.endTime = intervalConf.startTime + intervalConf.duration;
                    var timer_1 = setInterval(function (intervalConf) {
                        var currentTime = new Date().getTime();
                        var newScrollTop = intervalConf.easing(currentTime - intervalConf.startTime, intervalConf.startScrollTop, intervalConf.targetScrollTop, intervalConf.duration);
                        _this.body.scrollTop = newScrollTop;
                        _this.document.documentElement.scrollTop = newScrollTop;
                        if (intervalConf.endTime <= currentTime) {
                            PageScroll.stopTimer(timer_1);
                            _this.pageScrollFinish.emit(null);
                        }
                    }, ng2_page_scroll_config_1.PageScrollConfig._interval, intervalConf);
                    PageScroll.timers.push(timer_1);
                }
            }
        };
        PageScroll.stopTimers = function () {
            if (PageScroll.timers.length > 0) {
                PageScroll.timers.forEach(function (timer, index) {
                    clearInterval(timer);
                    PageScroll.timers.splice(index, 1);
                });
                return true;
            }
            return false;
        };
        PageScroll.stopTimer = function (timer) {
            clearInterval(timer);
            var index = PageScroll.timers.indexOf(timer);
            if (index >= 0) {
                PageScroll.timers.splice(index, 1);
                return true;
            }
            return false;
        };
        PageScroll.timers = [];
        PageScroll.interfereEvents = ['mousedown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'keyup', 'touchmove'];
        PageScroll.interfereKeys = [33, 34, 35, 36, 38, 40];
        __decorate([core_1.Input(), __metadata('design:type', Object)], PageScroll.prototype, "routerLink", void 0);
        __decorate([core_1.Input(), __metadata('design:type', String)], PageScroll.prototype, "href", void 0);
        __decorate([core_1.Input(), __metadata('design:type', Number)], PageScroll.prototype, "pageScrollOffset", void 0);
        __decorate([core_1.Input(), __metadata('design:type', Number)], PageScroll.prototype, "pageScrollDuration", void 0);
        __decorate([core_1.Input(), __metadata('design:type', Function)], PageScroll.prototype, "pageScrollEasing", void 0);
        __decorate([core_1.Output(), __metadata('design:type', core_1.EventEmitter)], PageScroll.prototype, "pageScrollFinish", void 0);
        __decorate([core_1.HostListener('click', ['$event']), __metadata('design:type', Function), __metadata('design:paramtypes', [Event]), __metadata('design:returntype', Boolean)], PageScroll.prototype, "handleClick", null);
        PageScroll = __decorate([core_1.Directive({
            selector: '[pageScroll]'
        }), __metadata('design:paramtypes', [core_1.ElementRef, router_1.Router])], PageScroll);
        return PageScroll;
    }();
    exports.PageScroll = PageScroll;
    

    return module.exports;
});
System.registerDynamic("src/ng2-page-scroll-config", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var PageScrollConfig = function () {
        function PageScrollConfig() {}
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
    }();
    exports.PageScrollConfig = PageScrollConfig;
    

    return module.exports;
});
System.registerDynamic('ng2-page-scroll', ['./src/ng2-page-scroll.directive', './src/ng2-page-scroll-config'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export($__require('./src/ng2-page-scroll.directive'));
    __export($__require('./src/ng2-page-scroll-config'));
    

    return module.exports;
});