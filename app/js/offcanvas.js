////////////////////////////////////////////
//
//  NOTES                   -   START
//
//  Works on desktop, perfectly. Problem on mobile is:
//  Mobile scroll events don't work like desktop scroll events.
//  The desktop scroll fires, well every pixel essentially. Recently
//  modern browsers and devices have adopted the same, namely Android, Chrome, Firefox, Dolphin.
//  However, Blackberry, Opera, Symbian and iOS browsers have not. They do not
//  detect on scroll per pixel, they detect on scrollstart and scrollstop,
//  inbetween, nothing. Momentum scrolling does not detect scrolling.
//  Therefore another solution needs to be considered.
//  https://www.tjvantoll.com/2012/08/19/onscroll-event-issues-on-mobile-browsers/
//  http://andyshora.com/mobile-scroll-event-problems.html
//
//  NOTES                   -   END
//
////////////////////////////////////////////
////////////////////////////////////////////
//
//  UTILITIES               -   START
//
function forEach(array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
    }
};
//
//  UTILITIES               -   END
//
////////////////////////////////////////////
////////////////////////////////////////////
//
//  CONFIG                  -   START
//
var body          = document.querySelector('body');
var header        = document.querySelector('.headerWrapper > header');
var headerWrapper = document.querySelector('.headerWrapper');
var nav           = document.querySelector('.headerWrapper > nav');
var navHeader     = document.querySelector('.headerWrapper > nav .navbar-header');
var navItems      = document.querySelectorAll('.headerWrapper > nav .dropdown');
var navToggle     = document.querySelector('.headerWrapper > nav #open-right');
var wrapper       = document.querySelector('#content');
InitializeBackdrop();
var backdrop      = document.querySelector('#navbar-backdrop');
//
//  CONFIG                  -   END
//
////////////////////////////////////////////
////////////////////////////////////////////
//
//  TOGGLE SIDEBAR          -   START
//
//
//  Create backdrop for sidebar and inserts
//  it into the content wrapper. Creates onclick for nav button
function InitializeBackdrop() {
    var newBackdrop  = document.createElement("div");
    wrapper.insertBefore(newBackdrop, wrapper.childNodes[0]);
    newBackdrop.id = "navbar-backdrop";
    newBackdrop.className = "fade invisible";
    newBackdrop.setAttribute("onclick", "CloseSidebar()");
    navToggle.setAttribute("onclick", "OpenSidebar()");
};
//
//  Adds appropriate classes to body and
//  backdrop along with with transition classes.
function OpenSidebar() {
    body.classList.add("sidebar-is-open");
    backdrop.classList.add("in");
    backdrop.classList.remove("invisible");
};
//
//  Reverse of the Above
function CloseSidebar() {
    body.classList.remove("sidebar-is-open");
    backdrop.classList.remove("in");
    setTimeout( function(){
        backdrop.classList.add("invisible");
    }, 250 );   // delay equivalent to "#navbar-backdrop-fade" transition in css.
};
//
//  TOGGLE SIDEBAR          -   END
//
////////////////////////////////////////////
////////////////////////////////////////////
//
//  TOGGLE COLLAPSE         -   START
//
//
//  Toggle nav links on load.
//  ** Used in window.onresize below.
ToggleNavCollapse();
//
//  Toggle convert nav links to collapse.
//
//  If screen is less than or equal to 991:
//      enable collapse nav items.
//  else
//      disable collapse nav items.
function ToggleNavCollapse() {
    if ( window.innerWidth <= 991 ) {
        EnableCollapse();
    } else {
        DisableCollapse();
    }
};
//
//  For each "li > a" convert from dropdown to collapse trigger.
//  For each "li > ul" convert to collapse element.
function EnableCollapse() {
    forEach(navItems, function (index, navItem) {
        //
        var navLink = navItem.firstElementChild;
        navLink.setAttribute("data-toggle", "collapse");
        navLink.setAttribute("onclick", "ToggleCollapse(this)");
        //
        var navLinkRef = navLink.getAttribute("href");
        navLink.setAttribute("data-href", navLinkRef );
        navLink.setAttribute("href", "");
        //
        navLink.removeAttribute("data-hover");
        //
        var navMenu = navItem.lastElementChild;
        navMenu.classList.add("collapse");
    });
};
//
//  Reverse of the above.
function DisableCollapse() {
    forEach(navItems, function (index, navItem) {
        //
        var navLink = navItem.firstElementChild;
        navLink.removeAttribute("data-toggle");
        navLink.removeAttribute("onclick");
        //
        var navLinkRef = navLink.getAttribute("data-href");
        navLink.setAttribute("href", navLinkRef );
        navLink.removeAttribute("data-href");
        //
        navLink.setAttribute("data-hover", "dropdown");
        //
        var navMenu = navItem.lastElementChild;
        navMenu.classList.remove("collapse");
        navMenu.removeAttribute("style");
    });
};
//
//  Toggle collapse state of next element, in
//  this case "li > a + ul".
function ToggleCollapse(el) {
    $(el).next().collapse('toggle');
}
//
//  TOGGLE COLLAPSE         -   END
//
////////////////////////////////////////////
////////////////////////////////////////////
//
//  TOGGLE STICKY ELEMENT   -   START
//
//
//  Initialize sticky element on Load.
InitializeSticky();
//
//  Toggle sticky element based on scroll.
window.onscroll = function() {
    //
    //  Get offset distance before check
    var threshold = nav.getAttribute("sticky-offset");
    //
    //  If screen is less than or equal to 991:
    //      If scroll past threshold:
    //          enable sticky.
    //      else
    //          disable sticky.
    //
    //      If not scrolled at all:
    //          disable sticky.
    if ( this.innerWidth <= 991 ) {
        if ( this.scrollY > threshold ) {
            EnableSticky();
        } else {
            DisableSticky();
        }
        if ( this.scrollY == 0 ) {
            DisableSticky();
        }
    }
};
//
//  Toggle sticky element on resize.
window.onresize = function() {
    //
    //  Toggle nav links on resize.
    ToggleNavCollapse();
    //
    //  Update sticky-offset value on resize.
    InitializeSticky();
    //
    //  If screen is greater than or equal to 992:
    //      disable sticky.
    //  else
    //      enable sticky.
    //  If not scrolled at all:
    //      disable sticky.
    if ( this.innerWidth >= 992 ) {
        DisableSticky();
    } else {
        EnableSticky();
    }
    if ( this.scrollY == 0 ) {
        DisableSticky();
    }
};
//
//  Prepare sticky element
//  Get the previous element's height /* 1 */ and stores it
//  in a new attribute on the sticky element. /* 2 */
function InitializeSticky() {
    var offset = header.offsetHeight;                           /* 1 */
    nav.setAttribute("sticky-offset", offset);                  /* 2 */
};
//
//  Enable sticky element
//  Adds a margin top /* 1 */ to the wrapepr element equivalent
//  to the height of the sticky element, essentially creating a
//  "clone" of the sticky element to compensate for position:fixed
//  page jump. Position fixed enabled by new attribute body/* 2 */.
function EnableSticky() {
    headerWrapper.style.marginBottom = navHeader.offsetHeight + "px";    /* 1 */
    body.classList.add("sticky-is-enabled");                    /* 2 */
};
//
//  Reverse of the above.
function DisableSticky() {
    headerWrapper.style.marginBottom = 0;                              /* 1 */
    body.classList.remove('sticky-is-enabled');                 /* 2 */
};
//
//
//  TOGGLE STICKY ELEMENT   -   END
//
////////////////////////////////////////////
