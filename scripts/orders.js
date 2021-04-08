
var ordersRetrieved = [];
var ordersFiltered = [];

fetch("http://127.0.0.1:8000/orders/1,2,3",{
    headers: {
    'Authorization': 'Token ' + localStorage.getItem('accessToken')
    }
  })
  .then(response => response.json())
  .then(orders => {
    ordersRetrieved = orders;
    table(ordersRetrieved);
  }
  );

table = (orders) => {
  const tableContent = document.querySelector("#retailer-characters");
  // console.log(orders)
  tableContent.innerHTML = ''
  for (let order of orders) {
    tableContent.innerHTML += `
        <tr>
          <td>${order.order_id}</td>
          <td>${order.user}</td>
          <td>${order.date}</td>
          <td>${order.paid}</td>
          <td>${order.subtotal}</td>
          <td>${order.taxes}</td>
          <td>${order.total}</td>
          <td onclick="openModal(`+order.order_id+`)"><i class="fa fa-search"></i></td>
        </tr>
      `
  }
}

openModal = (order_id) => {
  // console.log(order)
  fetch("http://127.0.0.1:8000/order/"+ order_id + "/shipping/detail/", 
  {headers: {
    'Authorization': 'Token ' + localStorage.getItem('accessToken')
  }})
  .then(response => response.json())
  .then(shipping => {

    fetch("http://127.0.0.1:8000/order/"+ order_id + "/payment/detail/", 
    {headers: {
      'Authorization': 'Token ' + localStorage.getItem('accessToken')
    }})
    .then(response => response.json())
    .then(payments => {

      var paymentsString = payments.map(payment => 
       "<tr>" +
          "<td>" + payment.payment_id + "</td>" +
          "<td>" + payment.type  + "</td>" +
          "<td>" + payment.date + "</td>" +
          "<td>" + payment.txn_id + "</td>" +
          "<td>" + payment.total + "</td>" +
          "<td>" + payment.status + "</td>" +
       "</tr>" 
      )

      var paymentTable = '<h2>Payment Details:</h2><br/>' +
      '<table class="styled-table">' +
      '<thead>' +
        '<tr>' +
          '<th>Payment Id</th>' +
          '<th>Type</th>' +
          '<th>Date</th>' +
          '<th>txn_id</th>' +
          '<th>Total</th>' +
          '<th>Status</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody id="retailer-characters">' +
        paymentsString
      '</tbody>' +
    '</table>'
       
      //console.log(shipping)
      modal.style.display = "block";
      var contentModal = document.getElementById("content-modal")
      contentModal.innerHTML = 

                    "<h2> Shipping Details: </h2><br/>" +
                    "Delivery Address: " + shipping.address +"<br></br>"+ 
                    "Delivery City: " + shipping.city +"<br></br>"+ 
                    "Delivery State: " + shipping.state +"<br></br>"+
                    "Delivery Country: " + shipping.country +"<br></br>"+
                    "Cost of shipping: " + shipping.cost +"<br></br>" + paymentTable       
    })
  })
}

async function search(){
  const serachValue = document.getElementById('input-search').value;
  const cityValue = document.getElementById('input-city').value;
  const stateValue = document.getElementById('input-state').value;
  const countryValue = document.getElementById('input-country').value;
  const dateStartValue = document.getElementById('date-start').value;
  const dateEndValue = document.getElementById('date-end').value;
  
  if (serachValue != '') {
    ordersFiltered = ordersRetrieved.filter(order => order.user.toLowerCase().includes(serachValue.toLowerCase()));
  }
  if (cityValue != '' && stateValue != '' &&  countryValue != '') {
    const responseOrdersShipping = await fetch("http://127.0.0.1:8000/orders/shipping/?city=" + cityValue +"&state=" + stateValue + "&country=" + countryValue, {
      headers: {
        'Authorization': 'Token ' + localStorage.getItem('accessToken')
      }
    })
    const responseOrdersShippingJson = await responseOrdersShipping.json()
    const notRepeated = ordersFiltered.filter(order => { 
      return responseOrdersShippingJson.some(f => {
        return f.order_id != order.order_id
      })
    })
    ordersFiltered = notRepeated.length === 0 ? ordersFiltered : notRepeated
    ordersFiltered = ordersFiltered.concat(responseOrdersShippingJson)
  }
  if (dateStartValue != '' || dateEndValue != '') {
    const responseDates = await fetch("http://127.0.0.1:8000/orders/" + dateStartValue + "-" + dateEndValue, {headers: {
      'Authorization': 'Token ' + localStorage.getItem('accessToken')
    }})
    const responseDatesJson = await responseDates.json()
    const notRepeatedDate = ordersFiltered.filter(order => { 
      return responseDatesJson.some(f => {
        return f.order_id != order.order_id
      })
    })
    ordersFiltered = notRepeatedDate.length === 0 ? ordersFiltered : notRepeatedDate
    ordersFiltered = ordersFiltered.concat(responseDatesJson)
  }

  table(ordersFiltered)
}

clearFilter = () => {
  document.getElementById('input-search').value = '';
  document.getElementById('input-city').value = '';
  document.getElementById('input-state').value = '';
  document.getElementById('input-country').value = '';
  document.getElementById('date-start').value = '';
  document.getElementById('date-end').value = '';
  table(ordersRetrieved);
}


logout = () => {
  window.location.href = 'http://127.0.0.1:5500/frontend/login.html';
  localStorage.setItem('accessToken', ''); 
}