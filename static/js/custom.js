// 找到 select 元素
const selectElement = document.querySelector('.form-control.ipt-common.model');
const searchInput = document.querySelector('.model-search-input');

if (selectElement) {
    // 遍历 select 元素下的所有 option 元素
    Array.from(selectElement.options).forEach(option => {
        const originalText = option.textContent; // 保存原始文本
        option.setAttribute('data-description', originalText); // 设置 data-description
        option.textContent = option.value; // 设置 textContent 为 value
    });
}

searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    Array.from(selectElement.options).forEach(option => {
        const description = option.getAttribute('data-description').toLowerCase();
        if (description.includes(searchTerm)) {
            option.style.display = 'block'; // 或者 option.hidden = false;
        } else {
            option.style.display = 'none'; // 或者 option.hidden = true;
        }
    });
});

function resetImageUpload() {
    imageUpload.value = '';
    base64Image = '';
    imagePreviewContainer.style.display = 'none';
    imagePreview.src = '';
    // 可选：触发 change 事件以更新状态
    var event = new Event('change', { bubbles: true });
    imageUpload.dispatchEvent(event);
}

    var base64Image = "";
    var imageUpload = document.getElementById('imageUpload');
    var imagePreviewContainer = document.getElementById('imagePreviewContainer');
    var closeButton = document.getElementById('closeButton');

    imageUpload.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                base64Image = e.target.result.split(',')[1];
                imagePreviewContainer.style.display = 'block';
                document.getElementById('imagePreview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            base64Image = '';
            imagePreviewContainer.style.display = 'none';
            document.getElementById('imagePreview').src = '';
        }
    });

    closeButton.addEventListener('click', function() {
        imageUpload.value = '';
        base64Image = '';
        imagePreviewContainer.style.display = 'none';
        document.getElementById('imagePreview').src = '';

        var event = new Event('change', { bubbles: true });
        imageUpload.dispatchEvent(event);
    });
function checkModelAndShowUpload() {
    var modelSelect = document.querySelector('.model');
    var selectedModel = modelSelect.value.toLowerCase();
    var uploadArea = document.getElementById('uploadArea');

    if (
        selectedModel.includes("gpt-4") ||
        selectedModel.includes("glm-4v") ||
        selectedModel.includes("claude-3") ||
        selectedModel.includes("gemini-1.5") ||
        selectedModel.includes("gemini-2.0") ||
        selectedModel.includes("gemini-exp") ||
        selectedModel.includes("learnlm-1.5-pro-experimental") ||
        selectedModel.includes("vision") ||
        selectedModel.includes("o1") ||
        selectedModel.includes("o3")

    ) {
        uploadArea.style.display = 'block';
    } else {
        uploadArea.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var modelSelect = document.querySelector('.model');
    modelSelect.addEventListener('change', checkModelAndShowUpload);

    // 初始化时检查一次
    checkModelAndShowUpload();
});




// Helper functions to set and get cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));  // Calculate expiration time
        expires = "; expires=" + date.toUTCString();  // Convert to UTC string
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";  // Set cookie
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();  // Use trim() to clean up any extra spaces
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);  // Return the cookie value
        }
    }
    return null;  // If cookie is not found, return null
}

document.addEventListener('DOMContentLoaded', function() {
    // 余额显示/隐藏功能
    var toggleBalance = document.getElementById('toggleBalance');
    var balanceInfo = document.getElementById('balanceInfo');

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

    // 模型输出方式是否流式
    var streamOutputCheckbox = document.getElementById('streamOutput');
    var streamOutput = getCookie('streamOutput');
    if (streamOutput === 'false') {
        streamOutputCheckbox.checked = false;
    } else {
        streamOutputCheckbox.checked = true; // default true or cookie is not set
    }

    streamOutputCheckbox.addEventListener('change', function() {
        setCookie('streamOutput', this.checked ? 'true' : 'false', 30);
    });

    // 连续对话消息上限
    var maxDialogueMessagesInput = document.getElementById('maxDialogueMessages');
    var maxDialogueMessages = getCookie('maxDialogueMessages');
    if (maxDialogueMessages) {
        maxDialogueMessagesInput.value = maxDialogueMessages;
    } else {
        maxDialogueMessagesInput.value = 150; // Default value if no cookie is set, aligning with original js comment
    }

    maxDialogueMessagesInput.addEventListener('change', function() {
        setCookie('maxDialogueMessages', this.value, 30);
    });
});


    // Helper function to clean up API URL
    function cleanApiUrl(apiUrl) {
        if (!apiUrl) {
            return apiUrl;
        }
        let cleanedUrl = apiUrl.trim();
        cleanedUrl = cleanedUrl.replace(/\s/g, ''); // Remove spaces
        cleanedUrl = cleanedUrl.replace(/\/+$/, ''); // Remove trailing slashes
        cleanedUrl = cleanedUrl.cleanedUrl.replace(/\/v1(\/chat\/completions)?$/i, ''); // Remove /v1 or /v1/chat/completions at the end
        return cleanedUrl;
    }


    async function fetchBalance(apiUrl, apiKey) {
        const headers = new Headers({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        });

        try {
            // Clean the apiUrl before using it
            const cleanedApiUrl = cleanApiUrl(apiUrl);

            // Get the total balance (quota)
            let subscriptionResponse = await fetch(`${cleanedApiUrl}/v1/dashboard/billing/subscription`, { headers });
            if (!subscriptionResponse.ok) {
                throw new Error('Failed to fetch subscription data');
            }
            let subscriptionData = await subscriptionResponse.json();
            let total = subscriptionData.hard_limit_usd;

            // Get the usage information
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 99);
            let endDate = new Date();
            const usageUrl = `${cleanedApiUrl}/v1/dashboard/billing/usage?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`;

            let usageResponse = await fetch(usageUrl, { headers });
            if (!usageResponse.ok) {
                throw new Error('Failed to fetch usage data');
            }
            let usageData = await usageResponse.json();
            let totalUsage = usageData.total_usage / 100;

            let remaining = total - totalUsage;

            // Update the balance display
            document.getElementById('totalBalance').innerText = `总额: ${total.toFixed(4)} $`;
            document.getElementById('usedBalance').innerText = `已用: ${totalUsage.toFixed(4)} $`;
            document.getElementById('remainingBalance').innerText = `剩余: ${remaining.toFixed(4)} $`;

        } catch (error) {
            console.error('Error fetching balance:', error);
            document.getElementById('totalBalance').innerText = '总额: 加载失败';
            document.getElementById('usedBalance').innerText = '已用: 加载失败';
            document.getElementById('remainingBalance').innerText = '剩余: 加载失败';
        }
    }

    // Function to fetch default balance from the backend
    let defaultApiUrl = ''; // Variable to store default apiUrl from backend
    async function fetchDefaultBalance() {
        try {
            let response = await fetch('/default_balance');
            if (!response.ok) {
                throw new Error('Failed to fetch default balance data');
            }
            let data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }

            // Store default apiUrl
            defaultApiUrl = data.url; // Assuming the backend returns url in data

            // Update the balance display with default balance
            document.getElementById('totalBalance').innerText = `总额: ${data.total_balance.toFixed(4)} $`;
            document.getElementById('usedBalance').innerText = `已用: ${data.used_balance.toFixed(4)} $`;
            document.getElementById('remainingBalance').innerText = `剩余: ${data.remaining_balance.toFixed(4)} $`;

        } catch (error) {
            console.error('Error fetching default balance:', error);
            document.getElementById('totalBalance').innerText = '总额: 加载失败';
            document.getElementById('usedBalance').innerText = '已用: 加载失败';
            document.getElementById('remainingBalance').innerText = '剩余: 加载失败';
        }
    }

    // Function to initialize the listeners
    function initListeners() {
        const apiKeyField = document.querySelector('.api-key');
        const apiUrlField = document.querySelector('.api_url');

        // Initial check
        if (apiKeyField.value.trim()) {
            let apiUrl = apiUrlField.value.trim();
            if (!apiUrl) {
                apiUrl = defaultApiUrl; // Use default apiUrl if input is empty
            }
            fetchBalance(apiUrl, apiKeyField.value.trim());
        } else {
            fetchDefaultBalance();
        }

        // Event listeners
        apiKeyField.addEventListener('input', function () {
            const apiKey = apiKeyField.value.trim();
            if (apiKey) {
                let apiUrl = apiUrlField.value.trim();
                if (!apiUrl) {
                    apiUrl = defaultApiUrl; // Use default apiUrl if input is empty
                }
                fetchBalance(apiUrl, apiKey);
            } else {
                fetchDefaultBalance();
            }
        });

        apiUrlField.addEventListener('input', function () {
            const apiKey = apiKeyField.value.trim();
            if (apiKey) {
                let apiUrl = apiUrlField.value.trim();
                if (!apiUrl) {
                    apiUrl = defaultApiUrl; // Use default apiUrl if input is empty, but in this case apiUrl is not empty because it's triggered by apiUrlField input event. So no need to check again.
                        apiUrl = apiUrlField.value.trim(); // Use current apiUrl input value
                } else {
                    apiUrl = apiUrlField.value.trim(); // Use current apiUrl input value
                }
                fetchBalance(apiUrl, apiKey);
            } else {
                fetchDefaultBalance();
            }
        });
    }

    // Ensure DOM is fully loaded before adding event listeners
    document.addEventListener('DOMContentLoaded', function () {
        initListeners();
    });


