export async function memoize(ip, fn) {
  let checkStorage = localStorage.getItem("ip_values");
  let response;
  if (checkStorage) {
    let data = JSON.parse(checkStorage).find((el) => el["google.com"]);
    if (data) {
      response = data;
    } else {
      response = await fn(ip);
    }
  } else {
    let ip_values = JSON.stringify([{ "google.com": {} }]);
    localStorage.setItem("ip_values", ip_values);
  }
}
memoize();
