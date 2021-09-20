console.log("Hello Post Master!");

//Utitlity Functions:
// 1. utility function to get DOM element from string

function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

// Initialize no of parameters
let addedParamCount = 0;

// hide the paarameter box initially
let parametersBox = document.getElementById('parametersBox');
parametersBox.style.display = 'none';


// id the users click on params box, hide the json box
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('parametersBox').style.display = "block"
    document.getElementById('requestJsonBox').style.display = "none"
});


// id the users click on json box, hide the params box

let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = "block"
    document.getElementById('parametersBox').style.display = "none"
});


// if the user clicks on + button, add more parameter

let addParams = document.getElementById('addParams');
addParams.addEventListener('click', () => {
    let params = document.getElementById('params');
    let string = ` <div class="form-row my-3">
                        <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamCount + 2}</label>
                        <div class=" col-md-4">
                            <input type="text" class="form-control" id="parameterKey${addedParamCount + 2}" placeholder="Enter Parameter ${addedParamCount + 2} Key">
                        </div>
                        <div class=" col-md-4">
                            <input type="text" class="form-control" id="parameterValue${addedParamCount + 2}" placeholder="Enter Parameter ${addedParamCount + 2} Value">
                        </div>
                        <button class="btn btn-primary deleteParam">-</button>
                    </div>`

    // Convert the Element string to DOM node
    let paramElement = getElementFromString(string);
    params.appendChild(paramElement);

    // add an event listner to remove the parameter on clicking - button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for (item of deleteParam) {
        item.addEventListener('click', (e) => {
            // TODO: add a confirmation box to confirm parameter deletion
            e.target.parentElement.remove();
        })
    }

    addedParamCount++;
})

// If the user clicks on submit button

let submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    // show please wait in the response box to request patience from the user 
    document.getElementById('responsePrism').innerHTML = "Please wait... Fetching response";
    Prism.highlightAll();

    // Fetch all the values user has entered

    let urlField = document.getElementById('urlField').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value
    let contentType = document.querySelector("input[name='contentType']:checked").value


    // If user has used params option instead of json, collect all the parameters in an object
    if (contentType == 'Params') {
        data = {};
        for (i = 0; i < addedParamCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let Key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[Key] = value;
            }
        }
        data = JSON.stringify(data);
    }
    else {
        data = document.getElementById('requestJsonText').value;
    }


    // log all the values in the console for debugging
    console.log("URL is", urlField);
    console.log("requestType is", requestType);
    console.log("contentType is", contentType);
    console.log("Data is", data);

    // If the request type is GET, invoke fetch api to create a post request
    if (requestType == 'GET') {
        fetch(urlField, {
            method: 'GET',
        })
            .then(response => response.text())
            .then(function (text) {
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            })
    }
    else {
        fetch(urlField, {
            method: 'POST',
            body:data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => response.text())
            .then(function (text) {
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            })
    }
})