$(document).ready(function () {
        // Function to detect links
    function containsLink(input) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return urlRegex.test(input);
    }

    // Existing input event listener for dynamic resizing
    chatInput.addEventListener('input', function () {
        // Save the current scroll height
        var currentScrollHeight = chatInput.scrollHeight;

        // Adjust the height of the input box
        chatInput.style.height = 'auto';
        chatInput.style.height = (Math.min(maxHeight, chatInput.scrollHeight)) + 'px';

        // Set the height of the outer container
        iptContainer.style.height = (Math.min(maxHeight, chatInput.scrollHeight) + 20) + 'px';

        // Restore the scroll height to prevent flickering
        chatInput.scrollTop = currentScrollHeight;

        // Check if the input contains a link
        if (containsLink(chatInput.value)) {
            // Disable continuous dialogue
            $("#chck-2").prop("checked", false);
            localStorage.setItem('continuousDialogue', false);
        }
    });

// 读取本地存储中的模型列表，并初始化模型选择下拉框
    var savedModels = localStorage.getItem('customModels');
    if (savedModels) {
        $(".model").html(savedModels);
    }

    // 监听添加自定义模型按钮点击事件
    $(".add-custom-model").on("click", function () {
        // 获取用户输入的自定义模型名称
        var customModelName = $(".custom-model").val().trim();

        // 确保模型名称非空
        if (customModelName !== "") {
            // 检查是否已存在相同模型
            if ($(".model option[value='" + customModelName + "']").length === 0) {
                // 创建新的 option 元素
                var newOption = $('<option>', {
                    value: customModelName,
                    text: customModelName, // 设置 textContent 为 value
                    'data-description': customModelName //设置data-description为value
                });
                // 添加自定义模型到模型选择下拉框
                $(".model").prepend(newOption); // Prepend to add to the beginning

                // 设置新添加的模型为选中项
                $(".model").val(customModelName);

                // 保存模型列表到本地存储
                saveModelsToLocalStorage();

                // 清空输入框
                $(".custom-model").val("");

                // 添加后立即更新标题
                updateTitle(); // Call updateTitle here

            } else {
                alert("该模型已存在！");
            }
        } else {
            alert("请输入有效的模型名称！");
        }
    });

    // 监听删除自定义模型按钮点击事件
    $(".delete-custom-model").on("click", function () {
        // 获取用户输入的自定义模型名称
        var customModelName = $(".custom-model").val().trim();

        // 确保模型名称非空
        if (customModelName !== "") {
            // 检查是否存在相同模型
            var optionToRemove = $(".model option[value='" + customModelName + "']");
            if (optionToRemove.length > 0) {
                // 删除相同模型
                optionToRemove.remove();

                // 保存模型列表到本地存储
                saveModelsToLocalStorage();

                // 清空输入框
                $(".custom-model").val("");
            } else {
                alert("未找到要删除的模型！");
            }
        } else {
            alert("请输入有效的模型名称！");
        }
    });

    // 将模型列表保存到本地存储
    function saveModelsToLocalStorage() {
        var modelsHtml = $(".model").html();
        localStorage.setItem('customModels', modelsHtml);
    }

    // 初始化 data-description 属性
    function initializeDataDescription() {
        $(".model option").each(function() {
            if (!$(this).attr('data-description')) { // Only initialize if it doesn't exist
                const originalText = $(this).text();
                $(this).attr('data-description', originalText);
                $(this).text($(this).val());
            }

        });
    }

    function updateTitle() {
        $(".title h2").text($(".settings-common .model option:selected").data('description'));
    }
    initializeDataDescription();
    updateTitle();
});


// 获取输入框元素和外部容器
var chatInput = document.getElementById('chatInput');
var iptContainer = document.querySelector('.ipt');

// 设置输入框的最大高度为250px
var maxHeight = 250;

// 获取发送按钮元素
var chatBtn = document.getElementById('chatBtn');

// 获取删除按钮元素
var deleteBtn = document.getElementById('deleteBtn');

// 判断是否是移动端
function isMobile() {
  // 使用适当的移动设备检测逻辑，这里简单地检查 whether it is less than a certain screen width
  return window.innerWidth <= 768; // Here we assume that a width less than or equal to 768 pixels is a mobile terminal
}

// Monitor input box content changes
chatInput.addEventListener('input', function () {
    // Save the current scroll height
    var currentScrollHeight = chatInput.scrollHeight;

    // Make input box height automatically adapt to content
    chatInput.style.height = 'auto';
    chatInput.style.height = (Math.min(maxHeight, chatInput.scrollHeight)) + 'px';

    // Calculate the new height of the input box
    var newHeight = Math.min(maxHeight, chatInput.scrollHeight);

    // Set the height of the outer container
    iptContainer.style.height = (newHeight + 20) + 'px'; // Increase by 20px of extra space

    // Restore scroll height to avoid flickering
    chatInput.scrollTop = currentScrollHeight;
});

// Monitor send button click event
chatBtn.addEventListener('click', function () {
    // Set the initial height of the input box
    chatInput.style.height = '32px';
    iptContainer.style.height = '50px'; // Also set the height of the outer container to the initial value
});

// Monitor delete button click event
deleteBtn.addEventListener('click', function () {
    // Set the initial height of the input box
    chatInput.style.height = '32px';
    iptContainer.style.height = '50px'; // Also set the height of the outer container to the initial value
});

// Monitor keyboard press event
chatInput.addEventListener('keydown', function (event) {
    // Determine whether Ctrl key and Enter key are pressed at the same time
    if (event.ctrlKey && event.keyCode === 13) {
        // Set the initial height of the input box
        chatInput.style.height = '32px';
        iptContainer.style.height = '50px'; // Also set the height of the outer container to the initial value
    }
    // If it is a mobile terminal, directly press the Enter key to send
    else if (isMobile() && event.keyCode == 13) {
        chatBtn.click();
        event.preventDefault();  // Avoid line break with Enter
    }
});


// 监听 temperature 变化
$('.settings-common .temperature').on('input', function() {
    const temperatureValue = $(this).val();
    $('.settings-common .temperature-display').text(temperatureValue);
    $('.settings-common .temperature-input').val(temperatureValue);
});

