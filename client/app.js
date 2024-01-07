const fileList = document.getElementById('fileList');
fetch(`http://localhost:3003/file_list`, {
  headers: { Accept: `application/json` },
  method: 'GET',
})
  .then((res) => {
    console.log(res);
    if (res.status >= 400) {
      return Promise.reject(new Error(`Got status ${res.status}`));
    }
    return res.json();
  })
  .then((resData) => {
    let table = `<table><tr><td> File List </td><td> Upload time </td></tr>`;
    resData.forEach((data) => {
      const timestamps = data.match(/([0,9])\w+/g);
      const t = timestamps[0];
      const date = new Date(Number(t));
      table += `<tr><td> ${data} </td><td> ${date} </td></tr>`;
    });
    table += `</table>`;
  })
  .catch((err) => {
    alert(err);
  });

const uploadFile = () => {
  const input = document.querySelector('input[type="file"]');
  const formData = new FormData();
  formData.append('file', input.files[0]);

  fetch(`http://localhost:3003/upload`, {
    headers: { Accept: `application/json` },
    method: 'POST',
    body: formData,
  })
    .then((res) => {
      if (res.status >= 400) {
        return Promise.reject(new Error(`Got status ${res.status}`));
      }
      return res.text();
    })
    .then((result) => {
      alert(result);
    })
    .catch((err) => {
      alert(err);
    });
};
