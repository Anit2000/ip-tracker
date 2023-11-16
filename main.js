import { updateView, map } from "./map";
import { memoize, loadSearch } from "./helper";

/* load search */
loadSearch();
/* function to retrieve ip or domain info
@params ip : type Strig
 */
const getIpInfo = async (ip) => {
  let sectionWrapper = document.querySelector(".section__form");
  sectionWrapper.classList.add("loading");
  try {
    let ipData = await fetch(`https://api.ipapi.com/api/${ip}?access_key=${import.meta.env.VITE_API_TOKEN}`)
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
            <h3>Showing results for "${data.ip}"</h3>
          </div>
          <div class="info_container">
            <ul>
              <li>
                <p>Region</p>
                <p>${data.region_name}</p>
              </li>
              <li>
                <p>Country</p>
                <p>${data.country_name}</p>
              </li>
              <li>
                <p>ISP</p>
                <p>${data.connection.isp}</p>
              </li>
            </ul>
          </div>`;
  infoContainer.innerHTML = infoHtml;
  tooggleInfoDisplay();
}
// info overlay display toggle function
function tooggleInfoDisplay(display = true) {
  let toggleWrapper = document.querySelector(".info_overlay");
  let mapContainer = document.querySelector(".map__container");
  if (!display && toggleWrapper.classList.contains("active")) {
    toggleWrapper.classList.remove("active");
    toggleWrapper.style.opacity = "0";
    mapContainer.classList.remove("active");
    setTimeout(() => {
      toggleWrapper.style.display = "none";
    }, 0);
  } else if (display) {
    toggleWrapper.style.display = "block";
    setTimeout(() => {
      toggleWrapper.classList.add("active");
      toggleWrapper.style.opacity = "1";
      mapContainer.classList.add("active");
      map.invalidateSize(true);
      toggleWrapper.scrollIntoView({
        behavior: 'smooth'
      })
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
    tooggleInfoDisplay(false)
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
      let data = await memoize(ip, getIpInfo);
      console.log(data);
      !data.status
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
  updateView({ lat: data.latitude, long: data.longitude });
}

/* 
  searching fromn history
  @params ip : type String
*/
async function searchFromHistory(ip) {
  displayError("", false);
  try {
    let data = await memoize(ip, getIpInfo);
    !data.status
      ? updateData(data)
      : displayError("Invalid Domain or IP");
  } catch (err) {
    displayError("Invalid Domain or IP");
  }
}
// ataching listeners
let ipForm = document.querySelector(".section__form form");
let searchInput = ipForm.querySelector("input");
let clearbtn = ipForm.querySelector('[data-role="clear-search"]');
let historyToggleBtn = document.querySelector(".history_toggle");

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("ino_toggle") ||
    e.target.closest(".ino_toggle")
  ) {
    tooggleInfoDisplay();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.history-load') || e.target.classList.contains("history-load")) {
    let el = e.target.classList.contains("history-load") ? e.target : e.target.closest('.history-load');
    let ipVal = el.dataset.value;
    searchFromHistory(ipVal);
    searchInput.value = ipVal;
    searchInput.dispatchEvent(new Event("input"));
  }
})
clearbtn.addEventListener('click', () => {
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
  tooggleInfoDisplay(false);
})
searchInput.addEventListener("input", function () {
  searchInput.value.length > 1 ? clearbtn.classList.add('active') : clearbtn.classList.remove('active');
})
historyToggleBtn.addEventListener('click', function () {
  let wrapper = this.closest(".history_toggle_container");
  wrapper.classList.toggle("active");
})
ipForm.addEventListener("submit", submissionHandler);