// 监听 temperature 输入框变化
$('.settings-common .temperature-input').on('input', function() {
    let temperatureValue = $(this).val();
    const minTemperature = parseFloat($('.settings-common .temperature-input').attr('min'));
    const maxTemperature = parseFloat($('.settings-common .temperature-input').attr('max'));

    // 限制最多只能输入两个数字
    const regex = /^(\d{0,2}(\.\d{0,1})?)?$/;
    if (!regex.test(temperatureValue)) {
    temperatureValue = parseFloat(temperatureValue).toFixed(1);
        $(this).val(temperatureValue);
    } else {
        // 处理以0开头后面直接跟数字的情况，如01
        if (temperatureValue.startsWith('0') && temperatureValue.length > 1 && temperatureValue[1] !== '.') {
            temperatureValue = parseFloat(temperatureValue); // 将字符串转换为数字
            $(this).val(temperatureValue); // 更新输入框的值
        }
        // 将字符串转换为数字
        temperatureValue = parseFloat(temperatureValue);
        if (isNaN(temperatureValue) || temperatureValue < minTemperature) {
            temperatureValue = minTemperature;
            $(this).val(minTemperature);
        } else if (temperatureValue > maxTemperature) {
            temperatureValue = maxTemperature;
            $(this).val(maxTemperature);
        }
    }
    $('.settings-common .temperature-display').text(temperatureValue);
    $('.settings-common .temperature').val(temperatureValue);
});


// 监听 max_tokens 变化
$('.settings-common .max-tokens').on('input', function() {
    const maxTokensValue = $(this).val();
    $('.settings-common .max-tokens-display').text(maxTokensValue);
    $('.settings-common .max-tokens-input').val(maxTokensValue);
});

// 监听 max_tokens 输入框键盘按下事件
$('.settings-common .max-tokens-input').on('keypress', function(event) {
const maxTokensValue = $(this).val();
    // 获取按下的键码
    const keyCode = event.which || event.keyCode;
    // 获取当前输入框的值
    const inputValue = $(this).val();
    // 如果按下的键是小数点，并且当前输入框的值已经包含小数点，则阻止默认行为
    if (keyCode === 46 ) {
        event.preventDefault();
    }
});

// 监听 max_tokens 输入框变化
$('.settings-common .max-tokens-input').on('input', function() {
    let maxTokensValue = parseInt($(this).val());
    const minTokens = parseInt($('.settings-common .max-tokens-input').attr('min'));
    const maxTokens = parseInt($('.settings-common .max-tokens-input').attr('max'));

    if (isNaN(maxTokensValue) || maxTokensValue < minTokens) {
        maxTokensValue = minTokens;
        $(this).val(minTokens);
    } else if (maxTokensValue > maxTokens) {
        maxTokensValue = maxTokens;
        $(this).val(maxTokens);
    }

    $('.settings-common .max-tokens-display').text(maxTokensValue);
    $('.settings-common .max-tokens').val(maxTokensValue);
});


// 功能
$(document).ready(function() {
  var chatBtn = $('#chatBtn');
  var chatInput = $('#chatInput');
  var chatWindow = $('#chatWindow');
  var streamOutputSetting = $('#streamOutputSetting'); // 获取模型输出方式设置行
  const apiPathSelect = $('#apiPathSelect'); // 获取 API Path 选择器
    const modelSelect = $('.settings-common .model'); // 获取模型选择 select 元素
    const modelSearchInput = $('.model-search-input'); // 获取模型搜索 input 元素


  // 存储对话信息,实现连续对话
  var messages = [];

  // 检查返回的信息是否是正确信息
  var resFlag = true

  // 创建自定义渲染器
  const renderer = new marked.Renderer();

  // 重写list方法
  renderer.list = function(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul';
    const startAttr = (ordered && start) ? ` start="${start}"` : '';
    return `<${type}${startAttr}>\n${body}</${type}>\n`;
  };

  // 设置marked选项
  marked.setOptions({
    renderer: renderer,
    highlight: function (code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : 'javascript';
      return hljs.highlight(code, { language: validLanguage }).value;
    }
  });


  // 转义html代码(对应字符转移为html实体)，防止在浏览器渲染
  function escapeHtml(html) {
    let text = document.createTextNode(html);
    let div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
  }

// 添加图片消息到窗口
function addImageMessage(imageUrl) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    lastResponseElement.append(`<div class="message-text"><img src="${imageUrl}" style="max-width: 30%; max-height: 30%;" alt="Generated Image"></div>` + '<button class="view-button"><i class="fas fa-search"></i></button>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
    // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Removed auto scroll

    // 绑定查看按钮事件
    lastResponseElement.find('.view-button').on('click', function() {
        window.open(imageUrl, '_blank');
    });
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').on('click', function() {
        $(this).closest('.message-bubble').remove(); // 删除该条响应消息
    });
}

// 添加审查结果消息到窗口
function addModerationMessage(moderationResult) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    let formattedResult = "<p>审查结果:</p><ul>";
    moderationResult.forEach(result => {
        formattedResult += `<li>有害标记: ${result["有害标记"] ? '是' : '否'}</li>`;
        formattedResult += "<li>违规类别:<ul>";
        for (const category in result["违规类别"]) {
            formattedResult += `<li>${category}: ${result["违规类别"][category] ? '是' : '否'}</li>`;
        }
        formattedResult += "</ul></li>";
        formattedResult += "<li>违规类别分数:<ul>";
        for (const score in result["违规类别分数(越大置信度越高)"]) {
            formattedResult += `<li>${score}: ${result["违规类别分数(越大置信度越高)"][score].toFixed(4)}</li>`;
        }
        formattedResult += "</ul></li>";
    });
    formattedResult += "</ul>";
    lastResponseElement.append('<div class="message-text">' + formattedResult + '</div>' + '<button class="copy-button"><i class="far fa-copy"></i></button>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
    // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Removed auto scroll
    // 绑定复制按钮点击事件
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim());
    });
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove();
    });
}

// 添加 Embedding 结果消息到窗口
function addEmbeddingMessage(embeddingResult) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    // Display the embedding result as a JSON string in a <pre> block for readability
    const embeddingString = JSON.stringify(embeddingResult, null, 2); // null, 2 for pretty printing
    lastResponseElement.append(`<div class="message-text"><p></p><pre style="white-space: pre-wrap;">${escapeHtml(embeddingString)}</pre></div>` + '<button class="copy-button"><i class="far fa-copy"></i></button>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
    // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Removed auto scroll

    // 绑定复制按钮点击事件
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim()); // Copy the text content of the message
    });
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove();
    });
}


// 添加 TTS 结果消息到窗口
function addTTSMessage(audioBase64) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    lastResponseElement.append('<div class="message-text">' + '<audio controls><source src="data:audio/mpeg;base64,' + audioBase64 + '" type="audio/mpeg"></audio></div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
    // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Removed auto scroll
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove();
    });
}

// 添加请求消息到窗口
function addRequestMessage(message) {
  $(".answer .tips").css({"display":"none"});    // reward card hidden
  chatInput.val('');
  let escapedMessage = escapeHtml(message);  // Escape the request message to prevent the browser from rendering if the input is html
  let requestMessageElement = $('<div class="message-bubble"><span class="chat-icon request-icon"></span><div class="message-text request"><p>' + escapedMessage + '</p><button class="copy-button"><i class="far fa-copy"></i></button><button class="edit-button"><i class="fas fa-edit"></i></button><button class="delete-message-btn"><i class="far fa-trash-alt"></i></button></div></div>');

  chatWindow.append(requestMessageElement);

  // Add copy button click event
  requestMessageElement.find('.copy-button').click(function() {
    copyMessage($(this)); // Call the copy message function
  });

  let responseMessageElement = $('<div class="message-bubble"><span class="chat-icon response-icon"></span><div class="message-text response"><span class="loading-icon"><i class="fa fa-spinner fa-pulse fa-2x"></i></span></div></div>');
  chatWindow.append(responseMessageElement);
  // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Removed auto scroll
    // Bind send button click event
  requestMessageElement.find('.send-button').click(function() {
  });

  // Bind edit button click event
  requestMessageElement.find('.edit-button').click(function() {
    editMessage(message);
  });

  // Add delete button click event
  requestMessageElement.find('.delete-message-btn').click(function() {
    $(this).closest('.message-bubble').remove(); // Delete the request message
  });
}

// Edit message
function editMessage(message) {
  // Clear the request message and response message
  $('.message-bubble').last().prev().remove();
  $('.message-bubble').last().remove();

  // Paste the request message to the user input box
  chatInput.val(message);
}

