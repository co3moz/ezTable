(function () {
  function ezTable(builder) {
    if (builder == null) {
      throw new TypeError("Builder cannot be null");
    }

    if (!builder.hasOwnProperty("headers")) {
      throw new TypeError("Builder.headers cannot be null");
    }

    var headers = Object.getOwnPropertyNames(builder.headers);

    if (headers.length == 0) {
      throw new TypeError("Builder.headers is empty. It should be filled");
    }

    return {
      /**
       * Bind element to ezTable instance
       * @param element {HTMLTableElement} Which element
       * @param element {string} Which element's id
       */
      bind: function (element) {
        if (element instanceof HTMLTableElement) {
          return builder.el = element;
        }

        builder.el = document.getElementById(element);
        if (!builder.el) {
          throw new Error("Empty element");
        }
      },

      /**
       * Load items.
       * @param items
       */
      load: function (items) {
        if (items instanceof Array) {
          builder.items = items;
        } else {
          builder.items = [items];
        }
      },

      render: function () {
        if (builder.items == null) {
          throw new Error("You didn't load any item");
        }

        if(builder.el == null) {
          throw new Error("You didn't bind any element");
        }

        // clear the children
        while (builder.el.firstChild) {
          builder.el.removeChild(builder.el.firstChild);
        }

        // create thead
        var thead = document.createElement("thead");

        // create headers
        headers.forEach(function(head) {
          var header = builder.headers[head];

          var th = document.createElement("th");
          th.innerText = header.title || head;
          thead.appendChild(th);
        });
        builder.el.appendChild(thead);

        // create tbody
        var tbody = document.createElement("tbody");

        // create elements
        builder.items.forEach(function (item) {
          // create row
          var tr = document.createElement("tr");

          // for each header
          headers.forEach(function(headerName) {
            // create alias of header object
            var header = builder.headers[headerName];
            
            // create column
            var td = document.createElement("td");

            if(header.onPrint) {
              td.innerText = header.onPrint(item);
            } else {
              td.innerText = item[headerName];
            }

            tr.appendChild(td);
          });

          tbody.appendChild(tr);
        });

        builder.el.appendChild(tbody);
      }
    }
  }

  /* BROWSER INTEGRATION */
  if (typeof window !== "undefined") {
    return window.ezTable = ezTable;
  }

  if (typeof module.exports !== "undefined") {
    return module.exports = ezTable;
  }

  define(function () {
    return ezTable;
  });
})();