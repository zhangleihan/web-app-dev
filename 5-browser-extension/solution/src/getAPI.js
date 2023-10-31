// import fetch from "node-fetch";
const fetch = require("node-fetch");

const options = {
    method: 'GET',
    headers: {
      'auth-token': 'mZbhuVceywqEPFf892nWa2xVlN6HCrWn'
    },
  };
  
fetch('https://api-access.electricitymaps.com/2w97h07rvxvuaa1g/power-breakdown/latest', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));