// Add response message to window, this method will be executed multiple times for streaming responses
function addResponseMessage(message) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();

    if ($(".answer .others .center").css("display") === "none") {
        $(".answer .others .center").css("display", "flex");
    }

    let escapedMessage;
    let messageContentHTML = ''; // Accumulate HTML content

    if (Array.isArray(message)) { // Handle structured message parts (for Gemini image responses)
        message.forEach(part => {
            if (part && part.text) { // Check if part and part.text exist
                // Process text part as before
                let textPart = part.text;
                let codeMarkCount = 0;
                let index = textPart.indexOf('```');

                while (index !== -1) {
                    codeMarkCount++;
                    index = textPart.indexOf('```', index + 3);
                }

                if (codeMarkCount % 2 == 1) {  // Unclosed code block
                    escapedMessage = marked.parse(textPart + '\n\n```');
                } else if (codeMarkCount % 2 == 0 && codeMarkCount != 0) {
                    escapedMessage = marked.parse(textPart);  // Convert response message markdown to html in real time
                } else if (codeMarkCount == 0) {  // No markdown code block in output code
                    if (textPart.includes('`')) {
                        escapedMessage = marked.parse(textPart);  // No markdown code block, but code snippet, still markdown format
                    } else {
                        escapedMessage = marked.parse(escapeHtml(textPart)); // May not be markdown format, use escapeHtml to process and then convert to prevent non-markdown format html from messing up the page
                    }
                }
                messageContentHTML += '<div class="message-text">' + escapedMessage + '</div><button class="copy-button"><i class="far fa-copy"></i></button>'; // Add copy button to text part

            } else if (part && part.inlineData) { //Check if part and part.inlineData exist
                // Handle image part
                const mimeType = part.inlineData.mimeType;
                const base64Data = part.inlineData.data;
                const imageUrl = `data:${mimeType};base64,${base64Data}`;
                messageContentHTML += `<div class="message-text"><img src="${imageUrl}" style="max-width: 30%; max-height: 30%;" alt="Generated Image"></div>`;
            }
        });
        lastResponseElement.append(messageContentHTML + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');

    } else { // Handle regular text message
        if (typeof message !== 'string' || !message) { // Check if message is not a string or is null/undefined
            console.error("addResponseMessage received non-string message:", message); // Log non-string messages
            return; // Exit if message is not a string
        }
        let codeMarkCount = 0;
        let index = message.indexOf('```'); // Line 809 - Error was happening here

        while (index !== -1) {
            codeMarkCount++;
            index = message.indexOf('```', index + 3);
        }

        if (codeMarkCount % 2 == 1) {  // Unclosed code block
            escapedMessage = marked.parse(message + '\n\n```');
        } else if (codeMarkCount % 2 == 0 && codeMarkCount != 0) {
            escapedMessage = marked.parse(message);  // Convert response message markdown to html in real time
        } else if (codeMarkCount == 0) {  // No markdown code block in output code
            if (message.includes('`')) {
                escapedMessage = marked.parse(message);  // No markdown code block, but code snippet, still markdown format
            } else {
                escapedMessage = marked.parse(escapeHtml(message)); // May not be markdown format, use escapeHtml to process and then convert to prevent non-markdown format html from messing up the page
            }
        }

        messageContent = escapedMessage;
        let viewButtons = [];

        // Parse the message content as HTML to find <a> tags
        let tempElement = $('<div>').html(messageContent);
        let links = tempElement.find('a');


        if (links.length > 0) {
            links.each(function() {
                let url = $(this).attr('href');
                if (url) {
                    let viewButton = $('<button class="view-button"><i class="fas fa-search"></i></button>');
                    viewButton.data('url', url);
                    viewButtons.push(viewButton);
                }
            });
             messageContent = tempElement.html(); // Update messageContent
        }


        if (message.startsWith('"//')) {
            // Handle audio with base64 encoding
            const base64Data = message.replace(/"/g, '');
            lastResponseElement.append('<div class="message-text">' + '<audio controls=""><source src="data:audio/mpeg;base64,' + base64Data + '" type="audio/mpeg"></audio> ' + '</div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
        } else if (message.startsWith('//')) {
            // Handle audio with base64 encoding
            const base64Data = message;
            lastResponseElement.append('<div class="message-text">' + '<audio controls=""><source src="data:audio/mpeg;base64,' + base64Data + '" type="audio/mpeg"></audio> ' + '</div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
        } else {
            lastResponseElement.append('<div class="message-text">' + messageContent + '</div>' + '<button class="copy-button"><i class="far fa-copy"></i></button>');
            viewButtons.forEach(button => {
                lastResponseElement.append(button);
            });
            lastResponseElement.append('<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
        }
        // ... (rest of button bindings for text messages are unchanged) ...
    }


    // Bind button events (for both text and image messages)
    lastResponseElement.find('.view-button').on('click', function() {
        const urlToOpen = $(this).data('url');
        window.open(urlToOpen, '_blank');
    });
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim());
    });
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove();
    });
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove();
    });
}

// 复制按钮点击事件
$(document).on('click', '.copy-button', function() {
  let messageText = $(this).prev().text().trim(); // Remove trailing newline
  // Create a temporary textarea to copy content
  let tempTextarea = $('<textarea>');
  tempTextarea.val(messageText).css({position: 'absolute', left: '-9999px'}).appendTo('body').select();
  document.execCommand('copy');
  tempTextarea.remove();

  // Show √ on copy button
  let checkMark = $('<i class="far fa-check-circle"></i>'); // Create √ icon element
  $(this).html(checkMark); // Replace button content with √ icon

  // Restore original copy button after delay
  let originalButton = $(this);
  setTimeout(function() {
    originalButton.html('<i class="far fa-copy"></i>'); // Restore original copy button content
  }, 2000); // Set delay time to 2 seconds
});

  // 添加失败信息到窗口
  function addFailMessage(message) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    lastResponseElement.append('<p class="error">' + message + '</p>');
    // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Removed auto scroll
    messages.pop() // If fail, let user input message delete from array
  }

let datas;

// Decode Base64 encoded API key
function decodeApiKey(encodedApiKey) {
  return atob(encodedApiKey);
}

// Get configuration information
async function getConfig() {
  try {
    const response = await fetch("/config");
    const data = await response.json();

    if (data.api_url) {
      datas = { "api_url": data.api_url };
    } else {
      datas = { "api_url": "" };
    }
  } catch (error) {
    console.error("Error fetching config:", error);
    // Error handling
  }
}

// Get random API key
function getRandomApiKey() {
  const apiKeyInput = $(".settings-common .api-key").val().trim();
  if (apiKeyInput) {
    const apiKeys = apiKeyInput.split(',').map(key => key.trim());
    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
  }
  return null;
}

// Get API key
async function getApiKey() {
  try {
    let apiKey = getRandomApiKey();

    if (!apiKey) {
      const password = $(".settings-common .password").val();

      if (!password) {
        console.error("Please enter an API key or password.");
        addFailMessage("请输入正确的访问密码或者输入自己的 API key 和 API URL 使用！");
        return null;
      }

      const response = await fetch("/get_api_key", {
        method: "POST",
        body: new URLSearchParams({ password }),
      });

      if (response.status === 403) {
        const errorData = await response.json();
        addFailMessage("请输入正确的访问密码或者输入自己的 API Key 和 API URL 使用！");
        console.error("Error:", errorData.error);
        return null;
      }

      const data = await response.json();

      if (data.apiKey) {
        // Decode API key
        apiKey = decodeApiKey(data.apiKey);
        return apiKey;
      } else {
        addFailMessage("请在设置填写好环境变量");
        console.error("API key not found in response.");
        return null;
      }
    } else {
      return apiKey;
    }
  } catch (error) {
    addFailMessage("出错了，请稍后再试！");
    console.error("Error fetching API key:", error);
    return null;
  }
}

