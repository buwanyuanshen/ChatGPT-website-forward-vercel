// 找到 select 元素
const selectElement = document.querySelector('.form-control.ipt-common.model');
const searchInput = document.querySelector('.model-search-input');

if (selectElement) {
    // 遍历 select 元素下的所有 option 元素
    Array.from(selectElement.options).forEach(option => {
        const originalText = option.textContent; // 保存原始文本
        // Only set data-description if it doesn't already exist (from potential localStorage load)
        if (!option.getAttribute('data-description')) {
            option.setAttribute('data-description', originalText);
        }
        // Always set textContent to value for consistency after potential localStorage load
        option.textContent = option.value;
    });
}

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        Array.from(selectElement.options).forEach(option => {
            // Ensure data-description exists before trying to read it
            const descriptionAttr = option.getAttribute('data-description');
            const description = descriptionAttr ? descriptionAttr.toLowerCase() : '';
            // Also check the value itself for matching
            const valueLower = option.value.toLowerCase();

            if (description.includes(searchTerm) || valueLower.includes(searchTerm)) {
                option.style.display = 'block'; // 或者 option.hidden = false;
            } else {
                option.style.display = 'none'; // 或者 option.hidden = true;
            }
        });
        localStorage.setItem('modelSearchInput', searchInput.value); // Save search input
    });
}


function resetImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    if (imageUpload) imageUpload.value = '';
    base64Image = ''; // Ensure global variable is reset
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    if (imagePreview) imagePreview.src = '';
    // 可选：触发 change 事件以更新状态
    if (imageUpload) {
        var event = new Event('change', { bubbles: true });
        imageUpload.dispatchEvent(event);
    }
}

var base64Image = ""; // Ensure this is declared globally or appropriately scoped
var imageUpload = document.getElementById('imageUpload');
var imagePreviewContainer = document.getElementById('imagePreviewContainer');
var imagePreview = document.getElementById('imagePreview'); // Define imagePreview
var closeButton = document.getElementById('closeButton');

if (imageUpload) {
    imageUpload.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                base64Image = e.target.result.split(',')[1];
                if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
                if (imagePreview) imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            resetImageUpload(); // Use the reset function on file removal
        }
    });
}

if (closeButton) {
    closeButton.addEventListener('click', function() {
        resetImageUpload(); // Use the reset function
    });
}

function checkModelAndShowUpload() {
    var modelSelect = document.querySelector('.model');
    var uploadArea = document.getElementById('uploadArea');

    // Ensure elements exist before accessing properties/methods
    if (!modelSelect || !uploadArea) return;

    var selectedModel = modelSelect.value.toLowerCase();

    if (
        selectedModel.includes("gpt-4") ||
        selectedModel.includes("glm-4v") ||
        selectedModel.includes("claude-3") ||
        selectedModel.includes("gemini-1.5") ||
        selectedModel.includes("gemini-2.0") ||
        selectedModel.includes("gemini-2.5") ||
        selectedModel.includes("gemini-exp") ||
        selectedModel.includes("learnlm-1.5-pro-experimental") ||
        selectedModel.includes("vision") ||
        selectedModel.includes("o1") ||
        selectedModel.includes("o3")
    ) {
        uploadArea.style.display = 'block';
    } else {
        uploadArea.style.display = 'none';
        resetImageUpload(); // Also reset/hide image if model doesn't support it
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var modelSelect = document.querySelector('.model');
    if (modelSelect) {
        modelSelect.addEventListener('change', checkModelAndShowUpload);
        // 初始化时检查一次
        checkModelAndShowUpload();
    }

    // ---- Balance Functionality ----
    var toggleBalance = document.getElementById('toggleBalance');
    var balanceInfo = document.getElementById('balanceInfo');

    if (toggleBalance && balanceInfo) {
        // 读取Cookie并设置初始状态
        var balanceVisibility = getCookie('balanceVisibility');
        if (balanceVisibility === 'hidden') {
            toggleBalance.checked = false;
            balanceInfo.style.display = 'none';
        } else {
            toggleBalance.checked = true;
            balanceInfo.style.display = 'block';
        }

        // 监听开关变化
        toggleBalance.addEventListener('change', function() {
            if (this.checked) {
                balanceInfo.style.display = 'block';
                setCookie('balanceVisibility', 'visible', 30); // 保存30天
            } else {
                balanceInfo.style.display = 'none';
                setCookie('balanceVisibility', 'hidden', 30); // 保存30天
            }
        });
    }

    // ---- Stream Output Setting ----
    var streamOutputCheckbox = document.getElementById('streamOutput');
    if (streamOutputCheckbox) {
        var streamOutput = getCookie('streamOutput');
        if (streamOutput === 'false') {
            streamOutputCheckbox.checked = false;
        } else {
            streamOutputCheckbox.checked = true; // default true or cookie is not set or 'true'
        }

        streamOutputCheckbox.addEventListener('change', function() {
            setCookie('streamOutput', this.checked ? 'true' : 'false', 30);
        });
    }

    // ---- Max Dialogue Messages Setting ----
    var maxDialogueMessagesInput = document.getElementById('maxDialogueMessages');
    if (maxDialogueMessagesInput) {
        var maxDialogueMessages = getCookie('maxDialogueMessages');
        if (maxDialogueMessages && !isNaN(parseInt(maxDialogueMessages))) {
            maxDialogueMessagesInput.value = parseInt(maxDialogueMessages);
        } else {
            maxDialogueMessagesInput.value = 150; // Default value
            setCookie('maxDialogueMessages', '150', 30); // Set default in cookie too
        }

        maxDialogueMessagesInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                value = 1; // Set a minimum valid value
                this.value = value;
            }
            setCookie('maxDialogueMessages', value, 30);
        });
         // Add input event listener for instant validation if needed
         maxDialogueMessagesInput.addEventListener('input', function() {
            let value = this.value;
            // Allow empty input temporarily, validation happens on change/blur
            if (value !== "" && (isNaN(parseInt(value)) || parseInt(value) < 1)) {
                 // Provide feedback or restrict input further if desired
                 // For now, rely on the 'change' event for final validation & saving
            }
         });
    }

     // --- Balance Fetching Initialization ---
     // Fetch default balance first, then initialize listeners that might override it
     fetchDefaultBalance().then(() => {
         initListeners(); // Initialize listeners after default balance (and potentially defaultApiUrl) is fetched
     });

     // --- Model Search Input Initialization ---
    const savedModelSearchInput = localStorage.getItem('modelSearchInput');
    if (searchInput && savedModelSearchInput) { // Check if searchInput exists
        searchInput.value = savedModelSearchInput;
        // Create and dispatch the event *after* the options have potentially been modified by localStorage
        setTimeout(() => { // Use timeout to ensure options are ready
             searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }, 0);
    }

    // --- API Path Initialization ---
    const savedApiPath = localStorage.getItem('apiPath');
    const apiPathSelectElement = document.getElementById('apiPathSelect');
    if (apiPathSelectElement && savedApiPath) {
        apiPathSelectElement.value = savedApiPath;
    }
});


// Helper functions to set and get cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));  // Calculate expiration time
        expires = "; expires=" + date.toUTCString();  // Convert to UTC string
    }
    // Ensure cookie value is encoded
    document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=Lax"; // Added SameSite
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();  // Use trim() to clean up any extra spaces
        if (c.indexOf(nameEQ) === 0) {
            // Decode the cookie value
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;  // If cookie is not found, return null
}


// Helper function to clean up API URL
function cleanApiUrl(apiUrl) {
    if (!apiUrl) {
        return apiUrl;
    }
    let cleanedUrl = apiUrl.trim();
    cleanedUrl = cleanedUrl.replace(/\s/g, ''); // Remove spaces
    cleanedUrl = cleanedUrl.replace(/\/+$/, ''); // Remove trailing slashes
    // Make regex case-insensitive and optional '/chat/completions' more robust
    cleanedUrl = cleanedUrl.replace(/\/v1(\/chat\/completions)?$/i, '');
    return cleanedUrl;
}

// Function to fetch balance from a specific API endpoint
async function fetchBalance(apiUrl, apiKey) {
    const totalBalanceEl = document.getElementById('totalBalance');
    const usedBalanceEl = document.getElementById('usedBalance');
    const remainingBalanceEl = document.getElementById('remainingBalance');

    // Helper to set loading state
    const setLoading = () => {
        if (totalBalanceEl) totalBalanceEl.innerText = '总额: 加载中...';
        if (usedBalanceEl) usedBalanceEl.innerText = '已用: 加载中...';
        if (remainingBalanceEl) remainingBalanceEl.innerText = '剩余: 加载中...';
    };

    // Helper to set failure state
    const setFailure = (reason = '加载失败') => {
        if (totalBalanceEl) totalBalanceEl.innerText = `总额: ${reason}`;
        if (usedBalanceEl) usedBalanceEl.innerText = `已用: ${reason}`;
        if (remainingBalanceEl) remainingBalanceEl.innerText = `剩余: ${reason}`;
    };

    if (!apiUrl || !apiKey) {
        // If either is missing, try fetching default instead of failing immediately
        console.log("API URL or Key missing for custom fetch, attempting default.");
        await fetchDefaultBalance();
        return;
    }

    setLoading(); // Set loading state

    const headers = new Headers({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    });

    try {
        const cleanedApiUrl = cleanApiUrl(apiUrl);
        if (!cleanedApiUrl) {
            throw new Error("无效的 API URL");
        }

        // Use URL constructor for robust path joining
        const baseUrl = new URL(cleanedApiUrl.startsWith('http') ? cleanedApiUrl : `https://${cleanedApiUrl}`); // Assume https if no scheme

        const subscriptionUrl = new URL('/v1/dashboard/billing/subscription', baseUrl);
        const usageUrl = new URL('/v1/dashboard/billing/usage', baseUrl);

        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 99); // Look back 99 days
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 1); // Include today fully

        usageUrl.searchParams.set('start_date', startDate.toISOString().split('T')[0]);
        usageUrl.searchParams.set('end_date', endDate.toISOString().split('T')[0]); // Corrected param name

        // Perform requests concurrently
        const [subscriptionResponse, usageResponse] = await Promise.all([
            fetch(subscriptionUrl.toString(), { headers }),
            fetch(usageUrl.toString(), { headers })
        ]);

        if (!subscriptionResponse.ok) {
             const errorText = await subscriptionResponse.text();
             console.error('Subscription fetch error:', subscriptionResponse.status, errorText);
             throw new Error(`订阅信息失败 (${subscriptionResponse.status})`);
        }
        if (!usageResponse.ok) {
             const errorText = await usageResponse.text();
             console.error('Usage fetch error:', usageResponse.status, errorText);
             throw new Error(`用量信息失败 (${usageResponse.status})`);
        }

        const subscriptionData = await subscriptionResponse.json();
        const usageData = await usageResponse.json();

        const total = subscriptionData.hard_limit_usd ?? 0; // Use nullish coalescing for default
        const totalUsage = (usageData.total_usage ?? 0) / 100; // API returns usage in cents
        const remaining = total - totalUsage;

        // Update the balance display
        if (totalBalanceEl) totalBalanceEl.innerText = `总额: ${total.toFixed(4)} $`;
        if (usedBalanceEl) usedBalanceEl.innerText = `已用: ${totalUsage.toFixed(4)} $`;
        if (remainingBalanceEl) remainingBalanceEl.innerText = `剩余: ${remaining.toFixed(4)} $`;

    } catch (error) {
        console.error("Error fetching balance:", error);
        setFailure(error.message || '加载失败'); // Display specific error message if available
    }
}

