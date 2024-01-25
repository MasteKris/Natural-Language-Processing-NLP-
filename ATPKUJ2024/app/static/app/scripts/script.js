document.addEventListener('DOMContentLoaded', function () {
    // Nas³uchiwacz zdarzeñ dla przycisku "Check"
    var checkButton = document.getElementById('checkButton');
    if (checkButton) {
        checkButton.addEventListener('click', function () {
            var text = document.getElementById('tekst').value;

            // Wywo³anie funkcji do analizy tekstu
            analyzeText(text);
        });
    }

    // Nas³uchiwacz zdarzeñ dla przycisku "Upload File"
    var uploadButton = document.getElementById('uploadButton');
    if (uploadButton) {
        uploadButton.addEventListener('click', function () {
            loadFile();
        });
    }
});

// Funkcja do analizy tekstu
function analyzeText(text) {
    $.ajax({
        url: '/analyze_text/',
        data: {
            text: text
        },
        dataType: 'json',
        success: function (result) {
            // Wywo³anie funkcji do wyœwietlenia wyników
            displayResults(result);
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

// Funkcja do wczytywania pliku
function loadFile() {
    var fileInput = document.getElementById('fileInput');

    if (fileInput.files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var fileContent = e.target.result;
        document.getElementById('tekst').value = fileContent;
    };

    reader.readAsText(file);
}

// Funkcja do wyœwietlania wyników analizy tekstu
function displayResults(result) {
    var textToCheck = document.getElementById('tekst').value;
    var resultsSection = document.getElementById('resultsSection2');
    resultsSection.innerHTML = '';

    // Wyœwietlenie wyników analizy
    var analysisResults = "<p>Input Text: " + textToCheck + "</p>" +
        "<p>Word Count: " + result.word_count + "</p>" +
        "<p>Average Word Length: " + result.avg_word_length.toFixed(2) + "</p>" +
        "<p>Shortest Word: " + result.shortest_word + "</p>" +
        "<p>Longest Word: " + result.longest_word + "</p>" +
        "<p>Word Frequencies: " + JSON.stringify(result.word_frequencies) + "</p>" +
        "<p>Character Frequencies: " + JSON.stringify(result.character_frequencies) + "</p>" +
        "<p>Trigram_frequencies: " + JSON.stringify(result.trigram_freqs) + "</p>" + 
        "<p>Similarity_score: " + JSON.stringify(result.similarity_score) + "</p>";

    resultsSection.innerHTML = analysisResults;
}

//----------------
function checkText() {
    var textToCheck = document.getElementById('tekst').value;

    // Use XMLHttpRequest to send a request to the 'detect_languages' view
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/detect_languages/?text=' + encodeURIComponent(textToCheck), true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var results = JSON.parse(xhr.responseText);
            var resultHTML = 'Detected languages:<br>';
            results.languages.forEach(function (lang) {
                resultHTML += lang.lang + ' (' + (lang.prob * 100).toFixed(2) + '%)<br>';
            });
            document.getElementById('resultsSection').innerHTML = resultHTML;
        } else {
            console.error('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.send(null);

    var text = document.getElementById('tekst').value;
    analyzeText(text).then(result => {
        displayResults(result);
    });
}