// Send request to get response
async function sendRequest(data) {
  await getConfig();
  const apiKey = await getApiKey();

  if (!datas || !datas.api_url || !apiKey) {
    addFailMessage("请输入正确的访问密码或者输入自己的 API Key 和 API URL 使用！");
    console.error("Config data or API key is missing.");
    return;
  }

// Check if api_url exists non-empty value
if ($(".settings-common .api_url").val().trim()) {
    // Store api_url value
    datas.api_url =cleanApiUrl($(".settings-common .api_url").val());
    // Check if api_url is correct website format
    var apiUrlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!apiUrlRegex.test(datas.api_url)) {
        // If not correct website format, return error message
        addFailMessage("请检查并输入正确的代理网址");
    }
}

let apiUrl = datas.api_url + "/v1/chat/completions"; // Default path
let requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": data.temperature,
    "top_p": 1,
    "n": 1,
    "stream": getCookie('streamOutput') !== 'false' // Get streaming output setting from Cookie
};

// Use selected API path if it's not the default one
const selectedApiPath = apiPathSelect.val();
if (selectedApiPath) {
    apiUrl = datas.api_url + selectedApiPath;
} else {
    apiUrl = datas.api_url + "/v1/chat/completions"; // Fallback to default if no path selected
}


const model = data.model.toLowerCase(); // Convert model name to lowercase for easier comparison

if (selectedApiPath === '/v1/completions' || (apiPathSelect.val() === null && model.includes("gpt-3.5-turbo-instruct") || model.includes("babbage-002") || model.includes("davinci-002"))) {
    apiUrl = datas.api_url + "/v1/completions";
    requestBody = {
        "prompt": data.prompts[0].content,
        "model": data.model,
        "max_tokens": data.max_tokens,
        "temperature": data.temperature,
        "top_p": 1,
        "n": 1,
        "stream": getCookie('streamOutput') !== 'false'
    };
} else if (data.image_base64 && data.image_base64.trim() !== '' && (selectedApiPath === '/v1/chat/completions' || apiPathSelect.val() === null )) {
    apiUrl = datas.api_url + "/v1/chat/completions";
   requestBody = {
    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": data.prompts[0].content},
                                {
                                    "type": "image_url",
                                    "image_url": {"url": "data:image/jpeg;base64," + data.image_base64},
                                },
                            ],
                        }
                    ],
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": data.temperature,
    "top_p": 1,
    "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
    };
} else if ((selectedApiPath === '/v1/images/generations' || apiPathSelect.val() === null ) && (model.includes("dall-e-2") || model.includes("dall-e-3") || model.includes("cogview-3"))) {
    apiUrl = datas.api_url + "/v1/images/generations";
    let size = "1024x1024";
    let quality = "standard";
    let style = "natural";

    if (model.includes("256x256")) size = "256x256";
    if (model.includes("512x512")) size = "512x512";
    if (model.includes("1792x1024")) size = "1792x1024";
    if (model.includes("1024x1792")) size = "1024x1792";
    if (model.includes("-hd")) quality = "hd";
    if (model.includes("-v") || model.includes("-p")) style = "vivid";


    requestBody = {
        "prompt": data.prompts[0].content, // Image generation uses only the last message as prompt
        "model": data.model,
        "n": 1,
        "size": size,
        "quality": quality,
        "style": style,
    };
    if (model.includes("cogview-3")) {
        requestBody = {
            "prompt": data.prompts[0].content,
            "model": data.model,
            "size": "1024x1024",
        };
    }

} else if ((selectedApiPath === '/v1/moderations' || apiPathSelect.val() === null ) && model.includes("moderation")) {
    apiUrl = datas.api_url + "/v1/moderations";
    requestBody = {
        "input": data.prompts[0].content, // Moderation uses the last message as input
        "model": data.model,
    };
} else if ((selectedApiPath === '/v1/embeddings' || apiPathSelect.val() === null ) && model.includes("embedding")) {
    apiUrl = datas.api_url + "/v1/embeddings";
    requestBody = {
        "input": data.prompts[0].content, // Embedding uses the last message as input
        "model": data.model,
    };
} else if ((selectedApiPath === '/v1/audio/speech' || apiPathSelect.val() === null ) && model.includes("tts-1")) {
    apiUrl = datas.api_url + "/v1/audio/speech";
    requestBody = {
        "input": data.prompts[0].content, // TTS uses the last message as input
        "model": data.model,
        "voice": "alloy",
    };
} else if (model.includes("gemini-2.0-flash-exp-image-generation") && selectedApiPath === '/v1beta') { // Gemini models handling
    apiUrl =`https://gemini.baipiao.io/v1beta/models/${data.model}:generateContent?key=${apiKey}`;
    requestBody = {
        "contents": [{
            "parts": [{"text": data.prompts[0].content}]}],
            "generationConfig":{"responseModalities":["Text","Image"]}
    };
}else if (selectedApiPath === '/v1beta') { // Gemini models handling
    apiUrl =`https://gemini.baipiao.io/v1beta/models/${data.model}:generateContent?key=${apiKey}`;
    requestBody = {
        "contents": [{
            "parts": [{"text": data.prompts[0].content}]
        }]
    };
}
 else { // Default to /v1/chat/completions for other models or if path is not explicitly set
    apiUrl = datas.api_url + "/v1/chat/completions";
    requestBody = {
        "messages": data.prompts,
        "model": data.model,
        "max_tokens": data.max_tokens,
        "temperature": data.temperature,
        "top_p": 1,
        "n": 1,
        "stream": getCookie('streamOutput') !== 'false'
    };
}
    if (data.model.includes("o1") && !data.model.includes("all")) {
    apiUrl = datas.api_url + "/v1/chat/completions";
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": false // Force non-streaming
    };
}
    if (data.model.includes("o3") && !data.model.includes("all")) {
    apiUrl = datas.api_url + "/v1/chat/completions";
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": false // Force non-streaming
    };
}
        if (data.model.includes("deepseek-r") ) {
    apiUrl = datas.api_url + "/v1/chat/completions";
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // Force non-streaming
    };
}
    if (data.model.includes("claude-3-7-sonnet-20250219-thinking") ) {
    apiUrl = datas.api_url + "/v1/chat/completions";
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // Force non-streaming
    };
}
    if (data.model.includes("claude-3-7-sonnet-thinking") ) {
    apiUrl = datas.api_url + "/v1/chat/completions";
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // Force non-streaming
    };
}
if (data.model.includes("claude-3-7-sonnet-thinking-20250219") ) {
    apiUrl = datas.api_url + "/v1/chat/completions";
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // Force non-streaming
    };
}

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: selectedApiPath === '/v1beta' ? { // Conditional headers
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify(requestBody)
    });

if (!response.ok) {
    const errorData = await response.json();
    addFailMessage(`请求失败，状态码: ${response.status}, 错误信息: ${errorData.error ? errorData.error.message : response.statusText}`);
    return;
}

if (model.includes("dall-e-2") || model.includes("dall-e-3") || model.includes("cogview-3")) {
    const responseData = await response.json();
    if (responseData.data && responseData.data.length > 0 && responseData.data[0].url) {
        addImageMessage(responseData.data[0].url);
        resFlag = true;
    } else if (responseData.error) {
        addFailMessage(responseData.error.message);
        resFlag = false;
    } else {
        addFailMessage("图片生成失败，返回数据格式不正确");
        resFlag = false;
    }
    return; // For image generation, we handle response differently and return early
} else if (model.includes("moderation")) {
    const responseData = await response.json();
    if (responseData.results) {
        addModerationMessage(responseData.results);
        resFlag = true;
    } else if (responseData.error) {
        addFailMessage(responseData.error.message);
        resFlag = false;
    } else {
        addFailMessage("内容审查失败，返回数据格式不正确");
        resFlag = false;
    }
    return; // For moderation, handle response and return
} else if (model.includes("embedding")) {
    const responseData = await response.json();
    if (responseData.data && responseData.data.length > 0 && responseData.data[0].embedding) {
        addEmbeddingMessage(responseData.data[0].embedding);
        resFlag = true;
    } else if (responseData.error) {
        addFailMessage(responseData.error.message);
        resFlag = false;
    } else {
        addFailMessage("Embedding 获取失败，返回数据格式不正确");
        resFlag = false;
    }
    return; // For embedding, handle response and return
} else if (model.includes("tts-1")) {
    const audioBlob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        addTTSMessage(base64Audio);
    };
    reader.readAsDataURL(audioBlob);
    resFlag = true;
    return; // For TTS, handle response and return
} else if (model.includes("gemini-2.0-flash-exp-image-generation") && selectedApiPath === '/v1beta') {
    const responseData = await response.json();
    if (responseData.candidates && responseData.candidates[0].content && responseData.candidates[0].content.parts) {
        addResponseMessage(responseData.candidates[0].content.parts); // Pass parts array to addResponseMessage
        resFlag = true;
    } else if (responseData.error) {
        addFailMessage(responseData.error.message);
        resFlag = false;
    } else {
        addFailMessage("图片生成失败，返回数据格式不正确");
        resFlag = false;
    }
    return;
}


