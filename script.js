// Helper function to add drag functionality to an element
function makeDraggable(el) {
    let offsetX, offsetY, isDragging = false;
    el.addEventListener("mousedown", (event) => {
      isDragging = true;
      offsetX = event.clientX - el.getBoundingClientRect().left;
      offsetY = event.clientY - el.getBoundingClientRect().top;
      el.style.cursor = "grabbing";
      el.style.zIndex = 1000000000;
    });
    document.addEventListener("mousemove", (event) => {
      if (!isDragging) return;
      el.style.left = event.clientX - offsetX + "px";
      el.style.top = event.clientY - offsetY + "px";
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      el.style.cursor = "grab";
      el.style.zIndex = 0;
    });
  }
  
  // Function to collect all created classes (articles)
  function getClasses() {
    const articles = document.querySelectorAll("article.draggable");
    const classesArray = [];
    articles.forEach(article => {
      const className = article.querySelector(".nombre").textContent.trim();
      
      // Collect properties from list items
      const propertiesList = [];
      article.querySelectorAll(".propiedades ul li").forEach(li => {
        propertiesList.push(li.textContent.trim());
      });
      
      // Collect methods from list items
      const methodsList = [];
      article.querySelectorAll(".metodos ul li").forEach(li => {
        methodsList.push(li.textContent.trim());
      });
      
      classesArray.push({
        className: className,
        properties: propertiesList,
        methods: methodsList
      });
    });
    return classesArray;
  }
  
  // Function to list the classes in the console
  function listClasses() {
    console.log(getClasses());
  }
  
  // Function to send the classes data to the PHP backend
  function saveClasses() {
    const classesData = getClasses();
    fetch('save_classes.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classesData)
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
  }
  
  // Set up event listeners once the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const listBtn = document.getElementById("listBtn");
    const saveBtn = document.getElementById("saveBtn");
    const template = document.getElementById("article-template");
  
    addBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default link behavior
      // Clone the template content
      const clone = template.content.cloneNode(true);
      const article = clone.querySelector("article");
      
      // Set an initial position for the new article
      article.style.left = "250px";
      article.style.top = "250px";
      
      // Append the new article to the main workspace
      document.querySelector("main").appendChild(article);
      
      // Apply drag functionality to the new article
      makeDraggable(article);
    });
  
    listBtn.addEventListener("click", (e) => {
      e.preventDefault();
      listClasses();
    });
  
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveClasses();
    });
  });