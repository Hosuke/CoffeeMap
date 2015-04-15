/**
 * Created by Hosuke on 15/04/15.
 */
function initialize() {
    var mapOptions = {
        center: { lat: -35.3075, lng: 149.1244},
        zoom: 13
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);