if (getCookie('streamOutput') !== 'false') { // Get streaming output setting from Cookie, default streaming
    const reader = response.body.getReader();
    let res = '';
    let str;
    // **新增代码 - 在请求前记录是否滚动到底部**
    const wasScrolledToBottomBeforeRequest = chatWindow.scrollTop() + chatWindow.innerHeight() + 1 >= chatWindow[0].scrollHeight;
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        str = '';
        res += new TextDecoder().decode(value).replace(/^data: /gm, '').replace("[DONE]", '');
        const lines = res.trim().split(/[\n]+(?=\{)/);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let jsonObj;
            try {
                jsonObj = JSON.parse(line);
            } catch (e) {
                break;
            }
    if (jsonObj.choices) {
        if (apiUrl === datas.api_url + "/v1/chat/completions" && jsonObj.choices[0].delta) {
            const reasoningContent = jsonObj.choices[0].delta.reasoning_content;
            const content = jsonObj.choices[0].delta.content;

            if (reasoningContent && reasoningContent.trim() !== "") {
                str += "思考过程:" + "\n" + reasoningContent + "\n"  + "最终回答:" + "\n" + content ;
            } else if (content && content.trim() !== "") {
                str += content;
            }
        } else if (apiUrl === datas.api_url + "/v1/completions" && jsonObj.choices[0].text) {
            str += jsonObj.choices[0].text;
        } else if (apiUrl === datas.api_url + "/v1/chat/completions" && jsonObj.choices[0].message) {
            const message = jsonObj.choices[0].message;
            const reasoningContent = message.reasoning_content;
            const content = message.content;

            if (reasoningContent && reasoningContent.trim() !== "") {
                str += "思考过程:" + "\n" + reasoningContent + "\n" + "最终回答:" + "\n" + content ;
            } else if (content && content.trim() !== "") {
                str += content;
            }
        }
                addResponseMessage(str);
                resFlag = true;
            } else if (jsonObj.candidates) { // Gemini stream response handling
                let geminiContent = '';
                if (jsonObj.candidates[0].content && jsonObj.candidates[0].content.parts && jsonObj.candidates[0].content.parts[0].text) {
                    geminiContent = jsonObj.candidates[0].content.parts[0].text;
                }
                str += geminiContent;
                addResponseMessage(str);
                resFlag = true;
            }

             else {
                if (jsonObj.error) {
                    addFailMessage(jsonObj.error.type + " : " + jsonObj.error.message + jsonObj.error.code);
                    resFlag = false;
                }
            }
        }
    }

    // **新增代码 - 流式响应结束后判断是否滚动到底部**
    if (wasScrolledToBottomBeforeRequest) {
      // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Conditional scroll, keep it if desired
    }


    return str;
} else { // Non-streaming output processing
    const responseData = await response.json();
    if (responseData.choices && responseData.choices.length > 0) {
        let content = '';
        if (apiUrl === datas.api_url + "/v1/chat/completions" && responseData.choices[0].message) {
            content = responseData.choices[0].message.content;
        } else if (apiUrl === datas.api_url + "/v1/completions" && responseData.choices[0].text) {
            content = responseData.choices[0].text;
        }
        addResponseMessage(content);
        resFlag = true;
        return content;
    } else if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content && responseData.candidates[0].content.parts && responseData.candidates[0].content.parts.length > 0) { // Gemini non-stream response handling
        const content = responseData.candidates[0].content.parts[0].text;
        addResponseMessage(content);
        resFlag = true;
        return content;
    }
     else if (responseData.error) {
        addFailMessage(responseData.error.message);
        resFlag = false;
        return null;
    } else {
        addFailMessage("Unexpected response format.");
        resFlag = false;
        return null;
    }

    // **新增代码 - 非流式响应结束后判断是否滚动到底部**
    const wasScrolledToBottomBeforeRequest = chatWindow.scrollTop() + chatWindow.innerHeight() + 1 >= chatWindow[0].scrollHeight;
    if (wasScrolledToBottomBeforeRequest) {
      // chatWindow.scrollTop(chatWindow.prop('scrollHeight')); // Conditional scroll, keep it if desired
    }
}


  }


  // 处理用户输入
  chatBtn.click(function() {
    // 解绑键盘事件
    chatInput.off("keydown",handleEnter);
let data = {};
console.log(base64Image);
let imageSrc = document.getElementById('imagePreview').src;
    data.image_base64 = imageSrc.split(',')[1];
    let message = chatInput.val();
    if (message.length == 0){
      // 重新绑定键盘事件
      chatInput.on("keydown",handleEnter);
      return
    }

    addRequestMessage(message);
    // 将用户消息保存到数组
    messages.push({"role": "user", "content": message})

    // 获取连续对话消息上限，默认值 150
    let maxMessages = parseInt(getCookie('maxDialogueMessages')) || 150;

    if(messages.length> maxMessages){
      addFailMessage("此次对话长度过长，请点击下方删除按钮清除对话内容！");
      // Rebind keyboard event
      chatInput.on("keydown",handleEnter);
      chatBtn.attr('disabled',false) // Make button clickable
      return ;
    }

 // Get selected model
  data.model = $(".settings-common .model").val();
  data.temperature = parseFloat($(".settings-common .temperature").val());
  data.max_tokens = parseInt($(".settings-common .max-tokens").val());

    const selectedModel = data.model.toLowerCase();
    if (selectedModel.includes("dall-e-2") || selectedModel.includes("dall-e-3") || selectedModel.includes("cogview-3") || selectedModel.includes("moderation") || selectedModel.includes("embedding") || selectedModel.includes("tts-1")) {
        data.prompts = [{"role": "user", "content": message}]; // For image/moderation/embedding/tts, only send the last message
    } else {
        // Determine whether continuous dialogue is enabled
        if(localStorage.getItem('continuousDialogue') == 'true'){
            // Control context, if dialogue length exceeds 4 turns, take the latest 3 turns, i.e. the last 7 data in the array
          data.prompts = messages.slice();  // Copy a copy of the global messages assigned to data.prompts, and then process data.prompts
          if (data.prompts.length > 8) {
            data.prompts.splice(0, data.prompts.length - 7);
          }
        }else{
          data.prompts = messages.slice();
          data.prompts.splice(0, data.prompts.length - 1); // If continuous dialogue is not enabled, take the last one
        }
    }


    sendRequest(data).then((res) => {
      chatInput.val('');
      // After receiving the reply, make the button clickable
      chatBtn.attr('disabled',false)
      // Rebind keyboard event
      chatInput.on("keydown",handleEnter);
      // Determine whether the reply is correct information
      if(resFlag && !(selectedModel.includes("dall-e-2") || selectedModel.includes("dall-e-3") || selectedModel.includes("cogview-3") || selectedModel.includes("moderation") || selectedModel.includes("embedding") || selectedModel.includes("tts-1")) ){ // Image/moderation/embedding/tts models don't add to messages array for continuous conversation
        messages.push({"role": "assistant", "content": res});
        // Determine whether to store historical sessions locally
        if(localStorage.getItem('archiveSession')=="true"){
          localStorage.setItem("session",JSON.stringify(messages));
        }
      }
      // Add copy
      copy();
    });
  });
