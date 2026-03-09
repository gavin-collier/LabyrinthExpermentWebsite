async function login() {
    var fname = document.getElementById('fname');
    var lname = document.getElementById('lname');
    var username = document.getElementById('username');

    try {
        const responce = await fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname: fname.value, lastname: lname.value }),
        });

        const data = await responce.json();
        console.log(data);
        username.innerHTML = data.user.id;
    } catch (error) {
        console.error(error);
    }
}

async function checkSession() {
    try {
        const responce = await fetch('/checkSession', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
        });
        const data = await responce.json();

        console.log(data);
        username.innerHTML = data.user.id;
    } catch (error) {
        console.error(error);
    } 
}

document.addEventListener("DOMContentLoaded", function (e) {
    checkSession();
});
