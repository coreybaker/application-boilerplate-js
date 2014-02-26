define(["dojo/ready", "dojo/_base/declare", "dojo/_base/lang", "esri/arcgis/utils", "esri/IdentityManager", "esri/geometry/Extent", "dojo/on"], function (
ready, declare, lang, arcgisUtils, IdentityManager, Extent, on) {
    return declare("", null, {
        config: {},
        constructor: function (config) {
            //config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information. 
            this.config = config;
            
            ready(lang.hitch(this, function () {
                console.log(this.config.webmap)
                arcgisUtils.getItem(this.config.webmap).then(lang.hitch(this, function (itemInfo) {
                    //let's get the web map item and update the extent if needed. 
                    if (this.config.appid && this.config.application_extent.length > 0) {
                        itemInfo.item.extent = [
                            [parseFloat(this.config.application_extent[0][0]), parseFloat(this.config.application_extent[0][1])],
                            [parseFloat(this.config.application_extent[1][0]), parseFloat(this.config.application_extent[1][1])]
                        ];
                    }
                    this._createWebMap(itemInfo);
                }));




            }));
        },
        _mapLoaded: function () {
            // Map is ready
        },
        //create a map based on the input web map id
        _createWebMap: function (itemInfo) {
            arcgisUtils.createMap(itemInfo, "mapDiv", {
                mapOptions: {
                    //Optionally define additional map config here for example you can 
                    //turn the slider off, display info windows, disable wraparound 180, slider position and more. 
                },
                bingMapsKey: this.config.bingmapskey
            }).then(lang.hitch(this, function (response) {
                //Once the map is created we get access to the response which provides important info 
                //such as the map, operational layers, popup info and more. This object will also contain
                //any custom options you defined for the template. In this example that is the 'theme' property.
                //Here' we'll use it to update the application to match the specified color theme.  



                console.log(this.config);
                this.map = response.map;

                if (this.map.loaded) {
                    // do something with the map

                        console.log("map is loaded");
                        var layers = response.itemInfo.itemData.operationalLayers;
                        var layerInfo = [];

                        console.log("This is where to LOOK!!!");
                        //This console log will return the layer object (sweet!)
                        console.log(layers);

                        dojo.forEach(layers, function(layer){
                            if(!layer.featureCollection){
                                layerInfo.push({"layer":layer.layerObject, "title":layer.title});
                            }
                        });



                    this._mapLoaded();
                } else {
                    on.once(this.map, "load", lang.hitch(this, function () {
                        // do something with the map
                        this._mapLoaded();
                    }));
                }
            }), lang.hitch(this, function (error) {
                //an error occurred - notify the user. In this example we pull the string from the 
                //resource.js file located in the nls folder because we've set the application up 
                //for localization. If you don't need to support mulitple languages you can hardcode the 
                //strings here and comment out the call in index.html to get the localization strings. 
                if (this.config && this.config.i18n) {
                    alert(this.config.i18n.map.error + ": " + error.message);
                } else {
                    alert("Unable to create map: " + error.message);
                }
            }));
        }
    });
});