// Stop and hide
$('.stop a').click(function() {
  if (ajaxRequest) {
    ajaxRequest.abort();
  }
  // Hide the parent element with class name "stop" (assuming you want to hide the entire parent element)
  $(this).closest('.stop').hide();
});
// Enter keyboard event
function handleEnter(e) {
  // If it is a computer terminal, determine whether Ctrl key and Enter key are pressed at the same time
  if (!isMobile() && e.ctrlKey && e.keyCode == 13) {
    chatBtn.click();
    e.preventDefault();  // Avoid line break with Enter
  }
}

// Bind keyboard event
chatInput.on("keydown", handleEnter);


  // Set column width adaptive
  let width = $('.function .others').width();
  $('.function .settings .dropdown-menu').css('width', width);

  $(window).resize(function() {
    width = $('.function .others').width();
    $('.function .settings .dropdown-menu').css('width', width);
  });


  // Theme
  function setBgColor(theme){
    $(':root').attr('bg-theme', theme);
    $('.settings-common .theme').val(theme);
    // Elements positioned outside the document also synchronize theme colors
    $('.settings-common').css('background-color', 'var(--bg-color)');
  }

  let theme = localStorage.getItem('theme');
  // If a theme was previously selected, apply it to the website
  if (theme) {
    setBgColor(theme);
  }else{
    localStorage.setItem('theme', "light"); //Default theme
    theme = localStorage.getItem('theme');
    setBgColor(theme);
  }

  // Monitor theme selection changes
  $('.settings-common .theme').change(function() {
    const selectedTheme = $(this).val();
    localStorage.setItem('theme', selectedTheme);
    $(':root').attr('bg-theme', selectedTheme);
    // Elements positioned outside the document also synchronize theme colors
    $('.settings-common').css('background-color', 'var(--bg-color)');
  });

  // password
  const password = localStorage.getItem('password');
  if (password) {
    $(".settings-common .password").val(password);
  }

  // password input box event
  $(".settings-common .password").blur(function() {
    const password = $(this).val();
    if(password.length!=0){
      localStorage.setItem('password', password);
    }else{
      localStorage.removeItem('password');
    }

  })
  // apiKey
  const apiKey = localStorage.getItem('apiKey');
  if (apiKey) {
    $(".settings-common .api-key").val(apiKey);
  }

  // apiKey input box event
  $(".settings-common .api-key").blur(function() {
    const apiKey = $(this).val();
    if(apiKey.length!=0){
      localStorage.setItem('apiKey', apiKey);
    }else{
      localStorage.removeItem('apiKey');
    }
  })

 // Read apiUrl
  const api_url = localStorage.getItem('api_url');
  if (api_url) {
    $(".settings-common .api_url").val(api_url);
  }

  // apiUrl input box event
  $(".settings-common .api_url").blur(function() {
    const api_url = $(this).val();
    if(api_url.length!=0){
      localStorage.setItem('api_url', api_url);
    }else{
      localStorage.removeItem('api_url');
    }
  })

  // Whether to save historical conversations
  var archiveSession = localStorage.getItem('archiveSession');

  // Initialize archiveSession
  if(archiveSession == null){
    archiveSession = "true";
    localStorage.setItem('archiveSession', archiveSession);
  }

  if(archiveSession == "true"){
    $("#chck-1").prop("checked", true);
  }else{
    $("#chck-1").prop("checked", false);
  }

  $('#chck-1').click(function() {
    if ($(this).prop('checked')) {
      // Actions for on state
      localStorage.setItem('archiveSession', true);
      if(messages.length != 0){
        localStorage.setItem("session",JSON.stringify(messages));
      }
    } else {
      // Actions for off state
      localStorage.setItem('archiveSession', false);
      localStorage.removeItem("session");
    }
  });

  // Load historically saved session
  if(archiveSession == "true"){
    const messagesList = JSON.parse(localStorage.getItem("session"));
    if(messagesList){
      messages = messagesList;
      $.each(messages, function(index, item) {
        if (item.role === 'user') {
          addRequestMessage(item.content)
        } else if (item.role === 'assistant') {
          addResponseMessage(item.content)
        }
      });
      // Add copy function
      copy();
    }
  }

  // Whether to enable continuous dialogue
  var continuousDialogue = localStorage.getItem('continuousDialogue');

  // Initialize continuousDialogue
  if(continuousDialogue == null){
    continuousDialogue = "true";
    localStorage.setItem('continuousDialogue', continuousDialogue);
  }

  if(continuousDialogue == "true"){
    $("#chck-2").prop("checked", true);
  }else{
    $("#chck-2").prop("checked", false);
  }

  $('#chck-2').click(function() {
    if ($(this).prop('checked')) {
      localStorage.setItem('continuousDialogue', true);
    } else {
      localStorage.setItem('continuousDialogue', false);
    }
// Delete the message in the input box
function deleteInputMessage() {
  chatInput.val('');
}
  });
// Read model configuration
const selectedModel = localStorage.getItem('selectedModel');

