ezTable
===========

Yet another table generator library. Simple and expandable design. Automatic search, sort, edit handlers. Easy button handle.

installation
---------------

1. Download the ezTable.

> **Note:**
> Here some links
> [Compressed Version](http://)

> [Non-Compressed Version](http://)


instructions
-----------------------

### create a object that holds information about table.

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

### bind some element to garageTable

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

### load the data

#### 1. from array
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

#### 2. from api

```javascript
garageTable.load({
  url: "api/garage/all",
  method: "get",
  onLoad: function (data) {
    console.log("data arrived", data);
  }
});
```
