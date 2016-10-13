import {Directive, ElementRef, Input, Output, EventEmitter, HostListener, OnDestroy} from 'angular2/core';
import {Router} from 'angular2/router';
import {Subscription} from 'rxjs/Subscription';
import {PageScrollConfig, IEasingFunction} from './ng2-page-scroll-config';

@Directive({
    selector: '[pageScroll]'
})
export class PageScroll implements OnDestroy {

    @Input()
    public routerLink:any;

    @Input()
    public href:string;

    @Input()
    public pageScrollOffset:number = null;

    @Input()
    public pageScrollDuration:number = null;

    @Input()
    public pageScrollEasing:IEasingFunction = null;

    @Output()
    pageScrollFinish:EventEmitter<any> = new EventEmitter();

    private document:Document;
    private body:HTMLBodyElement;
    private listener:EventListenerOrEventListenerObject = (event:Event):void => {
        // Stop the scroll animation if the user interferes with it
        if (event.type !== 'keyup' || PageScroll.interfereKeys.indexOf((<KeyboardEvent>event).keyCode) >= 0) {
            PageScroll.stopTimers();
        }
    };

    private static timers:any[] = [];
    private static interfereEvents:string[] = ['mousedown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'keyup', 'touchmove'];
    private static interfereKeys:number[] = [33, 34, 35, 36, 38, 40];

    constructor(private el:ElementRef, private router:Router) {
        this.document = el.nativeElement.ownerDocument;
        this.body = el.nativeElement.ownerDocument.body;
        PageScroll.interfereEvents.forEach((event:string) => this.body.addEventListener(event, this.listener));
    }

    ngOnDestroy():any {
        PageScroll.interfereEvents.forEach((event:string) => this.body.removeEventListener(event, this.listener));
        return undefined;
    }

    @HostListener('click', ['$event'])
    private handleClick(event:Event):boolean {
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
                let subscription:Subscription = <Subscription>this.router.subscribe(() => {
                    subscription.unsubscribe();
                    this.scrollView(this.href);
                });
            }
        } else {
            this.scrollView(this.href);
        }
        return false; // to preventDefault()
    }

    private scrollView(anchor:string):void {
        let anchorTarget:HTMLElement = this.document.getElementById(anchor.substr(1));

        if (anchorTarget !== null) {
            let targetScrollTop:number = anchorTarget.offsetTop;
            let startScrollTop:number = (this.document.documentElement.scrollTop || this.body.scrollTop);
            let distanceToScroll:number = targetScrollTop - startScrollTop;

            if (distanceToScroll !== 0) {
                PageScroll.stopTimers();

                let startTime:number = new Date().getTime();

                let intervalConf:any = {
                    startScrollTop: startScrollTop,
                    targetScrollTop: distanceToScroll -
                    (this.pageScrollOffset === null ? PageScrollConfig.defaultScrollOffset : this.pageScrollOffset),
                    startTime: startTime,
                    easing: this.pageScrollEasing === null ? PageScrollConfig.defaultEasingFunction : this.pageScrollEasing
                };
                intervalConf.duration = this.pageScrollDuration === null ? PageScrollConfig.defaultDuration : this.pageScrollDuration;
                intervalConf.endTime = intervalConf.startTime + intervalConf.duration;

                let timer:any = setInterval((intervalConf:any) => {
                    let currentTime:number = new Date().getTime();
                    let newScrollTop:number = intervalConf.easing(
                        currentTime - intervalConf.startTime,
                        intervalConf.startScrollTop,
                        intervalConf.targetScrollTop,
                        intervalConf.duration);

                    this.body.scrollTop = newScrollTop;
                    this.document.documentElement.scrollTop = newScrollTop

                    if (intervalConf.endTime <= currentTime) {
                        PageScroll.stopTimer(timer);
                        this.pageScrollFinish.emit(null);
                    }
                }, PageScrollConfig._interval, intervalConf);
                PageScroll.timers.push(timer);
            }
        }
    }

    private static stopTimers():boolean {
        if (PageScroll.timers.length > 0) {
            PageScroll.timers.forEach((timer:any, index:number) => {
                clearInterval(timer);
                PageScroll.timers.splice(index, 1);
            });
            return true;
        }
        return false;
    }

    private static stopTimer(timer:any):boolean {
        clearInterval(timer);
        let index:number = PageScroll.timers.indexOf(timer);
        if (index >= 0) {
            PageScroll.timers.splice(index, 1);
            return true;
        }
        return false;
    }
}
