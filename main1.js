
let token = "";
let role = "";
let username = "";

function showLoginForm(userType) {
    document.getElementById('userSelectionContainer').style.display = 'none';
    document.getElementById(`${userType}LoginContainer`).style.display = 'block';
}

// Student Login
document.getElementById('studentLoginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const user = document.getElementById('studentUsername').value;
    const password = document.getElementById('studentPassword').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/student/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);

        token = data.token;
        role = data.role;
        username = data.username;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        alert("Login Successful!");
        document.getElementById('studentLoginContainer').style.display = 'none';
        document.getElementById('outPassContainer').style.display = 'block'; // ✅ this line is needed

    } catch (err) {
        alert(err.message);
    }
});

// Warden Login
document.getElementById('wardenLoginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const user = document.getElementById('wardenUsername').value;
    const password = document.getElementById('wardenPassword').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/warden/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);

        token = data.token;
        role = data.role;
        username = data.username;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        alert("Warden Login Successful!");
        document.getElementById('wardenLoginContainer').style.display = 'none';
        document.getElementById('studentDetailsContainer').style.display = 'block';

        fetchAllRequests();

    } catch (err) {
        alert(err.message);
    }
});

// Student Submit Out-Pass
document.getElementById('outPassForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = localStorage.getItem("username");
    const studentId = document.getElementById('studentId').value;
    const department = document.getElementById('department').value;
    const reason = document.getElementById('reason').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    try {
        const res = await fetch('http://localhost:5000/api/outpass/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name, studentId, department, reason, date, time })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);

        alert("Out-Pass submitted successfully!");
        event.target.reset();

    } catch (err) {
        alert(err.message);
    }
});

// Warden View All Requests
async function fetchAllRequests() {
    try {
        const res = await fetch('http://localhost:5000/api/outpass/requests', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();
        const container = document.getElementById('studentDetails');
        if (!res.ok) throw new Error(data.msg);

        container.innerHTML = data.map(detail => `
            <div>
                <p><strong>Name:</strong> ${detail.name}</p>
                <p><strong>Student ID:</strong> ${detail.studentId}</p>
                <p><strong>Department:</strong> ${detail.department}</p>
                <p><strong>Reason:</strong> ${detail.reason}</p>
                <p><strong>Date:</strong> ${detail.date}</p>
                <p><strong>Time:</strong> ${detail.time}</p>
                <p><strong>Status:</strong> ${detail.status}</p>
                <button onclick="updateStatus('${detail._id}', 'approved')">Approve</button>
                <button onclick="updateStatus('${detail._id}', 'disapproved')">Disapprove</button>
                <hr>
            </div>
        `).join('');
    } catch (err) {
        alert(err.message);
    }
}

// Warden Update Request Status
window.updateStatus = async function (id, status) {
    try {
        const res = await fetch(`http://localhost:5000/api/outpass/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ status })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);

        alert("Status updated!");
        fetchAllRequests();
    } catch (err) {
        alert(err.message);
    }
}
