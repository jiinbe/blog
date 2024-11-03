const input = document.getElementById('upload');
const canvas = document.getElementById('preview');
const context = canvas.getContext('2d');
const ph = document.getElementById('placeholder');
const dlLink = document.getElementById('download-link');
      dlLink.hidden = true
const frameImage = new Image();
frameImage.src = 'mask.png'; // Replace with the path to your frame image

input.addEventListener('change', drawImageFromInput);

function drawImageFromInput(callback) {
context.clearRect(0, 0, 1024, 1035);

if (input.files.length === 0) {
context.drawImage(ph, 0, 0, 1024, 1035);
if (typeof callback === 'function') callback();
} else {
const img = new Image();
img.addEventListener('load', function () {
size = Math.min(img.height, img.width);
x1 = 0;
y1 = 0;
if (img.height < img.width) {
//breit
x1 = img.width / 2 - size / 2;
} else if (img.height > img.width) {
//hoch
y1 = img.height / 2 - size / 2;
}
context.drawImage(img, x1, y1, size, size, 0, 0, 1024, 1035);
context.drawImage(frameImage, 0, 0, 1024, 1035); // Add this line to apply the frame

prepareDownloadLink();

if (typeof callback === 'function') callback();
});
img.src = URL.createObjectURL(input.files[0]);
}
}

function prepareDownloadLink() {
if (input.files[0]) {
dlLink.setAttribute(
'download',
input.files[0].name.replace(/[^\\\/]*$/, 'twibbon.png')
);
}
dlLink.hidden = false;
dlLink.href = canvas.toDataURL();
}

placeholder.onload = drawImageFromInput;

// function
function share(){
// Web Share API
if (navigator.share !== undefined){
// CanvasをBlob
canvas.toBlob( (blob) => {
const shareImg = new File([blob], 'share.png', {type: 'image/png'})
// 
navigator.share({
title: "Twibbon Generator",
text: "Bingkai profil Anda dengan warna kebebasan. Biarkan foto profil Anda berbicara banyak tentang perdamaian dan keadilan.",
url: "https://jiinbe.github.io/freedom/",
files: [shareImg]
})
})
} else {
// alert("")
}
}

const link_btn = document.getElementById('share');
link_btn.addEventListener('click', async () => share());
