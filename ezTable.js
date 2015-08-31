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
       * Loads items.
       * @param items
       * @example
       * load([{..}, {..}]);
       *
       * load({
       *  url: "http::...",
       *  method: "GET"
       * });
       *
       * load({
       *  url: "http...",
       *  method: "POST",
       *  headers: {
       *    "Content-type": "application/x-www-form-urlencoded"
       *  },
       *  data: "name=hey&surname=you", // or FormData etc..
       *  onLoad: function() {
       *    console.log("loaded!");
       *  }
       * });
       */
      load: function (items) {
        if (items instanceof Array) { // if items is array then
          builder.items = items; // just load as is
          return;
        }

        if (items.url && items.method) { // if item has url and method properties then
          var that = this; // create alias for this
          var xmlHttpRequest = new XMLHttpRequest(); // create ajax request
          xmlHttpRequest.onreadystatechange = function () { // when request changes
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) { // when request complete
              if (xmlHttpRequest.responseType == "application/json") { // if request's content-type is application/json
                var data = JSON.parse(xmlHttpRequest.responseText);  // parse response

                if (items.onLoad) { // if onLoad property is exists
                  items.onLoad(data, xmlHttpRequest); // call it with data and xmlHttpRequest
                }

                that.load(data); // then load the data
              } else { // if request's content-type isn't application/json then
                throw new Error("Only application/json supported!"); // throw some error
              }
            }
          };
          xmlHttpRequest.open(items.method, items.url, true); // open async request for url with method

          if (items.headers) { // if headers property is exists
            Object.getOwnPropertyNames(items.headers).forEach(function (headerName) { // for every header
              xmlHttpRequest.setRequestHeader(headerName, items.headers[headerName]); // set xmlHttpRequest's header as same as programmer whats.
            });
          }

          if (items.data) { // if data property is exists
            xmlHttpRequest.send(items.data); // send with data
          } else { // not exists
            xmlHttpRequest.send(); // send with nothing.
          }
        } else {
          builder.items = [items];
        }
      },

      /**
       * Removes item from item list.
       * @param item which item will be deleted.
       * @returns {boolean} is it removed successfully?
       */
      remove: function (item) {
        if (builder.items) { // is items created
          return builder.items.some(function (e, i) { // check every items
            if (e == item) { // if item is same as e
              if (builder.render) { // if rendered before then
                Array.prototype.slice.call(builder.el.tbodyElement.children).some(function (child) { // check for items
                  if (child.item == item) { // if child.item same as item
                    builder.el.tbodyElement.removeChild(child); // remove the tr element (row)
                    return true; // stop the "some"
                  }
                });
              }

              delete builder.items[i]; // remove the item
              return true; // stop the "some"
            }
          });
        }

        return false;
      },

      add: function (item) {
        if (!builder.items) {
          builder.items = [item];
        }

        if (builder.render) {
          this.render();
        }
      },

      /**
       * Clears items.
       * @returns {boolean} is it cleared successfully?
       */
      clear: function () {
        if (builder.items) {
          while (builder.pop()) {
            // remove every element from list.
          }
          return builder.items.length == 0;
        }

        builder.items = [];
        return true;
      },

      /**
       * Renders to bound element
       */
      render: function () {
        if (builder == null) {  // check for null
          throw new Error("Builder can't be null");
        }

        if (builder.items == null) { // check items for null
          throw new Error("You didn't load any item");
        }

        if (builder.el == null) { // check element for null
          throw new Error("You didn't bind any element");
        }

        while (builder.el.firstChild) { // clear the children
          builder.el.removeChild(builder.el.firstChild);
        }

        builder.render = false; // render complete?

        var theadElement = document.createElement("thead"); // create thead

        headers.forEach(function (head) { // create headers
          var header = builder.headers[head];

          var thElement = document.createElement("th");
          thElement.innerText = header.title || head;

          if (header.style) {
            Object.getOwnPropertyNames(header.style).forEach(function (styleName) {
              thElement.style[styleName] = header.style[styleName];
            });
          }


          theadElement.appendChild(thElement);
        });
        builder.el.appendChild(theadElement);


        var tbodyElement = document.createElement("tbody"); // create tbody

        builder.items.forEach(function (item) { // create elements
          var trElement = document.createElement("tr"); // create row
          trElement.item = item;

          headers.forEach(function (headerName) {  // for each header
            var header = builder.headers[headerName]; // create alias of header object

            var tdElement = document.createElement("td"); // create column

            if (headerName == "buttons") { // if header is buttons
              var buttonTableElement = document.createElement("table"); // create table for buttons

              builder.buttons.forEach(function (button) { // for each button in builder
                var buttonTdElement = document.createElement("td"); // create column

                var buttonElement = document.createElement("button"); // create button

                if (button.icon) { // if icon defined
                  buttonElement.innerHTML = '<img src="{0}">'.replace("{0}", button.icon); // print icon
                  buttonElement.title = button.title; // over text
                } else if (button.title) { // if title defined
                  buttonElement.innerText = button.title; // print title
                } else { // if both are empty then
                  button.innerText = "&nbsp;"; // print space
                }

                if (button.onClick) { // if onClick defined
                  buttonElement.onclick = function (e) { // bind the event
                    button.onClick(item, e);
                  };
                }

                buttonTdElement.appendChild(buttonElement);
                buttonTableElement.appendChild(buttonTdElement);
              });

              tdElement.appendChild(buttonTableElement);
            } else { // if
              if (header.onPrint) {
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
        builder.el.tbodyElement = tbodyElement;
        builder.render = true;
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