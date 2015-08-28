(function() {

  function ezTable(builder) {
    if(builder == null) {
      throw new TypeError("Builder cannot be null");
    }

    if(!builder.hasOwnProperty("headers")) {
      throw new TypeError("Builder.headers cannot be null");
    }

    var headers = Object.getOwnPropertyNames(builder.headers);

    if(headers.length == 0) {
      throw new TypeError("Builder.headers is empty. It should be filled");
    }

    return {
      bind: function (elementId) {
        builder.el = document.getElementById(elementId);
      },

      load: function (array) {

      }
    }
  }

  /* BROWSER INTEGRATION */
  if(typeof window !== "undefined") {
    return window.ezTable = ezTable;
  }

  if(typeof module.exports !== "undefined") {
    return module.exports = ezTable;
  }

  define(function() {
    return ezTable;
  });
})();