// Function to fetch default balance from the backend
let defaultApiUrl = ''; // Variable to store default apiUrl from backend
async function fetchDefaultBalance() {
    const totalBalanceEl = document.getElementById('totalBalance');
    const usedBalanceEl = document.getElementById('usedBalance');
    const remainingBalanceEl = document.getElementById('remainingBalance');

    const setLoading = () => {
        if (totalBalanceEl) totalBalanceEl.innerText = '总额: 加载中...';
        if (usedBalanceEl) usedBalanceEl.innerText = '已用: 加载中...';
        if (remainingBalanceEl) remainingBalanceEl.innerText = '剩余: 加载中...';
    };

    const setFailure = (reason = '加载失败') => {
        if (totalBalanceEl) totalBalanceEl.innerText = `总额: ${reason}`;
        if (usedBalanceEl) usedBalanceEl.innerText = `已用: ${reason}`;
        if (remainingBalanceEl) remainingBalanceEl.innerText = `剩余: ${reason}`;
    };

    setLoading(); // Set loading state initially

    try {
        let response = await fetch('/default_balance'); // Ensure this endpoint exists and is correct
        if (!response.ok) {
             const errorText = await response.text();
             console.error('Default balance fetch error:', response.status, errorText);
             throw new Error(`获取默认余额失败 (${response.status})`);
        }
        let data = await response.json();
        if (data.error) {
            console.error("Default balance backend error:", data.error);
            throw new Error(data.error.message || '后端返回错误');
        }

        // Store default apiUrl if provided and valid
        if (data.url && typeof data.url === 'string') {
             defaultApiUrl = cleanApiUrl(data.url); // Clean and store
        } else {
             defaultApiUrl = ''; // Reset if not provided or invalid
             console.warn("Default API URL not provided or invalid in /default_balance response.");
        }


        // Ensure balance values are numbers before formatting
        const totalBalance = Number(data.total_balance);
        const usedBalance = Number(data.used_balance);
        const remainingBalance = Number(data.remaining_balance);

        if (isNaN(totalBalance) || isNaN(usedBalance) || isNaN(remainingBalance)) {
             throw new Error("无效的余额数据");
        }


        // Update the balance display with default balance
        if (totalBalanceEl) totalBalanceEl.innerText = `总额: ${totalBalance.toFixed(4)} $`;
        if (usedBalanceEl) usedBalanceEl.innerText = `已用: ${usedBalance.toFixed(4)} $`;
        if (remainingBalanceEl) remainingBalanceEl.innerText = `剩余: ${remainingBalance.toFixed(4)} $`;

    } catch (error) {
        console.error("Error fetching default balance:", error);
        defaultApiUrl = ''; // Ensure default URL is cleared on error
        setFailure(error.message || '加载失败');
    }
}

// Function to initialize the listeners for API Key and URL fields
function initListeners() {
    const apiKeyField = document.querySelector('.api-key');
    const apiUrlField = document.querySelector('.api_url');

    // Ensure fields exist before adding listeners
    if (!apiKeyField || !apiUrlField) {
        console.warn("API Key or API URL input field not found. Balance fetching might not work correctly with custom inputs.");
        return;
    }

    // Debounce function to limit API calls
    let debounceTimer;
    const debounceFetch = (apiUrl, apiKey) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (apiKey) {
                let urlToUse = apiUrl || defaultApiUrl; // Use provided apiUrl or fallback to default
                if (!urlToUse) {
                    console.warn("No API URL available (custom or default). Cannot fetch balance.");
                     // Optionally display a message indicating URL is needed
                     document.getElementById('totalBalance').innerText = '总额: 需要API URL';
                     document.getElementById('usedBalance').innerText = '已用: 需要API URL';
                     document.getElementById('remainingBalance').innerText = '剩余: 需要API URL';
                    return;
                }
                 fetchBalance(urlToUse, apiKey);
            } else {
                fetchDefaultBalance();
            }
        }, 500); // Adjust delay as needed (e.g., 500ms)
    };


    // --- Initial Check ---
    // Use values from localStorage first if available, otherwise use field values
    const initialApiKey = localStorage.getItem('apiKey') || apiKeyField.value.trim();
    const initialApiUrl = localStorage.getItem('api_url') || apiUrlField.value.trim();
    apiKeyField.value = initialApiKey; // Ensure field reflects the value being used
    apiUrlField.value = initialApiUrl; // Ensure field reflects the value being used

    // Trigger initial fetch based on potentially loaded values
    debounceFetch(initialApiUrl, initialApiKey);


    // Event listeners using debounce
    apiKeyField.addEventListener('input', function () {
        const apiKey = apiKeyField.value.trim();
        const apiUrl = apiUrlField.value.trim();
        debounceFetch(apiUrl, apiKey);
         // Save to localStorage on input as well (optional, blur might be better)
         // localStorage.setItem('apiKey', apiKey);
    });

    apiUrlField.addEventListener('input', function () {
        const apiKey = apiKeyField.value.trim();
        const apiUrl = apiUrlField.value.trim();
        debounceFetch(apiUrl, apiKey);
         // Save to localStorage on input as well
         // localStorage.setItem('api_url', apiUrl);
    });

     // Also fetch on blur to capture final input
     apiKeyField.addEventListener('blur', function() {
         const apiKey = apiKeyField.value.trim();
         const apiUrl = apiUrlField.value.trim();
         // No need for debounce on blur, fetch immediately if needed
         if (apiKey) {
             fetchBalance(apiUrl || defaultApiUrl, apiKey);
         } else {
             fetchDefaultBalance();
         }
         // Save final value to localStorage
         if(apiKey) localStorage.setItem('apiKey', apiKey); else localStorage.removeItem('apiKey');
     });

     apiUrlField.addEventListener('blur', function() {
         const apiKey = apiKeyField.value.trim();
         const apiUrl = apiUrlField.value.trim();
         if (apiKey) {
             fetchBalance(apiUrl || defaultApiUrl, apiKey);
         } else {
             fetchDefaultBalance();
         }
          // Save final value to localStorage
         if(apiUrl) localStorage.setItem('api_url', apiUrl); else localStorage.removeItem('api_url');
     });
}


// Global variables for chat elements
var chatInput = document.getElementById('chatInput');
var iptContainer = document.querySelector('.ipt');
var chatBtn = document.getElementById('chatBtn');
var deleteBtn = document.getElementById('deleteBtn');
var chatWindow = $('#chatWindow'); // Using jQuery selector
var scrollDownBtn = $('.scroll-down'); // Using jQuery selector for the container

// Settings
var maxHeight = 250; // Max height for chat input
let isScrolling = false; // Flag for scroll animation
const scrollDuration = 400; // Scroll animation speed

// --- jQuery Document Ready ---
$(document).ready(function () {

    // Function to detect links
    function containsLink(input) {
        // Improved regex: handles more edge cases like parentheses in URLs
        const urlRegex = /(?:(?:https?|ftp):\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        return urlRegex.test(input);
    }

    // --- Input Auto-Resize and Link Detection ---
    if (chatInput && iptContainer) {
        chatInput.addEventListener('input', function () {
            // Save scroll position to prevent jumpiness
            var currentScrollTop = this.scrollTop;

            // Adjust height
            this.style.height = 'auto'; // Temporarily shrink to allow scrollHeight recalculation
            var newScrollHeight = this.scrollHeight;
            this.style.height = (Math.min(maxHeight, newScrollHeight)) + 'px';

            // Adjust container height
            iptContainer.style.height = (Math.min(maxHeight, newScrollHeight) + 20) + 'px';

            // Restore scroll position
            this.scrollTop = currentScrollTop;


            // Check if the input contains a link and continuous dialogue is enabled
            if (localStorage.getItem('continuousDialogue') === 'true' && containsLink(chatInput.value)) {
                // Temporarily disable continuous dialogue for this send
                 // We don't change the checkbox/localStorage permanently here.
                 // The check should happen when *sending* the message.
                 console.log("Link detected, continuous dialogue will be temporarily ignored for this message if active.");
                 // Optionally show a visual indicator?
            }
        });
    } else {
         console.warn("Chat input or container not found. Auto-resizing disabled.");
    }


    // --- Custom Model Management ---
    // Function to save models to localStorage
    function saveModelsToLocalStorage() {
        var modelsHtml = $(".model").html();
        localStorage.setItem('customModels', modelsHtml);
    }

    // Function to initialize data-description and textContent = value
    function initializeModelOptions() {
        $(".model option").each(function() {
            const option = $(this);
            const originalText = option.text(); // Get current text (might be value already)
            const value = option.val();

            // Set data-description preferably from original text if available and not already set
            if (!option.attr('data-description')) {
                option.attr('data-description', originalText);
            }
            // Ensure textContent is always the value
            option.text(value);
        });
    }

    // Load models from localStorage if available
    var savedModels = localStorage.getItem('customModels');
    if (savedModels) {
        $(".model").html(savedModels);
    }

    // Initialize options after potentially loading from localStorage
    initializeModelOptions();

    // Update title based on selected model
    function updateTitle() {
        const selectedOption = $(".settings-common .model option:selected");
        // Use data-description if available, otherwise fallback to value/text
        const titleText = selectedOption.data('description') || selectedOption.val() || "Select Model";
         // Ensure the title element exists
         const titleElement = $(".title h2");
         if (titleElement.length > 0) {
             titleElement.text(titleText);
         } else {
             console.warn("Title H2 element not found.");
         }
    }
    updateTitle(); // Initial title update


    // Add Custom Model Button
    $(".add-custom-model").on("click", function () {
        var customModelInput = $(".custom-model");
        var customModelName = customModelInput.val().trim();

        if (customModelName === "") {
            alert("请输入有效的模型名称！");
            return;
        }

        // Check if model already exists (case-insensitive check might be better)
        if ($(".model option[value='" + customModelName + "']").length > 0) {
            alert("该模型已存在！");
            return;
        }

        // Create new option
        var newOption = $('<option>', {
            value: customModelName,
            text: customModelName, // Text initially same as value
            'data-description': customModelName // Set data-description
        });

        // Add to the beginning (prepend) and select it
        $(".model").prepend(newOption).val(customModelName);

        // Re-initialize the newly added option's text/data-description
        initializeModelOptions(); // Re-run to ensure consistency

        saveModelsToLocalStorage();
        customModelInput.val(""); // Clear input
        updateTitle(); // Update title immediately
        checkModelAndShowUpload(); // Check if upload area needs to be shown/hidden
        updateModelSettings(customModelName); // Update stream settings etc.
    });

    // Delete Custom Model Button
    $(".delete-custom-model").on("click", function () {
        var customModelInput = $(".custom-model");
        var customModelName = customModelInput.val().trim();

        if (customModelName === "") {
            alert("请输入有效的模型名称！");
            return;
        }

        var optionToRemove = $(".model option[value='" + customModelName + "']");
        if (optionToRemove.length > 0) {
             // Check if it's the currently selected model
             const isSelected = optionToRemove.is(':selected');
             optionToRemove.remove();
             saveModelsToLocalStorage();
             customModelInput.val("");

             // If the deleted model was selected, select the first available option and update
             if (isSelected && $(".model option").length > 0) {
                 $(".model").prop('selectedIndex', 0); // Select the first option
                 const newSelectedModel = $(".model").val();
                 localStorage.setItem('selectedModel', newSelectedModel); // Update storage
                 updateTitle();
                 checkModelAndShowUpload();
                 updateModelSettings(newSelectedModel);
             } else if ($(".model option").length === 0) {
                 // Handle case where no models are left
                 updateTitle(); // Title might become empty/default
                 checkModelAndShowUpload();
                 updateModelSettings(""); // Pass empty string?
                 localStorage.removeItem('selectedModel');
             }

        } else {
            alert("未找到要删除的模型！");
        }
    });

    // --- Settings Persistence & Initialization --- (Moved relevant parts inside DOMContentLoaded)

    // Example: Initializing temperature from localStorage
    const savedTemperature = localStorage.getItem('temperature');
    if (savedTemperature) {
        const tempValue = parseFloat(savedTemperature);
        if (!isNaN(tempValue)) {
            $('.settings-common .temperature').val(tempValue);
            $('.settings-common .temperature-display').text(tempValue);
            $('.settings-common .temperature-input').val(tempValue);
        }
    }

    // Example: Initializing max_tokens from localStorage
    const savedMaxTokens = localStorage.getItem('max_tokens '); // Note the space in key
    if (savedMaxTokens) {
        const tokensValue = parseInt(savedMaxTokens);
         if (!isNaN(tokensValue)) {
            $('.settings-common .max-tokens').val(tokensValue);
            $('.settings-common .max-tokens-display').text(tokensValue);
            $('.settings-common .max-tokens-input').val(tokensValue);
         }
    }

     // --- Initial Chat Window Scroll ---
     // Scroll to bottom only if there's content
     if (chatWindow.children().length > 0) {
         chatWindow.scrollTop(chatWindow.prop('scrollHeight'));
         scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
         scrollDownBtn.data('scroll-state', 'up'); // Set state to 'up' if scrolled down
     } else {
         scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
         scrollDownBtn.data('scroll-state', 'down'); // Default state
     }
     scrollDownBtn.show(); // Always show the button

}); // --- End jQuery $(document).ready ---


// --- Input Height Reset Logic ---
if (chatBtn) {
    chatBtn.addEventListener('click', resetInputHeight);
}
if (deleteBtn) {
    deleteBtn.addEventListener('click', resetInputHeight);
}
if (chatInput) {
    chatInput.addEventListener('keydown', function (event) {
        // Ctrl+Enter or Cmd+Enter for sending
        if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
            event.preventDefault(); // Prevent default newline
            resetInputHeight();
            chatBtn.click(); // Trigger send
        }
        // Enter on mobile for sending
        else if (isMobile() && event.keyCode === 13 && !event.shiftKey) { // Ensure Shift+Enter still works for newline
            event.preventDefault();
            resetInputHeight();
            chatBtn.click();
        }
    });
}

