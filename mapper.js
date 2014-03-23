// create a global request object to be used
var receiveReq = getXmlHttpRequestObject();

//Gets the browser specific XmlHttpRequest Object. This is boiler plate code used in every Ajax application
function getXmlHttpRequestObject() {	
	if (window.XMLHttpRequest) {		
		return new XMLHttpRequest();	
	} else if(window.ActiveXObject) {		
		return new ActiveXObject("Microsoft.XMLHTTP");	
	} else {		
		document.getElementById('status_div').innerHTML = 'Status: Cound not create XmlHttpRequest Object.' +		
			'Consider upgrading your browser.';	
	}
}

// Gets the current locations from the REST service on the server and writes out the HTML that contains links for the map
function getLocationsAndMap() {	
	if (receiveReq.readyState == 4 || receiveReq.readyState == 0) 
	{	
		// 	getD2DSites.html is a REST service that returns the list of locations as JSON
		receiveReq.open("GET", 'getD2DSites.html', true);		
		receiveReq.onreadystatechange = getLocationsAndMapCallback; 		
		receiveReq.send(null);	
	}			
} 
function getLocationsAndMapCallback() {	
	if (receiveReq.readyState == 4) {		
		// deserialize the JSON response. This creates an array of location objects. 
		// Use your browser to make a request to ./getD2DSites.html to see what the JSON looks like.
		var response = eval("(" + receiveReq.responseText + ")");		

		// generate HTML listing the locations and update the page DOM so the user will see the HTML
		var locations_div = document.getElementById('locations_div');		
		locations_div.innerHTML = '<p>Received ' + response.locations.location.length + ' results.</p>';
		for(i=0;i < response.locations.location.length; i++) {
			var city = response.locations.location[i].city;
			var loc = response.locations.location[i].location;
			// the anchor href is meaningless since we abort the navigation by returning false from onclick
			var anchor = '<a href="irrelevant" onclick="javascript:showAddress(\''+response.locations.location[i].address+'\'); return false">';
			var addr = 	response.locations.location[i].address;
			locations_div.innerHTML += '<p><b>'+ city + '</b> ' + anchor + loc + '</a><br/>' + addr + '</p>';
		}		
	}
}

// Google API specific code for recentering the map on an address, taken from the Google code library.
// The Google Maps documentation contains a lot of code samples to get you going fast!
function showAddress(address) {  
	var map = new GMap2(document.getElementById("google_map_div"));
	var geocoder = new GClientGeocoder();
	geocoder.getLatLng(address,    
		function(point) {      
		  if (!point) {        
		    alert(address + " not found");      
		  } else {        
		    map.setCenter(point, 13);        
		    var marker = new GMarker(point);        
		    map.addOverlay(marker);        
		    marker.openInfoWindowHtml(address);      
		  }    
	    }  
    );
}