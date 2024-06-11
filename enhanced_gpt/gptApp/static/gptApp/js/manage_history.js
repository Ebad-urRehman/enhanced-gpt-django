window.onload = function() {

    function createDivPrompt(userPrompt) {
    // get main div
    const container_prompt_responses = document.getElementById('prompt-responses')

    // create main div and assign class
    const promptDiv = document.createElement('div');
    promptDiv.setAttribute('class', 'prompt-div');

    //create text div with in it
    const prompt_text = document.createElement('span');
    prompt_text.setAttribute('class', 'prompt');

    // add child to it
    promptDiv.appendChild(prompt_text);
    container_prompt_responses.appendChild(promptDiv);

//    add text to prompt text element
    prompt_text.textContent = userPrompt;
}

function createDivResponse(response) {

    // get main div
    const container_prompt_responses = document.getElementById('prompt-responses')

    // create main div and assign class
    const responseDiv = document.createElement('div');
    responseDiv.setAttribute('class', 'response-div');

    //create text div with in it
    const response_text = document.createElement('p');
    response_text.setAttribute('class', 'response');

    // add child to it
    responseDiv.appendChild(response_text);
    container_prompt_responses.appendChild(responseDiv);

//    renderMarkdown(response, response_text);
//    add text to prompt text element
    response_text.innerText = response;

}

    function storeMessages(data, messages) {
        data.push(messages)
    }

    function displayMessages(data, messages) {

    }

    function storeMessagesMetaData(metadata) {

    }

    const metadata = ["tab1", "tab2", "tab3"];
    const sideBarDiv = document.getElementById('file-select-sidebar');

    function displayMessagesMetaData(metadata, sidebar) {
        metadata.forEach(function(tab) {
            const tabElement = document.createElement('li');
            tabElement.textContent = tab;
            sidebar.appendChild(tabElement)
        })
    }
    displayMessagesMetaData(metadata, sideBarDiv)

    response = "The `async` function in JavaScript is part of the ES2017 standard and helps in writing asynchronous code in a more synchronous/linear manner. Remember, using the 'await' keyword will pause execution of your asynchronous operations - which could impact performance if not managed correctly. You should try to limit usage of 'await' where possible or manage it within Promise.all() blocks etc...when dealing with lots of operations at once (like API calls)."

const messages = [
     [
        {
            "role": "system",
            "content": "You are a helpful assistant"
        },
        {
          "role": "user",
          "content": "what is js async function"
        },
        {
          "role": "assistant",
          "content": response
        },
        {
          "role": "user",
          "content": "what is js async function"
        },
        {
          "role": "assistant",
          "content": response
        }
    ],
    [
    {
            "role": "system",
            "content": "You are a helpful assistant"
        },
        {
          "role": "user",
          "content": "what is js async function"
        },
        {
          "role": "assistant",
          "content": response
        }
    ]
    ]

//    function loadTabContent(messages) {
//        console.log(messages)
//
//
//    }
//    loadTabContent(messages)
prompt_response_list = messages.forEach(function(list) {
    list.forEach(function(dict) {
        if (dict.role=== "user") {
            createDivPrompt(dict['content']);
        }
        else if (dict.role === "assistant") {
            createDivResponse(dict['content']);
        }
    })
})



//select image-model
var selectedModelImage = 'Dall-E 2';
modelDictImg = {"Dall-E 2": "dall-e-2",
            "Dall-E 3" : "dall-e-3",}

imageModelsSelectBox = document.getElementsByClassName('imageModelSelect');
imageModelArray = Array.from(imageModelsSelectBox);

imageModelArray.forEach(function(model) {
        model.addEventListener('click', function() {
            if (model.textContent in modelDictImg) {
                selectedModelImage = modelDictImg[model.textContent];
                document.getElementById('select-model-button-img').textContent = model.textContent;
                console.log(model.textContent, selectedModelImage)
            }
        })
    });



//createDivResponse(response)
}