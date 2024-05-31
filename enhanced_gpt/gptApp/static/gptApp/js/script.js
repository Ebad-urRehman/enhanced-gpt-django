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
function updateSliderValuesTokens(sliderId, sliderValueText, maxValue) {
       document.getElementById('sliderValue').textContent = sliderValueText + '/' + maxValue;
       return sliderValueText;
};

function updateSliderValuesTemperature(sliderId, sliderValueText, maxValue) {
       document.getElementById('sliderVal').textContent = sliderValueText + '/' + maxValue;
       return sliderValueText;
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
var prompt = ''
function sendThroughCtrlEnter(event, user_prompt) {
    if (user_prompt != undefined && user_prompt !== '') {
        if (event.ctrlKey && event.key ==='Enter') {
            prompt = user_prompt;
            console.log(prompt);
        }
    }
}

function sendThroughClick() {
    prompt = document.getElementById('prompt-text-area').value;
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