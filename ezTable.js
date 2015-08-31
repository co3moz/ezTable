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
        if (builder == null) {  // check for null
          throw new Error("Builder can't be null");
        }

        if (builder.items == null) { // check items for null
          throw new Error("You didn't load any item");
        }

        if(builder.el == null) { // check element for null
          throw new Error("You didn't bind any element");
        }

        while (builder.el.firstChild) { // clear the children
          builder.el.removeChild(builder.el.firstChild);
        }

        var theadElement = document.createElement("thead"); // create thead

        headers.forEach(function(head) { // create headers
          var header = builder.headers[head];

          var thElement = document.createElement("th");
          thElement.innerText = header.title || head;
          theadElement.appendChild(thElement);
        });
        builder.el.appendChild(theadElement);


        var tbodyElement = document.createElement("tbody"); // create tbody

        builder.items.forEach(function (item) { // create elements
          var trElement = document.createElement("tr"); // create row

          headers.forEach(function(headerName) {  // for each header
            var header = builder.headers[headerName]; // create alias of header object

            var tdElement = document.createElement("td"); // create column

            if(headerName == "buttons") { // if header is buttons
              builder.buttons.forEach(function(button) { // for each button in builder
                var buttonElement = document.createElement("button"); // create button

                if(button.icon) { // if icon defined
                  buttonElement.innerHTML = '<img src="{0}">'.replace("{0}", button.icon); // print icon
                } else if(button.title) { // if title defined
                  buttonElement.innerText = button.title; // print title
                } else { // if both are empty then
                  button.innerText = "&nbsp;"; // print space
                }

                if(button.onClick) { // if onClick defined
                  buttonElement.onclick = function(e) { // bind the event
                    button.onClick(item, e);
                  };
                }

                tdElement.appendChild(buttonElement);
              });
            } else { // if
              if(header.onPrint) {
                tdElement.innerText = header.onPrint(item);
              } else {
                tdElement.innerText = item[headerName];
              }
            }



            trElement.appendChild(tdElement);
          });

          tbodyElement.appendChild(trElement);
        });

        builder.el.appendChild(tbodyElement);
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