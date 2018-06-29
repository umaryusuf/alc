window.addEventListener('DOMContentLoaded', function() {

  // Select elements from the dom
  const form = document.querySelector('#myForm');
  const amount = form.querySelector('#amount');
  const output = form.querySelector('#output');
  const from = form.querySelector('#from');
  const to = form.querySelector('#to');
  const error = form.querySelector('#error');
  const btn = form.querySelector('#convert');

  const dbPromise = idb.open('currencies', 1, function(upgradeDb) {
    let store = upgradeDb.createObjectStore('rates', { keyPath: 'pair' });
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

      from.innerHTML = temp;
      to.innerHTML = temp;
    })
    .catch(err => console.log(err));

  const convertCurrency = (amount, from, to, cb) => {
    from = encodeURIComponent(from);
    to = encodeURIComponent(to);
    const from_to = `${from}_${to}`;
    const to_from = `${to}_${from}`;
    //check from indexDB
    dbPromise.then(function(db) {
      let tx = db.transaction('rates');
      let keyValStore = tx.objectStore('rates');
      return keyValStore.get(from_to);
    }).then(function(val) {
      // check if it exist in rates db
      if(val) {
        // exist in db
        let total = (amount * val.rate);
        
        // display the result
        output.innerHTML = total;
      } else {
        // go online and fetch from the api
        const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${from_to},${to_from}&compact=ultra`;

        fetch(url)
          .then(res => {
            return res.json();
          })
          .then(data => {

            if(data) {
              let total;
              total = (amount * data[from_to]);
              // = Math.round(total * 100) / 100;

              //store in indexDB
              dbPromise.then(db => {
                let tx = db.transaction('rates', 'readwrite');
                let ratesStore = tx.objectStore('rates');

                ratesStore.put({ pair: from_to, rate: data[from_to] });
                ratesStore.put({ pair: to_from, rate: data[to_from] });

                return tx.complete;
              }).then(() => {
                console.log('Rates saved to database');
              });

              // display the result
              output.innerHTML = total;
            }
          })
          .catch(e => {
            console.log(e)
          }
        )
      }
    });
  }

  btn.addEventListener('click', () => {

    if(amount.value == '') {
      // display amount is empty
      error.innerHTML = 'Amount is empty';
      amount.classList.add('is-invalid');
    } else {
      convertCurrency(parseInt(amount.value), from.value, to.value);
    }
  });

});

