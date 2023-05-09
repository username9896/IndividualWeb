const API_URL = 'https://individualapidata.onrender.com';
const Sensor_URL = 'https://individualsensordata.onrender.com' 

// 'http://localhost:5000/api';
//'http://localhost:5003/sensorvalues';

$.get(`${API_URL}/api/lightdevices`)
  .then(response => {
    response.forEach(device => {
      $('#lightdevices tbody').append(`
      <tr>
        <td>${device.room}</td>
        <td>${device.devicename}</td>
        <td>${device.state}</td>
        <td style="background: ${device.color}"></td>
      </tr>`
      );
    });
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });

$.get(`${API_URL}/api/securitydevices`)
  .then(response => {
    response.forEach(device => {
      $('#securitydevices tbody').append(`
      <tr>
        <td>${device.room}</td>
        <td>${device.devicename}</td>
        <td>${device.state}</td>
      </tr>`
      );
    });
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });

$('#light-device').on('click', function () {
  const room = $('#user').val();
  const devicename = $('#name').val();
  const state = $('#state').val();
  const color = $('#color').val();

  const body = {
    room,
    devicename,
    state,
    color
  }

  $.post(`${API_URL}/api/lightdevices`, body)
    .then(response => {
      location.href = 'device-list.html';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
});

$('#remove-lightdevice').on('click', function () {
  const room = $('#user').val();
  const devicename = $('#name').val();
  const state = 'ON';

  const body = {
    room,
    devicename,
    state
  }

  $.post(`${API_URL}/api/removelightdevices`, body)
    .then(response => {
      location.href = 'device-list.html';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
});

$('#remove-securitydevice').on('click', function () {
  const room = $('#user').val();
  const devicename = $('#name').val();

  const body = {
    room,
    devicename
  }

  $.post(`${API_URL}/api/removesecuritydevices`, body)
    .then(response => {
      location.href = 'device-list.html';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
});

$('#security-device').on('click', function () {
  const room = $('#user').val();
  const devicename = $('#device').val();
  const state = $('#state').val();

  const body = {
    room,
    devicename,
    state
  }

  $.post(`${API_URL}/api/securitydevices`, body)
    .then(response => {
      location.href = 'device-list.html';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
});

$('#changelightdevicestate').on('click', function () {
  const room = $('#rooms').val();
  const state = $('#state').val();
  const color = $('#customColor').val();

  const body = {
    room,
    state,
    color
  };

  $.post(`${API_URL}/api/updatedevices`, body)
    .then(response => {
      location.href = 'device-list.html';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
});

$('#changesecuritydevicestate').on('click', function () {
  const room = $('#rooms').val();
  const devicename = 'LED';
  const state = $('#state').val();

  const body = {
    room,
    devicename,
    state
  };

  $.post(`${API_URL}/api/updatesecuritydevices`, body)
    .then(response => {
      location.href = 'device-list.html';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
});

let ultrasensordata = [];
let motionsensordata = [];
let motionsensorvaluedata = [];
let timedata = [];
let lastultraval = [];
let lastmotionval = [];
let lasttimeval = [];

$.get(`${Sensor_URL}/sensorvalues/sensor-values`)
  .then(response => {
    response.forEach(device => {
      ultrasensordata.push(device.ultradata);
    });

    response.forEach(device => {
      motionsensorvaluedata.push(device.motiondata);
    });

    response.forEach(device => {
      if (device.motiondata == 1) {
        motionsensordata.push('Motion detected');
      }
      if (device.motiondata == 0) {
        motionsensordata.push('No Motion detected');
      }
    });

    response.forEach(device => {
      timedata.push(device.date);
    });

    lastultraval = ultrasensordata.slice(-150);
    lastmotionval = motionsensordata.slice(-150);
    lasttimeval = timedata.slice(-150);

    for (let i = 0; i < lasttimeval.length; i++) {
      const newRow = $('<tr>');
      newRow.append(`<td>${lastultraval[i]}</td>`);
      newRow.append(`<td>${lastmotionval[i]}</td>`);
      newRow.append(`<td>${lasttimeval[i]}</td>`);
      $('#sensorvalues tbody').append(newRow);
    }

    let timechart = timedata.map(function (time) {
      let timeParts = time.split(":");
      let hours = parseInt(timeParts[0]);
      let minutes = parseInt(timeParts[1]);
      let seconds = parseInt(timeParts[2]);

      return Math.floor(minutes + seconds / 3600);
    });

    const numericYArray = ultrasensordata.map(val => parseFloat(val));

    Highcharts.chart('my-plot', {
      title: {
        text: 'Graph b/w tds value and time'
      },
      xAxis: {
        title: {
          text: 'Time (in hours)'
        },
        categories: timechart
      },
      yAxis: {
        title: {
          text: 'tds value'
        },
      },
      series: [{
        data: numericYArray
      }]
    });

    const numericYArray1 = motionsensorvaluedata.map(val => parseFloat(val));

    Highcharts.chart('plot', {
      title: {
        text: 'Graph b/w loadcell value and time'
      },
      xAxis: {
        title: {
          text: 'Time (in hours)'
        },
        categories: timechart
      },
      yAxis: {
        title: {
          text: 'Load cell value'
        },
      },
      series: [{
        data: numericYArray1
      }]
    });
  })