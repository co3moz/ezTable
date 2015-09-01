var localData = [
  {
    "id":    1,
    "car":   {
      "brand": "Toyota",
      "model": "Corolla",
      "year":  2014
    },
    "owner": {
      "id":   1,
      "name": "Doğan DERYA"
    },
    "date":  "2015-08-27 10:04"
  },

  {
    "id":    2,
    "car":   {
      "brand": "Toyota",
      "model": "Verso",
      "year":  2015
    },
    "owner": {
      "id":   1,
      "name": "Doğan DERYA"
    },
    "date":  "2015-08-28 20:04"
  }
];

var garageTable = new ezTable({
  headers: {
    car:   {
      title:   'Car Information',
      onPrint: function (o) {
        return [o.car.brand, o.car.model, o.car.year].join(" ");
      },
      style:   {
        backgroundColor: "red"
      },

      rowStyle: {
        backgroundColor: "blue"
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
        if (!(o.date instanceof Date)) {
          o.date = new Date(o.date);
        }

        return [o.date.getDate(), o.date.getMonth() + 1, o.date.getFullYear()].join("/") + ' ' + [o.date.getHours(), o.date.getMinutes()].join(":");
      }
    },

    buttons: {
      title: 'Controls'
    }
  },

  buttons: [
    {
      title:   'delete',
      icon:    'assets/img/delete.png',
      onClick: function (o, e) {
        garageTable.remove(o);
      }
    },

    {
      title:   'go',
      icon:    'assets/img/go.png',
      onClick: function (o) {
        alert(o.owner.name);
      }
    }
  ]
});

// generate part
garageTable.bind("garageTable"); // bind the table
/*
 yes, u can!

 garageTable.load({
   url:    "assets/data.json",
   method: "GET",
   swear:  false,

   onLoad: function () {
     console.log("data.json loaded");
     garageTable.render();
   }
 });
 */
garageTable.load(localData);
garageTable.render();