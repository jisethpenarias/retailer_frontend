// fetch("http://127.0.0.1:8000/users/all/")
//   .then(response => response.json())
//   .then(users => {
//     showCharacters(users);
//   } 
//   );

// showCharacters = users => {
//     const usersDiv = document.querySelector("#retailer-characters");
//     users.forEach(user => {
//     const userElement = document.createElement("p");
//     userElement.innerText = `name: ${user.name}`;
//     usersDiv.append(userElement);
//     });
// }

var ordersRetrieved = [];
var ordersFiltered = [];

fetch("http://127.0.0.1:8000/orders/1,2,3")
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
  fetch("http://127.0.0.1:8000/order/"+ order_id + "/shipping/detail/")
  .then(response => response.json())
  .then(shipping => {

    fetch("http://127.0.0.1:8000/order/"+ order_id + "/payment/detail/")
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

status
search = () => {
  const serachValue = document.getElementById('input-search').value;
  if (serachValue == '') {
    alert('el dato de busqueda no puede ser vacio');
    return;
  }

  ordersFiltered = ordersRetrieved.filter(order => order.user.toLowerCase().includes(serachValue.toLowerCase()));
  table(ordersFiltered)
}

clearFilter = () => {
  document.getElementById('input-search').value = '';
  table(ordersRetrieved);
}
