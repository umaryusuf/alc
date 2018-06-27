(function() {

  // Select elements from the dom
  const form = document.querySelector('#myForm');
  const amount = form.querySelector('#amount');
  const output = form.querySelector('#output');
  const from = form.querySelector('#from');
  const to = form.querySelector('#to');
  const btn = form.querySelector('#convert');

  // If the browser doesn't support service worker,
  // we don't care about having a database
  // exchange rate = (Math.round(currency*getAmount() * 100) / 100)

  // {
  //   "USD_PHP": {
  //   "val": 53.519717
  //   }
  // }

  const dbPromise = idb.open('currencies-db', 1, function(upgradeDb) {
    let store = upgradeDb.createObjectStore('currencies');
    //store.createIndex('by-query');
  });

  const currencyUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';
  fetch(currencyUrl)
    .then(res => res.json())
    .then( data => {
      let temp = '';

      Object.values(data.results).map(currency => {
        temp += `
          <option value="${currency['id']}">${currency['id']} - ${currency['currencyName']}</option>
        `;
      });

      document.querySelector('#from').innerHTML = temp;
      document.querySelector('#to').innerHTML = temp;
    })
    .catch(err => console.log(err));

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
        let val = (amount * data[query].val);
        console.log(val);
        output.innerHTML = val;
      })
      .catch(e => {
        console.log(e)
      })
  }

  btn.addEventListener('click', () => {
    let error = false;

    if(amount.value == '') {
      // display amount is empty
      alert('amount is empty');
    } else {
      convertCurrency(parseInt(amount.value), from.value, to.value);
    }

  });

})();

