/**
 * Created by Hosuke on 15/04/15.
 */

/**
 * Utility function to convert lat and lng to google.maps.LatLng() object
 * @param latitude
 * @param longitude
 * @returns {google.maps.LatLng}
 */
var position = function(latitude, longitude){
  return new google.maps.LatLng(latitude, longitude);
};

/**
 * Separation of concerns for view and model
 * @constructor
 */
var ViewModel = function() {
    // Store the root object
    var self = this;

    this.setLocationMarker = function(lat, lng){
        var marker = new google.maps.Marker({
            map: self.map,
            position: position(lat,lng)
        });
        marker.setMap(self.map);
    };

    /**
     * Initialize Google Map
     */
    var mapOptions = {
        center: { lat: -35.3075, lng: 149.1244},
        zoom: 13
    };
    self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    self.setLocationMarker(-35.3075, 149.1244);

};

ko.applyBindings(new ViewModel());