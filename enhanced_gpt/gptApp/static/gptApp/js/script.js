import {SidebarSelectbar, AddSidebarSlider, SidebarInput, AddCheckboxSidebar} from './functions.js';
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

// adding sidebar elements
const role = new SidebarInput("role", "role", "Enter the Role", "Current Role : ", "You are a Helpful Assistant");
role.updateInput(role.input);

const tokens = new AddSidebarSlider("tokens", "tokens", 0, 4000, 2000, 100, "Max Tokens : ");
tokens.updateValue();

const temperature = new AddSidebarSlider("temperature", "temperature", 0, 1, 0.5, 0.05, "Temperature : ");
temperature.updateValue();

const frequency = new AddSidebarSlider("frequency", "frequency", -2, 2, 1, 0.1, "Frequency : ");
frequency.updateValue();

const responses = new AddSidebarSlider("responses", "responses", 1, 5, 1, 1, "Responses : ");
responses.updateValue();

const model = new SidebarSelectbar("Image Selector", "select-img", ['gpt-3.5-turbo-0125', 'gpt-4-turbo', 'gpt-4', 'gpt-4o'], "Select Model", 'gpt-3.5-turbo-0125');
const rememberContext = new AddCheckboxSidebar("remember-context", "remember-context", ". Remember Context", false);
const setStream = new AddCheckboxSidebar("set-stream", "stream", ". Stream", false);


const fileInput = document.getElementById('file-input-element');
const imageContainer = document.getElementById('prompt-image');
fileInput.addEventListener('change', function() {
    // Clears any existing images
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    // Gets the selected file
    const selectedFile = this.files[0];

    if (selectedFile) {
        const reader = new FileReader();

        // Reads the file as a data URL
        reader.readAsDataURL(selectedFile);

        // When the file is read, creates an img element and sets its source to the data URL
        reader.onload = function(e) {
            const imgElement = document.getElementById('prompt-image');
            imgElement.src = e.target.result;
            imgElement.alt = 'Uploaded Image';
            imgElement.style.display = 'inline-block';
            // Appends the img element to the image container
            imageContainer.appendChild(imgElement);
        }
    }
});

// input file
make_input_file_button_functional()

const promptResponseList = []
var prompt = '';
let response_no = 0;
var messages = null;

// get the prompt
const button = document.getElementById('submit-button');
const promptElement = document.getElementById('prompt-text-area');
// send prompt through click or enter button
button.addEventListener('click', sendThroughClick);
promptElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendThroughClick(event);
    }
});
let storedData = null;
let i=0;

// history tabs
const show_history_button = document.getElementById('hover-button-history-bar')
show_history_button.addEventListener('mouseover', function() {
    document.getElementById('history-bar').style.width = '250px';
    show_history_button.style.display = 'none';

});

document.getElementById('history-bar').addEventListener('mouseleave', function() {
    document.getElementById('history-bar').style.width = '0';
    show_history_button.style.display = 'block';
});


var userPrompt = null;
var tabName = null

function sendThroughClick(event) {
            userPrompt = document.getElementById('prompt-text-area').value;
            createDivPrompt(userPrompt)
            document.getElementById('load-animation').style.display = 'flex';
            if (rememberContext == false || messages == null) {
                console.log('here')
                messages = [
                    {"role": "system", "content": role},
                    {"role": "user", "content": userPrompt}
                    ]
                }
                else {
                    messages.push({"role": "user", "content": userPrompt})


            }

            promptElement.value = ""; // Clear the input

            // Create FormData object and append variables
            const dataToSend = {
                'messages': messages,
                'model': model.selected,
                'tokens': tokens.currentValue,
                'frequency': frequency.currentValue,
                'no-responses': responses.currentValue,
                'temperature': temperature.currentValue,
                'remember_context': rememberContext.Checked,
                'stream': setStream.Checked,
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
                console.log("TT", tabName)
                if (tabName == "not given") {
                    give_date_as_tab_name();
                }
                console.log(current_chats_data)
                console.log(tabList);
                store_chat_tabs();
            }
            messages.push({"role": "assistant", "content": response_text})

            // pushing data into current_chats_data
            current_chats_data.push({'prompt' : userPrompt,
                                            'response' : data['success']['response'][0]})
            console.log("current", current_chats_data)

            const final_response_text = response_text + "\nTokens used : " + tokens_used.toString();
            document.getElementById('load-animation').style.display = 'none';
            createDivResponse(final_response_text, current_chats_data.length - 1)
            console.log(data['success']['response'])
            console.log(messages)
            i+=1;
            console.log(current_chats_data)

            store_chats_history()

          })
          .catch(error => console.error('Error:', error));
}

