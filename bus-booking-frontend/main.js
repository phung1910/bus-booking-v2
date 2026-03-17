const apiUrl = 'http://localhost:5000/api/buses';

async function fetchBuses() {
    try {
        const response = await fetch(apiUrl);
        const buses = await response.json();
        
        const tbody = document.getElementById('busTableBody');

        buses.forEach(bus => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${bus.id}</td>
                <td>${bus.bus_number}</td>
                <td>${bus.capacity}</td> 
                <td>${bus.bus_type}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

document.getElementById('busForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    const newBus = {
        bus_number: document.getElementById('busNumber').value,
        capacity: document.getElementById('capacity').value,
        bus_type: document.getElementById('busType').value
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBus) 
        });

        if (response.ok) {
            alert('Thêm xe buýt thành công!');
            document.getElementById('busForm').reset(); 
            fetchBuses();
        } else {
            alert('Lỗi: Không thể thêm xe (Có thể trùng biển số)');
        }
    } catch (error) {
        console.error('Lỗi gửi dữ liệu:', error);
    }
});

fetchBuses();