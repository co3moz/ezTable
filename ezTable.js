/**
 * ezTable constructor.
 * @class
 * @param {Object} builder Table building object
 */
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

  /**
   * Bind element to ezTable instance
   *
   * @param element {HTMLTableElement|String} Which element
   * @returns {ezTable} returns the table
   * @example
   * table.bind("yourTable");
   *
   * @example
   * table.bind(document.getElementById("yourTable"));
   *
   * @example
   * table.bind($("#yourTable")[0]);
   */
  this.bind = function (element) {
    if (element instanceof HTMLTableElement) {
      builder.el = element;
      return this;
    }

    builder.el = document.getElementById(element);
    if (!builder.el) {
      throw new Error("Empty element");
    }

    return this;
  };

  /**
   * Loads items.
   * @function
   * @param {Array} items Which items will be loaded.
   * @param {Object} items Which object will be loaded. (url and method exists then, xmlHttpRequest will be triggered)
   * @returns {ezTable} returns the table
   * @example
   * load([{..}, {..}]);
   *
   * @example
   * load({
       *  url: "http::...",
       *  method: "GET"
       * });
   *
   * @example
   * load({
       *  url: "http...",
       *  method: "POST",
       *  headers: {
       *    "Content-type": "application/x-www-form-urlencoded"
       *  },
       *  data: "name=hey&surname=you", // or FormData etc..
       *  onLoad: function() {
       *    console.log("loaded!");
       *  },
       *  swear: true, // don't check responseType
       * });
   */
  this.load = function (items) {
    if (items instanceof Array) { // if items is array then
      builder.items = items; // just load as is
      return this;
    }

    if (items.url && items.method) { // if item has url and method properties then
      var that = this; // create alias for this
      var xmlHttpRequest = new XMLHttpRequest(); // create ajax request
      xmlHttpRequest.onreadystatechange = function () { // when request changes
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) { // when request complete
          if (items.swear || xmlHttpRequest.getResponseHeader("content-type") == "application/json") { // if request's content-type is application/json
            var data = JSON.parse(xmlHttpRequest.responseText);  // parse response

            that.reload = function () {
              that.load(items);
            };

            that.load(data); // then load the data

            if (items.onLoad) { // if onLoad property is exists
              items.onLoad(data, xmlHttpRequest); // call it with data and xmlHttpRequest
            }

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

    return this;
  };

  /**
   * Removes item from item list.
   * @param {Object} item which item will be deleted.
   * @returns {Boolean} is it removed successfully?
   *
   * @example
   * ...
   * onClick: function (object) { // delete button's click handler
       *  if (confirm("delete?")) {
       *    table.remove(object);
       *  }
       * }
   * ...
   */
  this.remove = function (item) {
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
  };


  /**
   * Adds item to item list. if you rendered before, it renders again
   * @param {Object} item which item will be added
   *
   * @example
   * ...
   * table.add({id: 1, car: {plate: "AZ 4123"}});
   * ...
   */
  this.add = function (item) {
    if (!builder.items) {
      builder.items = [item];
    }

    if (builder.render) {
      this.render();
    }
  };


  /**
   * Clears items from core array. It won't effect the table.
   * @returns {boolean} is it cleared successfully?
   *
   * @example
   * // only headers will remain.
   * table.clear();
   * table.render();
   */
  this.clear = function () {
    if (builder.items) {
      while (builder.items.pop()) {
        // remove every element from list.
      }
      return builder.items.length == 0;
    }

    builder.items = [];
    return true;
  };


  /**
   * Renders to bound element
   *
   * @example
   * table.bind(...);
   * table.load(...);
   * table.render();
   */
  this.render = function () {
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


    /*
     * Header creation
     */

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


    /*
     * Body creation
     */

    var tbodyElement = document.createElement("tbody"); // create tbody

    builder.items.forEach(function (item) { // create elements
      var trElement = document.createElement("tr"); // create row
      trElement.item = item;

      headers.forEach(function (headerName) {  // for each header
        var header = builder.headers[headerName]; // create alias of header object

        var tdElement = document.createElement("td"); // create column

        /*
         * Button creation
         */

        if (headerName == "buttons") { // if header is buttons
          var buttonTableElement = document.createElement("table"); // create table for buttons

          if (builder.buttons) {
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

              if (button.style) { // if style defined
                Object.getOwnPropertyNames(button.style).forEach(function (styleName) {
                  buttonElement.style[styleName] = button.style[styleName];
                });
              }

              buttonTdElement.appendChild(buttonElement);
              buttonTableElement.appendChild(buttonTdElement);
            });
          }

          tdElement.appendChild(buttonTableElement);
        } else {

          /*
           * Text data creation
           */

          if (header.onPrint) {
            tdElement.innerText = header.onPrint(item);
          } else {
            tdElement.innerText = item[headerName];
          }

          if (header.rowStyle) {
            Object.getOwnPropertyNames(header.rowStyle).forEach(function (styleName) {
              tdElement.style[styleName] = header.rowStyle[styleName];
            });
          }
        }

        trElement.appendChild(tdElement);
      });

      tbodyElement.appendChild(trElement);
    });

    // append things.
    builder.el.appendChild(theadElement);
    builder.el.appendChild(tbodyElement);
    builder.el.tbodyElement = tbodyElement;
    builder.render = true;
  };
}

window.ezTable = ezTable;