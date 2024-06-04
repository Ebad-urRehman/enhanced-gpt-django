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

function sendThroughClick(event) {
    const userPrompt = promptElement.value;
//    if (userPrompt !== '') {
//        if (event.ctrlKey && event.key === 'Enter') {
            if (rememberContext == false || messages == null) {
            console.log('here')
            messages = [
                {"role": "system", "content": role},
                {"role": "user", "content": userPrompt}
                ]
            }
            else {
                messages.push(
                {"role": "system", "content": role},
                {"role": "user", "content": userPrompt}
                )
            }
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
                'stream': setStream
            };
            console.log(messages)

            const jsonData = JSON.stringify(dataToSend);
            console.log(jsonData)
            // Send data using Fetch API
            fetch('/receive-data/', {
                method: 'POST',
                body: jsonData
            })
            .then(response => response.json())
            .then(data = data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
            console.log(messages)

            promptResponsesElement = document.getElementsByClassName('response')
            promptResponsesElement.forEach(
                function(element) {

                }
            )
            document.getElementsByClassName('response')[0].textContent = "responsrr";

//            // Append prompt and response to the container
//            const container = document.getElementById('prompt-responses');
//            const promptDiv = document.createElement('div');
//            promptDiv.classList.add('prompt-div');
//            const promptPara = document.createElement('p');
//            promptPara.classList.add('prompt');
//            promptPara.textContent = promptResponse.prompt;
//            promptDiv.appendChild(promptPara);
//            container.appendChild(promptDiv);
//
//            const responseDiv = document.createElement('div');
//            responseDiv.classList.add('response-div');
//            const responsePara = document.createElement('p');
//            responsePara.classList.add('response');
//            responsePara.textContent = promptResponse.response;
//            responseDiv.appendChild(responsePara);
//            container.appendChild(responseDiv);
//        }
//    }
}
}