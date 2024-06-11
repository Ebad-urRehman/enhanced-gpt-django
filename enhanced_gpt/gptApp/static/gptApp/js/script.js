window.onload = function () {

var tabList = []
var current_chats_data = []

// fetch the meta data from database when windows load
fetch('/load-chat-tabs/', {
                method: 'POST'
                })
                .then(response => response.json())
                .then(get_metadata => {

                console.log('Success:', get_metadata);
                const sideBarDiv = document.getElementById('file-select-sidebar');
                tabList = get_metadata['success']['chat_tab_list']
                console.log(tabList)
                if (tabList != null) {
                    if(tabList.length != 0) {
                        load_chat_tabs(tabList, sideBarDiv);
                        make_clickable_tabs();
                    }
                }
                })
                .catch(error => console.error('Error:', error));

make_chat_button_functional()

// select max_tokens
tokens = 2000;
const tokens_slider = document.getElementById('slider-tokens')
var current_tokens_value = tokens_slider.value
var tokens_max = tokens_slider.max
change_tokens(tokens_slider, current_tokens_value)

// choose temperature
temperature_slider = document.getElementById('slider-temp')
var current_temp_value = temperature_slider.value
var temperature_max = temperature_slider.max
change_temperature(temperature_slider, current_temp_value, temperature_max)


// Role
var role = 'You are a helpful assistant.';
role_selector = document.getElementById('role-input');
select_role(role_selector, role)

// input file
input_file_button = document.getElementById('file-input-button');
file_browse_button = document.getElementById('file-input-element');

input_file_button.addEventListener('click', function() {
    file_browse_button.click();
});


// Remember context
var rememberContext = true;
var rememberContextElement = document.getElementById('remember-context');
set_remember_context(rememberContext, rememberContextElement)

// set stream
var setStream = true;
var setStreamElement = document.getElementById('stream');
set_stream(setStreamElement, setStream)

// choose frequency
const frequency_slider = document.getElementById('slider-frequency')
var current_frequency_value = frequency_slider.value
var frequency_max = frequency_slider.max
change_frequency(frequency_slider, current_frequency_value, frequency_max)


// choose no of responses
const response_no_slider = document.getElementById('slider-no-responses')
var current_res_no_value = response_no_slider.value
var response_no_max = response_no_slider.max
change_response_no(response_no_slider, response_no_max)



//select text-model
var selectedModel = 'gpt-3.5-turbo-0125';
change_selected_model(selectedModel)

// prompt-responses transfer
promptResponseList = []
var prompt = '';
response_no = 0;
var messages = null;

// get the prompt
const button = document.getElementById('submit-button');
const promptElement = document.getElementById('prompt-text-area');
button.addEventListener('click', sendThroughClick);
storedData = null;
i=0;

// history tabs
document.getElementById('hover-button-history-bar').addEventListener('mouseover', function() {
    document.getElementById('history-bar').style.width = '250px';
});

document.getElementById('history-bar').addEventListener('mouseleave', function() {
    document.getElementById('history-bar').style.width = '0';
});


var userPrompt = null;
var tabName = null

function sendThroughClick(event) {
            userPrompt = document.getElementById('prompt-text-area').value;
            createDivPrompt(userPrompt)
            if (rememberContext == false || messages == null) {
                console.log('here')
                messages = [
                    {"role": "system", "content": role},
                    {"role": "user", "content": userPrompt}
                    ]
                i=0;
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

            }

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
//            console.log(messages)

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
            console.log('tab lists', tabList)
            if (tabName == null) {
                tabName = data['success']['tab-name'];
                console.log(current_chats_data)
                console.log(tabList);
                store_chat_tabs();
//                if (tabList != null && tabList.length != 0) {
//                console.log("tablist", tabList)
//                    tabList.push(tabName)
//                    console.log('tablist after', tabList)
//                }
//                else {
//                    tabList = [tabName]
//                    console.log('else', tabList)
//                }
//                let json_meta_data = {
//                    'chat_tab_list': tabList,
//                    'image_tab_list': null,
//                    'settings': null
//                }
//                json_meta_data = JSON.stringify(json_meta_data);
//                fetch('/store-chat-tabs/', {
//                    method: 'POST',
//                    body: json_meta_data
//                })
//                .then(response => response.json())
//                .then(metadata => {
//
//                console.log('Success:', metadata);
//                })
//                .catch(error => console.error('Error:', error));
            }
            messages.push({"role": "assistant", "content": response_text})

            // pushing data into current_chats_data
            current_chats_data.push({'prompt' : userPrompt,
                                            'response' : data['success']['response'][0]})
            console.log("current", current_chats_data)

            const final_response_text = response_text + "\nTokens used : " + tokens_used.toString();
            createDivResponse(final_response_text)
            console.log(data['success']['response'])
            console.log(messages)
            i+=1;
            console.log(current_chats_data)
            // storing chats data to database
//            if (rememberContext) {
//                last_message_list = current_chats_data.length - 1;
//
//            }
//            else {
//
//            }
            console.log("tabname given", tabName);
            fetch('/store-chats-history/', {
                    method: 'POST',
                    body: JSON.stringify({"prompt_response_dict": current_chats_data,
                                           "tab_name": tabName})
                })
                .then(response => response.json())
                .then(chats_data => {
                // operations on data
                console.log('Success:', chats_data);
                })
                .catch(error => console.error('Error:', error));

          })
          .catch(error => console.error('Error:', error));
}

