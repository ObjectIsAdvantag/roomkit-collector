# Mapwize.js

The SDK is built as a [Leaflet 1.x](http://leafletjs.com/) plugin. Leaflet is included in the package so you don't have to worry about importing it. Mapwize.js is all you need.

The package is exposed as `Mapwize`.

Here are the specific instructions for using Mapwize. Please refer to the [Leaflet 1.x Doc](http://leafletjs.com/reference-1.0.3.html) for all the Leaflet related options.

----------

## Summary
* <a href="#_install-mapwize">Install Mapwize</a>
* <a href="#_apiKey">Enter api key</a>
* <a href="#_display-map">Display a Mapwize map</a>
* <a href="#_map-constructor">Map constructor</a>
* <a href="#_limit-area">Limit the visible area</a>
* <a href="#_center-map">Center the map</a>
	* <a href="#_center-coordinates">Center on coordinates</a>
	* <a href="#_center-venue">Center on venue</a>
	* <a href="#_center-place">Center on place</a>
	* <a href="#_fit-area">Fit given area</a>
* <a href="#_floors">Floors</a>
* <a href="#_places">Promoting and ignoring places</a>
* <a href="#_externalplaces">Using places that are not managed on the Mapwize plaform</a>
* <a href="#_display-directions">Display directions</a>
* <a href="#_user-position">User position</a>
	* <a href="#_display-position">Display user position</a>
	* <a href="#_use-browser">Use browser location</a>
	* <a href="#_follow-user">Follow user mode</a>
	* <a href="#_center-user">Center map on user position</a>
	* <a href="#_get-user">Get user position</a>
	* <a href="#_set-user">Setting the user position</a>
	* <a href="#_multiple-sources">Using multiple measurement sources</a>
	* <a href="#_set-heading">Setting the user heading</a>
* <a href="#_urls">Setting the map based on URL</a>
* <a href="#_urlsParser">Parse a mapwize URL</a>
* <a href="#_markers">Adding markers</a>
* <a href="#_events">Listen for events</a>
	* <a href="#_event-click">`click`</a>
	* <a href="#_event-contextmenu">`contextmenu`</a>
	* <a href="#_event-directionsStart">`directionsStart`</a>
	* <a href="#_event-directionsStop">`directionsStop`</a>
	* <a href="#_event-floorChange">`floorChange`</a>
	* <a href="#_event-floorsChange">`floorsChange`</a>
	* <a href="#_event-followUserModeChange">`followUserModeChange`</a>
	* <a href="#_event-marginsChange">`marginsChange`</a>
	* <a href="#_event-markerClick">`markerClick`</a>
	* <a href="#_event-moveend">`moveend`</a>
	* <a href="#_event-placeClick">`placeClick`</a>
	* <a href="#_event-preferredLanguageChange">`preferredLanguageChange`</a>
	* <a href="#_event-userPositionChange">`userPositionChange`</a>
	* <a href="#_event-venueEnter">`venueEnter`</a>
	* <a href="#_event-venueExit">`venueExit`</a>
* <a href="#_qrCode">QR-code</a>
* <a href="#_access-key">Access Key</a>
* <a href="#_cache">Cache</a>
* <a href="#_margins">Margins</a>
* <a href="#_place-style">Modify Place Style</a>
* <a href="#_multilingual">Multilingual venues</a>
* <a href="#_outdoorProvider">Outdoor map provider</a>
* <a href="#_universes">Working with universes</a>
* <a href="#_custom-data">Adding custom data to objects</a>
* <a href="#_api">Api</a>
	* <a href="#_api-venues">Venues</a>
	* <a href="#_api-places">Places</a>
	* <a href="#_api-layers">Layers</a>
	* <a href="#_api-connectors">Connector places</a>
	* <a href="#_api-beacons">Beacons</a>
	* <a href="#_api-placeTypes">Place types</a>
	* <a href="#_api-placeLists">Place lists</a>
	* <a href="#_api-search">Search</a>

----------

## <a id="_install-mapwize"></a> Install Mapwize

### Bower

Run `bower install mapwize.js-dist --save`

Import Javascript and css files in your html:
```html
<script type="text/javascript" src="path/to/mapwizeFolder/dist/mapwize.js"></script>
<link rel="stylesheet" href="path/to/mapwizeFolder/dist/mapwize.css" />
```
## <a id="_apiKey"></a>Setup your api key
If you have to use a Mapwize service without loading the map, you can setup your api key as follow:

```javascript
    Mapwize.setApiKey(<your_api_key>);
```

## <a id="_display-map"></a>Display the Mapwize map
The simplest way to display a Mapwize map:
```html
<html>
	<head>
		<script type="text/javascript" src="mapwize.js"></script>
		<link rel="stylesheet" href="mapwize.css" />
		<style>
            #myMapId {
                height: 500px;
            }
        </style>
	</head>
	<body>

		<div id="myMapId"></div>

		<script>
			Mapwize.map('myMapId', {
        		apiKey: {{YOUR MAPWIZE API KEY HERE}}
    		}, function (err, mapInstance) {
		    	// This callback is called when the map is initialized (Or if there is an error during initialization)
    			    
	    		if (err) {
			    	console.error('An error occur during map initialization', err);
	    		}
	    		else {
		    		console.log('map is now loaded');
	    		}
	    	});
		</script>

	</body>
</html>
```

There has to be a div for where the map is going to go. This div can have a css style like for example 

```css
	#map {
    	position:absolute; top:0; bottom:0; width:100%; height: 100%;
    }
```

for a full screen display. Pay attention to have `<div id="myMapId"></div>` and **not** `<div id="myMapId"/>` as the second case will NOT work.

On the full map, everything is displayed:

- Layers with floor selector
- Places with shapes and markers
- Button to position yourself and enable the tracking

----------

## <a id="_map-constructor"></a>Map constructor

```javascript
    Mapwize.map(mapId, options, callback);
    
    /*
     * mapId: The id of the html div where the map should be created
     * options: The options for the map (see further for all possible options)
     * callback: function(err, mapInstance) The callback function called when the map is initialized, with errors if any, and the map instance.
    */
```
Possible map options (in addition to <a href="http://leafletjs.com/reference.html#map-options">all leaflet options</a>):

 - `apiKey` *(String, **required**)* Your Mapwize api key, find it in the Admin portal under the  **Developers/Applications** menu
 - <a href="#_access-key">`accessKey`</a> *(String, optionnal)* A Mapwize access key to access private venues. If necessary, it can be generated in the Admin portal.
 - `displayLayers` *(Boolean, optionnal, default: true).* If `true`, Mapwize **layers** are displayed on the map
 - `displayVenues` *(Boolean, optionnal, default: true).* If `true`, Mapwize **venues** are displayed on the map
 - `displayPlaces` *(Boolean, optionnal, default: true).* If `true`, Mapwize **places** are displayed on the map
 - `displayPlacesOptions` *(Object, optionnal, default: {})*
 - `displayConnectors` *(Boolean, optionnal, default: true)* If `true`, Mapwize **connectors** are displayed on the map
 - `displayFloorControl` *(Boolean, optionnal, default: true)* If `true`, the Floor Control is added on the map
 - `displayMarkerOptions`*(Object, optionnal, default: null)* See marker part for details.
 - `floorControlOptions` *(Object, optionnal, default: {})* 
 - `cacheParams` *(Object, optionnal, default: {})* Sent with each Mapwize api request. <a href="https://github.com/Mapwize/mapwize-api-doc">See Mapwize api doc</a>
 - `floor` *(Integer, optionnal, default: 0)* <a href="#_center-coordinates">Sets the initial floor</a>
 - `bounds` *(L.LatLngBounds, optionnal, default: null)* <a href="#_center-coordinates">Sets the initial bounds</a>
 - `showUserPosition` *(Boolean, optionnal, default: true)* <a href="#_display-position">See the User Position section</a>
 - `showUserPositionControl` *(Boolean, optionnal, default: true)* <a href="#_display-position">See the User Position section</a>
 - `useBrowserLocation` *(Boolean, optionnal, default: true)* <a href="#_use-browser">See the User Position section</a>
 - `marginTop` *(Integer, optionnal, default: 0)* <a href="#_margins">See the Margins section</a>
 - `marginBottom` *(Integer, optionnal, default: 0)* <a href="#_margins">See the Margins section</a>
 - `language` *(String, optionnal, default: null)* <a href="#_multilingual">See the Multilingual section</a>
 - `outdoorMapProvider` *(String, optional, default:null) <a href="#_outdoorProvider">See the OutdoorMapProvider section</a>
 - `mainColor` *(String, optional, default: #C51586)* changes the main color for the user position marker, direction path and floor control. (The marker can be customised using displayMarkerOptions. The user position control cannot be customised but it can be hidden using `showUserPositionControl` option)

----------

## <a id="_limit-area"></a>Limit the visible area
The area the user can browse can be limited to a given bound. To do so, use the Leaflet map options `maxBounds` and `minZoom` at initialization of the map. Example:

```javascript
var map = Mapwize.map('map', {
	maxBounds: [ [40.712, -74.227], [40.774, -74.125] ],
	minZoom: 18
});
```
----------

## <a id="_center-map"></a>Center the map

### <a id="_center-coordinates"></a>Center on coordinates
You can center the map on given coordinates defined by

- latitude
- longitude
- floor: if not set or if does not exist at that location, the floor is set to 'null'
- zoom: between 0 and 21, default 19

or specify the bounds and the floor to be displayed

You can give the options at creation time:
```javascript
var map = Mapwize.map('map', {
	center: [40.712, -74.227],
	zoom: 19,
	floor: 2
});
```
Or dynamically:
```javascript
map.centerOnCoordinates(latitude, longitude, [floor], [zoom]);
map.setFloor(2);
map.setZoom(19);
```
### <a id="_center-venue"></a>Center on venue
You can center the map on a venue by calling `centerOnVenue` with either a venueId or a venue object. Venue objects can be retrieved using the `api.getVenue` method.

	map.centerOnVenue('venueId');
	map.centerOnVenue(venue);
	
### <a id="_center-place"></a>Center on place
You can center the map on a given place by calling `centerOnPlace` with either a placeId or a place object. The floor is automatically selected based on the place. Place objects can be retrieved using the `api.getPlace` method.
```javascript
map.centerOnPlace('placeId');
map.centerOnPlace(place);
```
### <a id="_fit-area"></a>Fit a given area
You can set the map so that a given bound is completely displayed. This takes the margins into account.
```javascript
map.fitBounds([
	[40.712, -74.227],
	[40.774, -74.125]
], [options]);
```
Besides the <a href="http://leafletjs.com/reference-1.0.3.html#fitbounds-options">default options supported by leaflet</a>, `options` can also accept `minZoom` as an integer. Note that if `minZoom` is used, the entire bounds might not be displayed.

----------

## <a id="_floors"></a>Floors

Venues usually have multiple floors. The floor controller let the user change floor. But the floors can also be controlled programatically.

#### Get
Get the displayed floor
```javascript
    var floor = map.getFloor(); // Returns an int or null
```

Get the list of available floors on the current view
```javascript
    var floors = map.getFloors(); // Returns an array of int
```

#### Set
Set the floor to be displayed
```javascript
    map.setFloor(floor); // floor must be an int or null
```

----------

## <a id="_places"></a>Promoting and ignoring places

By default, places are displayed (or not) based on their `isVisible` attributes. Their display order is based on their `order` property. And if they are clickable or not is based on the `isClickable` attribute. It is possible to modify the default behavior using the following methods.

#### Promoting place
You can promote places so they will be displayed on top of any other. The order in which promoted places are displayed is set by the order in the promotePlaces list. Please note that:

- The first place in the promotePlace list is the first to be displayed
- The display of the next promoted places depends of potential collisions with other places earlier in the list.
- Promoted places are always considered visible, disregarding the `isVisible` attribute.

To set the list of promoted places
```javascript
map.setPromotePlaces(listOfplaceIds);
```

To add a single place in promoted list
```javascript
map.addPromotePlace(placeId); // Add the place at the end of the list
```

To add a multiple places in promoted list
```javascript
map.addPromotePlaces(listOfplaceIds); // Add places at the end of the list
```

To remove place from promoted list
```javascript
map.removePromotePlace(placeId); // Remove place from the list
```

#### Ignoring place
You can ignore places and therefore make sure they will never be displayed.

To ignore a place
```javascript
map.addIgnorePlace(placeId);
```

To remove a place from the ignored list
```javascript
map.removeIgnorePlace(placeId);
```

To set the list of ignored places
```javascript
map.setIgnorePlaces(listOfplaceIds);
```

#### Ignoring the `isVisible` attribute
Setting `setIgnoreIsVisible` to true you can enforce that all places will be displayed disregarding their initial settings
```javascript
map.setIgnoreIsVisible(boolean)
```

#### Ignoring the `isClickable` attribute
By default places that are specified as non-clickable will have their click event disabled. Setting `setIgnoreIsClickable` to true you can enforce that all places will be clickable disregarding their initial settings
```javascript
map.setIgnoreIsClickable(boolean)
```

----------

## <a id="_externalplaces"></a>Using places that are not managed on the Mapwize plaform
You can add places on the map coming from your own data set, that are not hosted on the Mapwize platform. 
To do so, set the list of external places using the `setExternalPlaces` method on the map object.
 
```javascript
map.setExternalPlaces(externalPlaces)
```

The place object need to have at least the 4 following attributes:

- venueId: string with the id of the venue the place belongs to
- floor: integer with the floor number of the place
- translations: array of {title, subTitle, details, language} strings that define what text need to be displayed on the map
- geometry: geojson geometry object with the position of the place 

Example:

```
{
	venueId: '56c2ea3402275a0b00fb00ac',
    floor: 0,
    translations:[{title: 'External place', details: '', language: 'en'}],
	geometry: {
		type: 'Polygon',
		coordinates: [[[4.5993915013968945,49.742717037274765],[4.599440451711416,49.74270013759909],[4.599408432841301,49.74266146331921],[4.599359482526779,49.742678363008345],[4.5993915013968945,49.742717037274765]]]
	}
}
```

You can also add an _id field to the place. The _id is only useful if you want to refer to methods that uses place ids like promote.

The folowing attributes are also available:

- placeTypeId: id of a Mapwize placeType that defines a default style
- style: a style object for the place. See the style section for details
- data: a free json object that is returned in any callback like placeClick
- isClickable: set to false to disable click
- isVisible: set to false to make it invisible
- marker: {latitude, longitude} object to specify the position of the place marker
- order: integer to define the order of display. Places are displayed in ascending order. Default 0

Please note that in the current implementation, external places do not support universes.

To remove the external places, simply pass an empty table to setExternalPlaces: `setExternalPlaces([])`

----------

## <a id="_display-directions"></a>Display directions

You can display directions on the map, either between 2 points or through a list of waypoints, as long as all the points are in the same venue.

The show direction method is the easyest to use and will take car of the API request and the display.

```javascript
map.showDirections(from, to, waypoints, options, callback);
```

You can also get the directions first using the API and then display all or portion of the directions using:

```javascript
Mapwize.Api.getDirections(from, to, waypoints, options, callback);
map.startDirections(directions, options);
```

The from parameter is required and is an objects which can have the following properties:

	{
		placeId: string (the Id of a place. If used, latitude/longitude/floor/venueId are ignored)
		latitude: number (if used, all latitude/longitude/floor are required)
		longitude: number (if used, all latitude/longitude/floor are required)
		floor: number (if used, all latitude/longitude/floor are required)
		venueId: string (the Id of the venue the latitude/longitude is in. Only required if the venue cannot be inferred from the to and the waypoints)
	}

The to parameter is required. It can be an object, with the same structure as the From, so the destination is fixed. It can also be an array, and in that case, the closest destination is used. It can also be an object refering to a placeList, and in that case the closest place of the list if used:

	{
		placeListId: string (the Id of a placeList)
	}

For the waypoints, you can specify an array with objects with the same structure as the From.

The options parameter is an object supporting the following properties:

	{
		isAccessible: boolean (if set to true, only routes and connectors accessible to people with disabilities are used in the computation. Default is false)
		waypointOptimize: boolean (if set to true, the order of the waypoints is optimized to minimize the total time of the directions. Default is false)
	}

The callback is a function returning an error object or directions object

	callback = function(err, directions)
	
Err is null if there was no error and a direction is displayed.

Directions is an object containing the folloing properties:

	{
		from: from object as above,
		to: to object as above,
		distance: total distance in meters,
		traveltime: total time in seconds,
		bounds: bounds containing the total route,
		route: [ a list of paths on different floors
			floor: the floor number of the route
			path: the list of coordinates on the way points
			distance: the distance of the route in meter
			bounds: the bounds of the route
			isStart: if the route of the first one
			isEnd: if the route is the last one
			fromFloor: the floor of the route before
			toFloor: the floor of the route after
			connectorTypeTo: the type of connector used to go to the next floor
			connectorTypeFrom: the type of connector used to come from the previous floor
		],
		waypoints: list of waypoints, ordered,
		subdirections: directions object with the same structure as the parent for each step between waypoints.
	}

To remove the directions from the map, use the method `stopDirections`

```javascript
map.stopDirections();
```
----------

## <a id="_user-position"></a>User position

### <a id="_display-position"></a>Display user position

By default, if the user position is available, it is displayed. You can prevent the user location from being displayed by setting the `showUserPosition` map option to false:

```javascript
var map = Mapwize.map('map', {
	showUserPosition: false
});
```

If `showUserPosition` is not false, the control proposing the user to go to its position is displayed by default. You can disable it by setting the `showUserPositionControl` map option to false:

```javascript
var map = Mapwize.map('map', {
	showUserPositionControl: false
});
```

### <a id="_use-browser"></a>Use browser location

By default, the user position is acquired from the web browser if available. You can disable it by setting the `useBrowserLocation` map option to false:

```javascript
var map = Mapwize.map('map', {
	useBrowserLocation: false
});
```

### <a id="_follow-user"></a>Follow user mode

The follow user mode allows to have the map moving as the position is updated.

You can manage the followUserMode using the following commands:

```javascript
map.getFollowUserMode();
map.setFollowUserMode(true or false);
```

### <a id="_center-user"></a>Center map on user position

To center the map on the current user position, you can use the `centerOnUser` method. The method takes a minZoom parameter. If the current zoom of the map is lower than minZoom, then the map is zoomed to minZoom.	

```javascript
map.centerOnUser(19);
```

### <a id="_get-user"></a>Get user position

You can get the current user position using the method

```javascript
map.getUserPosition();
```
The returned object has the following properties:

	{
		latitude: the latitude
		longitude: the longitude
		floor: the floor (null if ouside a building or unknown)
		accuracy: the radius in meter in which the user has a high probability to actually be, on the current floor. There is no vertical accuracy.
		validUntil:  timestamp until when the position is valid. Used for example for sources like QR-code which do not necesseraly get continuous measurements.
		source: a string describing the source of the measurement.
	}
 
### <a id="_set-user"></a>Setting the user position

You can manually set the user position by using the `setUserPosition` method:

```javascript
map.setUserPosition({
	latitude: 40.712, 
	longitude: -74.227,
	floor: 2,
	accuracy: 5
});
```

The accuracy is specified in meters. At this point the accuracy is only on horizontal position. There is no accuracy on floor.
	
If the followUserMode is enabled, then this methods will have as consequence to move the map. Otherwize, only the user position dot will be moved.

When the setUserPosition method is used, the position of the user is locked on the provided position until setUserPosition is called again. If you then want to unlock the positon and use the default position given by the browser for example, then you need to call

```javascript
map.unlockUserPosition();
```
	
### <a id="_multiple-sources"></a>Using multiple measurement sources

In many situations, many positioning methods can be combined in order to define the most probable position of the user, for example GPS, iBeacons, QR-Code, Wifi, Lifi, ...

To handle this situation, Mapwize allows you to send different measurements from different sources to the SDk.

To do so, use the method

```javascript
map.newUserPositionMeasurement(measurement);
```

where measurement is an object with the following properties

	{
		latitude
		longitude
		floor
		accuracy
		validity: the time in milliseconds the measurement is valid. This allows the use of single measurement methods like the scan of a code, for which no update is provided as the user moves. Set validity to null for infinite.
		source: a string describing the source of the measurement. Each time a new measurement arrives, it discards automatically the previous measurement from the same source.
	}

You can lock the user position to the current position using the method lockUserPosition. When the position is locked, all measurements are ignored until the method unlockUserPosition is called.

The method setUserPosition overrules all the previous rules and sets the user position until unlockUserPosition is called.

### <a id="_set-heading"></a>Setting the user heading
When a compass is available, it can be interesting to display the direction the user is looking. To do so, the method setUserHeading can be used, giving it an angle in degree. Example if the user is looking south:

```javascript
map.setUserHeading(180);
```
	
To remove the display of the compass, simply set the angle to null.

----------

## <a id="_urls"></a>Setting the map based on URL

The Mapwize URL allows to refer positions, venues, places and directions so they can be displayed uniformly on every device, web and mobile.

The same URLs can be typed in a web browser or scanned as QR-code, using the Mapwize apps or the SDK.

The URLs always start with http://mwz.io/

To load a URL, use the following method:

```javascript
map.loadURL(url, callback);
```
Same callback as Mapwize.Url.parse function (<a href="#_urlsParser">see below</a>)

The complete documentation regarding the URL format can be found [in the mapwize-url-scheme repository on github](https://github.com/Mapwize/mapwize-url-scheme).

----------

## <a id="_urlsParser"></a>Parse a mapwize URL

```javascript
Mapwize.Url.parse(url, callback);
```
     
The callback function returns an error (if any) and the parsed object in the following format
    
    {
        - venue: the venue object to which the url relates.
        - universe: the universe object if the ?u parameter is specified in the url 
        - language: the language code if the ?l parameter is specified in the url 
        - outdoorMapProvider: the outdoor map provider if the ?outdoorMapProvider is specified in the url
        - accessKey: the accessKey if the ?k parameter is specified in the url.
        - floor: the value of the floor if specified in the url, or the floor of the place, or the start floor of the direction 
        - zoom: the zoom if ?z parameter is specified 
        - userPosition: a user position object with lat lon floor if the url is a beacon, or if the direction starts from the beacon 
        - from: object with the origin of the direction if direction url starting from the place.
        - to: object with the venue, place or placelist for related urls or the destination of the direction.
        - direction: direction object if it's a direction url, or null 
        - bounds: the bounds that should be set to the map to properly display the url 
    }
    
#### Example
````javascript
Mapwize.Url.parse(url, function (err, parsedUrl) {
  // In case of error, parsedUrl might still contain useful information.

  if (parsedUrl) {
    if (err) {
      console.error(err);
      // Show user a warning
    }
    // Do something with parsedUrl
  }
  else {
    console.error(err);
  }
});

````

## <a id="_markers"></a>Markers

### <a id="_markers-style"></a>Styling

You can use your own marker by passing the following options on the map creation.
Please refer to Leaflet for iconSize and iconAnchor options.
```javascript
displayMarkerOptions: {
	iconUrl: 'your-url?png',
	iconSize: [x, y],
	iconAnchor: [x, y]
}
```

### <a id="_markers-add"></a>Adding marker

You can add markers on the map to show a position of interest. At this points, marker are static elements and users cannot interact with them.

To add a marker, use the function

```javascript
map.addMarker(position, callback);
```

where `position` is an **object** with the following properties (with same priority order):

*A full place object*

OR

	{
		latitude: number (if used, longitude is required)
		longitude: number (if used, latitude is required)
		floor: number (can be null)
	}

OR

<a href="#_api-places-get">*Same params as api get place*</a>

The `callback` function take 2 params:
(*Object*) `err` if an error has occurred
(*String*) `markerId` an uniq id for this marker

### <a id="_markers-remove"></a>Remove marker
#### <a id="_markers-remove-one"></a>Remove one marker

To remove only one marker, use the function

```javascript
map.removeMarker(markerId);
```

`markerId` is returned by <a href="#_markers-add">addMarker</a> callback

#### <a id="_markers-remove-all"></a>Remove all markers
	
To remove all the markers at once, use the function

```javascript
map.removeMarkers();
```

----------

## <a id="_events"></a>Listen for events

The map will emit various events you can listen to.

### <a id="_event-click"></a>click
Fired when the user clicks (or taps) the map.

```javascript
map.on('click', function (e) {
	console.log(e);
});
```

### <a id="_event-contextmenu"></a>contextmenu
Fired when the user pushes the right mouse button on the map. Also fired on mobile when the user holds a single touch for a second (also called long press).

```javascript
map.on('contextmenu', function (e) {
	console.log(e);
});
```

### <a id="_event-directionsStart"></a>directions start
Fired when directions are displayed on the map.

```javascript
map.on('directionsStart', function (e) {
	console.log('Directions have been loaded');
});
```

### <a id="_event-directionsStop"></a>directions stop
Fired when directions are stopped and not displayed on the map anymore.

```javascript
map.on('directionsStop', function (e) {
	console.log('Directions have stopped');
});
```

### <a id="_event-floorChange"></a>floor change
Fired when the currently viewed floor is changed.

```javascript
map.on('floorChange', function (e) {
	console.log('Floor changed to ' + e.floor);
});
```

### <a id="_event-floorsChange"></a>floors change
Fired when the list of available floors at the currently viewed location is changed.

```javascript
map.on('floorsChange', function(e) {
	console.log('Available floors at currently viewed location changed to ' + e.floors);
});
```

### <a id="_event-followUserModeChange"></a>followUserMode change
Fired when FollowUserMode changed.

```javascript
map.on('followUserModeChange', function (e) {
	console.log('followUserMode new value: ' + e.followUserMode);
});
```

### <a id="_event-marginsChange"></a>margins change
Fired when the map margins have changed

```javascript
map.on('marginsChange', function (e) {
	console.log('margins: ' + e.margins);
});
```

### <a id="_event-markerClick"></a>marker click
Fired when a marker is clicked

```javascript
map.on('markerClick', function (e) {
	console.log('marker id: ' + e.markerId);
});
```

### <a id="_event-moveend"></a>moveend
Fired when the view of the map stops changing (e.g. user stopped dragging the map).

```javascript
map.on('moveend', function (e) {
	console.log(e);
});
```

### <a id="_event-placeClick"></a>place click
Fired when a place is clicked.

```javascript
map.on('placeClick', function (e) {
	console.log(e.place);
});
```

### <a id="_event-preferredLanguageChange"></a>preferred language change
Fired when the map preferred language has changed

```javascript
map.on('preferredLanguageChange', function (e) {
	console.log('Language: ' + e.language);
});
```

### <a id="_event-userPositionChange"></a>user position change
Fired when the user position has changed.

```javascript
map.on('userPositionChange', function (e) {
	console.log('User position changed to ' + e.userPosition);
});
```

### <a id="_event-venueEnter"></a>venue enter
Fired when a venue is displayed (zoom level >= 16 and center of the map inside the venue)

```javascript
map.on('venueEnter', function (e) {
	console.log('Venue entered: ' + e.venue);
});
```

### <a id="_event-venueExit"></a>venue exit
Fired when leaving the venue that was previously entered

```javascript
map.on('venueExit', function (e) {
	console.log('Venue exited: ' + e.venue);
});
```

----------

## <a id="_qrCode"></a>QR-code
If you have retrieved a QR-code and want to pass it to the SDK, you can use the following method and pass the QR-code payload:

```javascript
map.loadURL('payload');
```
	
To add the QR-code scan button to the map (by default at bottom left):

```javascript
var qrcodeControl = Mapwize.qrcodeControl({
	onClick: function () {
		/* scan the QR code and retrieve payload */  
		map.loadURL(payload);
	}
});
qrcodeControl.addTo(map);
```

----------

## <a id="_access-key"></a>Access Key
If you want to access private buildings, you need to specify the related access key.

You can pass the access key directly when initializing the map:

```javascript
var map = Mapwize.map('map', {
	accessKey: 'YOUR KEY'
});
```

Or you can use the access method

```javascript
map.access('key', function (result) {
	if (result) {
		// NO error, key is valid
	}
	else {
		// ERROR, key is not valid
	}
});
```

----------

## <a id="_cache"></a>Cache
To prevent too many network requests while browsing the map, the SDK keeps a cache of some data it already downloaded.

The Time To Live of the cache is 5 minutes.

If you want to force the map to refresh the cache and update itself, you can call the refresh method anytime.

```javascript
map.refresh();
```

----------

## <a id="_margins"></a>Margins
It often happens that part of the map is hidden by banners or controls on the top or on the bottom. For example, if you display a banner to show the details of the place you just clicked on, it's better to display the banner on top of the map than having to resize the map.

However, you want to make sure that the Mapwize controls are always visible, like the followUserMode button and the floor selector. Also, that if you make a fitBounds, the area will be completely in the visible part of the map.

For this purpose, you can set a top and a bottom margin on the map. We garantee that nothing important will be displayed in those margin areas.

To set the margins, you can pass them in pixels when you intialize the map:

```javascript
var map = Mapwize.map('map', {
	marginTop: 50,
	marginBottom: 50
});
```

Or you can change them at runtime

```javascript
map.setTopMargin(50);
map.setBottomMargin(50);
```

----------

## <a id="_place-style"></a>Modify Place Style
The style of a place can be modifyed directly within the SDK and can then override the style sent by the server. This is the best way to make changes in real-time on the map as it does not require to contact the Mapwize servers. For example, this can be used to display the availability of a meeting room.

```javascript
map.setPlaceStyle(placeId, style);
```
	
where style is an object with the format:

	{
		markerUrl: string (An url to the icon of the marker. Must be an image, ideally png, square, 100*100 pixels),
        strokeColor: string (The color of the shape border as #hex),
        strokeOpacity: number (The opacity of the border, between 0 and 1),
        strokeWidth: number (The width of the border),
        fillColor: string (The color of the inside of the shape as #hex),
        fillOpacity: number (The opacity of the inside, between 0 and 1),
        labelBackgroundColor: string (The color of the backgroud of the label as #hex),
        labelBackgroundOpacity: number (The opacity of the background of the label, between 0 and 1)
	}

example:

```javascript
{
	markerUrl: 'http://myserver.com/image.png',
	strokeColor: '#C51586',
	strokeOpacity: 1,
	strokeWidth: 2,
	fillColor: '#FFFFFF',
	fillOpacity: 0.3,
	labelBackgroundColor: null,
	labelBackgroundOpacity: null
}
```

Note that if a parameter is null, the value defined on the server will be used.

----------

## <a id="_multilingual"></a>Multilingual venues
Venues can support multiple languages.
By default, venues are displayed in their default language configured on the backend-side.
Using the function

```javascript
map.setPreferredLanguage(language);
```
    
it is possible to set the preferred language of the user. If a venue supports the preferred language, it will be displayed in that language.
Otherwise, it will be displayed in the default language.

Languages are defined using 2 letter codes like 'en', 'fr', ...

Setting the preferred language to null displays all venues in their default language.

----------

## <a id="_outdoorProvider"></a>Outdoor map provider
Available map provider : 'mapbox-street', 'mapbox', 'mapbox-satellite', 'tomtom-street', 'tomtom', 'none'

If you don't set a specific provider, our default outdoor will be displayed

----------

## <a id="universes"></a>Working with universes

Defining multiple universes for a venue let you show different views with different permission levels. By default, the first universe which the user has access to is displayed.

### Set universe for venue
Tu display a specific universe for a venue, set it with the `setUniverseForVenue` method

```javascript
map.setUniverseForVenue(universeId, venueId);
```

This automaticaly refreshes the map if needed.

### Get universe for venue
To know wich universe is set for a venue use `getUniverseForVenue` method

```javascript
var universeId = map.getUniverseForVenue(venueId);
```

returns the universeId or null if no universe was previously set.

----------


## <a id="_custom-data"></a>Adding custom data to objects
To define specific behavior in your app for venues, places, placeLists or beacons, it is handy to attach custom data to those objects.
Data can be added using the API or the backend interface.
Data are retrieved in the objects under the property "data".

----------

## <a id="_api"></a>Api

You can access to the Mapwize api with the SDK by using `Mapwize.Api`.

### <a id="_api-venue"></a>Venues

#### get

```javascript
Mapwize.Api.venues.get(options, callback);
```

##### Arguments

 1. `options`: *object|String*
 2. `callback`: *function(err, venue)* `venue` is an **venue** object.

`options` can be a string as venueId or an object as:

    {
	    [id|venueId]: (String) an id of venue
	    [alias|venueAlias]: (String) an alias of venue
	    [name|venueName]: (String) a name of venue
    }

Priority rules:
- if you provide id, alias and name are ignored
- if you provide alias, name is ignored

##### Example

```javascript
// Using venue id
Mapwize.Api.venues.get('aValidVenueId', function (err, venue) {
	console.log(venue);
});
    
// Using venue alias
Mapwize.Api.venues.get({alias: 'aValidVenueAlias'}, function (err, venue) {
	console.log(venue);
});
```

#### list

Get a list of venues 

```javascript
Mapwize.Api.venues.list(options, callback);
```

##### Arguments

 1. `options`: *object*
 2. `callback`: *function(err, venues)* `venues` is an array of **venue** object.

`options` is an object as:

    {
	    // you should use both together
	    latitudeMin: (number)
	    latitudeMax: (number)
	    
	    // you should use both together
	    longitudeMin: (number)
	    longitudeMax: (number)
    }

##### Example

```javascript
// with empty options
Mapwize.Api.venues.list({}, function (err, venues) {
	// venues contain all venues you can access
	console.log(venues);
});
    
// In defined area
Mapwize.Api.venues.list({latitudeMin: 0, latitudeMax: 1, longitudeMin: 0, longitudeMax: 1}, function (err, venues) {
	// venues contain all venues in the defined area
	console.log(venues);
});
```

#### By organization

Get a list of venues 

```javascript
Mapwize.Api.getVenuesForOrganization(organizationId, callback);
```

##### Arguments

 1. `organizationId`: *string*
 2. `callback`: *function(err, venues)* `venues` is an array of **venue** object.

##### Example

```javascript
Mapwize.Api.getVenuesForOrganization('aValidOrganizationId', function (err, venues) {
	console.log(venues);
});
```

### <a id="_api-places"></a>Places

#### <a id="_api-places-get"></a>get

```javascript
Mapwize.Api.places.get(options, callback);
```

##### Arguments

 1. `options`: *object|String*
 2. `callback`: *function(err, place)* `place` is an **place** object.

`options` can be a string as placeId or an object as:

    {
	    [id|placeId]: (String) an id of place
	    [alias|placeAlias]: (String) an alias of place
	    [name|placeName]: (String) a name of place
	    
	    venueId: (String) required if you use name or alias
    }

Priority rules:
- if you provide id, alias and name are ignored
- if you provide alias, name is ignored

##### Example

```javascript
// Using venue id
Mapwize.Api.places.get('aValidPlaceId', function (err, place) {
	console.log(place);
});
    
// Using venue alias
Mapwize.Api.places.get({alias: 'aValidPlaceAlias', venueId: 'aValideVenueId'}, function (err, place) {
	console.log(place);
});
```

#### list

Get a list of places 

```javascript
Mapwize.Api.places.list(options, callback);
```

##### Arguments

 1. `options`: *object*
 2. `callback`: *function(err, places)* `places` is an array of **place** object.

`options` is an object as:

    {
	    // get only places in placeList
	    // if used, other params are ignored
	    placeListId: (String)
	    
	    // you should use both together
	    latitudeMin: (number)
	    latitudeMax: (number)
	    
	    // you should use both together
	    longitudeMin: (number)
	    longitudeMax: (number)
	    
	    floor: (Integer)
    }

##### Example

```javascript
// with empty options
Mapwize.Api.places.list({}, function (err, places) {
	// places contain all places you can access
	console.log(places);
});
    
// In defined area
Mapwize.Api.places.list({latitudeMin: 0, latitudeMax: 1, longitudeMin: 0, longitudeMax: 1, floor: 1}, function (err, places) {
	// places contain all places in the defined area on floor 1 (and floor outdoor (null))
	console.log(places);
});
```

### <a id="_api-layers"></a>Layers

#### list

Get a list of layers 

```javascript
Mapwize.Api.layers.list(options, callback);
```

##### Arguments

 1. `options`: *object*
 2. `callback`: *function(err, layers)* `layers` is an array of **layer** object.

`options` is an object as:

    {
	    // you should use both together
	    latitudeMin: (number)
	    latitudeMax: (number)
	    
	    // you should use both together
	    longitudeMin: (number)
	    longitudeMax: (number)
	    
	    floor: (Integer)
    }

##### Example

```javascript
// with empty options
Mapwize.Api.layers.list({}, function (err, layers) {
	// layers contain all layers you can access
	console.log(layers);
});
    
// In defined area
Mapwize.Api.layers.list({latitudeMin: 0, latitudeMax: 1, longitudeMin: 0, longitudeMax: 1, floor: 1}, function (err, layers) {
	// layers contain all layers in the defined area on floor 1 (and floor outdoor (null))
	console.log(layers);
});
```

### <a id="_api-connectors"></a>Connector places

#### list

Get a list of connectorPlace 

```javascript
Mapwize.Api.connectorPlaces.list(options, callback);
```

##### Arguments

 1. `options`: *object*
 2. `callback`: *function(err, connectorPlaces)* `connectorPlaces` is an array of **connectorPlace** object.

`options` is an object as:

    {
	    // you should use both together
	    latitudeMin: (number)
	    latitudeMax: (number)
	    
	    // you should use both together
	    longitudeMin: (number)
	    longitudeMax: (number)
	    
	    floor: (Integer)
    }

##### Example

```javascript
// with empty options
Mapwize.Api.connectorPlaces.list({}, function (err, connectorPlaces) {
	// connectorPlaces contain all connectorPlaces you can access
	console.log(connectorPlaces);
});
    
// In defined area
Mapwize.Api.connectorPlaces.list({latitudeMin: 0, latitudeMax: 1, longitudeMin: 0, longitudeMax: 1, floor: 1}, function (err, connectorPlaces) {
	// connectorPlaces contain all connectorPlaces in the defined area on floor 1 (and floor outdoor (null))
	console.log(connectorPlaces);
});
```

### <a id="_api-beacons"></a>Beacons

#### get

```javascript
Mapwize.Api.beacons.get(options, callback);
```

##### Arguments

 1. `options`: *object|String*
 2. `callback`: *function(err, beacons)* `beacons` is an **beacon** object.

`options` can be a string as beaconId or an object as:

    {
	    [id|beaconId]: (String) an id of beacon
	    payload: (String) a payload of beacon
	    [alias|beaconAlias]: (String) a alias of beacon
	    [name|beaconName]: (String) a name of beacon
	    venueId: (String) required if you use name or alias
    }

Priority rules:
- if you provide id: payload, alias and name are ignored
- if you provide payload: alias and name are ignored
- if you provide alias: name is ignored

##### Example

```javascript
// Using venue id
Mapwize.Api.beacons.get('aValidBeaconId', function (err, beacon) {
	console.log(beacon);
});
    
// Using venue alias
Mapwize.Api.beacons.get({alias: 'aValidBeaconAlias', venueId: 'aValidVenueId'}, function (err, beacon) {
	console.log(beacon);
});
```

#### list

Get a list of beacons 

```javascript
Mapwize.Api.beacons.list(options, callback);
```

##### Arguments

 1. `options`: *object*
 2. `callback`: *function(err, beacons)* `beacons` is an array of **beacon** object.

`options` is an object as:

    {
	    venueId: (String, required) a venue id
    }

##### Example

```javascript
// with empty options
Mapwize.Api.beacons.list({venueId: 'aValidVenueId'}, function (err, beacons) {
	// beacons contain all beacons you can access in the venue
	console.log(beacons);
});
```

### <a id="_api-placeTypes"></a>Place types

#### get

```javascript
Mapwize.Api.placeTypes.get(options, callback);
```

##### Arguments

 1. `options`: *String* a placeType id
 2. `callback`: *function(err, placeType)* `placeType` is an **placeType** object.

##### Example

```javascript
Mapwize.Api.placeTypes.get('aValidePlaceTypeId', function (err, placeType) {
	console.log(placeType);
});
```

### <a id="_api-placeLists"></a>Place Lists

#### get

```javascript
Mapwize.Api.placeLists.get(options, callback);
```

##### Arguments

 1. `options`: *object|String*
 2. `callback`: *function(err, placeList)* `placeList` is an **placeList** object.

`options` can be a string as placeListId or an object as:

    {
	    [id|listId]: (String) an id of venue
	    [alias|listAlias]: (String) an alias of venue
	    [name|listName]: (String) a name of venue
	    venueId: (String) required if you use name or alias
    }

Priority rules:
- if you provide id: alias and name are ignored
- if you provide alias: name is ignored

##### Example

```javascript
// Using placeList id
Mapwize.Api.placeLists.get('aValidePlaceListId', function (err, placeList) {
	console.log(placeList);
});
    
// Using placeList alias
Mapwize.Api.placeLists.get({alias: 'aValidePlaceListAlias', venueId: 'aValidVenueId'}, function (err, placeList) {
	console.log(placeList);
});
```

#### list

Get a list of placeLists 

```javascript
Mapwize.Api.placeLists.list(options, callback);
```

##### Arguments

 1. `options`: *object*
 2. `callback`: *function(err, placeLists)* `placeLists` is an array of **placeList** object.

`options` is an object as:

    {
	    venueId: (String, required)
    }

##### Example

```javascript
// with empty options
Mapwize.Api.placeLists.list({venueId: 'aValidVenueId'}, function (err, placeLists) {
	// placeLists contain all placeLists you can access in the venue
	console.log(placeLists);
});
```

### <a id="_api-search"></a>Search

Search in places, placeLists and venues

```javascript
Mapwize.Api.search(query, options, callback);
```

#### Arguments

 1. `query`: *string*
 2. `options`: *object*
 3. `callback`: *function(err, results)* `results` is an array of **place**, **placeList** or **venue** objects.

`options` is an object as:

    {
	    venueId: (string),
	    universeId: (string),
	    objectClass: (array of string) can contain ['place', 'placeList', 'venue']
    }

#### Example

```javascript
// with empty options
Mapwize.Api.search('what you want to find', {venueId: 'aValidVenueId'}, function (err, results) {
    // If objectClass is empty, all type can be returned
    console.log(results);
});
```