function resetInputHeight() {
    if (chatInput) {
        chatInput.style.height = '32px'; // Reset to initial height
    }
    if (iptContainer) {
        iptContainer.style.height = '50px'; // Reset container height
    }
}

// --- Mobile Detection ---
function isMobile() {
  // Consider more robust detection if needed (e.g., touch events, user agent)
  return window.innerWidth <= 768;
}

// --- Temperature Slider/Input Sync ---
// Slider input event
$('.settings-common .temperature').on('input', function() {
    const temperatureValue = parseFloat($(this).val()).toFixed(1); // Ensure single decimal place
    $('.settings-common .temperature-display').text(temperatureValue);
    $('.settings-common .temperature-input').val(temperatureValue);
});

// Input field input event
$('.settings-common .temperature-input').on('input', function() {
    let temperatureValue = $(this).val();
    const minTemperature = parseFloat($(this).attr('min') || 0);
    const maxTemperature = parseFloat($(this).attr('max') || 2);

    // Basic validation (allow partial input like "1.")
    if (temperatureValue === "" || temperatureValue === ".") return; // Allow empty or just dot temporarily

    let numericValue = parseFloat(temperatureValue);

    if (isNaN(numericValue)) {
         // Handle invalid input - maybe reset or show error?
         // For now, let's prevent further invalid state by potentially resetting
         // Or just rely on blur/change event for final validation.
         return;
    }

     // Clamp value immediately if it exceeds bounds
     if (numericValue < minTemperature) numericValue = minTemperature;
     if (numericValue > maxTemperature) numericValue = maxTemperature;


    // Don't restrict decimal places during input, only on display/slider update
    $('.settings-common .temperature-display').text(numericValue.toFixed(1)); // Display with one decimal
    $('.settings-common .temperature').val(numericValue); // Update slider

    // Optionally reformat input field on blur/change if needed:
    // $(this).val(numericValue.toFixed(1));
});

// Input field change/blur event for final validation and storage
$('.settings-common .temperature-input').on('change blur', function() {
    let temperatureValue = parseFloat($(this).val());
    const minTemperature = parseFloat($(this).attr('min') || 0);
    const maxTemperature = parseFloat($(this).attr('max') || 2);

     if (isNaN(temperatureValue)) {
        temperatureValue = parseFloat($('.settings-common .temperature').val()); // Revert to slider value
    } else if (temperatureValue < minTemperature) {
        temperatureValue = minTemperature;
    } else if (temperatureValue > maxTemperature) {
        temperatureValue = maxTemperature;
    }

    const finalValue = temperatureValue.toFixed(1);
    $(this).val(finalValue); // Update input field with formatted value
    $('.settings-common .temperature-display').text(finalValue);
    $('.settings-common .temperature').val(finalValue); // Sync slider

    // Save to localStorage
    localStorage.setItem('temperature', finalValue);
});

// --- Max Tokens Slider/Input Sync ---
// Slider input event
$('.settings-common .max-tokens').on('input', function() {
    const maxTokensValue = parseInt($(this).val());
    if (!isNaN(maxTokensValue)) {
        $('.settings-common .max-tokens-display').text(maxTokensValue);
        $('.settings-common .max-tokens-input').val(maxTokensValue);
    }
});

// Input field input event (basic validation)
$('.settings-common .max-tokens-input').on('input', function() {
    let maxTokensValue = $(this).val();
    // Remove non-digit characters
    maxTokensValue = maxTokensValue.replace(/[^0-9]/g, '');
    $(this).val(maxTokensValue); // Update input field immediately

    if (maxTokensValue === "") return; // Allow empty temporarily

    const numericValue = parseInt(maxTokensValue);
    const minTokens = parseInt($(this).attr('min') || 1);
    const maxTokens = parseInt($(this).attr('max') || 4096);


    if (!isNaN(numericValue)) {
         // Don't clamp immediately during input unless strictly needed
         // Clamp on display/slider update
         let displayValue = numericValue;
         if (displayValue < minTokens) displayValue = minTokens; // Display clamped value
         if (displayValue > maxTokens) displayValue = maxTokens; // Display clamped value


        $('.settings-common .max-tokens-display').text(displayValue); // Display potentially clamped value
        // Update slider only if within valid range (or clamp slider value)
        let sliderValue = numericValue;
         if (sliderValue < minTokens) sliderValue = minTokens;
         if (sliderValue > maxTokens) sliderValue = maxTokens;
        $('.settings-common .max-tokens').val(sliderValue);
    }
});

// Input field change/blur event for final validation and storage
$('.settings-common .max-tokens-input').on('change blur', function() {
    let maxTokensValue = parseInt($(this).val());
    const minTokens = parseInt($(this).attr('min') || 1);
    const maxTokens = parseInt($(this).attr('max') || 4096);

    if (isNaN(maxTokensValue) || maxTokensValue < minTokens) {
        maxTokensValue = minTokens;
    } else if (maxTokensValue > maxTokens) {
        maxTokensValue = maxTokens;
    }

    $(this).val(maxTokensValue); // Update input field with validated value
    $('.settings-common .max-tokens-display').text(maxTokensValue);
    $('.settings-common .max-tokens').val(maxTokensValue); // Sync slider

    // Save to localStorage (ensure key consistency)
    localStorage.setItem('max_tokens ', maxTokensValue); // Using 'max_tokens ' key from original code
});


// --- Core Chat Logic ---
$(document).ready(function() {
  // Re-select elements within this scope if needed, or use globals defined earlier
  var chatBtn = $('#chatBtn');
  var chatInput = $('#chatInput');
  var chatWindow = $('#chatWindow');
  var streamOutputSetting = $('#streamOutputSetting'); // Get stream setting row
  const apiPathSelect = $('#apiPathSelect');
  const modelSelect = $('.settings-common .model');
  const scrollDownBtn = $('.scroll-down'); // Container

  // Conversation history
  var messages = []; // Initialize as empty array

  // Response flag
  var resFlag = true;
  var ajaxRequest = null; // Variable to hold the AJAX request for aborting

  // Marked.js setup
  const renderer = new marked.Renderer();
  renderer.list = function(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul';
    const startAttr = (ordered && start) ? ` start="${start}"` : '';
    // Add classes for styling if needed
    return `<${type}${startAttr} class="marked-list">\n${body}</${type}>\n`;
  };
   // Override link rendering to add target="_blank"
   renderer.link = function(href, title, text) {
     // Basic check if it looks like a valid URL
     if (href && (href.startsWith('http') || href.startsWith('//'))) {
         return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
     }
     // Otherwise, render as plain text or handle differently
     return text; // Or return the original markdown link text: `[${text}](${href})`
   };


  marked.setOptions({
    renderer: renderer,
    highlight: function (code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'; // Default to plaintext
      try {
          return hljs.highlight(code, { language: validLanguage, ignoreIllegals: true }).value;
      } catch (e) {
          console.error("Highlighting error:", e);
          return hljs.highlight(code, { language: 'plaintext', ignoreIllegals: true }).value; // Fallback safely
      }
    },
     gfm: true, // Enable GitHub Flavored Markdown
     breaks: true, // Convert single newlines to <br>
     pedantic: false,
     smartLists: true,
     smartypants: false
  });

  // HTML escaping function
  function escapeHtml(html) {
    let text = document.createTextNode(html);
    let div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
  }

 // Rebuild messages array from DOM and save (used by delete buttons)
function rebuildAndSaveMessages() {
    messages = []; // Clear current array
    $('#chatWindow .message-bubble').each(function() {
        const bubble = $(this);
        const messageTextElement = bubble.find('.message-text');
        let role = '';
        let content = '';

        if (bubble.find('.request-icon').length > 0) {
            role = 'user';
            // Get text content, handling potential <p> or direct text
             content = messageTextElement.find('p').length ? messageTextElement.find('p').text() : messageTextElement.text();
             // Trim buttons text if necessary (though they are usually siblings)
             content = content.replace(/复制编辑删除$/,'').trim(); // Basic trim

        } else if (bubble.find('.response-icon').length > 0) {
            role = 'assistant';
            // Determine content type based on elements inside message-text
            if (messageTextElement.find('img').length > 0) {
                content = messageTextElement.find('img').attr('src') || '//image url...'; // SAVE THE URL
            } else if (messageTextElement.find('audio').length > 0) {
                content = '//audio base64...'; // Placeholder for audio
            } else if (messageTextElement.find('pre').length > 0) {
                content = messageTextElement.find('pre').text(); // Get code content
            } else if (messageTextElement.find('p').length > 0 || messageTextElement.find('ul').length > 0 || messageTextElement.find('ol').length > 0) {
                 // Get combined HTML content for markdown rendering, or just text
                 // For simplicity in saving, let's try getting the text content first.
                 // This might lose formatting for complex markdown in history.
                 // A better approach might be to store the raw markdown, but that requires more changes.
                 content = messageTextElement.text();
                  // Basic trim of button text
                  content = content.replace(/复制查看删除$/,'').trim();
            } else {
                 // Fallback for simple text or unknown structure
                 content = messageTextElement.text();
                 content = content.replace(/复制查看删除$/,'').trim();
            }
        }

        if (role && content) {
            // Trim button text from the end more reliably if needed
            // Example: remove "复制编辑删除" or "复制查看删除" etc.
            // This depends heavily on the exact button text and structure.
            // A safer way is to select the text node directly if possible.

            messages.push({ "role": role, "content": content.trim() });
        } else if (role && !content && role === 'assistant') {
            // Handle case where assistant response might be empty (e.g., failed generation placeholder)
             // Decide whether to save empty responses or skip them
             // console.log("Skipping potentially empty assistant message during rebuild.");
        }
    });

    // Save the rebuilt array
    if (localStorage.getItem('archiveSession') === 'true') {
        if (messages.length > 0) {
            localStorage.setItem("session", JSON.stringify(messages));
        } else {
            localStorage.removeItem("session"); // Remove if empty
        }
    }
}


// --- Message Adding Functions ---

// Add Image Message (Handles Display, Saving, Deletion)
function addImageMessage(imageUrl) {
    let lastResponseElement = $(".message-bubble .response").last();
    if (!lastResponseElement.length) {
        console.error("Cannot add image message: No preceding response element found.");
        return;
    }
    lastResponseElement.empty(); // Clear loading indicator or previous content

    // Create image element and buttons
    const imageElement = `<img src="${imageUrl}" style="max-width: 100%; max-height: 300px; display: block; margin-top: 5px;" alt="Generated Image">`; // Adjusted style
    const viewButton = '<button class="view-button"><i class="fas fa-search"></i></button>';
    const deleteButton = '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>';

    // Append to the response element
    lastResponseElement.append(`<div class="message-text">${imageElement}</div>` + viewButton + deleteButton);

    // *** Add to messages array and save (Moved Logic) ***
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        messages.push({"role": "assistant", "content": imageUrl}); // SAVE THE ACTUAL URL
        if (localStorage.getItem('archiveSession') === 'true') {
            localStorage.setItem("session", JSON.stringify(messages));
        }
    } else {
         console.warn("addImageMessage called without preceding user message in array.");
    }

    // Bind view button event
    lastResponseElement.find('.view-button').on('click', function() {
        window.open(imageUrl, '_blank');
    });

    // Bind delete button event
    lastResponseElement.find('.delete-message-btn').click(function() {
        const messageBubble = $(this).closest('.message-bubble');
        const requestBubble = messageBubble.prev('.message-bubble'); // Find the preceding request

        requestBubble.remove(); // Remove request message bubble
        messageBubble.remove(); // Remove response message bubble

        rebuildAndSaveMessages(); // Rebuild and save after deletion
    });

     scrollToBottom(); // Scroll after adding
}


// Add Moderation Message
function addModerationMessage(moderationResult) {
    let lastResponseElement = $(".message-bubble .response").last();
     if (!lastResponseElement.length) return;
    lastResponseElement.empty();

    let formattedResult = "<p>审查结果:</p><ul>";
    // Assuming moderationResult is an array from the API structure
    if (Array.isArray(moderationResult) && moderationResult.length > 0) {
         const result = moderationResult[0]; // Usually only one result for a single input
         formattedResult += `<li>有害标记: ${result.flagged ? '是' : '否'}</li>`;

         if (result.categories) {
             formattedResult += "<li>违规类别:<ul>";
             for (const category in result.categories) {
                 formattedResult += `<li>${category}: ${result.categories[category] ? '是' : '否'}</li>`;
             }
             formattedResult += "</ul></li>";
         }
          if (result.category_scores) {
             formattedResult += "<li>违规类别分数 (越大置信度越高):<ul>";
             for (const score in result.category_scores) {
                 formattedResult += `<li>${score}: ${result.category_scores[score].toFixed(4)}</li>`;
             }
             formattedResult += "</ul></li>";
         }
    } else {
         formattedResult = "<p>无法解析审查结果。</p>";
    }
    formattedResult += "</ul>";

    lastResponseElement.append('<div class="message-text">' + formattedResult + '</div>' + '<button class="copy-button"><i class="far fa-copy"></i></button>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');

     // *** Add to messages array and save ***
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        // Save a simplified representation or the full JSON?
        messages.push({"role": "assistant", "content": JSON.stringify(moderationResult) }); // Save JSON string
        if (localStorage.getItem('archiveSession') === 'true') {
            localStorage.setItem("session", JSON.stringify(messages));
        }
    }

    // Bind buttons
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim()); // Copy displayed text
    });
    lastResponseElement.find('.delete-message-btn').click(function() {
        const messageBubble = $(this).closest('.message-bubble');
        messageBubble.prev('.message-bubble').remove();
        messageBubble.remove();
        rebuildAndSaveMessages();
    });
     scrollToBottom();
}

