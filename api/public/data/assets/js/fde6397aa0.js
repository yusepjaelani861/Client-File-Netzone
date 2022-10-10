const api = '80daa38629dc182cbfd2a26f68b85cee';
const url = 'http://localhost:8000';
const css = url + '/data/assets/css/upload.css';
const head = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = css;
head.appendChild(link);

const upload = document.querySelector("#nearven-upload");

upload.innerHTML = `
<button class="btn">
<div class="drag-area-nearven">
<span role="img" aria-label="inbox" class="icon"><svg viewBox="0 0 1024 1024" focusable="false" data-icon="inbox" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path></svg></span>
<header>Click or drag file to this area to upload</header>
<p class="mini-text">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
<input type="file" multiple hidden>
</div>
</button>
<div id="list-upload" class="list"></div>
`;

const dropArea = upload.querySelector(".drag-area-nearven"),
dragText = upload.querySelector("header"),
button = upload.querySelector("button"),
list = upload.querySelector("#list-upload"),
input = upload.querySelector("input");

button.onclick = () => {
    input.click();
}

input.addEventListener("change", function () {
    // file selected
    if (this.files.length > 1) {
        const files = this.files;
        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i]);
        }
    } else if (this.files.length == 1) {
        uploadFile(this.files[0]);
    }
})

// if user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault(); // prevent default behaviour
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
})

// if user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
})

// if user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
    event.preventDefault(); // prevent default behaviour
    let files = event.dataTransfer.files; // getting user select file and store in files variable
    list.innerHTML += `
    <h1 class="title-list">List Uploaded</h1>`
    if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadFile(file);
        }
    } else {
        const file = files[0];
        uploadFile(file);
    }
})

function uploadFile(file) {
    let xhr = new XMLHttpRequest(); // create new XMLHttpRequest
    xhr.open("POST", url + '/api/v1/upload/single'); // open connection
    xhr.setRequestHeader("apikey", api);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let response = xhr.response;
                list.innerHTML += `
                <div class="item" style="display:flex; flex-direction: column; padding: 10px">
                <span class="file-name">Name : ${JSON.parse(response).data.name}</span>
                <span class="file-size">Size : ${convertSize(JSON.parse(response).data.size)}</span>
                <span class="file-url">URL : ${
                    JSON.parse(response).data.url
                }</span>
                </div>
                `
            }
        } 
    }
    let formData = new FormData(); // create new FormData
    formData.append("file", file); // append the file to FormData
    xhr.send(formData); // send the FormData to server
}

function convertSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}