//function loadTabContent() {
////    loadTabContent(messages)
//prompt_response_list = messages.forEach(function(list) {
//    list.forEach(function(dict) {
//        if (dict.role=== "user") {
//            createDivPrompt(dict['content']);
//        }
//        else if (dict.role === "assistant") {
//            createDivResponse(dict['content']);
//        }
//    })
//})
//}


// functions
function store_chat_tabs() {
    if (tabList != null && tabList.length != 0) {
                console.log("tablist", tabList)
                    tabList.push(tabName)
                    console.log('tablist after', tabList)
                }
                else {
                    tabList = [tabName]
                    console.log('else', tabList)
                }
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

                console.log('Success:', metadata);
                })
                .catch(error => console.error('Error:', error));
}

function make_clickable_tabs() {
    const tab_list = document.getElementById('file-select-sidebar');
    const tabs = Array.from(tab_list.children);
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            // remove previous divs
            const prompt_response_area = document.getElementById('prompt-responses')
            const older_divs = Array.from(prompt_response_area.children);
            // delete all except the first one that is intro
            for (let i = older_divs.length - 1; i > 0; i--) {
                older_divs[i].remove();
            }

        console.log("tabs", tab.textContent)
        dts = JSON.stringify({"current_tab_name": tab.textContent})

        console.log("dts", dts)
            fetch('/load-chats-history/', {
                method : 'POST',
                body: dts
            })
        .then(response => response.json())
        .then(chats_history => {
            console.log('Success', chats_history)
            current_chats_data = chats_history['success'];

            current_chats_data.forEach(function(prompt_response) {
                createDivPrompt(prompt_response['prompt'])
                createDivResponse(prompt_response['response'])
                console.log(prompt_response)
                tabName = tab.textContent;
            })
            console.log(current_chats_data)
            console.log(tabName)
        })

    })
})
}


}



function load_chat_tabs(tabs_list, sidebar) {
        tabs_list.forEach(function(tab) {
            const tabElement = document.createElement('li');
            tabElement.textContent = tab;
            sidebar.appendChild(tabElement)
        })
}


function make_chat_button_functional() {
    const new_chat_button = document.getElementById('new-chat-button')
    new_chat_button.addEventListener('click', function() {
    window.location.href = '';
})
}

function change_tokens(tokens_slider, current_tokens_value) {
    tokens_slider.addEventListener('change', function() {
        current_tokens_value = tokens_slider.value
        tokens_max = tokens_slider.max
        document.getElementById('slider-value').innerHTML = current_tokens_value + '/' + tokens_max;
        console.log("Token value : ", current_tokens_value)
});
}

function change_temperature(temperature_slider, current_temp_value, temperature_max) {
    temperature_slider.addEventListener('change', function() {
        current_temp_value = temperature_slider.value
        temperature_max = temperature_slider.max
        document.getElementById('slider-val').innerHTML = current_temp_value + '/' + temperature_max;
        console.log("Token value : ", current_temp_value)
});
}

function select_role(role_selector, role) {
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
}
// ajax
function set_remember_context(rememberContext, rememberContextElement) {
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
}

function set_stream(setStreamElement, setStream) {
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
}

function change_frequency(frequency_slider, current_frequency_value, frequency_max) {
frequency_slider.addEventListener('change', function() {
    current_frequency_value = frequency_slider.value
    document.getElementById('slider-freq-val').innerHTML = current_frequency_value + '/' + frequency_max;
    console.log("Frequency value : ", current_frequency_value)
    });
}

function change_response_no(response_no_slider, response_no_max) {
response_no_slider.addEventListener('change', function() {
    current_res_no_value = response_no_slider.value
    document.getElementById('slider-res-no-val').innerHTML = current_res_no_value + '/' + response_no_max;
    console.log("Response no value : ", current_res_no_value)
});
}

function change_selected_model(selectedModel) {
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
}


// Creating divs
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