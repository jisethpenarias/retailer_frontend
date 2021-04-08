async function login() {
    const loginValue = document.getElementById("Uname").value;
    const passwordValue = document.getElementById("Pass").value;

    if (loginValue == '') {
        alert("Please enter user name.");
    }
    if (passwordValue == '') {
        alert("Enter the password");
    }
    if (loginValue != '' || passwordValue != '') {
        const response = await fetch("http://localhost:8000/api-token-auth/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ username:loginValue, password: passwordValue})
        })
        const token = await response.json()
        if(response.status === 200){
            localStorage.setItem('accessToken', token.token);
            window.location.href = "http://127.0.0.1:5500/frontend/users.html";
        }
        
    }
}
