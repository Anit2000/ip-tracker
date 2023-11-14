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
      storedData.unshift({ [ip]: response })
      localStorage.setItem("ip_values", JSON.stringify(storedData))
    }
  } else {
    response = await fn(ip);
    localStorage.setItem("ip_values", JSON.stringify([{ [ip]: response }]));
  }
  return response;
}

