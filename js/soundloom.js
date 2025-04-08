document.addEventListener("DOMContentLoaded", () => {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let isPlaying = false;
    let currentSample = [];
    let bpm = 120;
    let intervalId = null;
  
    // Dummy samples
    const dummySamples = [
      'samples/kick.wav',
      'samples/snare.wav',
      'samples/hihat.wav',
      'samples/ambient.wav',
      'samples/raindrop.wav',
      'samples/bass.wav',
      'samples/loop.wav',
      'samples/vocal.wav'
    ];
  
    // Load Dummy Samples
    let sampleBuffers = [];
    const loadSample = (url, index) => {
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => {
          sampleBuffers[index] = buffer;
          const button = document.createElement("button");
          button.innerText = `Sample ${index + 1}`;
          button.classList.add("bg-blue-500", "hover:bg-blue-600", "px-4", "py-2", "rounded-xl");
          button.onclick = () => playSample(buffer);
          document.getElementById('sampleSelect').appendChild(button);
        })
        .catch(error => console.error('Error loading sample:', error));
    };
  
    // Play Sample
    const playSample = (buffer) => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      let source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    };
  
    // Create the Pattern Grid
    const createGrid = () => {
      const grid = document.getElementById('grid');
      for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('bg-gray-700', 'h-16', 'w-16', 'cursor-pointer', 'flex', 'items-center', 'justify-center');
        cell.onclick = () => toggleStep(i);
        grid.appendChild(cell);
      }
    };
  
    // Toggle Steps
    const toggleStep = (index) => {
      const step = document.getElementById('grid').children[index];
      step.classList.toggle('bg-blue-500');
      currentSample[index] = currentSample[index] ? null : sampleBuffers[0];  // Temporary logic to play sample[0]
    };
  
    // Play Sequence
    const playSequence = () => {
      if (isPlaying) {
        clearInterval(intervalId);
        isPlaying = false;
        document.getElementById('playBtn').innerText = "Play";
      } else {
        let stepIndex = 0;
        intervalId = setInterval(() => {
          if (currentSample[stepIndex]) {
            playSample(currentSample[stepIndex]);
          }
          stepIndex = (stepIndex + 1) % 16;
        }, (60 / bpm) * 1000);
        isPlaying = true;
        document.getElementById('playBtn').innerText = "Stop";
      }
    };
  
    // Initialize BPM and Buttons
    document.getElementById('bpmSlider').addEventListener('input', (e) => {
      bpm = e.target.value;
      document.getElementById('bpmDisplay').innerText = bpm;
    });
  
    document.getElementById('playBtn').addEventListener('click', playSequence);
    document.getElementById('stopBtn').addEventListener('click', () => clearInterval(intervalId));
  
    // Load Dummy Samples
    dummySamples.forEach((sample, index) => loadSample(sample, index));
  
    // Create Grid
    createGrid();
  });
  