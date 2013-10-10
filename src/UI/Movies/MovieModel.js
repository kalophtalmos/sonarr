'use strict';
define(
[
    'backbone',
    'underscore'
], function(Backbone,_) {
    return Backbone.Model.extend({
        urlRoot: window.NzbDrone.ApiRoot + '/movies',
        
        defaults: {
            isExisting:false
        }
    });
});