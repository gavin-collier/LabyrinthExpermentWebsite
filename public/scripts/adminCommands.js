document.addEventListener("DOMContentLoaded", function (e) {

});

async function createNewUser() {
    var password = document.getElementById('pwd');
    var newUserFname = document.getElementById('fname');
    var newUserLname = document.getElementById('lname');

    try {
        await fetch('/admin/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Admin-Key': password.value
        },
        body: JSON.stringify({ firstname: newUserFname.value, lastname: newUserLname.value }),
        });    
    } catch (error) {
        console.error(error);
    }
}