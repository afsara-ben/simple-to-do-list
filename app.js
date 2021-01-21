// load elements from html 

const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery_container = document.querySelector(".grocery-container");
const grocery_list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn");
const input = document.getElementById("grocery");
const clearBtn = document.querySelector(".clear-btn");


// edit option
let editElement = '';
let editFlag = false;
let editID = '';

//submit form
form.addEventListener("submit", addItem);

//clear items
clearBtn.addEventListener("click", clearItems);

//load item list from local storage upon loading DOMContent
window.addEventListener("DOMContentLoaded", loadItemsFromStorage);


//  
// ------------------ ALL FUNCTIONS ---------------
// 

//on clicking submit/edit button this function is called
function addItem(e)
{
    console.log(editFlag);
    
    e.preventDefault();// prevents submitting the form
    const value = input.value;
    const id = new Date().getTime().toString();

    if(value !== '' && editFlag === false) {//adding item
       

            
            createListItem(id,value);

            //display added item
             displayAlert(value+ " successfully added to list", "success");
             
             //make container visible
             grocery_container.classList.add("show-container");
    
            //add to local storage
            addToLocalStorage(id,value);

            //clear input 
            setToDefault();


           

    }

    else if(value !== '' && editFlag) { //editing
       editElement.innerHTML = value; //assign value from input

       displayAlert("item edited", "success");

       //edit to local storage
       editToLocalStorage(editID, value);

       setToDefault();
    }

    else //empty value inputted
    {
       displayAlert("Please enter a value","danger"); 
    }
}

function clearItems()
{
    const items = document.querySelectorAll(".grocery-item");
    if(items.length > 0)
    {
        items.forEach(function(item)
        {
            grocery_list.remove(item);
        });
    }

    //so that clear button is not shown for an empty list
    grocery_container.classList.remove("show-container");

    //display msg that all items were cleared
    displayAlert("All items cleared","danger");

    setToDefault();

    //clear all items from local storage
    localStorage.removeItem('list');
}


//display alert upon entry of empty string
function displayAlert(text, action)
{
    
    alert.textContent = text;
    alert.classList.add('alert-${action}');


    //set time out of alert
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove('alert-${action}');
    },2000)
    
}

function deleteItem(e)
{
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id; //?? why dataset.id and not data-id
    
    grocery_list.removeChild(element);
    let itemName = element.textContent.toString().trim();
    console.log(itemName + " deleted");

    
    //in case last item was deleted,remove the 'clear' button
    if(grocery_list.children.length === 0)
    {
        grocery_container.classList.remove("show-container");
    }

    //display action
    displayAlert(itemName + " deleted", "danger");
    
    setToDefault();

    //remove from local storage
    removeFromLocalStorage(id);

}

function editItem(e)
{
    console.log('in edititem')
    const element = e.currentTarget.parentElement.parentElement;
    
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    
    //set form value
    input.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;

    submitBtn.textContent = "edit";

    
    
    console.log("item edited");

}
function setToDefault()
{
    console.log("value set to default")
    input.value="";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}



//
// -----------ADD DATA TO LOCAL STORAGE ---------
//

function addToLocalStorage(id,value)
{
    const item_to_add = {id:id, value:value}; //first id and value are fixed parameters, second id and value are passed parameters
    let items = getLocalStorage();
    console.log(items);

    items.push(item_to_add); //add new item to items
    
    //set array
    localStorage.setItem("list", JSON.stringify(items));

    console.log("added to local storage");
}

function editToLocalStorage(id,value)
{
    let items = getLocalStorage();
    items = items.filter(function(item){
        if (item.id == id)
        {
            item.value = value;
        }
        return item;
    })

    //overwrite whole list
    localStorage.setItem("list",JSON.stringify(items));

    console.log("edited to local storage");
}

function removeFromLocalStorage(id)
{
    let items = getLocalStorage();
    
    //keeps all item except for the one to be removed
    //inefficient way
    items = items.filter(function(item){
        if(item.id != id)
        {
            return item;
        }
    });

    //overwrite the list again
    localStorage.setItem("list",JSON.stringify(items));

    console.log("removed item");
}

//fetches the localStorage array
function getLocalStorage()
{
    //if theres already an array list return it, or return an empty array
    return localStorage.getItem("list")?
    JSON.parse(localStorage.getItem("list")) : []; 
}


// ---------- SETUP previously entered ITEMS from local storage ----------

function loadItemsFromStorage()
{
    let items = getLocalStorage();

    if(items.length > 0) { //local storage e any item thakle prottektar jonno ekta list entry show korbe
        items.forEach(function(item){
            createListItem(item.id, item.value);
         });
    }

    //make the list entries visible
    grocery_container.classList.add("show-container");

    
}
function createListItem(id, value)
{
    console.log("new  item created");


    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;

    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `
    
        <p class="title">${value}</p>
        <div class="btn-container">

        <!-- edit button -->
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>

        <!-- delete button -->
            <button type="button" class="delt-btn">
                <i class="fas fa-trash"></i>
            </button>
         </div>`;

         
        // add eventlistener if delete or edit button is clicked
        const deleteBtn = element.querySelector(".delt-btn"); // document.querySelector(".delt-btn") would get only the first entry;
        deleteBtn.addEventListener("click", deleteItem);
        
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);
        
         //append item to list
         grocery_list.appendChild(element);
}


// how localStorage API works
//setItem
//getItem
//removeItem
//must be stored as strings - use JSON.stringify() & JSON.parse()

// localStorage.setItem("1",JSON.stringify(["item","item2", "item3"]));

// const getValue = JSON.parse(localStorage.getItem("1"));
// console.log(getValue);
