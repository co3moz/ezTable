window.garageTable = ezTable({
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
      title: 'Garage In'
    },

    buttons: {
      title: ''
    }
  },

  controls: {}
});