const video = document.getElementById('videoInput');
const startButton = document.getElementById('startRecognition');
const statusElement = document.getElementById('status');

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/webapp/public/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/webapp/public/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/webapp/public/models')
]).then(startCamera);

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
                adjustCanvasSize();
            });
        })
        .catch(err => console.error("Error accessing the camera: ", err));
}

startButton.addEventListener('click', async () => {
    statusElement.textContent = "Please wait...";
    await recognizeFaces();
    statusElement.textContent = "Ready";
});

function adjustCanvasSize() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
        const videoRatio = video.videoWidth / video.videoHeight;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let newWidth = viewportHeight * videoRatio;
        if (newWidth > viewportWidth) {
            newWidth = viewportWidth;
            canvas.height = newWidth / videoRatio;
        } else {
            canvas.height = viewportHeight;
        }

        canvas.width = newWidth;
        video.style.width = `${newWidth}px`;
        video.style.height = `${canvas.height}px`;

        const displaySize = { width: canvas.width, height: canvas.height };
        faceapi.matchDimensions(canvas, displaySize);
    }
}

async function recognizeFaces() {
    const labeledDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    adjustCanvasSize();

    window.addEventListener('resize', adjustCanvasSize); // Adjust canvas size on window resize

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
        const displaySize = { width: canvas.width, height: canvas.height };
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
            drawBox.draw(canvas);
        });
    }, 100);
}

function loadLabeledImages() {
    const labels = ['Black Widow', 'Captain America', 'Hawkeye', 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel', 'Raica'];
    return Promise.all(
        labels.map(async (label) => {
            const descriptions = [];
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`../public/labeled_images/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }
          //  document.body.append(label + ' Faces Loaded | ');
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
}
