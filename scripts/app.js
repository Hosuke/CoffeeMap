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

    // Current Address for search
    this.curAddress = ko.observable("Canberra");

    // List of Cafe nearby
    this.cafeNearby = ko.observableArray([]);

    // List of Cafe nearby Markers
    this.cafeNearbyMarkers = ko.observableArray([]);

    // Google Geocoder
    this.geocoder = new google.maps.Geocoder();

    /**
     * Initialize Google Map
     */
    // Map Options
    var mapOptions = {
        center: { lat: -35.3075, lng: 149.1244},
        zoom: 13,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    };
    // Map Styles
    var styles = [{"stylers":[{"hue":"#16a085"},{"saturation":0}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]}]
    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

    self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //Associate the styled map with the MapTypeId and set it to display.
    self.map.mapTypes.set('map_style', styledMap);
    self.map.setMapTypeId('map_style');

    /**
     * set a marker for a specific location
     * @param lat
     * @param lng
     */
    this.setLocationMarker = function(lat, lng){
        var marker = new google.maps.Marker({
            map: self.map,
            position: position(lat,lng)
        });
        marker.setMap(self.map);
    };

    this.setCafeMarker = function(Cafe){
        var marker = new google.maps.Marker
    };

    /**
     * Geocoding a address to a place object, which includes lat and lng
     * @param address -- address for geocoding
     * @param callback -- a function to run after success
     * @returns {place}
     */
    this.geocoding = function(address, callback) {
        // Create a custom place object using returned data
        var place = {};
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                place.lat = results[0].geometry.location.lat();
                place.lng = results[0].geometry.location.lng();
                place.location = results[0].geometry.location;
                place.formattedAddress = results[0].formatted_address;

                callback(place)
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
        return place;
    };

    this.moveTo = function(dist){
        var lat = dist.lat,
            lng = dist.lng;
        self.map.setCenter(position(lat, lng));
        self.searchCafe(lat, lng);
    };

    this.handleInput = function(){
        var addressQuery = this.curAddress();

        // Clear Markers and Cafe list
        self.cafeNearbyMarkers().forEach(function(marker){
            marker.setMap(null);
        });
        self.cafeNearby([]);
        self.cafeNearbyMarkers([]);

        // Check if addressQuery is empty
        if (addressQuery) {
            self.geocoding(addressQuery, self.moveTo);
        } else {
            alert("Please enter an address");
        }
    };

    this.searchCafe = function(lat, lng, callback){
        var clientID = "PCRVZWPJU2PW4PAWD04WWPHOVM5MRAW1X0FOOBBKS125I0DZ",
            clientSecret = "ECDTQ32IMB3W50KQVSD1FVMHA2NBPM5BL3Z1ZVY5YKWYNHHT",
            query = "coffee",
            requestURL = 'https://api.foursquare.com/v2/venues/search?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20130815&ll=' + lat + ',' + lng + '&query=' + query,
            cafeList = [];

        $.getJSON(requestURL, function(data){
            cafeList = data.response.venues;
            cafeList.forEach(function(cafe){
                //self.setLocationMarker(cafe.location.lat, cafe.location.lng);
                self.cafeNearby.push(cafe);
                self.cafeNearbyMarkers.push(new google.maps.Marker({
                    map: self.map,
                    position: position(cafe.location.lat, cafe.location.lng),
                    title: cafe.name,
                    address: cafe.location.address,
                    city: cafe.location.city,
                    contact: cafe.contact.formattedPhone,
                    icon: 'assets/coffee-icon.png',
                    url: cafe.url,
                    id: cafe.id
                }));
            })
        });
    };


    self.setLocationMarker(-35.3075, 149.1244);
};

ko.applyBindings(new ViewModel());