
var node = null;

//Indicates if the text was an edited text the it ought not to be readdded
var IsEditedText = false;

//Indicates if the todo added should be stored to local storage or not
let shouldStore = true;


function NewTodo()
{
    //Gets the text input from the input field
   let title = document.getElementById("todoTextBox").value

   //Sets the date and time the input was created
   let theDate = new Date();

   //Adds the titles and dates to the page
    Add(title, theDate);

    //Resets the input textbox to empty
    document.getElementById("todoTextBox").value = "";
    
    //Removes a todo item from the page and local storage
    close(closed);
  
    //Copies the details of the todo tex to clipboard
    copy(copied);
    
    //Allows the user to edit a todo item
    Edit(edited);
    
    //Birngs up a list of todos who's text match the entered input
    ToSearch(search);

  
}

function Add(title, theDate)
{
    //Creates an ordered list element for the todo item
    let newList = document.createElement("li");

    //Creates a p-tag for the todo text
    let ptag = document.createElement('p');

        //Creates a p-tag for the todo's date of creation
    let atag = document.createElement('a');

    
    let input = title;

    //Will not add an empty string
    if(input == ""){}

    //Calls a method that adds the text content to the required node
    else if(IsEditedText ==true)
    {
        AddEdit(node, input);
    }


    else
    {
    let date = theDate;
    let newNode = document.createTextNode(input);
    let newnode2 = document.createTextNode(date);

    //Appends the text and date to the tags
    ptag.appendChild(newNode);
    atag.appendChild(newnode2);

    //Creates spans copy and edit and text data for copy and edit.
    let span1 = document.createElement("span");
    let span2 = document.createElement("span")
    let span3 =  document.createElement("span");
    let newnode4 = document.createTextNode("Copy");
    let newnode5 = document.createTextNode("Edit");

    //Sets the class names using font-awesome
    span1.className = "fa fa-close";
    span1.id ="close"
    span2.className = "fa fa-copy";
    span2.id ="copy"
    span3.className = "fa fa-edit";
    span3.id = "edit";

    span2.appendChild(newnode4);
    span3.appendChild(newnode5);

    //Appends the children elements to the created ordered list
    newList.appendChild(ptag);
    newList.appendChild(atag );
    newList.appendChild(span1);
    newList.appendChild(span2);
    newList.appendChild(span3);

    //Appends the ordered list to the unordered list element
    let mainList = document.getElementById("Add");
    mainList.appendChild(newList);

    //Determines if the data is being loaded from the localstorage
    //Stores false
    let array =JSON.stringify( 
        {
           title: input,
           CreationDate:  date
        }
    );
    
    if(shouldStore === true)
    {
       
        Store(array);
    }
    }
}

//Gets the object by class name
let copied = document.getElementsByClassName("fa fa-copy"); 
function copy(copied)
    {
        var i;
        for(i=0; i<copied.length; i++)
        {
            //If the an object of the class is clicked on the text is copied to the clipboard
            //The text is gotten from the parent element and set to the clipboard navigator property
            copied[i].onclick = function() 
            {
            var TodoText =this.parentElement.firstChild.textContent;
            navigator.clipboard.writeText(TodoText);
            }
        }
    }

    //Gets the object by class name
    let closed = document.getElementsByClassName("fa fa-close");
    function close(closed)
    {  var i;  
        for(i = 0; i <closed.length; i++ )
        {
        //If the an object of the class is clicked on the parent element is removed
        //The element is also removed from the local storage
            closed[i].onclick = function()
            {
            let parent = this.parentElement;
            RemoveFromLocalStorage(parent.textContent);
            parent.remove();
            } 
        }
    }


    function RemoveFromLocalStorage(text)
    {
        //Slices the text to the required content
        //The text is the text from the parent content
        let newText = text.slice(0, -8);

        //Checks if the local storage exists for the data
        if(localStorage.li)
        {
        //Gets the data from the localstorage and parses it into a json
         let data =  JSON.parse(localStorage.getItem("li"));

         //Loops through and finds the node with the matching text
         for (let i = 0; i < data.length; i++)
          {
              var c = JSON.parse(data[i]);
             var d = c.title + c.CreationDate;
             if (d === newText) 
             {
                 //Splices the node from the data when found
                 data.splice(i, 1);

                 //Resets the data to the new data content.
                localStorage.setItem("li", JSON.stringify(data));
             }
         }
        }
    }


    //Gets the object by class name
    let search = document.getElementById("searchBox");
    function ToSearch(search) 
    {
        //Fires the event when there is a touch in the search box
        search.onkeyup= function()
        {
            //Gets the data in the search box and turns it to lowercase
            let searchInput = document.getElementById("searchBox").value.toLowerCase();
            
            //Loops through and gets the data for all texts in the ordered lists
            for (let i = 0; i < closed.length; i++)
            {
                let text = closed[i].parentElement.firstChild.textContent.toLowerCase();
                if (text.includes(searchInput))
                {
                    //Displays those that fit
                    closed[i].parentElement.style.display = 'inline';
                }
                else
                {
                    //Hides those that are not fit
                    closed[i].parentElement.style.display = 'none';
                    console.log(searchInput)
                }
                
            }
        }
    }


    //Gets the object by class name
    let edited = document.getElementsByClassName("fa fa-edit");
    function Edit(edited) 
    {
        for (let i = 0; i < edited.length; i++) 
        {
            edited[i].onclick = function()
            {
                //Sets the text content of the parent element to the input value of the todo
                var TodoText =this.parentElement.firstChild.textContent;
                document.getElementById("todoTextBox").value = TodoText;
                //Sets the node value to the parent element in the global scope
                node = edited[i];
                //Sets the IsEditedText value to be true to for the required add method.
                IsEditedText = true;
    
            }
            
        }
    }

    function AddEdit(node , text)
    {
        //Sets the content of the text to the text content of the node
        node.parentElement.firstChild.textContent = text;
        IsEditedText = false;
    }

    function Store(input)
    {
        let array;

        //Checks for the existence of the local storage
        if(!localStorage.li)
        {
            //Creates the storage as an array if it does not exists
                array=[];
        }
        else
        {
            //Gets the storage data if it exists
           array = JSON.parse(localStorage.getItem("li"));
        }

        //Push the input into the array and sets the local storage
        array.push(input);
        localStorage.setItem("li", JSON.stringify(array));
    }

    //Fires when the page is loaded
    function LoadPageDetails()
    {
        //Sets the should store value to true so the data is not stored when added
        shouldStore = false;
        //Checks if there is a storage and Adds all the values as required
        if(localStorage.li)
        {
        let data = JSON.parse(localStorage.getItem("li"));
            for (let i = 0; i < data.length; i++)
             {
                var c = JSON.parse(data[i]);
                Add(c.title, c.CreationDate);
            }
        }
        //Sets the should store value back to true
        shouldStore = true;

        //Calls the new todo function to enable all functions.
        NewTodo();
    }