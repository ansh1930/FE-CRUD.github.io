class AnimalTable {
  constructor(tableId, sortableColumns) {
    this.table = document.getElementById(tableId).querySelector("tbody");
    this.headers = document
      .getElementById(tableId)
      .querySelectorAll("thead th");
    this.animals = [];
    this.tableId = tableId;
    this.sortableColumns = sortableColumns;
    this.currentSort = { column: null, order: null }; // Keeps track of sorting state

    this.initializeSorting();
  }

  initializeSorting() {
    this.headers.forEach((header, index) => {
      if (this.sortableColumns.includes(index)) {
        header.style.cursor = "pointer";
        header.addEventListener("click", () => this.sortTable(index));
      }
    });
  }

  addAnimal(animal) {
    if (this.animals.some((a) => a.name === animal.name)) {
      alert("Animal already exists!");
      return;
    }
    this.animals.push(animal);
    this.renderTable();
  }

  deleteAnimal(name) {
    this.animals = this.animals.filter((animal) => animal.name !== name);
    this.renderTable();
  }

  editAnimal(oldName, updatedAnimal) {
    const index = this.animals.findIndex((a) => a.name === oldName);
    if (index !== -1) {
      this.animals[index] = updatedAnimal;
      this.renderTable();
    }
  }

  sortTable(columnIndex) {
    const order =
      this.currentSort.column === columnIndex &&
      this.currentSort.order === "asc"
        ? "desc"
        : "asc";

    this.animals.sort((a, b) => {
      const valueA = Object.values(a)[columnIndex];
      const valueB = Object.values(b)[columnIndex];

      if (typeof valueA === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    this.currentSort = { column: columnIndex, order };
    this.renderTable();
  }
  rendername(id, name) {
    if (id === "dogsTable") {
      return `<td><strong>${name}</strong></td>`;
    } else if (id === "bigFishTable") {
      return `<td><strong><em style="color: blue;">${name}</em></strong></td>`;
    } else {
      return `<td>${name}</td>`;
    }
  }

  renderTable() {
    this.table.innerHTML = "";
    this.animals.forEach((animal) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          ${this.rendername(this.tableId, animal.name)}
          <td>${animal.size}</td>
          <td>${animal.location}</td>
          <td>
            <img src="${animal.image}" alt="${
        animal.name
      }" class="img-thumbnail animal-image" 
                 style="width: 100px; border: 2px solid #ccc;">
          </td>
          <td>
            <i class="bi bi-pencil-square text-warning edit-icon" 
               style="cursor: pointer;"></i>
            <i class="bi bi-trash text-danger delete-icon ms-3" 
               style="cursor: pointer;"></i>
          </td>
        `;

      const img = row.querySelector(".animal-image");
      img.addEventListener("mouseover", () => {
        img.style.width = "150px";
        img.style.height = "150px";
      });
      img.addEventListener("mouseout", () => {
        img.style.width = "100px";
        img.style.height = "100px";
      });

      row.querySelector(".edit-icon").addEventListener("click", () => {
        const updatedName =
          prompt("Enter new name:", animal.name) || animal.name;
        const updatedSize =
          prompt("Enter new size:", animal.size) || animal.size;
        const updatedLocation =
          prompt("Enter new location:", animal.location) || animal.location;
        const updatedImage =
          prompt("Enter new image URL:", animal.image) || animal.image;

        this.editAnimal(animal.name, {
          name: updatedName,
          size: parseInt(updatedSize, 10),
          location: updatedLocation,
          image: updatedImage,
        });
      });

      row.querySelector(".delete-icon").addEventListener("click", () => {
        if (confirm(`Are you sure you want to delete ${animal.name}?`)) {
          this.deleteAnimal(animal.name);
        }
      });

      this.table.appendChild(row);
    });
  }
}

class BigCatsTable extends AnimalTable {}
class DogsTable extends AnimalTable {}
class BigFishTable extends AnimalTable {}

document.addEventListener("DOMContentLoaded", () => {
  const bigCatsTable = new BigCatsTable("bigCatsTable", [0, 1, 2]); // All columns except images
  const dogsTable = new DogsTable("dogsTable", [0, 2]); // Name and Location
  const bigFishTable = new BigFishTable("bigFishTable", [1]); // Size only

  const form = document.getElementById("animalForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const name = document.getElementById("animalName").value.trim();
    const size = parseInt(document.getElementById("animalSize").value, 10);
    const location = document.getElementById("animalLocation").value.trim();
    const image = document.getElementById("animalImage").value.trim();
    const tableId = document.getElementById("animalTable").value;

    const animal = { name, size, location, image };

    if (tableId === "bigCatsTable") {
      bigCatsTable.addAnimal(animal);
    } else if (tableId === "dogsTable") {
      dogsTable.addAnimal(animal);
    } else if (tableId === "bigFishTable") {
      bigFishTable.addAnimal(animal);
    }

    form.reset(); 
  });

  // Add initial  data
  bigCatsTable.addAnimal({
    name: "Lion",
    size: 250,
    location: "Africa",
    image: "https://via.placeholder.com/100",
  });
  dogsTable.addAnimal({
    name: "Bulldog",
    size: 50,
    location: "USA",
    image: "https://via.placeholder.com/100",
  });
  bigFishTable.addAnimal({
    name: "Shark",
    size: 500,
    location: "Ocean",
    image: "https://via.placeholder.com/100",
  });
});
