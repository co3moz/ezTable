window.garageTable = ezTable({
  headers: {
    car:   {
      title:   'Car Information',
      onPrint: function (o) {
        return [o.car.brand, o.car.model, o.car.year].join(" ");
      },
      style: {
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
      onClick: function(o, e) {
        alert(o.owner.name);
      }
    },

    {
      title: 'go',
      icon: 'assets/img/go.png',
      onClick: function(o) {
        console.log(o.owner.name);
        garageTable.remove(o);
      }
    }
  ]
});