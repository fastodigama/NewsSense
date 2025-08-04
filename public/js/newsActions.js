// Get references to all modal elements. These are defined in the global scope
// so they are available to all functions that need to show or hide parts of the modal.
const modalWrapper = document.getElementById('modal');
const modalContainer = document.getElementById('modal-container');
const modalLoading = document.getElementById('modal-loading');
const modalContent = document.getElementById('modal-content');
const questionModal = document.getElementById('question-modal');
const questionInput = document.getElementById('question-input');
const submitBtn = document.getElementById('submit-question-btn');
const cancelBtn = document.getElementById('cancel-question-btn');
let resolvePrompt;

/**
 * Displays a custom prompt modal and returns a Promise that resolves
 * with the user's input or null if they cancel.
 * @param {string} promptText The message to display in the modal.
 * @returns {Promise<string|null>}
 */
const askQuestion = (promptText = "What is your question?") => {
    return new Promise(resolve => {
        // Clear the input field from the previous question.
        questionInput.value = "";
        
        // Hide all other modal content areas before showing the question box.
        modalContent.classList.add('hidden');
        modalLoading.classList.add('hidden');

        // Set the modal's text and show it.
        document.getElementById('question-text').textContent = promptText;
        questionModal.classList.remove('hidden');
        modalWrapper.classList.remove('hidden');

        // Focus on the input field for immediate typing.
        questionInput.focus();

        // Store the resolve function to be called by the button handlers later.
        resolvePrompt = resolve;
    });
};

// Event listener for the submit button inside the modal.
submitBtn.addEventListener('click', () => {
    const answer = questionInput.value;
    questionInput.value = ""; // Clear the input field.
    modalWrapper.classList.add('hidden'); // Hide the entire modal.
    questionModal.classList.add('hidden'); // Hide the question box specifically.
    resolvePrompt(answer); // Resolve the Promise with the user's input.
});

// Event listener for the cancel button inside the modal.
cancelBtn.addEventListener('click', () => {
    questionInput.value = ""; // Clear the input field.
    modalWrapper.classList.add('hidden'); // Hide the entire modal.
    questionModal.classList.add('hidden'); // Hide the question box specifically.
    resolvePrompt(null); // Resolve with null to indicate cancellation.
});

// Event listener to allow submitting with the 'Enter' key.
questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});


// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // --- Main Click Handler for Buttons with Data Attributes ---
    document.body.addEventListener('click', async (e) => {
        // Find the nearest button with a data-action attribute
        const button = e.target.closest('button[data-action]');
        if (!button) return; // Exit if no valid button was clicked

        const action = button.dataset.action; // e.g., 'summarize', 'explain', 'ask'
        const url = button.dataset.url; // URL to be processed

        if (!action || !url) return; // Exit if required data is missing

        let prompt = ''; // Will hold the prompt to send to the API

        // --- Define Prompts Based on Action ---
        switch (action) {
            case 'summarize':
                prompt = `Please provide a very short, one-paragraph summary of the article at this URL: ${url}. Do not use any markdown formatting like bolding.`;
                break;
            case 'explain':
                prompt = `Please read the article at ${url} and explain its main points in 2-3 short, simple sentences, as if you were talking to a 5-year-old. Do not use any markdown formatting like bolding.`;
                break;
            case 'ask':
                const userQuestion = await askQuestion("What is your question about this article?");
                if (!userQuestion) return; // Exit if user cancels the prompt
                prompt = `Based on the article at ${url}, please answer the following question as concisely as possible: "${userQuestion}". Do not use any markdown formatting like bolding.`;
                break;
            default:
                return; // Exit if action is not recognized
        }

        // --- Show the Modal with Loading State ---
        showLoadingModal();

        try {
            // Send the prompt to the backend API and wait for the response
            const response = await sendToActionAPI(prompt);

            // Display the response as plain text (no HTML rendering)
            displayResultAsText(response);

        } catch (err) {
            console.error('Error during API call:', err);

            // Show a styled error message in the modal
            displayResultAsHTML(`<div class="text-red-600">
                <h3 class="font-bold text-lg mb-2">Oops! Something went wrong.</h3>
                <p>We couldn't get a response. Please try again later.</p>
                <p class="text-sm text-gray-500 mt-2">Error: ${err.message}</p>
            </div>`);
        }
    });

    // --- Modal Utility Functions ---

    // Show the modal with loading spinner
    function showLoadingModal() {
        modalContent.innerHTML = ''; // Clear previous content
        modalContent.classList.add('hidden'); // Hide content area
        questionModal.classList.add('hidden'); // Ensure the question modal is hidden
        modalLoading.classList.remove('hidden'); // Show loading spinner
        modalWrapper.classList.remove('hidden'); // Make modal visible

        // Animate modal appearance
        setTimeout(() => {
            modalWrapper.classList.add('opacity-100'); // Fade in
            modalContainer.classList.remove('scale-95'); // Scale up
        }, 10);
    }

    // Display plain text result
    function displayResultAsText(textContent) {
        modalContent.textContent = textContent; // Set text safely
        modalLoading.classList.add('hidden'); // Hide spinner
        modalContent.classList.remove('hidden'); // Show content
    }

    // Display HTML content (used for error messages)
    function displayResultAsHTML(htmlContent) {
        modalContent.innerHTML = htmlContent; // Set HTML
        modalLoading.classList.add('hidden'); // Hide spinner
        modalContent.classList.remove('hidden'); // Show content
    }

    // Close modal with animation
    window.closeModal = function() {
        modalWrapper.classList.remove('opacity-100'); // Fade out
        modalContainer.classList.add('scale-95'); // Scale down
        setTimeout(() => {
            modalWrapper.classList.add('hidden'); // Hide modal
        }, 300);
    }

    // Close modal when clicking outside the container
    modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
            closeModal();
        }
    });

    // --- API Call Function ---
    async function sendToActionAPI(prompt) {
        const res = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }) // Send the prompt as JSON
        });

        // Handle non-OK responses
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response.' }));
            throw new Error(errorData.error || `Request failed with status ${res.status}`);
        }

        // Parse and return the output from the response
        const data = await res.json();
        return data.output;
    }
});
