window.onload = function () {


var tabList = []
var current_images_data = []


// fetch the meta data from database when windows load
fetch('/load-image-tabs/', {
                method: 'POST'
                })
                .then(response => response.json())
                .then(get_metadata => {

                console.log('Success:', get_metadata);
                const sideBarDiv = document.getElementById('file-select-sidebar');
                tabList = get_metadata['success']['image_tab_list']
                console.log(tabList)
                if (tabList != null) {
                    if(tabList.length != 0) {
                        load_chat_tabs(tabList, sideBarDiv);
                        make_clickable_tabs();
                    }
                }
                })
                .catch(error => console.error('Error:', error));

make_image_button_functional()

// input file
make_input_file_button_functional()

// Image Input button
browse_image();

// choose no of responses
var current_res_no_value = 1
change_response_no()



//select text-model
var selectedImageModel = 'dall-e-3';
change_selected_model(selectedImageModel)
console.log("selected model", selectedImageModel)

// prompt-responses transfer
promptResponseList = []
var prompt = '';

// get the prompt
const button = document.getElementById('submit-button');
const promptElement = document.getElementById('prompt-text-area');
button.addEventListener('click', sendThroughClick);
storedData = null;
i=0;

// size
size = "1024x1024"
// by default dall_e3 sizes are loaded
select_size_3();

// add dall-e-2 sizes
select_size_2();

// quality
quality = "hd";
set_quality();

// set style
var style = "vivid";
set_style()

// history tabs
show_history_button = document.getElementById('hover-button-history-bar')
show_history_button.addEventListener('mouseover', function() {
    document.getElementById('history-bar').style.width = '250px';
    show_history_button.style.display = 'none';

});

document.getElementById('history-bar').addEventListener('mouseleave', function() {
    document.getElementById('history-bar').style.width = '0';
    show_history_button.style.display = 'block';
});

//  change color and appearance on hover
//input_file_button = document.getElementById(file_input_button)


var userPrompt = null;
var tabName = null

function sendThroughClick(event) {
            userPrompt = document.getElementById('prompt-text-area').value;
            createDivPrompt(userPrompt)

            promptElement.value = ""; // Clear the input

            // Create FormData object and append variables
            const dataToSend = {
                'prompt': userPrompt,
                'model': selectedImageModel,
                'n': current_res_no_value,
                'size': size,
                'tab-name': tabName,
                "response": null,
                "style": style,
                "quality": quality
            }
//            console.log(messages)
            const jsonData = JSON.stringify(dataToSend);
            console.log(jsonData)

            // Send data using Fetch API
            fetch('/receive-img-response/', {
                method: 'POST',
                body: jsonData
            })

            .then(response => response.json())
          .then(data => {
            // operations on data
            console.log('Success:', data);

            let urls_list = data['success']['response'];
//            let response_b64 = ["https://as2.ftcdn.net/v2/jpg/01/53/54/45/1000_F_153544544_aInTyZpNa3oVSJEs8rviYX5xLo7IKwKl.jpg",
//                                "https://as2.ftcdn.net/v2/jpg/01/53/54/45/1000_F_153544544_aInTyZpNa3oVSJEs8rviYX5xLo7IKwKl.jpg",
//                                "256x256"];
//            console.log(response_b64)
            console.log('tab lists', tabList)
            if (tabName == null) {
                tabName = data['success']['tab-name'];
                console.log("TT", tabName)
                if (tabName == "not given") {
                    give_date_as_tab_name();
                }
                console.log(current_images_data)
                console.log(tabList);
                store_chat_tabs();
            }

            // pushing data into current_images_data
            current_images_data.push({'prompt' : userPrompt,
                                            'response' : data['success']['response'][0]})
            console.log("current", current_images_data)
//            image_url = data['success']['response']
              extractImageBase64(urls_list)
//              urlToBase64(urls_list[0]).then(base64 => {
//              console.log(base64); // Logs the Base64 encoded string
//                 });
//            console.log(data['success']['response'])
//            createDivResponseImage(data['success']['response'], 1024, 1024)
            console.log(current_images_data)

            console.log("tabname given", tabName);
            fetch('/store-chats-history/', {
                    method: 'POST',
                    body: JSON.stringify({"prompt_response_dict": current_images_data,
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

function make_input_file_button_functional() {
input_file_button = document.getElementById('file-input-button');
file_browse_button = document.getElementById('file-input-element');
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

function browse_image() {
const fileInput = document.getElementById('file-input-element');
const imageContainer = document.getElementById('prompt-image');

fileInput.addEventListener('change', function() {
    // Clears any existing images
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    // Gets the selected file
    const selectedFile = this.files[0];
    console.log("selected file", selectedFile)

    if (selectedFile) {
        const reader = new FileReader();
        console.log("reader", reader)
        // Reads the file as a data URL
        reader.readAsDataURL(selectedFile);

        console.log("reader after reading", reader)
        // When the file is read, creates an img element and sets its source to the data URL
        reader.onload = function(e) {
        console.log("E", e)
            const imgElement = document.getElementById('prompt-image');
            imgElement.src = e.target.result;
            console.log(e.target.result)
            imgElement.alt = 'Uploaded Image';
            imgElement.style.display = 'inline-block';
            console.log("img", imgElement)
            // Appends the img element to the image container
        }
    }
});
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
                    'chat_tab_list': null,
                    'image_tab_list': tabList,
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
    let previous_tab = null;
    const tab_list = document.getElementById('file-select-sidebar');
    const tabs = Array.from(tab_list.children);
    tabs.forEach(function(tab) {
    tab.title = tab.textContent
        tab.addEventListener('click', function() {
            if (previous_tab) {
                previous_tab.style.backgroundColor = '#d4ffff';
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
            current_images_data = chats_history['success'];

            current_images_data.forEach(function(prompt_response) {
                createDivPrompt(prompt_response['prompt'])
                createDivResponseImage(prompt_response['response'][0], 1024, 1024)
                console.log(prompt_response)
                tabName = tab.textContent;
            })
            console.log(current_images_data)
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


function change_selected_model() {
    modelDictImg = {"Dall-E 2": "dall-e-2",
                "Dall-E 3" : "dall-e-3"}

    chatModelsSelectBox = document.getElementsByClassName('imageModelSelect');
    chatModelArray = Array.from(chatModelsSelectBox);

    chatModelArray.forEach(function(model) {
            model.addEventListener('click', function() {
                if (model.textContent in modelDictImg) {
                    console.log(model.textContent)
                    selectedImageModel = modelDictImg[model.textContent];
                    document.getElementById('select-model-button').textContent = model.textContent;
                    console.log(model.textContent, selectedImageModel)
                    toggle_n_responses_view(selectedImageModel)
                    return selectedImageModel;
                }
            })
        });
}



function extractImageBase64(imageUrls) {
            let size = imageUrls[imageUrls.length - 1];

            size = size.split('x');
            let width = parseInt(size[0]);
            let height = parseInt(size[1]);
            const container = document.getElementById('content-container')
            console.log("wh", width, height)
            if (width > parseInt(755)) {
                img_width = width * 2.5/4
                img_height = height * 2.5/4
            }
            else {
                img_width = width;
                img_height = height;
            }
            console.log(width, height)
            for (let i=0; i < imageUrls.length - 1; i++) {
                console.log(imageUrls[i]);
                // Create an image element
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                // Set the image source URL
                img.src = imageUrls[i];

                console.log("wh", width, height)
                // Create a canvas element
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                // When the image has loaded, draw it onto the canvas
                img.onload = function() {
                    // Set canvas dimensions to match the image
                    canvas.width = width;
                    canvas.height = height;
                    console.log("loading")
                    // Draw the image onto the canvas
                    ctx.drawImage(img, 0, 0);

                    // Get the Base64-encoded data from the canvas
                    let base64Data = canvas.toDataURL('image/png'); // Change to 'image/png' if needed
                    console.log(base64Data)
                    // Log or use the Base64 data as needed
                    createDivResponseImage(base64Data, img_width, img_height, width, height)
                };
            }

        }


async function urlToBase64(imageUrls) {
    let size = imageUrls[imageUrls.length - 1];
    url = imageUrls[0]
    size = size.split('x');
    width = parseInt(size[0]);
    height = parseInt(size[1]);
//    for (i=0; i < imageUrls.length - 2; i++) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();

            const reader = new FileReader();

            const base64data = new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };

                reader.onerror = reject;

                reader.readAsDataURL(blob);
            });

            return await base64data;
        } catch (error) {
            console.error('Error converting URL to Base64:', error);
        }
//    }
}


function toggle_n_responses_view(selectedImageModel) {
    dall_e2_size = document.getElementById('dall-e-2-sizes')
    dall_e3_size = document.getElementById('dall-e-3-sizes')
    quality_element = document.getElementById('quality')
    slider_response_no = document.getElementById('slider-container-img-responses')
    style_element = document.getElementById('style');
    if (selectedImageModel == "dall-e-3") {
        slider_response_no.style.display = 'none';
        current_res_no_value = 1;
        dall_e3_size.style.display = 'block';
        dall_e2_size.style.display = 'none';
        quality_element.style.display = 'block';
        style_element.style.display = 'block';

    }
    else if (selectedImageModel == "dall-e-2") {
        size = "256x256"
        slider_response_no.style.display = 'block';
        current_res_no_value = 1;
        dall_e3_size.style.display = 'none';
        dall_e2_size.style.display = 'block';
        quality_element.style.display = 'none';
        style_element.style.display = 'none';
    }
}
// removed from here



function select_size_3() {
        // select size
        dall_e3_sizes = document.getElementById('dall-e-3-sizes');
        const size_inputs = dall_e3_sizes.querySelectorAll('input[name="select-size_"]');
        const size_arr_3 = Array.from(size_inputs);
        console.log(size_arr_3)
        size_arr_3.forEach(function(size_element) {
            size_element.addEventListener('click', function() {
                size = size_element.value
                console.log(size)
            })
})
}

function select_size_2() {
        // select size
        dall_e2_sizes = document.getElementById('dall-e-2-sizes');
        const size_inputs = dall_e2_sizes.querySelectorAll('input[name="select-size"]');
        const size_arr_2 = Array.from(size_inputs);
        console.log(size_arr_2)
        size_arr_2.forEach(function(size_element) {
            size_element.addEventListener('click', function() {
                size = size_element.value
                console.log(size)
            })
})
}

function set_quality() {
        quality_element = document.getElementById('quality')
        const quality_inputs = quality_element.querySelectorAll('input[name="select-quality"]');
        const quality_arr = Array.from(quality_inputs);
        quality_arr.forEach(function(quality_element) {
            quality_element.addEventListener('click', function() {
                quality = quality_element.value
                console.log(quality)
        })
        })
        }

function set_style() {
        style_element = document.getElementById('style');
        const style_inputs = style_element.querySelectorAll('input[name="select-style"]');
        const style_arr = Array.from(style_inputs);
        style_arr.forEach(function(style_element) {
            style_element.addEventListener('click', function() {
                style = style_element.value
                console.log(style)
    })
    })
    }

function load_chat_tabs(tabs_list, sidebar) {
        for (let i = tabs_list.length - 1; i >= 0; i--) {
        const tabElement = document.createElement('li');
        tabElement.textContent = tabs_list[i];
        sidebar.appendChild(tabElement);
    }
}


function make_image_button_functional() {
    const new_image_button = document.getElementById('new-image-button')
    new_image_button.addEventListener('click', function() {
    window.location.href = '/imageGenerator';
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

function change_response_no() {
const response_no_slider = document.getElementById('slider-no-responses')
let response_no_max = response_no_slider.max
response_no_slider.addEventListener('change', function() {
    current_res_no_value = response_no_slider.value
    document.getElementById('slider-res-no-val').innerHTML = current_res_no_value + '/' + response_no_max;
    console.log("Response no value : ", current_res_no_value)
    return current_res_no_value;
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

function createDivResponseImage(response_b64, width, height, full_width, full_height) {
    // get main div
    const container_prompt_responses = document.getElementById('prompt-responses')

//    // create main div and assign class
    const responseDiv = document.createElement('div');
    responseDiv.setAttribute('class', 'response-div');

    //create image div with in it
    const response_img = document.createElement('img');
    response_img.setAttribute('class', 'response');
    response_img.setAttribute('src', response_b64);
    response_img.setAttribute('width', width);
    response_img.setAttribute('height', height);

    // add child to it
    responseDiv.appendChild(response_img);
    container_prompt_responses.appendChild(responseDiv);


    // adding other image buttons for image editing
    const edit_button = document.createElement('img')
    const variation_button = document.createElement('img')
    const copy_button = document.createElement('img')
    const download_button = document.createElement('img')
    const full_screen_button = document.createElement('img')

    //giving sources to each image
    edit_button.setAttribute('src', staticUrls.editButton)
    variation_button.setAttribute('src', staticUrls.variationButton)
    copy_button.setAttribute('src', staticUrls.copyButton)
    download_button.setAttribute('src', staticUrls.downloadButton)
    full_screen_button.setAttribute('src', staticUrls.fullScreenButton)

    // giving classes to each button
    edit_button.setAttribute('class', 'img-option')
    edit_button.setAttribute('title', 'Edit Image')
    variation_button.setAttribute('class', 'img-option')
    variation_button.setAttribute('title', 'Make Variations')
    copy_button.setAttribute('class', 'img-option')
    copy_button.setAttribute('title', 'Copy Image')
    download_button.setAttribute('class', 'img-option')
    download_button.setAttribute('title', 'Download Image')
    full_screen_button.setAttribute('class', 'img-option')
    full_screen_button.setAttribute('title', 'Full Screen')

    // adding event listeners to all options to change image
    edit_button.addEventListener('mouseenter', function() {
        edit_button.setAttribute('src', staticUrls.editButtonHover)
    })
    edit_button.addEventListener('mouseleave', function() {
        edit_button.setAttribute('src', staticUrls.editButton)
    })
    variation_button.addEventListener('mouseenter', function() {
        variation_button.setAttribute('src', staticUrls.variationButtonHover)
    })
    variation_button.addEventListener('mouseleave', function() {
        variation_button.setAttribute('src', staticUrls.variationButton)
    })
    copy_button.addEventListener('mouseenter', function() {
        copy_button.setAttribute('src', staticUrls.copyButtonHover)
    })
    copy_button.addEventListener('mouseleave', function() {
        copy_button.setAttribute('src', staticUrls.copyButton)
    })
    download_button.addEventListener('mouseenter', function() {
        download_button.setAttribute('src', staticUrls.downloadButtonHover)
    })
    download_button.addEventListener('mouseleave', function() {
        download_button.setAttribute('src', staticUrls.downloadButton)
    })
    full_screen_button.addEventListener('mouseenter', function() {
        full_screen_button.setAttribute('src', staticUrls.fullScreenButtonHover)
    })
    full_screen_button.addEventListener('mouseleave', function() {
        full_screen_button.setAttribute('src', staticUrls.fullScreenButton)
    })

    // add eventlistners for functions
//    full_screen_button.addEventListener('click', function() {
//
//    })

full_screen_button.addEventListener('click', function() {
    // Create the modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.setAttribute('class', 'modalOverlay')

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modalContent')

    // Create the close button
    const closeButtonModal = document.createElement('img');
    closeButtonModal.setAttribute('class', 'img-close-modal')
    closeButtonModal.setAttribute('src', staticUrls.closeButtonModal)

    const para = document.createElement('p')
    para.textContent = "Full Screen"

    const image_full_screen = document.createElement('img')
    image_full_screen.setAttribute('src', response_b64);
    image_full_screen.setAttribute('width', full_width);
    image_full_screen.setAttribute('height', full_height);

    document.body.style.overflow = 'hidden'

    // Append the close button to the modal content
    modalContent.appendChild(para)
    modalContent.appendChild(closeButtonModal);
    modalContent.appendChild(image_full_screen)

    // Append the modal content to the modal overlay
    modalOverlay.appendChild(modalContent);

    // Append the modal overlay to the body
    document.body.appendChild(modalOverlay);

    // Close the modal when the close button is clicked
    closeButtonModal.addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
        document.body.style.overflow = 'scroll'

    });
});

    // making main-options div
    let img_options = document.createElement('div')
    img_options.setAttribute('class', 'img-options')
    img_options.appendChild(edit_button)
    img_options.appendChild(variation_button)
    img_options.appendChild(copy_button)
    img_options.appendChild(download_button)
    img_options.appendChild(full_screen_button)

    // appending to the main prompt-responses div
    responseDiv.appendChild(img_options)

    // add event listener to display image-options
    response_img.addEventListener('mouseenter', function() {
        img_options.style.display = 'block'
    })
    response_img.addEventListener('mouseleave', function() {
        img_options.style.display = 'none'
    })

    img_options.addEventListener('mouseenter', function() {
        img_options.style.display = 'block'
        img_options.style.opacity = 1
    })
    img_options.addEventListener('mouseleave', function() {
        img_options.style.display = 'none'
        img_options.style.opacity = 0.7
    })

    console.log(response_b64)
//    add text to prompt text element
//    response_text.innerText = response;
}

}