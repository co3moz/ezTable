ezTable
===========

Yet another table generator library. Simple and expandable design. Automatic search, sort, edit handlers. Easy button handle. 


content
---------------
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [installation
](#installation)
- [instructions
](#instructions)
    - [creating](#creating)
    - [binding](#binding)
    - [loading](#loading)
      - [load from api](#load-from-api)
      - [load from array](#load-from-array)
    - [rendering](#rendering)
- [code reference
](#code-reference)
    - [headers](#headers)
      - [title](#title)
      - [style](#style)
      - [rowStyle](#rowstyle)
      - [onPrint](#onprint)
      - [header.buttons](#headerbuttons)
    - [buttons](#buttons)
      - [title](#title-1)
      - [style](#style-1)
      - [icon](#icon)
      - [onClick](#onclick)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

installation
---------------

1. Download the ezTable.

> **Links:**
> * [Compressed Version](http://)
> * [Non-Compressed Version](http://)


instructions
-----------------------

#### creating
create a object that holds information about table.
```javascript
var garageTable = ezTable({
  headers: {
    car:   {
      title:   'Car Information',
      onPrint: function (o) {
        return [o.car.brand, o.car.model, o.car.year].join(" ");
      }
    },
    owner: {
      title:   'Owner Information',
      onPrint: function (o) {
        return o.owner.name;
      }
    },
    date:  {
      title: 'Garage In',

      onPrint: function (o) {
        return [o.date.getDate(), o.date.getMonth() + 1, o.date.getFullYear()].join("/") + ' ' + [o.date.getHours(), o.date.getMinutes()].join(":");
      }
    },

    buttons: {
      title: 'Controls'
    }
  },

  buttons: [
    {
      title: 'delete',
      icon: 'assets/img/delete.png',
      onClick: function(o) {
        garageTable.remove(o); // removes from list and table
      }
    },

    {
      title: 'go',
      icon: 'assets/img/go.png',
      onClick: function(o) {
        alert("you selected " + o.owner.name + "'s car");
      }
    }
  ]
});
```

_____________

#### binding
 
 bind some element to garageTable
 
```html
<div>
    <table id="garageTable">
</div>
```

```javascript
garageTable.bind("garageTable");
// or
// garageTable.bind(document.getElementById("garageTable"));
// garageTable.bind(document.getElementsByTagName("table")[0]);
```
_____________

#### loading

You can load from api or array. It's your choice.

##### load from api

> **Note:** api must return application/json.

```javascript
garageTable.load({
  url: "api/garage/all",
  method: "get",
  onLoad: function (data) {
    console.log("data arrived", data);
  }
});
```
##### load from array

```javascript
var data = [
  {
    id:    1,
    car:   {
      brand: "Toyota",
      model: "Corolla",
      year:  2014
    },
    owner: {
      id:   1,
      name: "Doğan DERYA"
    },
    date:  new Date("2015-08-27 10:04")
  },

  {
    id:    2,
    car:   {
      brand: "Toyota",
      model: "Verso",
      year:  2015
    },
    owner: {
      id:   -1,
      name: "Unknown Customer"
    },
    date:  new Date("2015-08-28 14:34")
  }
];

garageTable.load(data);
```
_____________

#### rendering

Just type

```javascript
garageTable.render();
```

That's all. Headers, Datas will be rendered in garageTable div.

code reference
------------------

#### headers

We easily define a header with headers section.
> **Note:** Headers can't be empty or null

```javascript
ezTable({
	headers: {
		...
	}
});
```

In header, we define properties as same as our data.  Let's examine this code.

```javascript
var table = ezTable({
	headers: {
		id: {
			
		}
	}
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>id</th>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
		</tr>
	</tbody>
</table>
```

##### title
We use this option, when we want to specify a name for header. Let's look.
```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity'
		}
	}
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
		</tr>
	</tbody>
</table>
```
##### style

Do you need to change style of title? Use this,
```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity',
			style: {
			    backgroundColor: "red"
			}
		}
	}
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th style="background-color: red;">identity</th>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
		</tr>
	</tbody>
</table>
```

##### rowStyle

Do you need to change style of rows? Use this,
```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity',
			rowStyle: {
			    backgroundColor: "red"
			}
		}
	}
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
	</thead>
	<tbody>
		<tr>
			<td style="background-color: red;">1</td>
		</tr>
	</tbody>
</table>
```

##### onPrint

Overrides printing operation. It has 1 argument that is printing object. You can change print data with just returning.

```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity',
			onPrint: function (object) {
			    return object.id * 10;
			}
		}
	}
});
table.bind("test");
table.load([{id: 1}, {id: 2}, {id: 3}]);
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
	</thead>
	<tbody>
		<tr>
			<td>10</td>
		</tr>
		<tr>
			<td>20</td>
		</tr>
		<tr>
			<td>30</td>
		</tr>
	</tbody>
</table>
```

##### headers.buttons

If we want to create control buttons for each of data, first we need to create `headers.buttons`.

```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity',
			onPrint: function (object) {
			    return object.id * 10;
			}
		},

		buttons: {
		    title: 'Control'
		}
	}
});
table.bind("test");
table.load([{id: 1}, {id: 2}, {id: 3}]);
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
		<th>Control</th>
	</thead>
	<tbody>
		<tr>
			<td>10</td>
			<td><table></table></td>
		</tr>
		<tr>
			<td>20</td>
			<td><table></table></td>
		</tr>
		<tr>
			<td>30</td>
			<td><table></table></td>
		</tr>
	</tbody>
</table>
```

#### buttons

After we create the [headers.buttons](#headersbuttons) now we need to create buttons section.

```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity'
		},

		buttons: {
		    title: 'Control'
		}
	},

	buttons: [
	    {}
	]
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
		<th>Control</th>
	</thead>
	<tbody>
		<tr>
			<td>10</td>
			<td>
                <table>
                    <td>
                        <button></button>
                    </td>
                </table>
			</td>
		</tr>
	</tbody>
</table>
```

##### title

If we want to name the buttons, we use title property.

```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity'
		},

		buttons: {
		    title: 'Control'
		}
	},

	buttons: [
	    {
	        title: 'Hey!'
	    }
	]
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
		<th>Control</th>
	</thead>
	<tbody>
		<tr>
			<td>10</td>
			<td>
                <table>
                    <td>
                        <button>Hey!</button>
                    </td>
                </table>
			</td>
		</tr>
	</tbody>
</table>
```

##### style

Do you need to change style of button? Use this,

```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity'
		},

		buttons: {
		    title: 'Control'
		}
	},

	buttons: [
	    {
	        title: 'Hey!',
	        style: {
	            backgroundColor: "red"
	        }
	    }
	]
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
		<th>Control</th>
	</thead>
	<tbody>
		<tr>
			<td>10</td>
			<td>
                <table>
                    <td>
                        <button style="background-color: red;">Hey!</button>
                    </td>
                </table>
			</td>
		</tr>
	</tbody>
</table>
```

##### icon

If you simply want to show icon? then you are in right place.

> **Note:** icon makes title hidden. title can only be seen by hover button.

```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity'
		},

		buttons: {
		    title: 'Control'
		}
	},

	buttons: [
	    {
	        title: 'Hey!',
	        icon: 'assets/blabla.jpg'
	    }
	]
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
		<th>Control</th>
	</thead>
	<tbody>
		<tr>
			<td>10</td>
			<td>
                <table>
                    <td>
                        <button title="Hey!"><img src="assets/blabla.jpg"></button>
                    </td>
                </table>
			</td>
		</tr>
	</tbody>
</table>
```

##### onClick

this property handles click event. It has 2 arguments which first one is object that clicked, second one is click handlers.


```javascript
var table = ezTable({
	headers: {
		id: {
			title: 'identity'
		},

		buttons: {
		    title: 'Control'
		}
	},

	buttons: [
	    {
	        title: 'Hey!',
	        icon: 'assets/blabla.jpg',
	        onClick: function (object) {
	            alert("You clicked #" + object.id);
	        }
	    }
	]
});
table.bind("test");
table.load({id: 1});
table.render();
```
generates this,
```html
<table>
	<thead>
		<th>identity</th>
		<th>Control</th>
	</thead>
	<tbody>
		<tr>
			<td>10</td>
			<td>
                <table>
                    <td>
                        <button title="Hey!"><img src="assets/blabla.jpg"></button>
                    </td>
                </table>
			</td>
		</tr>
	</tbody>
</table>
```