// Detect model and update settings
function updateModelSettings(modelName) {
    const isNonStreamModel = (modelName.toLowerCase().includes("o1") && !modelName.toLowerCase().includes("all")) ||
                               (modelName.toLowerCase().includes("o3") && !modelName.toLowerCase().includes("all")) ||
                               modelName.toLowerCase().includes("deepseek-r") ||
                               modelName.toLowerCase().includes("claude-3-7-sonnet-20250219-thinking") ||
                               modelName.toLowerCase().includes("claude-3-7-sonnet-thinking") ||
                               modelName.toLowerCase().includes("claude-3-7-sonnet-thinking-20250219");

    const isHideStreamSettingModel = modelName.toLowerCase().includes("dall-e") ||
                                      modelName.toLowerCase().includes("cogview") ||
                                      modelName.toLowerCase().includes("moderation") ||
                                      modelName.toLowerCase().includes("embedding") ||
                                      modelName.toLowerCase().includes("tts-1");

    var streamOutputCheckbox = document.getElementById('streamOutput');

    if (isNonStreamModel) {
        streamOutputCheckbox.checked = false;
        setCookie('streamOutput', 'false', 30);
        streamOutputSetting.show(); // Ensure setting row is displayed
    } else if (isHideStreamSettingModel) {
        streamOutputSetting.hide(); // Hide setting row
    } else {
        streamOutputSetting.show(); // Ensure setting row is displayed
        // If previously non-streaming, switch to streaming
        if (getCookie('streamOutput') === 'false') {
            streamOutputCheckbox.checked = true;
            setCookie('streamOutput', 'true', 30);
        }
    }

    // Detect whether it contains "tts" or "dall" and set continuous dialogue status - keep original continuous dialogue logic
    const hasTTS = modelName.toLowerCase().includes("tts");
    const hasCompletion1 = modelName.toLowerCase().includes("gpt-3.5-turbo-instruct");
    const hasCompletion2 = modelName.toLowerCase().includes("babbage-002");
    const hasCompletion3 = modelName.toLowerCase().includes("davinci-002");
    const hasTextem = modelName.toLowerCase().includes("embedding");
    const hasTextmo = modelName.toLowerCase().includes("moderation");
    const hasDALL = modelName.toLowerCase().includes("dall-e");
    const hasCog = modelName.toLowerCase().includes("cogview");
    const hasVs = modelName.toLowerCase().includes("glm-4v");
    const hasVi = modelName.toLowerCase().includes("vision");
    const hasMj = modelName.toLowerCase().includes("midjourney");
    const hasSD = modelName.toLowerCase().includes("stable");
    const hasFlux = modelName.toLowerCase().includes("flux");
    const hasVd = modelName.toLowerCase().includes("video");
    const hasSora = modelName.toLowerCase().includes("sora");
    const hasSuno = modelName.toLowerCase().includes("suno");
    const hasKo = modelName.toLowerCase().includes("kolors");
    const hasKl = modelName.toLowerCase().includes("kling");


    const isContinuousDialogueEnabled = !(hasTTS || hasDALL || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl);

    // Set continuous dialogue status
    $("#chck-2").prop("checked", isContinuousDialogueEnabled);
    localStorage.setItem('continuousDialogue', isContinuousDialogueEnabled);

    // Set whether to disable checkbox
    $("#chck-2").prop("disabled", hasTTS || hasDALL  || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl);

    // Get the previous model name
    const previousModel = localStorage.getItem('previousModel') || "";
    const hadTTS = previousModel.toLowerCase().includes("tts");
    const hadDALL = previousModel.toLowerCase().includes("dall-e");
    const hadCog = previousModel.toLowerCase().includes("cogview");
    const hadCompletion1 = previousModel.toLowerCase().includes("gpt-3.5-turbo-instruct");
    const hadCompletion2 = previousModel.toLowerCase().includes("babbage-002");
    const hadCompletion3= previousModel.toLowerCase().includes("davinci-002");
    const hadTextem = previousModel.toLowerCase().includes("embedding");
    const hadTextmo = previousModel.toLowerCase().includes("moderation");
    const hadVs = previousModel.toLowerCase().includes("glm-4v");
    const hadVi = previousModel.toLowerCase().includes("vision");
    const hadMj = previousModel.toLowerCase().includes("midjourney");
    const hadSD = previousModel.toLowerCase().includes("stable");
    const hadFlux = previousModel.toLowerCase().includes("flux");
    const hadVd = previousModel.toLowerCase().includes("video");
    const hadSora = previousModel.toLowerCase().includes("sora");
    const hadSuno = previousModel.toLowerCase().includes("suno");
    const hadKo = previousModel.toLowerCase().includes("kolors");
    const hadKl = previousModel.toLowerCase().includes("kling");


    // If switching from a model containing tts or dall to one that does not contain these, clear the conversation
    if ((hadTTS || hadDALL || hadCog || hadCompletion1 || hadCompletion2 || hadCompletion3 || hadTextem || hadTextmo || hadVs || hadVi || hadMj || hadSD || hadFlux || hadVd || hadSora || hadSuno || hadKo || hadKl) && !(hasTTS || hasDALL || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl)) {
        clearConversation();
    }

    // Update the previous model name to the current model
    localStorage.setItem('previousModel', modelName);

    // --- Start of Path Auto-Switching Logic ---
    let targetApiPath = null;
    const lowerModelName = modelName.toLowerCase();

    if (lowerModelName.includes("gpt-3.5-turbo-instruct") || lowerModelName.includes("babbage-002") || lowerModelName.includes("davinci-002")) {
        targetApiPath = '/v1/completions';
    } else if (lowerModelName.includes("dall-e-2") || lowerModelName.includes("dall-e-3") || lowerModelName.includes("cogview-3")) {
        targetApiPath = '/v1/images/generations';
    } else if (lowerModelName.includes("moderation")) {
        targetApiPath = '/v1/moderations';
    } else if (lowerModelName.includes("embedding")) {
        targetApiPath = '/v1/embeddings';
    } else if (lowerModelName.includes("tts-1")) {
        targetApiPath = '/v1/audio/speech';
    } else if (lowerModelName.includes("gemini")) {
        targetApiPath = '/v1/chat/completions'; // Gemini uses a special path, don't override apiPathSelect
    }
    else {
        targetApiPath = '/v1/chat/completions'; // Default path
    }

    if (targetApiPath && !lowerModelName.includes("gemini")) { // Do not set apiPath if Gemini model is selected, as it uses specific path
        apiPathSelect.val(targetApiPath);
        localStorage.setItem('apiPath', targetApiPath); // Optionally update localStorage as well
    } else if (lowerModelName.includes("gemini")) {
        apiPathSelect.val(targetApiPath); // Clear apiPathSelect for Gemini to avoid conflicts
        localStorage.removeItem('apiPath'); // Optionally clear localStorage for apiPath
    }
    // --- End of Path Auto-Switching Logic ---
}


        // Initial load detects selectedModel
        if (selectedModel) {
            $(".settings-common .model").val(selectedModel);
            updateModelSettings(selectedModel);
            // Update the title to use the selected option's data-description
            $(".title h2").text($(".settings-common .model option:selected").data('description'));
        }

        // Monitor model selection changes
        $('.settings-common .model').change(function() {
            const selectedModel = $(this).val();
            localStorage.setItem('selectedModel', selectedModel);
            updateModelSettings(selectedModel);
            // Update the title to use the selected option's data-description
            $(".title h2").text($(this).find("option:selected").data('description'));
        });

// Delete conversation
function clearConversation() {
    chatWindow.empty();
    deleteInputMessage();
    $(".answer .tips").css({"display":"flex"});
    messages = [];
    localStorage.removeItem("session");
}

// Delete function
$(".delete a").click(function(){
    clearConversation();
});
  // Read temperature
  const temperature = localStorage.getItem('temperature');
  if (temperature) {
    $(".settings-common .temperature-input").val(temperature);
    $(".settings-common .temperature").val(temperature);
  }

  // temperature input box event
  $(".settings-common .temperature-input").change(function() {
    const temperature = $(this).val();
    localStorage.setItem('temperature', temperature);
  })

  // temperature slider event
  $(".settings-common .temperature").change(function() {
    const temperature = $(this).val();
    localStorage.setItem('temperature', temperature);
     })

// Read max_tokens
  const max_tokens  = localStorage.getItem('max_tokens ');
  if (max_tokens) {
    $(".settings-common .max-tokens-input").val(max_tokens );
    $(".settings-common .max-tokens ").val(max_tokens );
  }

  // max_tokens input box event
  $(".settings-common .max-tokens-input").change(function() {
    const max_tokens  = $(this).val();
    localStorage.setItem('max_tokens ', max_tokens );
      })

  // max_tokens slider event
  $(".settings-common .max-tokens").change(function() {
    const max_tokens  = $(this).val();
    localStorage.setItem('max_tokens ', max_tokens );
      })

// Delete message in input box
function deleteInputMessage() {
  chatInput.val('');
}

// Delete function
$(".delete a").click(function(){
  chatWindow.empty();
  deleteInputMessage();
  $(".answer .tips").css({"display":"flex"});
  messages = [];
  localStorage.removeItem("session");
});

// Delete function
$(".delete a").click(function(){
    clearConversation();
});
  // Screenshot function
  $(".screenshot a").click(function() {
    // Create a copy element
    const clonedChatWindow = chatWindow.clone();
    clonedChatWindow.css({
      position: "absolute",
      left: "-9999px",
      overflow: "visible",
      width: chatWindow.width(),
      height: "auto"
    });
    $("body").append(clonedChatWindow);
    // Screenshot
    html2canvas(clonedChatWindow[0], {
      allowTaint: false,
      useCORS: true,
      scrollY: 0,
    }).then(function(canvas) {
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      // Create download link
      const link = document.createElement('a');
      link.download = "screenshot_" + Math.floor(Date.now() / 1000) + ".png";
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      clonedChatWindow.remove();
    });
  });

  // Code copy function
  function copy(){
    $('pre').each(function() {
      let btn = $('<button class="copy-btn">复制</button>');
      $(this).append(btn);
      btn.hide();
    });

    $('pre').hover(
      function() {
        $(this).find('.copy-btn').show();
      },
      function() {
        $(this).find('.copy-btn').hide();
      }
    );

    $('pre').on('click', '.copy-btn', function() {
      let text = $(this).siblings('code').text();
      // Create a temporary textarea element
      let textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);

      // Select the text in the textarea
      textArea.select();

      // Execute copy command
      try {
        document.execCommand('copy');
        $(this).text('复制成功');
      } catch (e) {
        $(this).text('复制失败');
      }

      // Remove the temporary textarea element from the document
      document.body.removeChild(textArea);

      setTimeout(() => {
        $(this).text('复制');
      }, 2000);
    });
  }
    // Read apiPath
    const apiPath = localStorage.getItem('apiPath');
    if (apiPath) {
        apiPathSelect.val(apiPath);
    }

    // apiPath select event
    apiPathSelect.change(function() {
        const selectedApiPath = $(this).val();
        localStorage.setItem('apiPath', selectedApiPath);
    });
});
