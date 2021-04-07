
var ordersRetrieved = [];
var ordersFiltered = [];

fetch("http://127.0.0.1:8000/users/")
  .then(response => response.json())
  .then(users => {
    usersRetrieved = users;
    table(usersRetrieved);
  }
  );

table = (users) => {
  const tableContent = document.querySelector("#retailer-characters");
  // console.log(orders)
  tableContent.innerHTML = ''
  for (let user of users) {
    tableContent.innerHTML += `
        <tr>
          <td>${user.user_id}</td>
          <td>${user.name}</td>
          <td>${user.last_name}</td>
          <td>${user.gov_id}</td>
          <td>${user.email}</td>
          <td>${user.company}</td>
        </tr>
      `
  }
}

search = () => {
  const serachValue = document.getElementById('input-search').value;
  if (serachValue == '') {
    alert('The search data cannot be empty');
    return;
  }

  usersFiltered = usersRetrieved.filter(user => 
    user.name.toLowerCase().includes(serachValue.toLowerCase()) ||
    user.last_name.toLowerCase().includes(serachValue.toLowerCase()) ||
    user.email.toLowerCase().includes(serachValue.toLowerCase()) ||
    user.user_id.toString().toLowerCase().includes(serachValue.toLowerCase()) ||
    user.gov_id.toString().toLowerCase().includes(serachValue.toLowerCase())
    );
  table(usersFiltered)
}

clearFilter = () => {
  document.getElementById('input-search').value = '';
  table(usersRetrieved);
}
