import "./style.css";
import { updateView } from "./map";
import { memoize } from "./helper";
/* function to retrieve ip or domain info
@params ip : type Strig
 */
const getIpInfo = async (ip) => {
  let sectionWrapper = document.querySelector(".section__form");
  sectionWrapper.classList.add("loading");
  try {
    let ipData = await fetch(`http://ip-api.com/json/${ip}`)
      .then((res) => res.json())
      .then((data) => data);
    sectionWrapper.classList.remove("loading");
    return ipData;
  } catch (err) {
    sectionWrapper.classList.remove("loading");
    return err;
  }
};

/*
  info display
  @params data : type Object {query,region,country,isp}
*/
function displayInfo(data) {
  let infoContainer = document.querySelector(".info_overlay_container");
  let infoHtml = ` <div class="info_overlay_header">
            <h3>Showing results for ${data.query}</h3>
            <button class="ino_toggle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="info_container">
            <ul>
              <li>
                <p>Region</p>
                <p>${data.region}</p>
              </li>
              <li>
                <p>Country</p>
                <p>${data.country}</p>
              </li>
              <li>
                <p>ISP</p>
                <p>${data.isp}</p>
              </li>
            </ul>
          </div>`;
  infoContainer.innerHTML = infoHtml;
  tooggleInfoDisplay();
}
// info overlay display toggle function
function tooggleInfoDisplay() {
  let toggleWrapper = document.querySelector(".info_overlay");
  if (toggleWrapper.classList.contains("active")) {
    toggleWrapper.classList.remove("active");
    toggleWrapper.style.opacity = "0";
    setTimeout(() => {
      toggleWrapper.style.display = "none";
    }, 0);
  } else {
    toggleWrapper.style.display = "block";
    setTimeout(() => {
      toggleWrapper.classList.add("active");
      toggleWrapper.style.opacity = "1";
    }, 0);
  }
}
/* displaying error 
 @params message : type String
         display : type boolean
*/
function displayError(message = "", display = true) {
  let error_box = document.querySelector(".error_box");
  let error_message = document.querySelector(".error_message");
  if (display) {
    error_box.classList.add("error");
    error_message.textContent = message;
  } else {
    error_box.classList.remove("error");
  }
}

// form submission handler
async function submissionHandler(e) {
  e.preventDefault();
  let ip = this.querySelector("[name='ip']").value;
  let ipValid = ip.trim().length > 6 ? true : false;
  if (!ipValid) {
    displayError("Invalid I.P or Domain");
    return;
  } else {
    displayError("", false);
    try {
      let data = await getIpInfo(ip);
      data.status == "success"
        ? updateData(data)
        : displayError("Invalid Domain or IP");
    } catch (err) {
      displayError("Invalid Domain or IP");
    }
  }
}

// update data
function updateData(data) {
  displayInfo(data);
  updateView({ lat: data.lat, long: data.lon });
}
// ataching listeners
let ipForm = document.querySelector(".section__form form");

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("ino_toggle") ||
    e.target.closest(".ino_toggle")
  ) {
    tooggleInfoDisplay();
  }
});
ipForm.addEventListener("submit", submissionHandler);
