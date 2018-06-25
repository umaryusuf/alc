

// Select elements from the dom
// const amount = parseFloat(document.querySelector('#amount'));
// const output = document.querySelector('#output');
// let from = document.querySelector('#from');
// let to = document.querySelector('#to');


const convertCurrency = (amount, from, to, cb) => {
  from = encodeURIComponent(from);
  to = encodeURIComponent(to);
  const query = `${from}_${to}`;

  const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`;

  fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data[query]);
    })
    .catch(e => {
      cb(e)
    })
}

convertCurrency(100, 'USD', 'NGN');


