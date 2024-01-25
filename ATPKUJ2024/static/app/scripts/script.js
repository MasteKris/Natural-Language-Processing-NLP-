document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploadButton').addEventListener('click', function () {
        loadFile();
    });

    document.getElementById('checkButton').addEventListener('click', function () {
        var text = document.getElementById('tekst').value;

        // Make an AJAX request to the '/analyze_text/' URL
        $.ajax({
            url: '/analyze_text/',
            data: {
                text: text
            },
            dataType: 'json',
            success: function (result) {
                // Display the analysis results
                displayResults(result);
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    });
});

function displayResults(result) {
    var textToCheck = document.getElementById('tekst').value;
    var resultsSection = document.getElementById('resultsSection2');
    resultsSection.innerHTML = '';

    // Display the analysis results
    var analysisResults = "<p>Input Text: " + textToCheck + "</p>" +
        "<p>Word Count: " + result.word_count + "</p>" +
        "<p>Average Word Length: " + result.avg_word_length.toFixed(2) + "</p>" +
        "<p>Shortest Word: " + result.shortest_word + "</p>" +
        "<p>Longest Word: " + result.longest_word + "</p>" +
        "<p>Detected Language: " + result.language + "</p>";

    resultsSection.innerHTML = analysisResults;
}

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
