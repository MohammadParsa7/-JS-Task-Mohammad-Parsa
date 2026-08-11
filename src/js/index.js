// ! SELECTED

const showModalBtn = document.querySelector(".show-modal");
const modal = document.querySelector(".page-modal");
const backdrop = document.querySelector(".backdrop");
const closeBtn = document.querySelector(".close-btn");

const btn = document.querySelector(".btn-upload");
const listBody = document.querySelector(".list-body");
const inputSearch = document.querySelector(".search");
const selectSortPrice = document.querySelector(".sort-price");
const selectSortData = document.querySelector(".sort-data");

// ! EVEANTS
btn.addEventListener("click", getUser);
showModalBtn.addEventListener("click", () => {
  backdrop.classList.remove("hidden");
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  backdrop.classList.add("hidden");
  modal.classList.add("hidden");
});

backdrop.addEventListener("click", () => {
  backdrop.classList.add("hidden");
  modal.classList.add("hidden");
});

const app = axios.create({
  baseURL: "http://localhost:3000/",
});

app.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

app.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// GET DATA
async function getUser() {
  try {
    const res = await app.get("transactions");
    const data = res.data;
    addData(data);
  } catch (err) {
    console.log(err);
  }
}
// ADD DATA
function addData(data) {
  let result = "";
  data.forEach((data) => {
    result += `
           <tr>
           <th>${data.id}</th>
           <th>${data.type}</th>
           <th>${data.price}</th>
           <th>${data.refId}</th>
           <th>
            ${new Date(data.date).toLocaleString("fa-IR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
           </th>
           </tr>
           `;
  });
  listBody.innerHTML = result;
}

// SORT PRICE

selectSortPrice.addEventListener("change", sortPrice);

async function sortPrice() {
  const selectSort = selectSortPrice.value;

  const res = await app.get("transactions");
  const data = res.data;

  switch (selectSort) {
    case "All":
      return addData(data);

    case "Ascending":
      const Ascending = [...data].sort((a, b) => a.price - b.price);
      return addData(Ascending);

    case "Descending":
      const Descending = [...data].sort((a, b) => b.price - a.price);
      return addData(Descending);

    default:
      throw new Error("Please select an option.");
  }
}

// SEARCH DATA
inputSearch.addEventListener("input", async (e) => {
  const query = e.target.value;
  const { data } = await app.get("transactions");

  const filtered = data.filter((item) =>
    String(item.refId).trim().includes(query.trim()),
  );

  addData(filtered);
});

// SORT DATA

selectSortData.addEventListener("change", sortData);

async function sortData() {
  const statusSort = selectSortData.value;
  const { data } = await app.get("transactions");
  const newest = [...data].sort((a, b) => {
    return b.date - a.date;
  });
  const oldest = [...data].sort((a, b) => {
    return a.date - b.date;
  });
  switch (statusSort) {
    case "All":
      return addData(data);
    case "Newest":
      return addData(newest);
    case "Oldest":
      return addData(oldest);

    default:
      throw new Error("Please select an option.");
  }
}
