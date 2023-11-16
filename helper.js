/* 
  function to store response to prevent excess network calls
  @params ip : type String
          fn : type Function
*/
export async function memoize(ip, fn) {
  let checkStorage = localStorage.getItem("ip_values");
  let response;
  if (checkStorage) {
    let storedData = JSON.parse(checkStorage)
    let data = storedData.find((el) => el[ip]);
    if (data) {
      response = data[ip];
    } else {
      response = await fn(ip);
      if (response.status == 'success') {
        storedData.unshift({ [ip]: response })
        localStorage.setItem("ip_values", JSON.stringify(storedData));
        loadSearch();
      }
    }
  } else {
    response = await fn(ip);
    localStorage.setItem("ip_values", JSON.stringify([{ [ip]: response }]));
    loadSearch();
  }
  return response;
}

export function loadSearch() {
  let checkStorage = localStorage.getItem("ip_values");
  let searchContainer = document.querySelector(".history_content");
  if (checkStorage) {
    let data = JSON.parse(checkStorage);
    let html = data.map(el => `<li data-role="history-load" data-value="${Object.keys(el)[0]}">${Object.keys(el)[0]}</li>`).join("");
    searchContainer.innerHTML = data.length > 1 ? html : '<p>No recent searches found</p>';
  } else {
    searchContainer.innerHTML = '<p>No recent searches found</p>';
  }
}