// functions
function store_chat_tabs() {
    if (tabList != null && tabList.length != 0) {
        console.log("tablist", tabList)
        for(i=0; i<tabList.length; i++) {
            if (tabName == tabList[i])
            {
                give_date_as_tab_name();
                break;
            }
        }
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

function make_input_file_button_functional() {
const input_file_button = document.getElementById('file-input-button');
const file_browse_button = document.getElementById('file-input-element');
const send_button = document.getElementById('submit-button')
input_file_button.addEventListener('click', function() {
    file_browse_button.click();
});

const input_img = document.getElementById('file-input-image')
input_file_button.addEventListener('mouseenter', function() {
    input_img.src = staticUrls.inputImageButtonHover
})
input_file_button.addEventListener('mouseleave', function() {
    input_img.src = staticUrls.inputImageButton
})

const submit_image = document.getElementById('submit-image')
send_button.addEventListener('mouseenter', function() {
    submit_image.src = staticUrls.sendButtonHover
})
send_button.addEventListener('mouseleave', function() {
    submit_image.src = staticUrls.sendButton
})
}

var tabs;
var tab_clicked_index;

function make_clickable_tabs() {
    let previous_tab = null;
    var tab_list = document.getElementById('file-select-sidebar');
    tabs = Array.from(tab_list.children);
    tabs.forEach(function(tab, index) {
    tab_clicked_index = index;
    tab.title = tab.textContent
        tab.addEventListener('click', function() {
            if (previous_tab) {
                previous_tab.style.backgroundColor = 'gainsboro';
                previous_tab.style.color = 'black';
            }
            // make tabs appeared as selected
            tab.style.backgroundColor = '#808080';
            tab.style.color = 'white';
            previous_tab = tab;
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

            current_chats_data.forEach(function(prompt_response, index) {
                createDivPrompt(prompt_response['prompt'])
                createDivResponse(prompt_response['response'], index)
                tabName = tab.textContent;
                console.log(prompt_response)
            })
            len_current_chats = current_chats_data.length;
            messages = [
                    {"role": "system", "content": role},
                    {"role": "user", "content": current_chats_data[len_current_chats - 1]['prompt']},
                    {"role": "assistant", "content": current_chats_data[len_current_chats - 1]['response']}
                    ]
            console.log("previous prompt response", messages[1]['content'], messages[2]['content'])
            console.log("current_chats", current_chats_data)
            console.log(tabName)
        })

    })
})
}

function give_date_as_tab_name() {
    let now = new Date();
    dateTime = now.toString();
    tabName = dateTime.slice(0,24)
    console.log("tabname : ", tabName)
}


function load_chat_tabs(tabs_list, sidebar) {
        for (let i = tabs_list.length - 1; i >= 0; i--) {
        const tabElement = document.createElement('li');
        tabElement.textContent = tabs_list[i];
        sidebar.appendChild(tabElement);
    }
}


function make_chat_button_functional() {
    const new_chat_button = document.getElementById('new-chat-button')
    new_chat_button.addEventListener('click', function() {
    window.location.href = '';
})
}

function store_chats_history() {
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

function createDivResponse(response, index) {

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
//    container_prompt_responses.appendChild(responseDiv);

    renderMarkdown(response, response_text);

    // creating options div
    let options = document.createElement('div');
    options.setAttribute('class', 'text-options');

    // options for option div
    const copy_button = document.createElement('img')
    const delete_button = document.createElement('img')
    const download_button = document.createElement('img')

    copy_button.setAttribute('src', staticUrls.copyButton)
    delete_button.setAttribute('src', staticUrls.deleteButton)
    download_button.setAttribute('src', staticUrls.downloadButton)

    copy_button.setAttribute('class', 'img-option')
    copy_button.setAttribute('title', 'Copy Response')
    delete_button.setAttribute('class', 'img-option')
    delete_button.setAttribute('title', 'Delete Response')
    download_button.setAttribute('class', 'img-option')
    download_button.setAttribute('title', 'Download as PDF')

    copy_button.addEventListener('mouseenter', function() {
        copy_button.setAttribute('src', staticUrls.copyButtonHover)
    })
    copy_button.addEventListener('mouseleave', function() {
        copy_button.setAttribute('src', staticUrls.copyButton)
    })
    delete_button.addEventListener('mouseenter', function() {
        delete_button.setAttribute('src', staticUrls.deleteButtonHover)
    })
    delete_button.addEventListener('mouseleave', function() {
        delete_button.setAttribute('src', staticUrls.deleteButton)
    })
    download_button.addEventListener('mouseenter', function() {
        download_button.setAttribute('src', staticUrls.downloadButtonHover)
    })
    download_button.addEventListener('mouseleave', function() {
        download_button.setAttribute('src', staticUrls.downloadButton)
    })


    // add copy button functionality
    copy_button.addEventListener('click', function() {
        copyTextToClipboard(response)
    })

    delete_button.addEventListener('click', function() {
        current_chats_data.splice(0, 1) // remove 1 item at index
        console.log("current chats data", current_chats_data)
        store_chats_history()
        tabs[tab_clicked_index].dispatchEvent(new MouseEvent('click'));
    })

    options.appendChild(copy_button)
    options.appendChild(download_button)
    options.appendChild(delete_button)

    responseDiv.appendChild(options)

    container_prompt_responses.appendChild(responseDiv)

    responseDiv.addEventListener('mouseenter', function() {
        options.style.display = 'inline'
    })
    responseDiv.addEventListener('mouseleave', function() {
        options.style.display = 'block'
    })

    options.addEventListener('mouseenter', function() {
        options.style.display = 'block'
        options.style.opacity = 1
    })
    options.addEventListener('mouseleave', function() {
        options.style.display = 'none'
        options.style.opacity = 0.7
    })




}

function copyTextToClipboard(response_text) {
    navigator.clipboard.writeText(response_text).then(function() {
        console.log('Text copied to clipboard');
    }).catch(function(error) {
        console.error('Failed to copy text: ', error);
    });
}

}