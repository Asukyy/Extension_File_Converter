document.addEventListener('DOMContentLoaded', function () {
    const fileConverterForm = document.getElementById('fileConverterForm');
    const outputMessage = document.getElementById('outputMessage');

    fileConverterForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('file');
        const formatSelect = document.getElementById('convert');
        const selectedFormat = formatSelect.value;

        if (fileInput.files.length === 0) {
            outputMessage.textContent = 'Please select a file to convert.';
            return;
        }

        const file = fileInput.files[0];

        const convertedFileName = file.name.replace(/\.[^.]+$/, `.${selectedFormat}`);
        const convertedFile = new File([await convertFile(file, selectedFormat)], convertedFileName, {
            type: `image/${selectedFormat}`,
        });

        downloadFile(convertedFile);

        outputMessage.textContent = 'Conversion completed. Click the link to download the converted file.';
    });
});

async function convertFile(file, format) {
    if (format === 'webp') {
        const blob = await file.arrayBuffer();
        const dataUrl = `data:image/${format};base64,${btoa(new Uint8Array(blob).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
        return fetch(dataUrl).then(response => response.blob());
    } else {
        // Gérez d'autres formats de conversion ici
        return null;
    }
}

function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
}
