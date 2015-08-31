var garage = [
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
      id:   2,
      name: "Sadettin YAVUZ"
    },
    date:  new Date("2015-08-28 14:34")
  }
];

// generate part
garageTable.bind("garageTable"); // bind the table
garageTable.load(garage); // load objects (clears old ones if exists)
garageTable.render(); // clears table if exists, then put rows
/*

garageTable.load({
  url: "api/garage/all",
  method: "GET"
});
 */