// Add Embedding Message
function addEmbeddingMessage(embeddingResult) {
    let lastResponseElement = $(".message-bubble .response").last();
     if (!lastResponseElement.length) return;
    lastResponseElement.empty();

    const embeddingString = JSON.stringify(embeddingResult, null, 2);
    lastResponseElement.append(`<div class="message-text"><p>Embedding Vector:</p><pre style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(embeddingString)}</pre></div>` + '<button class="copy-button"><i class="far fa-copy"></i></button>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');

     // *** Add to messages array and save ***
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        messages.push({"role": "assistant", "content": "//embedding data..." }); // Save placeholder
        if (localStorage.getItem('archiveSession') === 'true') {
            localStorage.setItem("session", JSON.stringify(messages));
        }
    }

    // Bind buttons
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage(embeddingString); // Copy the actual JSON string
    });
    lastResponseElement.find('.delete-message-btn').click(function() {
        const messageBubble = $(this).closest('.message-bubble');
        messageBubble.prev('.message-bubble').remove();
        messageBubble.remove();
        rebuildAndSaveMessages();
    });
     scrollToBottom();
}

// Add TTS Message
function addTTSMessage(audioBase64) {
    let lastResponseElement = $(".message-bubble .response").last();
     if (!lastResponseElement.length) return;
    lastResponseElement.empty();

    lastResponseElement.append('<div class="message-text">' + '<audio controls style="margin-top: 5px;"><source src="data:audio/mpeg;base64,' + audioBase64 + '" type="audio/mpeg">Your browser does not support the audio element.</audio></div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');

     // *** Add to messages array and save ***
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        messages.push({"role": "assistant", "content": "//audio base64..."}); // Save placeholder
        if (localStorage.getItem('archiveSession') === 'true') {
            localStorage.setItem("session", JSON.stringify(messages));
        }
    }

    // Bind delete button
    lastResponseElement.find('.delete-message-btn').click(function() {
        const messageBubble = $(this).closest('.message-bubble');
        messageBubble.prev('.message-bubble').remove();
        messageBubble.remove();
        rebuildAndSaveMessages();
    });
     scrollToBottom();
}

// Add Request Message to window
function addRequestMessage(message) {
  $(".answer .tips").hide(); // Hide tips card
  chatInput.val(''); // Clear input field

  let escapedMessage = escapeHtml(message);
  // Structure: Bubble -> Icon + Message Text Container -> (Paragraph + Buttons)
  let requestBubble = $(`
    <div class="message-bubble request-bubble">
      <span class="chat-icon request-icon"></span>
      <div class="message-content">
         <div class="message-text request">
             <p>${escapedMessage}</p>
         </div>
         <div class="message-buttons">
             <button class="copy-button" title="Copy"><i class="far fa-copy"></i></button>
             <button class="edit-button" title="Edit"><i class="fas fa-edit"></i></button>
             <button class="delete-message-btn" title="Delete"><i class="far fa-trash-alt"></i></button>
         </div>
      </div>
    </div>`);

  chatWindow.append(requestBubble);

  // Bind buttons within this request bubble
  requestBubble.find('.copy-button').click(function() {
      copyMessage(message); // Copy original unescaped message
      showCheckmark($(this));
  });

  requestBubble.find('.edit-button').click(function() {
    editMessage(requestBubble, message); // Pass the bubble and original message
  });

  requestBubble.find('.delete-message-btn').click(function() {
    const responseBubble = requestBubble.next('.message-bubble.response-bubble'); // Find the *next* bubble which should be the response
    requestBubble.remove();
    responseBubble.remove(); // Remove the corresponding response too
    rebuildAndSaveMessages(); // Rebuild and save
  });

  // Add placeholder for the response
  let responseBubble = $(`
    <div class="message-bubble response-bubble">
      <span class="chat-icon response-icon"></span>
       <div class="message-content">
            <div class="message-text response">
                <span class="loading-icon"><i class="fa fa-spinner fa-pulse fa-fw"></i></span>
            </div>
             <div class="message-buttons">
                  <!-- Buttons will be added dynamically here -->
             </div>
       </div>
    </div>`);
  chatWindow.append(responseBubble);

  scrollToBottom(); // Scroll after adding request and response placeholder
}

// Edit Message Function
function editMessage(requestBubble, originalMessage) {
    // Remove the response bubble associated with this request
    requestBubble.next('.message-bubble.response-bubble').remove();
    // Remove the request bubble itself
    requestBubble.remove();

    // Rebuild the message array *without* the deleted pair and save
    rebuildAndSaveMessages();

    // Put the original message back into the input box
    chatInput.val(originalMessage);
    chatInput.focus(); // Set focus to the input box
    // Adjust input height if needed
     chatInput.dispatchEvent(new Event('input', { bubbles: true }));
}

// Global variable to store the accumulated response for stream=true
let currentAssistantMessage = '';
// Global variable to store the reference to the last response element being updated
let lastResponseElementForStream = null;

// Add/Update Response Message (Handles stream and non-stream)
function addResponseMessage(contentChunk, isComplete = false) {
    let lastResponseElement = $(".message-bubble .response-bubble .message-text.response").last();

    if (!lastResponseElement.length) {
         // If called during load before request bubble, might need adjustment.
         // For now, assume it's called after addRequestMessage.
         console.error("Cannot add response: No response element found.");
         return;
    }

     // Clear loading indicator on first chunk
     if (lastResponseElement.find('.loading-icon').length > 0) {
         lastResponseElement.empty();
         currentAssistantMessage = ''; // Reset accumulator for new message
         lastResponseElementForStream = lastResponseElement; // Store reference
     } else if (lastResponseElement !== lastResponseElementForStream) {
         // If the target element changed unexpectedly (e.g., user deleted mid-stream)
         // Reset and use the new last element
         console.warn("Response element changed mid-stream. Resetting.");
         currentAssistantMessage = '';
         lastResponseElementForStream = lastResponseElement;
         // Potentially clear the new element if it has old content?
         // lastResponseElement.empty(); // Uncomment cautiously
     }


    currentAssistantMessage += contentChunk; // Accumulate content

    let processedHTML;
    // Use marked.parse safely
    try {
         // Check for incomplete code blocks for streaming
         let finalContent = currentAssistantMessage;
         const codeBlockRegex = /```/g;
         const codeMatches = finalContent.match(codeBlockRegex);
         const codeMarkCount = codeMatches ? codeMatches.length : 0;

         if (!isComplete && codeMarkCount % 2 === 1) {
             // If streaming and an odd number of ``` exist, append closing ``` for parsing
             processedHTML = marked.parse(finalContent + '\n```');
         } else {
             processedHTML = marked.parse(finalContent);
         }
    } catch (e) {
         console.error("Markdown parsing error:", e);
         processedHTML = marked.parse(escapeHtml(currentAssistantMessage)); // Fallback to escaped HTML
    }


    // Update the content
    lastResponseElement.html(processedHTML);

    // Re-attach code highlighting and copy buttons after updating content
    lastResponseElement.find('pre code').each(function(i, block) {
        hljs.highlightElement(block);
    });
    // Remove previous copy buttons before adding new ones inside 'pre'
    lastResponseElement.find('pre .copy-code-btn').remove();
    lastResponseElement.find('pre').each(function() {
        // Add button relative to the 'pre' block
        $(this).append('<button class="copy-code-btn" title="Copy Code"><i class="far fa-copy"></i></button>');
    });


    // Manage buttons container (outside message-text)
    let buttonsContainer = lastResponseElement.closest('.message-content').find('.message-buttons');
    if (!buttonsContainer.length) { // Create if doesn't exist
         buttonsContainer = $('<div class="message-buttons"></div>');
         lastResponseElement.closest('.message-content').append(buttonsContainer);
    }


    // Add/Update main action buttons only when complete or for non-streaming
    if (isComplete) {
        buttonsContainer.empty(); // Clear previous buttons

        // Add Copy button for the whole message text
        buttonsContainer.append('<button class="copy-button" title="Copy Message"><i class="far fa-copy"></i></button>');

        // Add View buttons for links
        lastResponseElement.find('a[href^="http"]').each(function() {
             const url = $(this).attr('href');
             buttonsContainer.append(`<button class="view-button" data-url="${url}" title="Open Link"><i class="fas fa-external-link-alt"></i></button>`); // Changed icon
        });


        // Add Delete button
        buttonsContainer.append('<button class="delete-message-btn" title="Delete"><i class="far fa-trash-alt"></i></button>');


        // Bind buttons for the completed message
        const responseBubble = lastResponseElement.closest('.message-bubble.response-bubble');
        bindResponseButtons(responseBubble, currentAssistantMessage);


        // *** Add completed message to array and save ***
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            messages.push({"role": "assistant", "content": currentAssistantMessage});
            if (localStorage.getItem('archiveSession') === 'true') {
                localStorage.setItem("session", JSON.stringify(messages));
            }
        } else {
             console.warn("Completed response added without preceding user message in array.");
        }

        currentAssistantMessage = ''; // Reset for next message
        lastResponseElementForStream = null; // Clear reference
        resFlag = true; // Mark as successful completion

        // Re-enable send button etc. (handled in calling function)
         chatBtn.attr('disabled',false);
         chatInput.on("keydown", handleEnter); // Re-bind enter key
         $('.stop').hide(); // Hide stop button

    } else {
         resFlag = true; // Mark as successful chunk
         // Show stop button during streaming
         $('.stop').show();
    }

    scrollToBottom(); // Scroll as content is added
}

// Helper function to bind buttons for a response bubble
function bindResponseButtons(responseBubble, fullMessageContent) {
    const messageTextElement = responseBubble.find('.message-text.response'); // Target the text container

    // Copy Message Button
    responseBubble.find('.copy-button').first().off('click').on('click', function() { // Ensure only one handler, target first
        // Get text, excluding potential code blocks if needed, or get all text
         let textToCopy = messageTextElement.text(); // Simple text extraction
         // Alternative: get formatted HTML? copyMessage helper likely handles text.
        copyMessage(textToCopy);
        showCheckmark($(this));
    });

    // View Link Buttons
    responseBubble.find('.view-button').off('click').on('click', function() {
        const urlToOpen = $(this).data('url');
        if (urlToOpen) {
            window.open(urlToOpen, '_blank');
        }
    });

    // Delete Button
    responseBubble.find('.delete-message-btn').first().off('click').on('click', function() {
        const requestBubble = responseBubble.prev('.message-bubble.request-bubble');
        requestBubble.remove();
        responseBubble.remove();
        rebuildAndSaveMessages();
    });

    // Copy Code Buttons (inside PRE tags)
    responseBubble.find('.copy-code-btn').off('click').on('click', function() {
        const codeText = $(this).siblings('code').text();
        copyMessage(codeText);
        showCheckmark($(this), "Copied"); // Show "Copied" text
    });
}


// Copy message helper
function copyMessage(text) {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    let tempTextarea = $('<textarea>');
    tempTextarea.val(text).css({position: 'absolute', left: '-9999px'}).appendTo('body').select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed', err);
        alert("复制失败");
    }
    tempTextarea.remove();
    return; // Indicate success/failure?
  }
  navigator.clipboard.writeText(text).then(function() {
    // Success - checkmark is handled by showCheckmark
  }, function(err) {
    console.error('Async copy failed', err);
    alert("复制失败");
  });
}

// Show checkmark on button
function showCheckmark(buttonElement, text = '<i class="far fa-check-circle"></i>') {
    const originalContent = buttonElement.html();
    buttonElement.html(text);
    buttonElement.prop('disabled', true); // Optionally disable briefly
    setTimeout(function() {
        buttonElement.html(originalContent);
        buttonElement.prop('disabled', false);
    }, 1500); // Show checkmark for 1.5 seconds
}

