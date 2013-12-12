'use strict';
define(function(require, exports) {

require("./Header");
require("./Message");
require("./Footer");
require("./Dialog");

angular.module('gymCommon', ["angular-table", "gymHeader", "gymMessage", "gymFooter", "gymDialog"]);

});
