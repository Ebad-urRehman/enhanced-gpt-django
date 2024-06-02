// logic for selecting new chat and history
function change_name(to_change) {
document.getElementById("but-text-new-his").innerHTML = to_change;
}


// display the selected data
const chatHistoryNo = document.querySelectorAll('#file-select-sidebar');
console.log(chatHistoryNo[0])

//if (chatHistoryNo) {
//    const liElements = chatHistoryNo.querySelectorAll('li');
//
//};

//sliderID = document.getElementById("slider-tokens");
//sliderValueText = document.getElementById("sliderValue");
tokens = 2000;
function updateSliderValuesTokens(sliderId, sliderValueText, maxValue) {
       document.getElementById('sliderValue').textContent = sliderValueText + '/' + maxValue;
       tokens = document.getElementById('sliderValue').textContent;
};

function updateSliderValuesTemperature(sliderId, sliderValueText, maxValue) {
       document.getElementById('sliderVal').textContent = sliderValueText + '/' + maxValue;
       tokens = document.getElementById('sliderVal').textContent;
};

var role = 'helpful assistant'
function updateRole(event, roleText) {
    if (event.key ==='Enter' && roleText != "") {
        role = roleText;
        console.log(role)
        document.getElementById('role-info').textContent = role;
        document.getElementById('role-input').value = "";
    }
}

promptResponseList = []

var prompt = '';
response_no = 0;

function sendThroughCtrlEnter(event, user_prompt) {
    if (user_prompt != undefined && user_prompt !== '') {
        if (event.ctrlKey && event.key ==='Enter') {
            prompt = user_prompt;
            console.log(prompt);
            document.getElementById('prompt-text-area').value = "";
            promptResponseList.push(prompt);
            response = "Walaikum As Salam" // func call here
            response_no += 1;
            promptResponseList.push({"response_no": response_no, "prompt": prompt, "response": response})
            console.log(promptResponseList)
            // Create FormData object and append variables
            const dataToSend = new FormData();
            dataToSend.append('prompt', prompt);
            dataToSend.append('stream', stream);
            dataToSend.append('tokens', tokens);
            dataToSend.append('model', selectedModel);
            dataToSend.append('remember_context', rememberContext);

            // Send data using Fetch API
            fetch('/receive-data/', {
                method: 'POST',
                body: dataToSend
            })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));

            console.log(prompt);

            const container = document.getElementById('prompt-responses');

            promptResponseList.forEach(promptResponse => {
                // Create a new div element for prompt
                const promptDiv = document.createElement('div');
                promptDiv.classList.add('prompt-div');

                // Create a new paragraph element for the prompt text
                const promptPara = document.createElement('p');
                promptPara.classList.add('prompt');
                promptPara.textContent = promptResponse.prompt;

                // Append the paragraph to the prompt div
                promptDiv.appendChild(promptPara);

                // Create a new div element for response
                const responseDiv = document.createElement('div');
                responseDiv.classList.add('response-div');

                // Create a new paragraph element for the response text
                const responsePara = document.createElement('p');
                responsePara.classList.add('response');
                responsePara.textContent = promptResponse.response;

                // Append the paragraph to the response div
                responseDiv.appendChild(responsePara);

                // Append both prompt and response divs to the container
                container.appendChild(promptDiv);
                container.appendChild(responseDiv);
            });
        }
    }
}


//function sendThroughClick() {
//    prompt = document.getElementById('prompt-text-area').value;
//    document.getElementById('prompt-text-area').value = "";
//    promptResponseList.append(prompt);
//    console.log(prompt)
//}

function sendThroughClick() {
            const prompt = document.getElementById('prompt-text-area').value;
            promptResponseList.push(prompt);
            document.getElementById('prompt-text-area').value = "";

            // Create FormData object and append variables
            const dataToSend = new FormData();
            dataToSend.append('prompt', prompt);
            dataToSend.append('stream', stream);
            dataToSend.append('tokens', tokens);
            dataToSend.append('model', selectedModel);
            dataToSend.append('remember_context', rememberContext);

            // Send data using Fetch API
            fetch('/receive-data/', {
                method: 'POST',
                body: dataToSend
            })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));

            console.log(prompt);
        }

function inputFile() {
    console.log('working');
    document.getElementById('file-input-element').click();
}

var rememberContext = true;
function rememberContext(checked) {
    if (checked == true) {
        rememberContext = true;
    }
    else {
        rememberContext = false;
    }
}

var stream = true;
function setStream(checked) {
    if (checked == true) {
        stream = true;
    }
    else {
        stream = false;
    }
}

var selectedModel = 'GPT-3.5';
function setModel(model) {
    if (model.textContent === 'GPT-3.5-turbo') {
        selectedModel = 'gpt-3.5-turbo-0125';
        document.getElementById('select-model-button').textContent = "GPT-3.5-turbo"
    }
    else if (model.textContent === 'GPT-4-turbo') {
        selectedModel = 'gpt-4-turbo';
        document.getElementById('select-model-button').textContent = "GPT-4-turbo"
    }
    else if (model.textContent === 'GPT-4') {
        selectedModel = 'gpt-4';
        document.getElementById('select-model-button').textContent = "GPT-4"
    }
    else if (model.textContent === 'GPT-4o') {
        selectedModel = 'gpt-4o';
        document.getElementById('select-model-button').textContent = "GPT-4o"
    }
    console.log(selectedModel)
}

var selectedImageModel = 'Dall-E 2';
function setImageModel(model) {
    if (model.textContent === 'Dall-E 2') {
        selectedModel = 'dall-e-2';
        document.getElementById('select-model-button').textContent = "Dall-E 2";
    }
    else if (model.textContent === 'Dall-E 3') {
        selectedModel = 'dall-e-2';
        document.getElementById('select-model-button').textContent = "Dall-E 3";
    }
    console.log(selectedModel)
}


//document.addEventListener('DOMContentLoaded', function() {
//            document.getElementById('sendDataButton').addEventListener('click', function() {
//                const dataToSend = new FormData();
//                dataToSend.append('variable1', 'value1');
//                dataToSend.append('variable2', 'value2');
//
//                fetch('/receive-data/', {
//                    method: 'POST',
//                    body: dataToSend
//                })
//                .then(response => response.json())
//                .then(data => console.log('Success:', data))
//                .catch(error => console.error('Error:', error));
//            });
//        });