// Add Fail Message
function addFailMessage(message) {
    let lastResponseElement = $(".message-bubble .response-bubble .message-text.response").last();
    if (!lastResponseElement.length) return; // Exit if no target

    lastResponseElement.empty(); // Clear loading icon
    lastResponseElement.append('<p class="error"><i class="fas fa-exclamation-triangle"></i> ' + escapeHtml(message) + '</p>');

    // Clean up buttons container if it exists
    lastResponseElement.closest('.message-content').find('.message-buttons').empty();

    // Remove the preceding user prompt from the messages array as it failed
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        messages.pop();
        // No need to save here, as the session shouldn't reflect the failed attempt
    }
    resFlag = false; // Set flag to indicate failure
    scrollToBottom();

     // Re-enable send button etc.
     chatBtn.attr('disabled',false);
     chatInput.on("keydown", handleEnter); // Re-bind enter key
     $('.stop').hide(); // Hide stop button
}

let datas; // Should hold API URL etc. - scope carefully

// Decode API key (if needed, typically handled server-side)
function decodeApiKey(encodedApiKey) {
  try {
      return atob(encodedApiKey);
  } catch (e) {
       console.error("Failed to decode API key:", e);
       return null; // Return null or handle error appropriately
  }
}


// Get config (API URL) - Potentially from backend or localStorage
async function getConfig() {
    // Prioritize localStorage if available
    const storedApiUrl = localStorage.getItem('api_url');
    if (storedApiUrl) {
        datas = { "api_url": cleanApiUrl(storedApiUrl) };
        return; // Use stored value
    }

    // Fallback to fetching from backend if no localStorage value
    try {
        const response = await fetch("/config"); // Ensure this endpoint is correct
         if (!response.ok) {
             throw new Error(`Config fetch failed: ${response.status}`);
         }
        const data = await response.json();

        if (data.api_url) {
            datas = { "api_url": cleanApiUrl(data.api_url) };
             // Optionally save fetched default to localStorage if desired
             // localStorage.setItem('api_url', datas.api_url);
        } else {
            datas = { "api_url": "" }; // Default to empty if not provided
        }
    } catch (error) {
        console.error("Error getting config:", error);
        datas = { "api_url": "" }; // Ensure datas is defined even on error
    }
}

// Get a random API key if multiple are provided
function getRandomApiKey(apiKeyInputValue) {
    if (!apiKeyInputValue) return null;
    const apiKeys = apiKeyInputValue.split(',').map(key => key.trim()).filter(key => key); // Filter empty keys
    if (apiKeys.length === 0) return null;
    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
}

// Get API Key - Prioritize input field/localStorage, fallback to password/backend
async function getApiKey() {
    // 1. Try API Key field (and localStorage)
    const apiKeyInput = $(".settings-common .api-key").val().trim();
    const storedApiKey = localStorage.getItem('apiKey'); // Check localStorage too
    const effectiveApiKeyValue = apiKeyInput || storedApiKey; // Use input if present, else stored

    if (effectiveApiKeyValue) {
        let apiKey = getRandomApiKey(effectiveApiKeyValue);
        if (apiKey) return apiKey; // Return random key if multiple provided
    }

    // 2. Try Password field (and localStorage)
    const passwordInput = $(".settings-common .password").val().trim();
    const storedPassword = localStorage.getItem('password');
    const effectivePassword = passwordInput || storedPassword;

    if (effectivePassword) {
        try {
             const response = await fetch("/get_api_key", { // Ensure endpoint is correct
                 method: "POST",
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                 body: new URLSearchParams({ password: effectivePassword }),
             });

             if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ detail: "Unknown error" })); // Catch JSON parse errors
                 // Handle specific errors like 401/403 (Unauthorized/Forbidden)
                 if (response.status === 401 || response.status === 403) {
                      addFailMessage("访问密码错误或无效。");
                 } else {
                      addFailMessage(`获取API Key失败: ${errorData.detail || response.statusText}`);
                 }
                 return null; // Indicate failure
             }

             const data = await response.json();
             if (data.apiKey) {
                 // Assuming backend sends encoded key - decode if necessary
                 const decodedKey = decodeApiKey(data.apiKey);
                 if (decodedKey) {
                     return decodedKey;
                 } else {
                     addFailMessage("无法解码API Key。");
                     return null;
                 }
             } else {
                 addFailMessage("后端未返回API Key。");
                 return null;
             }
        } catch (error) {
            console.error("Error fetching API key with password:", error);
            addFailMessage("获取API Key时出错。");
            return null;
        }
    }

    // 3. No Key or Password provided/valid
    addFailMessage("请在设置中提供API Key或访问密码。");
    return null;
}


