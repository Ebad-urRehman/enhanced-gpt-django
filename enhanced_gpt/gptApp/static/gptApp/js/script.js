window.onload = function () {
// logic for selecting new chat and history
function change_name(to_change) {
document.getElementById("but-text-new-his").innerHTML = to_change;
}


// select max_tokens
tokens = 2000;
const tokens_slider = document.getElementById('slider-tokens')
var current_tokens_value = tokens_slider.value
var tokens_max = tokens_slider.max

tokens_slider.addEventListener('change', function() {
    current_tokens_value = tokens_slider.value
    tokens_max = tokens_slider.max
    document.getElementById('slider-value').innerHTML = current_tokens_value + '/' + tokens_max;
    console.log("Token value : ", current_tokens_value)
    });



// choose temperature
const temperature_slider = document.getElementById('slider-temp')
var current_temp_value = temperature_slider.value
var temperature_max = temperature_slider.max

temperature_slider.addEventListener('change', function() {
    current_temp_value = temperature_slider.value
    temperature_max = temperature_slider.max
    document.getElementById('slider-val').innerHTML = current_temp_value + '/' + temperature_max;
    console.log("Token value : ", current_temp_value)
    });


// Role
var role = 'You are a helpful assistant.';
role_selector = document.getElementById('role-input');

role_selector.addEventListener('keydown', function() {
    if (event.key ==='Enter') {
        role = role_selector.value;
        if (role != "") {
        document.getElementById('role-info').textContent = role;
        document.getElementById('role-input').value = "";
        console.log(role)
        }
    }
    });


// input file
input_file_button = document.getElementById('file-input-button');
file_browse_button = document.getElementById('file-input-element');

input_file_button.addEventListener('click', function() {
    file_browse_button.click();
});


// Remember context
var rememberContext = true;
var rememberContextElement = document.getElementById('remember-context');

rememberContextElement.addEventListener('click', function() {
    checked = rememberContextElement.checked;
    if (checked == true) {
        rememberContext = true;
    }
    else {
        rememberContext = false;
    }
    console.log(rememberContext);
});


// set stream
var setStream = true;
var setStreamElement = document.getElementById('stream');

setStreamElement.addEventListener('click', function() {
    checked = setStreamElement.checked;
    if (checked == true) {
        setStream = true;
    }
    else {
        setStream = false;
    }
    console.log(setStream);
});


// choose frequency
const frequency_slider = document.getElementById('slider-frequency')
var current_frequency_value = frequency_slider.value
var frequency_max = frequency_slider.max

frequency_slider.addEventListener('change', function() {
    current_frequency_value = frequency_slider.value
    frequency_max = frequency_slider.max
    document.getElementById('slider-freq-val').innerHTML = current_frequency_value + '/' + frequency_max;
    console.log("Frequency value : ", current_frequency_value)
    });


// choose no of responses
const response_no_slider = document.getElementById('slider-no-responses')
var current_res_no_value = response_no_slider.value
var response_no_max = response_no_slider.max

response_no_slider.addEventListener('change', function() {
    current_res_no_value = response_no_slider.value
    document.getElementById('slider-res-no-val').innerHTML = current_res_no_value + '/' + response_no_max;
    console.log("Response no value : ", current_res_no_value)
    });


//select text-model
var selectedModel = 'gpt-3.5-turbo-0125';
modelDict = {"GPT-3.5-turbo": "gpt-3.5-turbo-0125",
            "GPT-4-turbo" : "gpt-4-turbo",
            "GPT-4" : "gpt-4",
            "GPT-4o": "gpt-4o"}

chatModelsSelectBox = document.getElementsByClassName('chatModelSelect');
chatModelArray = Array.from(chatModelsSelectBox);

chatModelArray.forEach(function(model) {
        model.addEventListener('click', function() {
            if (model.textContent in modelDict) {
                selectedModel = modelDict[model.textContent];
                document.getElementById('select-model-button').textContent = model.textContent;
                console.log(model.textContent, selectedModel)
            }
        })
    });


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


// prompt-responses transfer
promptResponseList = []
var prompt = '';
response_no = 0;
messages = null;

const button = document.getElementById('submit-button');
const promptElement = document.getElementById('prompt-text-area');
button.addEventListener('click', sendThroughClick);
storedData = null;
i=0;

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

    renderMarkdown(response, response_text);
//    add text to prompt text element
//    response_text.innerText = response;
}


// history tabs
document.getElementById('hover-button-history-bar').addEventListener('mouseover', function() {
    document.getElementById('history-bar').style.width = '250px';
});

document.getElementById('history-bar').addEventListener('mouseleave', function() {
    document.getElementById('history-bar').style.width = '0';
});


var userPrompt = null;
var tabList = []
var tabName = null

function sendThroughClick(event) {
            userPrompt = document.getElementById('prompt-text-area').value;
            console.log(userPrompt)
            createDivPrompt(userPrompt)
            if (rememberContext == false || messages == null) {
                console.log('here')
                messages = [
                    {"role": "system", "content": role},
                    {"role": "user", "content": userPrompt}
                    ]
                i=0;
                tabList.push(messages)
                }
                else {
                if (role === messages[i-1]['content']) {
                    messages.push(
                    {"role": "user", "content": userPrompt}
                    )
                    }
                else {
                    messages.push({"role": "system", "content": role},
                    {"role": "user", "content": userPrompt}
                    ) }
                tabList.push(messages)

            }
            console.log(tabList)
//            const messages = JSON.stringify(messages)
            promptElement.value = ""; // Clear the input

            // Create FormData object and append variables
            const dataToSend = {
                'messages': messages,
                'model': selectedModel,
                'tokens': current_tokens_value,
                'frequency': current_frequency_value,
                'no-responses': current_res_no_value,
                'temperature': current_temp_value,
                'remember_context': rememberContext,
                'stream': setStream,
                'tab-name': tabName
            }
            console.log(messages)

            const jsonData = JSON.stringify(dataToSend);
            console.log(jsonData)
            // Send data using Fetch API
            fetch('/receive-data/', {
                method: 'POST',
                body: jsonData
            })

            .then(response => response.json())
          .then(data => {
            // operations on data
            console.log('Success:', data);

            let response_text = data['success']['response'][0];
            let tokens_used = data['success']['response'][1];

            if (tabName == null) {
                tabName = data['success']['tab-name'];
                console.log(tabName)
                const tabList = ["tab1", "tab2", "tab3"]
                tabList.push("tab4")
                let json_meta_data = {
                    'chat_tab_list': tabList,
                    'image_tab_list': null,
                    'settings': null
                }
                json_meta_data = JSON.stringify(json_meta_data);
                fetch('/store-chat-tabs/', {
                    method: 'POST',
                    body: json_meta_data
                })
                .then(response => response.json())
                .then(metadata => {
                // operations on data
                console.log('Success:', metadata);
                })
                .catch(error => console.error('Error:', error));
            }
            messages.push({"role": "assistant", "content": response_text})
            console.log(messages)
            const final_response_text = response_text + "\nTokens used : " + tokens_used.toString();
            createDivResponse(final_response_text)
            console.log(data['success']['response'])
            i+=1;
          })
          .catch(error => console.error('Error:', error));

}
}