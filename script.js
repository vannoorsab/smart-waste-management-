document.getElementById('binForm').addEventListener('submit', function (event) {
  event.preventDefault(); 

  const deviceId = document.getElementById('device_id').value;
  const location = document.getElementById('location').value;
  const timestamp = document.getElementById('timestamp').value;

  const requestData = {
      device_id: deviceId,
      location: location,
      timestamp: timestamp
  };

  fetch('https://us-central1-smart-waste-management-444504.cloudfunctions.net/checkBinAvailability', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
  })
  .then(response => response.json())
  .then(data => {
     
      const resultMessage = data.isAvailable ? 
          'Bin is available for occupancy!' : 
          `Error: ${data.message}`;
      
      document.getElementById('resultMessage').textContent = resultMessage;
  })
  .catch(err => {
      console.error('Error:', err);
      document.getElementById('resultMessage').textContent = 'Error fetching data. Please try again later.';
  });
});