// --- Send Request Function ---
async function sendRequest(data) {
  await getConfig(); // Ensure datas.api_url is populated (from localStorage or backend)
  const apiKey = await getApiKey(); // Get API key (from input/storage or backend)


   // Use custom API URL from input/localStorage if available, otherwise use fetched default
    let customApiUrl = cleanApiUrl(localStorage.getItem('api_url') || $(".settings-common .api_url").val());
    let effectiveApiUrl = customApiUrl || (datas ? datas.api_url : ''); // Use custom, fallback to fetched default


  if (!effectiveApiUrl || !apiKey) {
    // If getApiKey already added a message, don't add another.
    if (resFlag) { // Check if addFailMessage was already called by getApiKey or getConfig
         addFailMessage("缺少API Key或API URL。请检查设置。");
    }
    chatBtn.attr('disabled',false); // Re-enable button
    return; // Stop execution
  }

    // Validate API URL format (basic check)
    var apiUrlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!apiUrlRegex.test(effectiveApiUrl)) {
        // Allow localhost without http/https for development? Maybe not.
        addFailMessage("无效的API URL格式。请输入完整网址 (e.g., https://api.example.com)");
        chatBtn.attr('disabled',false);
        return;
    }

    // Determine API Path and Request Body based on model and selected path
    let apiUrl;
    let requestBody;
    let requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
    };

    const selectedApiPath = apiPathSelect.val(); // Get user's selected path
    const model = data.model.toLowerCase();

    // --- Path and Body Logic ---
    let determinedPath = selectedApiPath; // Start with user selection
    let streamRequested = getCookie('streamOutput') !== 'false'; // Check cookie

    // Auto-detect path if user hasn't selected one or if model implies a specific path
    if (!determinedPath || determinedPath === "/v1/chat/completions") { // Only override default/chat path
        if (model.includes("gpt-3.5-turbo-instruct") || model.includes("babbage-002") || model.includes("davinci-002")) {
            determinedPath = '/v1/completions';
        } else if (model.includes("dall-e-2") || model.includes("dall-e-3") || model.includes("cogview-3") || model.includes("grok-2-image")) {
            determinedPath = '/v1/images/generations';
            streamRequested = false; // Images are not streamed
        } else if (model.includes("moderation")) {
            determinedPath = '/v1/moderations';
            streamRequested = false;
        } else if (model.includes("embedding")) {
            determinedPath = '/v1/embeddings';
            streamRequested = false;
        } else if (model.includes("tts-1")) {
            determinedPath = '/v1/audio/speech';
            streamRequested = false;
        } else if (model.includes("gemini")) {
             // Gemini often uses a different path/auth, handle explicitly if needed
             // Example for a specific Gemini URL structure:
             if (model.includes("gemini-pro") || model.includes("gemini-1.0-pro") || model.includes("gemini-1.5-pro") || model.includes("gemini-1.5-flash")) {
                  // Check if a specific Gemini path exists, otherwise default might be chat/completions if proxied
                   if ($('#apiPathSelect option[value="/v1beta/models/model:generateContent?key=apikey"]').length > 0) {
                        determinedPath = '/v1beta/models/model:generateContent?key=apikey';
                        streamRequested = false; // Often non-streaming or different stream format
                        // Adjust headers for Gemini if needed (e.g., remove Authorization, use key in URL)
                        requestHeaders = { 'Content-Type': 'application/json' };
                        apiUrl = `https://${effectiveApiUrl.replace(/^https?:\/\//, '')}${determinedPath.replace('model:generateContent?key=apikey', `${data.model}:generateContent?key=${apiKey}`)}`; // Construct specific URL
                   } else {
                       determinedPath = '/v1/chat/completions'; // Assume standard proxy if specific path not selected/available
                       streamRequested = true; // Or check specific model caps
                   }

             } else if (model.includes("gemini-2.0-flash-exp-image-generation")) {
                 if ($('#apiPathSelect option[value="/v1beta/models/model:generateContent?key=apikey"]').length > 0) {
                     determinedPath = '/v1beta/models/model:generateContent?key=apikey';
                     streamRequested = false; // Image generation is non-streaming
                     requestHeaders = { 'Content-Type': 'application/json' };
                     apiUrl = `https://${effectiveApiUrl.replace(/^https?:\/\//, '')}${determinedPath.replace('model:generateContent?key=apikey', `${data.model}:generateContent?key=${apiKey}`)}`;
                 } else {
                      determinedPath = '/v1/chat/completions'; // Fallback proxy path
                 }
             }
             else {
                  determinedPath = '/v1/chat/completions'; // Default for other potential Gemini models via proxy
                  streamRequested = getCookie('streamOutput') !== 'false';
             }
        } else if (model.includes("o1") && !model.includes("all")) {
             determinedPath = '/v1/chat/completions';
             streamRequested = false; // Force non-streaming
        } else if (model.includes("o3") && !model.includes("all")) {
             determinedPath = '/v1/chat/completions';
             streamRequested = false; // Force non-streaming
        } else if (model.includes("deepseek-r")) {
             determinedPath = '/v1/chat/completions';
              // streamRequested = check settings; default is true usually
        } else if (model.includes("claude-3-7-sonnet-thinking") || model.includes("claude-3-7-sonnet-20250219-thinking")) {
              determinedPath = '/v1/chat/completions';
              // streamRequested = check settings; default is true usually
         } else {
             determinedPath = '/v1/chat/completions'; // Default path
              streamRequested = getCookie('streamOutput') !== 'false';
         }
    } else {
         // User selected a specific path, respect it
         // Need to check if standard streaming applies or if the path implies non-streaming
         if (determinedPath === '/v1/images/generations' || determinedPath === '/v1/moderations' || determinedPath === '/v1/embeddings' || determinedPath === '/v1/audio/speech') {
             streamRequested = false;
         } else if (determinedPath === '/v1beta/models/model:generateContent?key=apikey') {
             streamRequested = false; // Assume non-streaming for this path
             requestHeaders = { 'Content-Type': 'application/json' }; // Adjust headers
             apiUrl = `https://${effectiveApiUrl.replace(/^https?:\/\//, '')}${determinedPath.replace('model:generateContent?key=apikey', `${data.model}:generateContent?key=${apiKey}`)}`;
         }
         // For /v1/completions, streamRequested depends on cookie
         else if (determinedPath === '/v1/completions') {
             streamRequested = getCookie('streamOutput') !== 'false';
         }
         // Default to cookie setting for other paths like /v1/chat/completions
         else {
             streamRequested = getCookie('streamOutput') !== 'false';
         }
    }

     // Construct final API URL if not already set (like for specific Gemini case)
     if (!apiUrl) {
         apiUrl = effectiveApiUrl + determinedPath;
     }


    // --- Construct Request Body based on Path ---
    switch (determinedPath) {
        case '/v1/completions':
            requestBody = {
                "prompt": data.prompts[data.prompts.length - 1].content, // Use last user message for completions
                "model": data.model,
                "max_tokens": data.max_tokens,
                "temperature": data.temperature,
                "stream": streamRequested
                // Add other params like top_p, n if needed
            };
            break;

        case '/v1/images/generations':
            let size = "1024x1024"; // Default size
            let quality = "standard";
            let style = "natural"; // Default style
            // Extract size, quality, style from model name if present
            if (model.includes("dall-e-3")) {
                 if (model.includes("1792x1024")) size = "1792x1024";
                 else if (model.includes("1024x1792")) size = "1024x1792";
                 // DALL-E 3 also supports 1024x1024 (default)
                 if (model.includes("-hd")) quality = "hd";
                  // DALL-E 3 styles: vivid, natural
                 if (model.includes("-vivid")) style = "vivid"; // Example convention
                 // Use only the base model name for the API call
                 data.model = model.split('-')[0] + '-' + model.split('-')[1]; // e.g., "dall-e-3"
            } else if (model.includes("dall-e-2")) {
                  if (model.includes("256x256")) size = "256x256";
                  else if (model.includes("512x512")) size = "512x512";
                  // DALL-E 2 also supports 1024x1024 (default)
                  // DALL-E 2 doesn't have quality/style params in the same way
                  quality = undefined;
                  style = undefined;
                  data.model = "dall-e-2"; // Use base name
            } else if (model.includes("cogview-3")) {
                 size = "1024x1024"; // Or check model name specifics if they vary
                 quality = undefined;
                 style = undefined;
                 data.model = "cogview-3";
             } else if (model.includes("grok-2-image")){
                  size = undefined; // Let model decide or check API docs
                  quality = undefined;
                  style = undefined;
                  data.model = "grok-2-image"; // Use exact name if needed by API
             }


            requestBody = {
                "prompt": data.prompts[data.prompts.length - 1].content, // Use last user message
                "model": data.model, // Use potentially cleaned model name
                "n": 1,
                "size": size,
                "quality": quality,
                "style": style,
                 // Remove undefined properties before stringifying if API is strict
            };
             // Clean undefined properties
             Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);
            break;

        case '/v1/moderations':
            requestBody = {
                "input": data.prompts[data.prompts.length - 1].content,
                "model": data.model.includes("latest") ? "text-moderation-latest" : "text-moderation-stable" // Choose specific moderation model
            };
            break;

        case '/v1/embeddings':
            requestBody = {
                "input": data.prompts[data.prompts.length - 1].content,
                "model": data.model // Pass the full model name, e.g., text-embedding-ada-002
                // Add encoding_format if needed
            };
            break;

        case '/v1/audio/speech':
            requestBody = {
                "input": data.prompts[data.prompts.length - 1].content,
                "model": data.model, // e.g., tts-1, tts-1-hd
                "voice": "alloy" // Default voice, allow selection later?
                // Add response_format, speed if needed
            };
            break;

         case '/v1beta/models/model:generateContent?key=apikey': // Specific Gemini Handler
              // Handle image input for multimodal Gemini models
              let geminiContentParts = [{"text": data.prompts[data.prompts.length - 1].content}]; // Start with text
              if (data.image_base64 && model.includes("vision")) { // Or check specific model names like gemini-pro-vision
                    geminiContentParts.push({
                        "inline_data": {
                            "mime_type": "image/jpeg", // Or detect mime type
                            "data": data.image_base64
                        }
                    });
              }

              requestBody = {
                  "contents": [{"role": "user", "parts": geminiContentParts}], // Use parts structure
                   // Add generationConfig, safetySettings if needed
                   // Example for image generation model:
                   "generationConfig": model.includes("image-generation") ? {"responseModalities":["Text","Image"]} : {}
              };
             // History needs careful handling for Gemini 'contents' format
             // This example sends only the last user turn. Implement history mapping if needed.
             break;


        case '/v1/chat/completions':
        default: // Default to chat completions
            let messagesToSend = [];
             // Handle image data for multimodal models using this endpoint (e.g., gpt-4-vision)
             const lastUserMessageIndex = data.prompts.length - 1;
             if (data.image_base64 && lastUserMessageIndex >= 0 && (model.includes("vision") || model.includes("gpt-4") || model.includes("claude-3") || model.includes("glm-4v") || model.includes("o1") || model.includes("o3") )) { // Add relevant model checks
                 // Prepare multimodal content for the last message
                 const lastMessageContent = [
                     { "type": "text", "text": data.prompts[lastUserMessageIndex].content }
                 ];
                  // Basic check for base64 string
                 if (typeof data.image_base64 === 'string' && data.image_base64.length > 10) {
                     lastMessageContent.push({
                         "type": "image_url",
                         "image_url": { "url": `data:image/jpeg;base64,${data.image_base64}` } // Assume JPEG, adjust if needed
                     });
                 }


                 // Decide how much history to include
                 if (localStorage.getItem('continuousDialogue') === 'true') {
                     messagesToSend = data.prompts.slice(0, lastUserMessageIndex); // History before last message
                     messagesToSend.push({ "role": "user", "content": lastMessageContent });
                 } else {
                     messagesToSend = [{ "role": "user", "content": lastMessageContent }]; // Only last message
                 }
             } else {
                  // Regular text chat
                  messagesToSend = data.prompts; // Use the prepared prompts array (handles history logic)
             }

            requestBody = {
                "messages": messagesToSend,
                "model": data.model,
                "max_tokens": data.max_tokens,
                "temperature": data.temperature,
                "stream": streamRequested
                // Add other params like top_p, n if needed
            };
             // Specific overrides
             if (model.includes("o1") && !model.includes("all")) requestBody.temperature = 1;
             if (model.includes("o3") && !model.includes("all")) requestBody.temperature = 1;
              if (model.includes("deepseek-r")) { /* No specific overrides needed based on provided snippet */ }
              if (model.includes("claude-3-7-sonnet-thinking")) { /* No specific overrides needed */ }

            break;
    }

    // --- Make the API Request ---
    try {
        const controller = new AbortController();
        const signal = controller.signal;
        ajaxRequest = controller; // Store controller for aborting
        $('.stop').show(); // Show stop button


        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(requestBody),
            signal: signal // Pass the abort signal
        });

         ajaxRequest = null; // Clear request object after fetch starts/completes initial phase

        if (!response.ok) {
            let errorData;
            try {
                 errorData = await response.json();
                 const errorMsg = errorData.error ? (errorData.error.message || JSON.stringify(errorData.error)) : (JSON.stringify(errorData) || response.statusText);
                 throw new Error(`HTTP error ${response.status}: ${errorMsg}`);
            } catch (e) {
                 // Handle cases where response is not JSON or JSON parsing fails
                 throw new Error(`HTTP error ${response.status}: ${response.statusText}. Could not parse error details.`);
            }
        }

        // --- Process Response based on Path and Streaming ---
        if (determinedPath === '/v1/images/generations') {
            const responseData = await response.json();
             if (responseData.data && responseData.data.length > 0 && responseData.data[0].url) {
                 addImageMessage(responseData.data[0].url); // This now handles saving too
                 resFlag = true;
             } else if (responseData.data && responseData.data.length > 0 && responseData.data[0].revised_prompt) {
                  // Handle revised prompt scenario (e.g., DALL-E might return this instead of URL on safety issues)
                  addResponseMessage("服务器返回了修改后的提示词 (可能由于安全原因): " + responseData.data[0].revised_prompt, true);
                  resFlag = true; // Still technically a valid response
             } else {
                 throw new Error("图片生成失败: " + (responseData.error?.message || "返回数据格式不正确"));
             }
        } else if (determinedPath === '/v1/moderations') {
            const responseData = await response.json();
            if (responseData.results) {
                addModerationMessage(responseData.results);
                resFlag = true;
            } else {
                throw new Error("内容审查失败: " + (responseData.error?.message || "返回数据格式不正确"));
            }
        } else if (determinedPath === '/v1/embeddings') {
            const responseData = await response.json();
             // Embeddings usually return a list, handle appropriately
             if (responseData.data && responseData.data.length > 0 && responseData.data[0].embedding) {
                 addEmbeddingMessage(responseData.data[0].embedding); // Display the first embedding
                 resFlag = true;
             } else {
                 throw new Error("Embedding 获取失败: " + (responseData.error?.message || "返回数据格式不正确"));
             }
        } else if (determinedPath === '/v1/audio/speech') {
            const audioBlob = await response.blob();
             if (audioBlob.type.startsWith('audio/')) {
                 const reader = new FileReader();
                 reader.onloadend = () => {
                     const base64Audio = reader.result.split(',')[1];
                     addTTSMessage(base64Audio); // This handles saving placeholder
                 };
                 reader.readAsDataURL(audioBlob);
                 resFlag = true;
             } else {
                  // Handle potential error response returned as JSON instead of audio blob
                  try {
                      const errorText = await audioBlob.text();
                      const errorJson = JSON.parse(errorText);
                      throw new Error("TTS失败: " + (errorJson.error?.message || errorText));
                  } catch (e) {
                       throw new Error("TTS失败: 无法处理响应。");
                  }
             }
        } else if (streamRequested) {
            // Handle Streaming Response (Chat Completions, Completions)
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            resFlag = false; // Assume not complete until done
            currentAssistantMessage = ''; // Reset accumulator

             while (true) {
                 const { done, value } = await reader.read();
                 if (done) {
                     addResponseMessage("", true); // Signal completion
                     resFlag = true;
                     break; // Exit loop
                 }

                 const chunk = decoder.decode(value, { stream: true });
                 // Process Server-Sent Events (SSE)
                 const lines = chunk.split("\n");
                 for (const line of lines) {
                     if (line.startsWith("data: ")) {
                         const dataStr = line.substring(6).trim();
                         if (dataStr === "[DONE]") {
                              addResponseMessage("", true); // Signal completion from DONE message
                              resFlag = true;
                              // reader.cancel(); // No need to cancel if already done
                              // break; // Exit inner loop, outer loop will catch 'done' next
                              continue; // Skip to next line/chunk
                         }
                         try {
                             const jsonObj = JSON.parse(dataStr);
                             let contentChunk = "";
                              // Handle different response structures
                              if (jsonObj.choices && jsonObj.choices[0]) {
                                  if (jsonObj.choices[0].delta && jsonObj.choices[0].delta.content) {
                                      contentChunk = jsonObj.choices[0].delta.content; // OpenAI Chat Stream
                                  } else if (jsonObj.choices[0].text) {
                                       contentChunk = jsonObj.choices[0].text; // OpenAI Completion Stream
                                   } else if (jsonObj.choices[0].message && jsonObj.choices[0].message.content) {
                                        // Some models might send full message object in stream chunks
                                        contentChunk = jsonObj.choices[0].message.content;
                                    }
                              } else if (jsonObj.candidates && jsonObj.candidates[0]?.content?.parts[0]?.text) {
                                  contentChunk = jsonObj.candidates[0].content.parts[0].text; // Gemini Stream
                              }
                              // Add more parsers if needed for other APIs

                             if (contentChunk) {
                                 addResponseMessage(contentChunk, false); // Add chunk, not complete yet
                                 resFlag = true; // Indicate we got *some* valid data
                             }
                         } catch (e) {
                             console.error("Error parsing stream chunk:", dataStr, e);
                             // Decide how to handle parse errors - skip chunk, show error?
                         }
                     }
                 } // End line processing loop
             } // End while loop
        } else {
            // Handle Non-Streaming Response
            const responseData = await response.json();
             let finalContent = null;

            // Handle different response structures
             if (responseData.choices && responseData.choices.length > 0) {
                  if (responseData.choices[0].message && responseData.choices[0].message.content) {
                       finalContent = responseData.choices[0].message.content; // OpenAI Chat
                  } else if (responseData.choices[0].text) {
                       finalContent = responseData.choices[0].text; // OpenAI Completion
                   }
             } else if (responseData.candidates && responseData.candidates[0]?.content?.parts[0]?.text) {
                  finalContent = responseData.candidates[0].content.parts[0].text; // Gemini Non-Stream
             } else if (determinedPath === '/v1beta/models/model:generateContent?key=apikey' && responseData.candidates && responseData.candidates[0]?.content?.parts) {
                 // Handle Gemini multimodal non-stream (image + text) - needs special handling
                  console.log("Received Gemini multimodal non-stream response:", responseData);
                  // TODO: Implement display logic for combined text/image parts if needed
                  // For now, extract first text part if available
                  const textPart = responseData.candidates[0].content.parts.find(p => p.text);
                  finalContent = textPart ? textPart.text : "[Multimodal content received]";
             }
             // Add more parsers if needed


             if (finalContent !== null) {
                 addResponseMessage(finalContent, true); // Add complete message
                 resFlag = true;
             } else {
                 // Throw error if no usable content found but response was OK
                 throw new Error("处理响应失败: " + (responseData.error?.message || "无法解析响应内容"));
             }
        }

    } catch (error) {
         ajaxRequest = null; // Clear request object on error too
         console.error("API Request Error:", error);
          // Check if the error was due to aborting
          if (error.name === 'AbortError') {
              addFailMessage("请求已中止。");
          } else {
              addFailMessage(error.message || "发生未知错误");
          }
         resFlag = false;
    } finally {
         // Ensure stop button is hidden and send button is enabled unless streaming correctly finished
         if (resFlag && !streamRequested) { // Non-stream success or handled stream completion
             $('.stop').hide();
             chatBtn.attr('disabled', false);
             chatInput.on("keydown", handleEnter);
         } else if (!resFlag) { // Failure case
              $('.stop').hide();
              chatBtn.attr('disabled', false);
              chatInput.on("keydown", handleEnter);
         }
          // If streaming is ongoing, the stop button remains visible, button disabled
          ajaxRequest = null; // Final clear in case it wasn't cleared before
    }
}


  // --- Event Handlers ---

  // Send Button Click
  chatBtn.click(function() {
    const message = chatInput.val().trim();
    if (!message) return; // Don't send empty messages

    // Disable button and unbind enter immediately
    chatBtn.attr('disabled', true);
    chatInput.off("keydown", handleEnter);
    resetInputHeight(); // Reset input height visually

    // Get image data if present
    let imageBase64 = "";
    if ($('#imagePreviewContainer').is(':visible') && imagePreview && imagePreview.src.startsWith('data:image')) {
         imageBase64 = imagePreview.src.split(',')[1];
    }

    // Prepare request data structure
    let requestData = {
      model: modelSelect.val(), // Get current model
      temperature: parseFloat($(".settings-common .temperature").val()),
      max_tokens: parseInt($(".settings-common .max-tokens").val()),
      prompts: [], // Will be populated based on history settings
      image_base64: imageBase64
    };

    addRequestMessage(message); // Add user message to UI
    messages.push({"role": "user", "content": message}); // Add user message to array

    // Handle History / Prompts
    const continuousDialogueEnabled = localStorage.getItem('continuousDialogue') === 'true';
    const modelRequiresNoHistory = requestData.model.toLowerCase().includes("dall-e") ||
                                   requestData.model.toLowerCase().includes("cogview") ||
                                   requestData.model.toLowerCase().includes("moderation") ||
                                   requestData.model.toLowerCase().includes("embedding") ||
                                   requestData.model.toLowerCase().includes("tts-1") ||
                                   requestData.model.toLowerCase().includes("grok-2-image") ||
                                   apiPathSelect.val() === '/v1/completions' || // Completions endpoint uses prompt, not messages
                                   apiPathSelect.val() === '/v1beta/models/model:generateContent?key=apikey'; // Gemini API structure


    if (continuousDialogueEnabled && !modelRequiresNoHistory) {
        const maxMessages = parseInt(getCookie('maxDialogueMessages')) || 150;
        requestData.prompts = messages.slice(-maxMessages); // Get last N messages
         // Simple check for message limit (could be more robust)
         if (messages.length >= maxMessages + 5) { // Add buffer before warning
             console.warn("Approaching max dialogue length. Consider clearing history.");
             // Optionally display a non-blocking warning to the user
         }

    } else {
        // Send only the last user message
        requestData.prompts = [messages[messages.length - 1]];
    }

     // Specific check for link + continuous dialogue (disable for this request)
     if (containsLink(message) && continuousDialogueEnabled && !modelRequiresNoHistory) {
         console.log("Link detected, sending only current message despite continuous dialogue setting.");
         requestData.prompts = [messages[messages.length - 1]];
     }


    sendRequest(requestData); // Call the async function

     // Clear image preview AFTER sending the request containing it
     if (imageBase64) {
          resetImageUpload();
     }

  }); // End chatBtn click

  // Stop Button Click
  $('.stop a').click(function(e) {
      e.preventDefault();
      if (ajaxRequest) {
          ajaxRequest.abort(); // Abort the fetch request
          console.log("Request aborted by user.");
          ajaxRequest = null; // Clear the controller reference
          // addFailMessage("请求已中止。"); // Already handled in sendRequest's catch block
          $(this).closest('.stop').hide(); // Hide the stop button itself
          // Re-enable send button and input
          chatBtn.attr('disabled', false);
          chatInput.on("keydown", handleEnter);
      }
  });


  // Enter Key Handler Function
  function handleEnter(e) {
      if (!isMobile() && (e.ctrlKey || e.metaKey) && e.keyCode === 13) {
          e.preventDefault();
          chatBtn.click();
      } else if (isMobile() && e.keyCode === 13 && !e.shiftKey) {
          e.preventDefault();
          chatBtn.click();
      }
  }
  // Initial binding
  chatInput.on("keydown", handleEnter);


  // --- Settings Dropdown Width ---
  function adaptSettingsWidth() {
     const othersWidth = $('.function .others').width();
     // Ensure width is reasonable before applying
     if (othersWidth && othersWidth > 50) {
          $('.function .settings .dropdown-menu').css('width', othersWidth);
     }
  }
  adaptSettingsWidth(); // Initial call
  $(window).resize(adaptSettingsWidth); // Adapt on resize


  // --- Theme Management ---
  function setBgColor(theme) {
    $(':root').attr('bg-theme', theme);
    // Update select dropdown value
    $('.settings-common .theme').val(theme);
    // Apply to detached elements if necessary (though CSS variables should handle this)
    $('.settings-common').css('background-color', 'var(--bg-color)'); // Example
  }

  let currentTheme = localStorage.getItem('theme') || "light"; // Default to light
  setBgColor(currentTheme);

  $('.settings-common .theme').change(function() {
    const selectedTheme = $(this).val();
    localStorage.setItem('theme', selectedTheme);
    setBgColor(selectedTheme);
  });

    // --- Settings Persistence (Password, API Key, URL) ---
    // Load from localStorage on startup
    $(".settings-common .password").val(localStorage.getItem('password') || '');
    $(".settings-common .api-key").val(localStorage.getItem('apiKey') || '');
    $(".settings-common .api_url").val(localStorage.getItem('api_url') || '');

    // Save on blur (focus lost)
    $(".settings-common .password").blur(function() {
        const value = $(this).val().trim();
        if (value) localStorage.setItem('password', value);
        else localStorage.removeItem('password');
    });
    $(".settings-common .api-key").blur(function() {
        const value = $(this).val().trim();
        if (value) localStorage.setItem('apiKey', value);
        else localStorage.removeItem('apiKey');
        // Trigger balance update on blur if value changed significantly (handled in initListeners)
    });
    $(".settings-common .api_url").blur(function() {
        const value = $(this).val().trim();
        if (value) localStorage.setItem('api_url', cleanApiUrl(value)); // Save cleaned URL
        else localStorage.removeItem('api_url');
         // Trigger balance update (handled in initListeners)
    });

  // --- Archive Session Setting ---
  var archiveSession = localStorage.getItem('archiveSession') !== 'false'; // Default true
  $("#chck-1").prop("checked", archiveSession);

  $('#chck-1').click(function() {
    const isChecked = $(this).prop('checked');
    localStorage.setItem('archiveSession', isChecked);
    if (isChecked && messages.length > 0) {
      // Save current session if newly enabled
      localStorage.setItem("session", JSON.stringify(messages));
    } else if (!isChecked) {
      // Clear session if disabled
      localStorage.removeItem("session");
    }
  });

    // --- Load History ---
    if (archiveSession) {
        const savedSession = localStorage.getItem("session");
        if (savedSession) {
            try {
                messages = JSON.parse(savedSession);
                if (!Array.isArray(messages)) messages = []; // Ensure it's an array

                // Clear existing chat window before loading history
                chatWindow.empty();

                // Load messages into UI
                let lastRequestBubble = null;
                messages.forEach(item => {
                    if (item.role === 'user') {
                         addRequestMessage(item.content);
                         // Find the bubble just added (it's the last request-bubble)
                         lastRequestBubble = chatWindow.find('.message-bubble.request-bubble').last();
                    } else if (item.role === 'assistant') {
                         // Ensure we have a preceding request bubble's response placeholder
                         if (lastRequestBubble && lastRequestBubble.next('.message-bubble.response-bubble').length) {
                             const responseBubble = lastRequestBubble.next('.message-bubble.response-bubble');
                             const responseTextElement = responseBubble.find('.message-text.response');
                             const responseButtonsContainer = responseBubble.find('.message-buttons');

                            // Determine content type and use appropriate function
                             const content = item.content;
                             if (content && (content.startsWith('http://') || content.startsWith('https://') || content.startsWith('data:image'))) {
                                  // It's an image URL - use addImageMessage logic (simplified for loading)
                                  responseTextElement.empty().append(`<div class="message-text"><img src="${content}" style="max-width: 100%; max-height: 300px; display: block; margin-top: 5px;" alt="Saved Image"></div>`);
                                  responseButtonsContainer.empty()
                                      .append('<button class="view-button"><i class="fas fa-search"></i></button>')
                                      .append('<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
                                  // Re-bind buttons for this loaded image
                                  responseButtonsContainer.find('.view-button').on('click', function() { window.open(content, '_blank'); });
                                  responseButtonsContainer.find('.delete-message-btn').click(function() {
                                      lastRequestBubble.remove(); responseBubble.remove(); rebuildAndSaveMessages();
                                  });

                             } else if (content === "//audio base64...") {
                                 responseTextElement.empty().append('<div class="message-text"><audio controls style="margin-top: 5px;" title="Audio playback not available from history"><source src="" type="audio/mpeg">Cannot load audio from history.</audio></div>'); // Placeholder element
                                 responseButtonsContainer.empty()
                                      .append('<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
                                  responseButtonsContainer.find('.delete-message-btn').click(function() {
                                       lastRequestBubble.remove(); responseBubble.remove(); rebuildAndSaveMessages();
                                  });

                              } else if (content === "//embedding data..." || content.startsWith('{') || content.startsWith('[')) {
                                  // Handle JSON data (moderation) or placeholders (embedding) as text/code
                                  let displayContent = content;
                                  try { // Try to pretty-print JSON if it is JSON
                                       const parsed = JSON.parse(content);
                                       displayContent = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(JSON.stringify(parsed, null, 2))}</pre>`;
                                  } catch(e) {
                                       // Not JSON or placeholder, treat as text
                                       displayContent = `<p>${escapeHtml(content)}</p>`;
                                  }
                                  responseTextElement.empty().html(displayContent); // Use html() for pre tag
                                  responseButtonsContainer.empty()
                                      .append('<button class="copy-button" title="Copy"><i class="far fa-copy"></i></button>')
                                      .append('<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
                                   bindResponseButtons(responseBubble, content); // Bind standard text buttons

                              } else {
                                 // Regular text message
                                 addResponseMessage(content, true); // Call addResponseMessage to render markdown and add buttons
                             }
                         } else {
                              console.warn("Orphaned assistant message found during loading:", item);
                         }
                         lastRequestBubble = null; // Reset for next pair
                    }
                });
                scrollToBottom(true); // Scroll to bottom immediately after loading
                copy(); // Re-apply code copy buttons after loading

            } catch (e) {
                console.error("Error parsing saved session:", e);
                messages = []; // Reset messages array on parse error
                localStorage.removeItem("session"); // Remove corrupted session data
            }
        } else {
             messages = []; // Ensure messages is empty if no session found
        }
    } else {
         messages = []; // Ensure messages is empty if archive is off
    }


  // --- Continuous Dialogue Setting ---
  var continuousDialogue = localStorage.getItem('continuousDialogue') !== 'false'; // Default true
  $("#chck-2").prop("checked", continuousDialogue);

  $('#chck-2').click(function() {
    localStorage.setItem('continuousDialogue', $(this).prop('checked'));
  });

// --- Model Change Logic ---
const streamOutputCheckbox = document.getElementById('streamOutput');

function updateModelSettings(modelName) {
    const lowerModelName = modelName.toLowerCase();

    // --- Streaming Setting Logic ---
    const forceNonStream = (lowerModelName.includes("o1") && !lowerModelName.includes("all")) ||
                           (lowerModelName.includes("o3") && !lowerModelName.includes("all"));

    const hideStreamSetting = lowerModelName.includes("dall-e") ||
                              lowerModelName.includes("cogview") ||
                              lowerModelName.includes("moderation") ||
                              lowerModelName.includes("embedding") ||
                              lowerModelName.includes("tts-1") ||
                              lowerModelName.includes("grok-2-image") ||
                              apiPathSelect.val() === '/v1beta/models/model:generateContent?key=apikey'; // Gemini path often non-streamed

    if (streamOutputSetting) { // Check if element exists
        if (hideStreamSetting) {
            streamOutputSetting.hide();
             // Optional: Set underlying cookie value if needed when hidden?
             // setCookie('streamOutput', 'false', 30); // Example: force non-stream if hidden
        } else {
            streamOutputSetting.show();
            if (forceNonStream) {
                if (streamOutputCheckbox) streamOutputCheckbox.checked = false;
                setCookie('streamOutput', 'false', 30);
                 if (streamOutputCheckbox) streamOutputCheckbox.disabled = true; // Disable checkbox
            } else {
                 if (streamOutputCheckbox) streamOutputCheckbox.disabled = false; // Re-enable checkbox
                 // Restore user's preferred setting if not forced
                 const preferredStream = getCookie('streamOutput') !== 'false';
                 if (streamOutputCheckbox) streamOutputCheckbox.checked = preferredStream;
            }
        }
    }

    // --- Continuous Dialogue Setting Logic ---
    const disableContinuous = lowerModelName.includes("dall-e") ||
                               lowerModelName.includes("cogview") ||
                               lowerModelName.includes("moderation") ||
                               lowerModelName.includes("embedding") ||
                               lowerModelName.includes("tts-1") ||
                               lowerModelName.includes("grok-2-image") ||
                               // Models primarily used with specific, non-chat endpoints
                               lowerModelName.includes("gpt-3.5-turbo-instruct") ||
                               lowerModelName.includes("babbage-002") ||
                               lowerModelName.includes("davinci-002") ||
                               // Vision models might or might not support history well depending on API
                               lowerModelName.includes("vision") || // General vision keyword
                               lowerModelName.includes("glm-4v") ||
                               // Other non-chat or specialized models
                               lowerModelName.includes("midjourney") || lowerModelName.includes("stable") ||
                               lowerModelName.includes("flux") || lowerModelName.includes("video") ||
                               lowerModelName.includes("sora") || lowerModelName.includes("suno") ||
                               lowerModelName.includes("kolors") || lowerModelName.includes("kling") ||
                               apiPathSelect.val() === '/v1beta/models/model:generateContent?key=apikey'; // Gemini path


    const continuousCheckbox = $("#chck-2");
    continuousCheckbox.prop("disabled", disableContinuous);

    if (disableContinuous) {
        continuousCheckbox.prop("checked", false);
        localStorage.setItem('continuousDialogue', false);
    } else {
        // If enabling continuous, restore user's preference
        const preferredContinuous = localStorage.getItem('continuousDialogue') !== 'false';
        continuousCheckbox.prop("checked", preferredContinuous);
    }

    // --- Clear History when switching from non-history model ---
    const previousModel = localStorage.getItem('previousModel') || "";
    const lowerPreviousModel = previousModel.toLowerCase();
    const previousWasDisabled = lowerPreviousModel.includes("dall-e") || lowerPreviousModel.includes("cogview") ||
                                lowerPreviousModel.includes("moderation") || lowerPreviousModel.includes("embedding") ||
                                lowerPreviousModel.includes("tts-1") || lowerPreviousModel.includes("grok-2-image") ||
                                lowerPreviousModel.includes("gpt-3.5-turbo-instruct") || lowerPreviousModel.includes("babbage-002") ||
                                lowerPreviousModel.includes("davinci-002") || lowerPreviousModel.includes("vision") ||
                                lowerPreviousModel.includes("glm-4v") || lowerPreviousModel.includes("midjourney") ||
                                lowerPreviousModel.includes("stable") || lowerPreviousModel.includes("flux") ||
                                lowerPreviousModel.includes("video") || lowerPreviousModel.includes("sora") ||
                                lowerPreviousModel.includes("suno") || lowerPreviousModel.includes("kolors") ||
                                lowerPreviousModel.includes("kling") ||
                                localStorage.getItem('previousApiPath') === '/v1beta/models/model:generateContent?key=apikey';


    if (previousWasDisabled && !disableContinuous) {
        // Switched from a model that disables history TO a model that allows it
        // Ask user or automatically clear? Let's clear automatically for simplicity.
        console.log("Switched from non-history model, clearing conversation.");
        clearConversation();
    }

    // --- Auto-switch API Path ---
    let autoSelectedPath = null; // Default: let user choose or keep current
     if (lowerModelName.includes("gpt-3.5-turbo-instruct") || lowerModelName.includes("babbage-002") || lowerModelName.includes("davinci-002")) {
         autoSelectedPath = '/v1/completions';
     } else if (lowerModelName.includes("dall-e-2") || lowerModelName.includes("dall-e-3") || lowerModelName.includes("cogview-3") || lowerModelName.includes("grok-2-image")) {
         autoSelectedPath = '/v1/images/generations';
     } else if (lowerModelName.includes("moderation")) {
         autoSelectedPath = '/v1/moderations';
     } else if (lowerModelName.includes("embedding")) {
         autoSelectedPath = '/v1/embeddings';
     } else if (lowerModelName.includes("tts-1")) {
         autoSelectedPath = '/v1/audio/speech';
     } else if (lowerModelName.includes("gemini")) {
         // Check if specific Gemini path exists in dropdown
          if ($('#apiPathSelect option[value="/v1beta/models/model:generateContent?key=apikey"]').length > 0) {
              autoSelectedPath = '/v1beta/models/model:generateContent?key=apikey';
          } else {
               autoSelectedPath = '/v1/chat/completions'; // Fallback if path not available
           }
     } else {
         // Default to chat completions for most other models if no specific path detected
         autoSelectedPath = '/v1/chat/completions';
     }

     // Update the dropdown *only if* the auto-selected path exists as an option
     if (autoSelectedPath && $(`#apiPathSelect option[value='${autoSelectedPath}']`).length > 0) {
          apiPathSelect.val(autoSelectedPath);
          localStorage.setItem('apiPath', autoSelectedPath); // Save auto-selected path
     } else if (!autoSelectedPath && $(`#apiPathSelect option[value='/v1/chat/completions']`).length > 0) {
         // If no specific path detected, but chat/completions exists, default to it
         apiPathSelect.val('/v1/chat/completions');
         localStorage.setItem('apiPath', '/v1/chat/completions');
     }
     // else: Keep the user's current selection if auto-path doesn't exist or isn't determined


    // Store current model and path for next change detection
    localStorage.setItem('previousModel', modelName);
    localStorage.setItem('previousApiPath', apiPathSelect.val());

     // Also update title
     updateTitle();
     // Check image upload visibility
     checkModelAndShowUpload();
}


// --- Initial Model Setup ---
const initialSelectedModel = localStorage.getItem('selectedModel');
if (initialSelectedModel) {
    // Check if the saved model still exists in the dropdown
    if ($(`.settings-common .model option[value='${initialSelectedModel}']`).length > 0) {
        $(".settings-common .model").val(initialSelectedModel);
    } else {
        // Saved model doesn't exist (maybe deleted), select the first one
        if ($(".settings-common .model option").length > 0) {
             $(".settings-common .model").prop('selectedIndex', 0);
             localStorage.setItem('selectedModel', $(".settings-common .model").val());
        } else {
             localStorage.removeItem('selectedModel'); // No models left
        }
    }
} else if ($(".settings-common .model option").length > 0) {
     // No saved model, select the first one by default
     $(".settings-common .model").prop('selectedIndex', 0);
     localStorage.setItem('selectedModel', $(".settings-common .model").val());
}

// Initialize settings based on the finally selected model
updateModelSettings($(".settings-common .model").val() || ""); // Pass current value or empty string


// Model Select Change Handler
$('.settings-common .model').change(function() {
    const selectedModel = $(this).val();
    localStorage.setItem('selectedModel', selectedModel);
    updateModelSettings(selectedModel); // Update settings, path, title etc.
});

// --- Clear Conversation ---
function clearConversation() {
    chatWindow.empty(); // Clear chat display
    if(chatInput) chatInput.val(''); // Clear input field
    resetInputHeight(); // Reset input height
    $(".answer .tips").css({"display":"flex"}); // Show tips card
    messages = []; // Clear message array
    localStorage.removeItem("session"); // Clear storage
    if (scrollDownBtn) {
         scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
         scrollDownBtn.data('scroll-state', 'down');
    }
     // Also reset image upload state
     resetImageUpload();
}

// Delete Button Handler
$(".delete a").click(function(e){
    e.preventDefault(); // Prevent potential anchor link behavior
    clearConversation();
});

// --- Scroll Handling ---
// Scroll to bottom helper
function scrollToBottom(immediate = false) {
     if (isScrolling) return; // Don't interrupt existing animation

     const targetScrollTop = chatWindow.prop('scrollHeight');
     if (immediate) {
          chatWindow.scrollTop(targetScrollTop);
          // Update button state immediately after manual scroll
          if (chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() < 1) {
               scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
               scrollDownBtn.data('scroll-state', 'up');
          } else {
               scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
               scrollDownBtn.data('scroll-state', 'down');
          }
     } else {
          // Animate scroll only if not already near the bottom
          if (chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() > 50) { // Threshold
               isScrolling = true;
               chatWindow.animate({ scrollTop: targetScrollTop }, scrollDuration, 'linear', function() {
                   isScrolling = false;
                   // Update button state after animation completes
                   scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                   scrollDownBtn.data('scroll-state', 'up');
               });
          } else {
               // If already near bottom, just snap and update state
               chatWindow.scrollTop(targetScrollTop);
               scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
               scrollDownBtn.data('scroll-state', 'up');
          }
     }
}

// Scroll event listener for button state
chatWindow.on('scroll', function() {
    if (isScrolling) return; // Ignore scroll events during animation

    const isNearTop = chatWindow.scrollTop() < 50; // Threshold near top
    const isNearBottom = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() < 50; // Threshold near bottom

    if (isNearBottom) {
        scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        scrollDownBtn.data('scroll-state', 'up');
    } else if (isNearTop) {
         scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
         scrollDownBtn.data('scroll-state', 'down');
    } else {
         // In the middle, default to scroll down state/icon
         scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
         scrollDownBtn.data('scroll-state', 'down');
    }
});

// Scroll button click handler
scrollDownBtn.click(function(e) {
    e.preventDefault();
    if (isScrolling) return;

    let scrollState = scrollDownBtn.data('scroll-state') || 'down';
    let targetScrollTop = scrollState === 'down' ? chatWindow[0].scrollHeight : 0;

    isScrolling = true;
    chatWindow.animate({
        scrollTop: targetScrollTop
    }, scrollDuration, 'linear', function() {
        isScrolling = false;
        // Update state after animation
        if (targetScrollTop === 0) { // Scrolled to top
            scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            scrollDownBtn.data('scroll-state', 'down');
        } else { // Scrolled to bottom
            scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
            scrollDownBtn.data('scroll-state', 'up');
        }
    });
});

// Stop scroll animation on user interaction (wheel or touch)
chatWindow.on('wheel touchstart', function() {
     if (isScrolling) {
          chatWindow.stop(true, false); // Stop animation immediately
          isScrolling = false;
          // Manually update button state based on current position after stopping
           const isNearBottom = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() < 50;
           if (isNearBottom) {
                scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                scrollDownBtn.data('scroll-state', 'up');
           } else {
                scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                scrollDownBtn.data('scroll-state', 'down');
           }
     }
});


  // --- Temperature/Max Tokens Persistence (Saving) ---
  // Note: Loading is handled earlier in the ready function
  // Slider change event
  $(".settings-common .temperature").on('change', function() {
      localStorage.setItem('temperature', $(this).val());
  });
  $(".settings-common .max-tokens").on('change', function() {
      localStorage.setItem('max_tokens ', $(this).val()); // Key has space
  });
  // Input change/blur events already handle saving in their respective sync logic


    // --- Screenshot Function ---
    $(".screenshot a").click(function(e) {
        e.preventDefault();
        // Use a library like html2canvas
        if (typeof html2canvas === 'undefined') {
            alert("Screenshot library (html2canvas) not loaded.");
            return;
        }

         // Temporarily style for capture if needed (e.g., remove scrollbars for full capture)
         // Note: Capturing full scroll height can be complex and memory-intensive
         const originalStyle = chatWindow.attr('style');
         chatWindow.css({
              overflow: 'visible', // Allow content to overflow for capture
              height: 'auto'     // Let height adjust to content
         });
         const captureHeight = chatWindow.prop('scrollHeight'); // Get full height

        html2canvas(chatWindow[0], {
            allowTaint: false,
            useCORS: true, // Important for external images/icons if any
             // scrollY: -window.scrollY, // Adjust based on page scroll if needed
             windowHeight: captureHeight, // Try to capture full height
             height: captureHeight,
             backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim() || '#ffffff' // Use theme background
        }).then(function(canvas) {
            // Restore original styles
            chatWindow.attr('style', originalStyle || ''); // Restore or remove style attr

            // Convert canvas to image and trigger download
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = "chat-screenshot-" + Date.now() + ".png";
            link.href = imgData;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => {
            console.error("Screenshot failed:", err);
            alert("截图失败。");
            // Restore original styles even on failure
            chatWindow.attr('style', originalStyle || '');
        });
    });


  // --- Code Copy Button Logic ---
  function copy() {
    // Remove existing buttons first to avoid duplicates on reload/redraw
    $('pre .copy-code-btn').remove();

    $('pre').each(function() {
      let btn = $('<button class="copy-code-btn" title="Copy Code"><i class="far fa-copy"></i></button>');
      $(this).append(btn); // Append directly to pre
       // Initially hide? Or use CSS for hover effect
       // btn.hide();
    });

    // Use event delegation for dynamically added buttons
    $(document).off('click', '.copy-code-btn').on('click', '.copy-code-btn', function() {
        let text = $(this).siblings('code').text();
        copyMessage(text); // Use the main copy helper
        showCheckmark($(this), "Copied"); // Show visual feedback
    });

     // Optional: Hover effect using CSS is generally better
     /*
     $('pre').hover(
       function() { $(this).find('.copy-code-btn').show(); },
       function() { $(this).find('.copy-code-btn').hide(); }
     );
     */
  }
  copy(); // Initial application


    // --- API Path Selection ---
    const initialApiPath = localStorage.getItem('apiPath');
    if (initialApiPath && $(`#apiPathSelect option[value='${initialApiPath}']`).length > 0) {
         apiPathSelect.val(initialApiPath);
    } // Loading handled earlier as well

    apiPathSelect.change(function() {
        const selectedApiPath = $(this).val();
        localStorage.setItem('apiPath', selectedApiPath);
        // Trigger model settings update as path change might affect stream/history options
        updateModelSettings(modelSelect.val() || "");
    });

}); 
