export function SidebarSelectbar(name, id, selectOptions, labelTextInfo, defaultSelected) {
    this.name = name;
    this.id = id;
    this.selectOptions = selectOptions;
    this.labelTextInfo = labelTextInfo;
    this.selected = defaultSelected;

    // get
    const sidebar = document.getElementById('sidebar');

    //creating elements
    const selectbarDiv = document.createElement('div');
    const label = document.createElement('label');
    const button = document.createElement('button');
    const brElement = document.createElement('br');
    const dropDown = document.createElement('ul');

    // adding properties
    label.setAttribute('for', `${this.id}`);
    label.classList.add('item', 'align-left');
    label.innerHTML = this.labelTextInfo;



    button.setAttribute('id', `${this.id}`);
    button.classList.add('btn', 'btn-secondary', 'dropdown-toggle')
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'dropdown');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = this.selected;

    dropDown.setAttribute('class', 'dropdown-menu');

    // creating all list items
    for(let i=0; i<selectOptions.length; i++) {
        const listItem = document.createElement('li');
        listItem.classList.add('dropdown-item');
        listItem.textContent = selectOptions[i];
        listItem.addEventListener('click', function() {
            button.textContent = selectOptions[i];
            this.selected = selectOptions[i];
        })
        dropDown.append(listItem);
    }

    selectbarDiv.append(label, brElement, button, dropDown);
    selectbarDiv.display = 'flex';
    selectbarDiv.setAttribute('flex-direction', 'column');
    sidebar.append(selectbarDiv);


}

export function SidebarInput(name, id, labelTextInfo, labelTextStatus, labelTextCurrent) {
    this.name = name;
    this.labelText = labelTextInfo;
    this.labelTextStatus = labelTextStatus;
    this.labelTextCurrent = labelTextCurrent;
    this.currentValue = labelTextCurrent;
    this.id = id;
    this.input_id = `${id}_input`

    // getting elements
    document.getElementById('sidebar');

    // creating elements
    let inputDiv = document.createElement('div');
    let label = document.createElement('label')
    this.input = document.createElement('input');
    let infoTextPara = document.createElement('p');
    let span = document.createElement('span');

    // Assigning attributes
    inputDiv.id = this.id;

    label.setAttribute('for', `${this.input_id}`);
    label.textContent = this.labelText;

    this.input.type = 'text';
    this.input.id = this.input_id;
    this.input.name = this.input_id;

    const boldSelectedInput = `<b><span>${this.labelTextCurrent}</span></b>`


    // appending

    infoTextPara.innerHTML = (this.labelTextStatus + boldSelectedInput);


    inputDiv.append(label, this.input, infoTextPara);

    sidebar.append(inputDiv);

    this.updateInput = function(input) {
        input.addEventListener('keydown', function() {
        if (event.key ==='Enter') {
            this.currentValue = input.value;
            if (role != "") {
            infoTextPara.innerHTML = `${labelTextStatus}<b>${this.currentValue}</b>`;
            input.value = "";
            }
        }
    });
    }

    return this.labelTextCurrent;
}

export function AddSidebarSlider(name, id, minValue, maxValue, currentValue, step, labelText) {
    // attributes
    this.name = name;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.labelText = labelText;
    this.id = id;
    this.currentValue = currentValue;
    this.step = step;

    // get
    const sidebar = document.getElementById('sidebar');

    // label
    // create
    const sliderDiv = document.createElement('div');
    const slider = document.createElement('input');
    const label = document.createElement('label');


    // setting attributes
    label.setAttribute('for', `${this.name}`);
    label.textContent = `${this.labelText}`;

    // input
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'range');
    this.input.setAttribute('id', `${id}`);
    this.input.setAttribute('name', `${name}`);
    this.input.setAttribute('min', minValue);
    this.input.setAttribute('max', maxValue);
    this.input.setAttribute('step', this.step);
    this.input.setAttribute('value', currentValue);

    // info
    const infoTextPara = document.createElement('p');
    this.span = document.createElement('span');
    this.span.id = 'slider-value';
    this.span.innerHTML = `Value : ${this.currentValue}/${this.maxValue}`;

    // appending
    infoTextPara.append(this.span);

    sliderDiv.append(label);
    sliderDiv.append(this.input);
    sliderDiv.append(infoTextPara);

    sidebar.append(sliderDiv);

    this.updateValue = function () {
    // saving object this in self so to use it later in below event listener.
    const self = this;
    this.input.addEventListener('change', function() {
        self.currentValue = self.input.value;
        self.span.innerHTML = `Value : ${self.currentValue}/${self.maxValue}`;
});
}
}

export function AddCheckboxSidebar(name, id, labelText, isChecked) {
    this.name = name;
    this.id = id;
    this.checked = isChecked;
    this.labelText = labelText;

    // get
    const sidebar = document.getElementById('sidebar');

    // create
    const checkboxDiv = document.createElement('div');
    const heading = document.createElement('h6');
    const input = document.createElement('input');
    const label = document.createElement('label');

    // set attributes
    input.type = 'checkbox';
    input.id = id;
    if (this.checked) input.checked = true;

    label.setAttribute('for', id);
    label.textContent = this.labelText;

    // appending
    heading.append(input, label);
    checkboxDiv.append(heading);

    sidebar.append(checkboxDiv);

}