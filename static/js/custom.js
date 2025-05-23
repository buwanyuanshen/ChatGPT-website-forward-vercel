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
    localStorage.setItem('modelSearchInput', searchInput.value); // Save search input
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
        selectedModel.includes("claude-sonnet-4") ||
        selectedModel.includes("claude-opus-4") ||
        selectedModel.includes("gemini-1.5") ||
        selectedModel.includes("gemini-2.0") ||
        selectedModel.includes("gemini-2.5") ||
        selectedModel.includes("gemini-exp") ||
        selectedModel.includes("learnlm") ||
        selectedModel.includes("vision") ||
        selectedModel.includes("o1") ||
        selectedModel.includes("o3") ||
        selectedModel.includes("o4")

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
        cleanedUrl = cleanedUrl.replace(/\/v1(\/chat\/completions)?$/i, ''); // Remove /v1 or /v1/chat/completions at the end
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
            const usageUrl = `${cleanedApiUrl}/v1/dashboard/billing/usage?start_date=${startDate.toISOString().split('T')[0]}&end-date=${endDate.toISOString().split('T')[0]}`;

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

    // Load model search input from localStorage
    const savedModelSearchInput = localStorage.getItem('modelSearchInput');
    if (savedModelSearchInput) {
        searchInput.value = savedModelSearchInput;
        searchInput.dispatchEvent(new Event('input')); // Trigger input event to filter options
    }

    const savedApiPath = localStorage.getItem('apiPath');
    if (savedApiPath) {
        $('#apiPathSelect').val(savedApiPath);
    }
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
// 获取 scroll-down 按钮元素
var scrollDownBtn = $('.scroll-down a');
// 获取 chatWindow 元素
var chatWindow = $('#chatWindow');

// 标志当前是否正在滚动
let isScrolling = false;
// 滚动动画的持续时间（毫秒）
const scrollDuration = 400; // 匀速滚动速度，可以调整

// 判断是否是移动端
function isMobile() {
  // 使用适当的移动设备检测逻辑，这里简单地检查是否小于某个屏幕宽度
  return window.innerWidth <= 768; // 这里假设小于等于768像素的宽度是移动端
}

// 监听输入框内容变化
chatInput.addEventListener('input', function () {
    // 保存当前输入框的滚动高度
    var currentScrollHeight = chatInput.scrollHeight;

    // 使输入框高度自动适应内容
    chatInput.style.height = 'auto';
    chatInput.style.height = (Math.min(maxHeight, chatInput.scrollHeight)) + 'px';

    // 计算输入框的新高度
    var newHeight = Math.min(maxHeight, chatInput.scrollHeight);

    // 设置外部容器的高度
    iptContainer.style.height = (newHeight + 20) + 'px'; // 增加20px的额外空间

    // 恢复滚动高度，避免闪烁
    chatInput.scrollTop = currentScrollHeight;
});

// 监听发送按钮点击事件
chatBtn.addEventListener('click', function () {
    // 设置输入框的初始高度
    chatInput.style.height = '32px';
    iptContainer.style.height = '50px'; // 将外部容器的高度也设置为初始值
});

// 监听删除按钮点击事件
deleteBtn.addEventListener('click', function () {
    // 设置输入框的初始高度
    chatInput.style.height = '32px';
    iptContainer.style.height = '50px'; // 将外部容器的高度也设置为初始值
});

// 监听键盘按下事件
chatInput.addEventListener('keydown', function (event) {
    // 判断同时按下Ctrl键和Enter键
    if (event.ctrlKey && event.keyCode === 13) {
        // 设置输入框的初始高度
        chatInput.style.height = '32px';
        iptContainer.style.height = '50px'; // 将外部容器的高度也设置为初始值
    }
    // 如果是手机端，直接按下Enter键发送
    else if (isMobile() && event.keyCode == 13) {
        chatBtn.click();
        event.preventDefault();  //避免回车换行
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
    const scrollDownBtn = $('.scroll-down'); // 获取 scroll-down 按钮容器


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

    // 绑定查看按钮事件
    lastResponseElement.find('.view-button').on('click', function() {
        window.open(imageUrl, '_blank');
    });
    // 绑定删除按钮点击事件
lastResponseElement.find('.delete-message-btn').click(function() {
    const messageBubble = $(this).closest('.message-bubble');
    messageBubble.prev('.message-bubble').remove(); // 删除请求消息 bubble
    messageBubble.remove(); // 删除响应消息 bubble

    if (localStorage.getItem('archiveSession') === 'true') {
        messages = []; // 清空 messages 数组
        localStorage.removeItem("session"); // 移除 session

        // 重新遍历 chatWindow 中的消息 bubble，重建 messages 数组
        $('#chatWindow .message-bubble').each(function() {
            const role = $(this).find('.chat-icon').hasClass('request-icon') ? 'user' : 'assistant';
            const content = $(this).find('.message-text p').text() || $(this).find('.message-text pre').text() || $(this).find('.message-text audio').length > 0 ? '//audio base64...' : ''; // 获取消息内容，音频消息内容简化为占位符
            if (role && content) { // 确保 role 和 content 都存在
                 if (role === 'user') {
                    messages.push({ "role": "user", "content": $(this).find('.message-text p').text() || $(this).find('.message-text pre').text()});
                } else if (role === 'assistant') {
                    let messageContent = "";
                    if ($(this).find('.message-text p').length > 0) {
                        messageContent = $(this).find('.message-text p').text();
                    } else if ($(this).find('.message-text pre').length > 0) {
                        messageContent = $(this).find('.message-text pre').text();
                    } else if ($(this).find('.message-text audio').length > 0) {
                        messageContent = "//audio base64..."; // 音频消息内容简化为占位符
                    } else if ($(this).find('.message-text img').length > 0) {
                        messageContent = "//image url..."; // 图片消息内容简化为占位符
                    } else {
                        messageContent = $(this).find('.message-text').text(); // 兜底方案
                    }
                    messages.push({ "role": "assistant", "content": messageContent, "isImage": true }); // Add "isImage" flag
                }
            }
        });
         if (messages.length > 0) { // 只有当 messages 不为空时才保存
            localStorage.setItem("session", JSON.stringify(messages)); // 重新保存 session
        }
    }
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
    // 绑定复制按钮点击事件
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim());
    });
    // 绑定删除按钮点击事件
lastResponseElement.find('.delete-message-btn').click(function() {
    const messageBubble = $(this).closest('.message-bubble');
    messageBubble.prev('.message-bubble').remove(); // 删除请求消息 bubble
    messageBubble.remove(); // 删除响应消息 bubble

    if (localStorage.getItem('archiveSession') === 'true') {
        messages = []; // 清空 messages 数组
        localStorage.removeItem("session"); // 移除 session

        // 重新遍历 chatWindow 中的消息 bubble，重建 messages 数组
        $('#chatWindow .message-bubble').each(function() {
            const role = $(this).find('.chat-icon').hasClass('request-icon') ? 'user' : 'assistant';
            const content = $(this).find('.message-text p').text() || $(this).find('.message-text pre').text() || $(this).find('.message-text audio').length > 0 ? '//audio base64...' : ''; // 获取消息内容，音频消息内容简化为占位符
            if (role && content) { // 确保 role 和 content 都存在
                 if (role === 'user') {
                    messages.push({ "role": "user", "content": $(this).find('.message-text p').text() || $(this).find('.message-text pre').text()});
                } else if (role === 'assistant') {
                    let messageContent = "";
                    if ($(this).find('.message-text p').length > 0) {
                        messageContent = $(this).find('.message-text p').text();
                    } else if ($(this).find('.message-text pre').length > 0) {
                        messageContent = $(this).find('.message-text pre').text();
                    } else if ($(this).find('.message-text audio').length > 0) {
                        messageContent = "//audio base64..."; // 音频消息内容简化为占位符
                    } else if ($(this).find('.message-text img').length > 0) {
                        messageContent = "//image url..."; // 图片消息内容简化为占位符
                    } else {
                        messageContent = $(this).find('.message-text').text(); // 兜底方案
                    }
                    messages.push({ "role": "assistant", "content": messageContent });
                }
            }
        });
         if (messages.length > 0) { // 只有当 messages 不为空时才保存
            localStorage.setItem("session", JSON.stringify(messages)); // 重新保存 session
        }
    }
});
}

// 添加 Embedding 结果消息到窗口
function addEmbeddingMessage(embeddingResult) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    // Display the embedding result as a JSON string in a <pre> block for readability
    const embeddingString = JSON.stringify(embeddingResult, null, 2); // null, 2 for pretty printing
    lastResponseElement.append(`<div class="message-text"><p></p><pre style="white-space: pre-wrap;">${escapeHtml(embeddingString)}</pre></div>` + '<button class="copy-button"><i class="far fa-copy"></i></button>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');

    // 绑定复制按钮点击事件
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim()); // Copy the text content of the message
    });
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
    const messageBubble = $(this).closest('.message-bubble');
    messageBubble.prev('.message-bubble').remove(); // 删除请求消息 bubble
    messageBubble.remove(); // 删除响应消息 bubble

    if (localStorage.getItem('archiveSession') === 'true') {
        messages = []; // 清空 messages 数组
        localStorage.removeItem("session"); // 移除 session

        // 重新遍历 chatWindow 中的消息 bubble，重建 messages 数组
        $('#chatWindow .message-bubble').each(function() {
            const role = $(this).find('.chat-icon').hasClass('request-icon') ? 'user' : 'assistant';
            const content = $(this).find('.message-text p').text() || $(this).find('.message-text pre').text() || $(this).find('.message-text audio').length > 0 ? '//audio base64...' : ''; // 获取消息内容，音频消息内容简化为占位符
            if (role && content) { // 确保 role 和 content 都存在
                 if (role === 'user') {
                    messages.push({ "role": "user", "content": $(this).find('.message-text p').text() || $(this).find('.message-text pre').text()});
                } else if (role === 'assistant') {
                    let messageContent = "";
                    if ($(this).find('.message-text p').length > 0) {
                        messageContent = $(this).find('.message-text p').text();
                    } else if ($(this).find('.message-text pre').length > 0) {
                        messageContent = $(this).find('.message-text pre').text();
                    } else if ($(this).find('.message-text audio').length > 0) {
                        messageContent = "//audio base64..."; // 音频消息内容简化为占位符
                    } else if ($(this).find('.message-text img').length > 0) {
                        messageContent = "//image url..."; // 图片消息内容简化为占位符
                    } else {
                        messageContent = $(this).find('.message-text').text(); // 兜底方案
                    }
                    messages.push({ "role": "assistant", "content": messageContent });
                }
            }
        });
         if (messages.length > 0) { // 只有当 messages 不为空时才保存
            localStorage.setItem("session", JSON.stringify(messages)); // 重新保存 session
        }
    }
});
}


// 添加 TTS 结果消息到窗口
function addTTSMessage(audioBase64) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    lastResponseElement.append('<div class="message-text">' + '<audio controls><source src="data:audio/mpeg;base64,' + audioBase64 + '" type="audio/mpeg"></audio></div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
    const messageBubble = $(this).closest('.message-bubble');
    messageBubble.prev('.message-bubble').remove(); // 删除请求消息 bubble
    messageBubble.remove(); // 删除响应消息 bubble

    if (localStorage.getItem('archiveSession') === 'true') {
        messages = []; // 清空 messages 数组
        localStorage.removeItem("session"); // 移除 session

        // 重新遍历 chatWindow 中的消息 bubble，重建 messages 数组
        $('#chatWindow .message-bubble').each(function() {
            const role = $(this).find('.chat-icon').hasClass('request-icon') ? 'user' : 'assistant';
            const content = $(this).find('.message-text p').text() || $(this).find('.message-text pre').text() || $(this).find('.message-text audio').length > 0 ? '//audio base64...' : ''; // 获取消息内容，音频消息内容简化为占位符
            if (role && content) { // 确保 role 和 content 都存在
                 if (role === 'user') {
                    messages.push({ "role": "user", "content": $(this).find('.message-text p').text() || $(this).find('.message-text pre').text()});
                } else if (role === 'assistant') {
                    let messageContent = "";
                    if ($(this).find('.message-text p').length > 0) {
                        messageContent = $(this).find('.message-text p').text();
                    } else if ($(this).find('.message-text pre').length > 0) {
                        messageContent = $(this).find('.message-text pre').text();
                    } else if ($(this).find('.message-text audio').length > 0) {
                        messageContent = "//audio base64..."; // 音频消息内容简化为占位符
                    } else if ($(this).find('.message-text img').length > 0) {
                        messageContent = "//image url..."; // 图片消息内容简化为占位符
                    } else {
                        messageContent = $(this).find('.message-text').text(); // 兜底方案
                    }
                    messages.push({ "role": "assistant", "content": messageContent });
                }
            }
        });
         if (messages.length > 0) { // 只有当 messages 不为空时才保存
            localStorage.setItem("session", JSON.stringify(messages)); // 重新保存 session
        }
    }
});
}

// 添加请求消息到窗口
function addRequestMessage(message) {
  $(".answer .tips").css({"display":"none"});    // 打赏卡隐藏
  chatInput.val('');
  let escapedMessage = escapeHtml(message);  // 对请求message进行转义，防止输入的是html而被浏览器渲染
  let requestMessageElement = $('<div class="message-bubble"><span class="chat-icon request-icon"></span><div class="message-text request"><p>' + escapedMessage + '</p><button class="copy-button"><i class="far fa-copy"></i></button><button class="edit-button"><i class="fas fa-edit"></i></button><button class="delete-message-btn"><i class="far fa-trash-alt"></i></button></div></div>');

  chatWindow.append(requestMessageElement);

  // 添加复制按钮点击事件
  requestMessageElement.find('.copy-button').click(function() {
    copyMessage($(this)); // 调用复制消息函数
  });

  let responseMessageElement = $('<div class="message-bubble"><span class="chat-icon response-icon"></span><div class="message-text response"><span class="loading-icon"><i class="fa fa-spinner fa-pulse fa-2x"></i></span></div></div>');
  chatWindow.append(responseMessageElement);
    // 绑定发送按钮点击事件
  requestMessageElement.find('.send-button').click(function() {
  });

  // 绑定编辑按钮点击事件
  requestMessageElement.find('.edit-button').click(function() {
    editMessage(message);
  });

  // 添加删除按钮点击事件
  requestMessageElement.find('.delete-message-btn').click(function() {
    const messageBubble = $(this).closest('.message-bubble');
    messageBubble.prev('.message-bubble').remove(); // 删除请求消息 bubble
    messageBubble.remove(); // 删除响应消息 bubble

    if (localStorage.getItem('archiveSession') === 'true') {
        messages = []; // 清空 messages 数组
        localStorage.removeItem("session"); // 移除 session

        // 重新遍历 chatWindow 中的消息 bubble，重建 messages 数组
        $('#chatWindow .message-bubble').each(function() {
            const role = $(this).find('.chat-icon').hasClass('request-icon') ? 'user' : 'assistant';
            const content = $(this).find('.message-text p').text() || $(this).find('.message-text pre').text() || $(this).find('.message-text audio').length > 0 ? '//audio base64...' : ''; // 获取消息内容，音频消息内容简化为占位符
            if (role && content) { // 确保 role 和 content 都存在
                 if (role === 'user') {
                    messages.push({ "role": "user", "content": $(this).find('.message-text p').text() || $(this).find('.message-text pre').text()});
                } else if (role === 'assistant') {
                    let messageContent = "";
                    if ($(this).find('.message-text p').length > 0) {
                        messageContent = $(this).find('.message-text p').text();
                    } else if ($(this).find('.message-text pre').length > 0) {
                        messageContent = $(this).find('.message-text pre').text();
                    } else if ($(this).find('.message-text audio').length > 0) {
                        messageContent = "//audio base64..."; // 音频消息内容简化为占位符
                    } else if ($(this).find('.message-text img').length > 0) {
                        messageContent = "//image url..."; // 图片消息内容简化为占位符
                    } else {
                        messageContent = $(this).find('.message-text').text(); // 兜底方案
                    }
                    messages.push({ "role": "assistant", "content": messageContent });
                }
            }
        });
         if (messages.length > 0) { // 只有当 messages 不为空时才保存
            localStorage.setItem("session", JSON.stringify(messages)); // 重新保存 session
        }
    }
});
}

// 编辑消息
function editMessage(message) {
  // 清除该条请求消息和回复消息
  $('.message-bubble').last().prev().remove();
  $('.message-bubble').last().remove();

  // 将请求消息粘贴到用户输入框
  chatInput.val(message);
}

// 添加响应消息到窗口，流式响应此方法会执行多次
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
            if (part.text) {
                // Process text part as before
                let textPart = part.text;
                let codeMarkCount = 0;
                let index = textPart.indexOf('```');

                while (index !== -1) {
                    codeMarkCount++;
                    index = textPart.indexOf('```', index + 3);
                }

                if (codeMarkCount % 2 == 1) {  // 有未闭合的 code
                    escapedMessage = marked.parse(textPart + '\n\n```');
                } else if (codeMarkCount % 2 == 0 && codeMarkCount != 0) {
                    escapedMessage = marked.parse(textPart);  // 响应消息markdown实时转换为html
                } else if (codeMarkCount == 0) {  // 输出的代码没有markdown代码块
                    if (textPart.includes('`')) {
                        escapedMessage = marked.parse(textPart);  // 没有markdown代码块，但有代码段，依旧是 markdown格式
                    } else {
                        escapedMessage = marked.parse(escapeHtml(textPart)); // 有可能不是markdown格式，都用escapeHtml处理后再转换，防止非markdown格式html紊乱页面
                    }
                }
                messageContentHTML += '<div class="message-text">' + escapedMessage + '</div><button class="copy-button"><i class="far fa-copy"></i></button>'; // 添加复制按钮到文字部分

            } else if (part.inlineData) {
                // Handle image part
                const mimeType = part.inlineData.mimeType;
                const base64Data = part.inlineData.data;
                const imageUrl = `data:${mimeType};base64,${base64Data}`;
                messageContentHTML += `<div class="message-text"><img src="${imageUrl}" style="max-width: 30%; max-height: 30%;" alt="Generated Image"></div>`;
            }
        });
        lastResponseElement.append(messageContentHTML + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');

    } else { // Handle regular text message
        if (typeof message !== 'string') {
            return; // Exit if message is not a string
        }
        let codeMarkCount = 0;
        let index = message.indexOf('```'); // Line 809 - Error was happening here

        while (index !== -1) {
            codeMarkCount++;
            index = message.indexOf('```', index + 3);
        }

        if (codeMarkCount % 2 == 1) {  // 有未闭合的 code
            escapedMessage = marked.parse(message + '\n\n```');
        } else if (codeMarkCount % 2 == 0 && codeMarkCount != 0) {
            escapedMessage = marked.parse(message);  // 响应消息markdown实时转换为html
        } else if (codeMarkCount == 0) {  // 输出的代码没有markdown代码块
            if (message.includes('`')) {
                escapedMessage = marked.parse(message);  // 没有markdown代码块，但有代码段，依旧是 markdown格式
            } else {
                escapedMessage = marked.parse(escapeHtml(message)); // 有可能不是markdown格式，都用escapeHtml处理后再转换，防止非markdown格式html紊乱页面
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
            // 处理包含base64编码的音频
            const base64Data = message.replace(/"/g, '');
            lastResponseElement.append('<div class="message-text">' + '<audio controls=""><source src="data:audio/mpeg;base64,' + base64Data + '" type="audio/mpeg"></audio> ' + '</div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
        } else if (message.startsWith('//')) {
            // 处理包含base64编码的音频
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
scrollDownBtn.show();

    // 绑定按钮事件 (for both text and image messages)
    lastResponseElement.find('.view-button').on('click', function() {
        const urlToOpen = $(this).data('url');
        window.open(urlToOpen, '_blank');
    });
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim());
    });
    lastResponseElement.find('.delete-message-btn').click(function() {
    const messageBubble = $(this).closest('.message-bubble');
    messageBubble.prev('.message-bubble').remove(); // 删除请求消息 bubble
    messageBubble.remove(); // 删除响应消息 bubble

    if (localStorage.getItem('archiveSession') === 'true') {
        messages = []; // 清空 messages 数组
        localStorage.removeItem("session"); // 移除 session

        // 重新遍历 chatWindow 中的消息 bubble，重建 messages 数组
        $('#chatWindow .message-bubble').each(function() {
            const role = $(this).find('.chat-icon').hasClass('request-icon') ? 'user' : 'assistant';
            const content = $(this).find('.message-text p').text() || $(this).find('.message-text pre').text() || $(this).find('.message-text audio').length > 0 ? '//audio base64...' : ''; // 获取消息内容，音频消息内容简化为占位符
            if (role && content) { // 确保 role 和 content 都存在
                 if (role === 'user') {
                    messages.push({ "role": "user", "content": $(this).find('.message-text p').text() || $(this).find('.message-text pre').text()});
                } else if (role === 'assistant') {
                    let messageContent = "";
                    if ($(this).find('.message-text p').length > 0) {
                        messageContent = $(this).find('.message-text p').text();
                    } else if ($(this).find('.message-text pre').length > 0) {
                        messageContent = $(this).find('.message-text pre').text();
                    } else if ($(this).find('.message-text audio').length > 0) {
                        messageContent = "//audio base64..."; // 音频消息内容简化为占位符
                    } else if ($(this).find('.message-text img').length > 0) {
                        messageContent = "//image url..."; // 图片消息内容简化为占位符
                    } else {
                        messageContent = $(this).find('.message-text').text(); // 兜底方案
                    }
                    messages.push({ "role": "assistant", "content": messageContent, "isImage": $(this).find('.message-text img').length > 0 }); // Add "isImage" flag
                }
            }
        });
         if (messages.length > 0) { // 只有当 messages 不为空时才保存
            localStorage.setItem("session", JSON.stringify(messages)); // 重新保存 session
        }
    }
});
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove();
    });
}

// 复制按钮点击事件
$(document).on('click', '.copy-button', function() {
  let messageText = $(this).prev().text().trim(); // 去除末尾的换行符
  // 创建一个临时文本框用于复制内容
  let tempTextarea = $('<textarea>');
  tempTextarea.val(messageText).css({position: 'absolute', left: '-9999px'}).appendTo('body').select();
  document.execCommand('copy');
  tempTextarea.remove();

  // 将复制按钮显示为√
  let checkMark = $('<i class="far fa-check-circle"></i>'); // 创建√图标元素
  $(this).html(checkMark); // 替换按钮内容为√图标

  // 延时一段时间后恢复原始复制按钮
  let originalButton = $(this);
  setTimeout(function() {
    originalButton.html('<i class="far fa-copy"></i>'); // 恢复原始复制按钮内容
  }, 2000); // 设置延时时间为2秒
});

  // 添加失败信息到窗口
  function addFailMessage(message) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    lastResponseElement.append('<p class="error">' + message + '</p>');
    messages.pop() // 失败就让用户输入信息从数组删除
  }

let datas;

// 解码 Base64 编码的 API 密钥
function decodeApiKey(encodedApiKey) {
  return atob(encodedApiKey);
}

// 获取配置信息
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
    // 处理错误情况
  }
}

// 获取随机的 API 密钥
function getRandomApiKey() {
  const apiKeyInput = $(".settings-common .api-key").val().trim();
  if (apiKeyInput) {
    const apiKeys = apiKeyInput.split(',').map(key => key.trim());
    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
  }
  return null;
}

// 获取 API 密钥
async function getApiKey() {
  try {
    let apiKey = getRandomApiKey();

    if (!apiKey) {
      const password = $(".settings-common .password").val();

      if (!password) {
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
        return null;
      }

      const data = await response.json();

      if (data.apiKey) {
        // 解码 API 密钥
        apiKey = decodeApiKey(data.apiKey);
        return apiKey;
      } else {
        addFailMessage("请在设置填写好环境变量");
        return null;
      }
    } else {
      return apiKey;
    }
  } catch (error) {
    addFailMessage("出错了，请稍后再试！");
    return null;
  }
}

// 发送请求获得响应
async function sendRequest(data) {
  await getConfig();
  const apiKey = await getApiKey();

  if (!datas || !datas.api_url || !apiKey) {
    addFailMessage("请输入正确的访问密码或者输入自己的 API Key 和 API URL 使用！");
    return;
  }

// 检查api_url是否存在非空值
if ($(".settings-common .api_url").val().trim()) {
    // 存储api_url值
    datas.api_url =cleanApiUrl($(".settings-common .api_url").val());
    // 检查api_url是否是正确的网址格式
    var apiUrlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!apiUrlRegex.test(datas.api_url)) {
        // 如果不是正确的网址格式，则返回错误消息
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
    "stream": getCookie('streamOutput') !== 'false' // 从 Cookie 获取流式输出设置
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
} else if ((selectedApiPath === '/v1/audio/speech' || apiPathSelect.val() === null ) && model.includes("tts")) {
    apiUrl = datas.api_url + "/v1/audio/speech";
    requestBody = {
        "input": data.prompts[0].content, // TTS uses the last message as input
        "model": data.model,
        "voice": "alloy",
    };
}else if (model.includes("gemini-2.0-flash-exp-image-generation") && (selectedApiPath === '/v1beta/models/model:generateContent?key=apikey' || apiPathSelect.val() === null)) { // Gemini models handling
    apiUrl = `https://gemini.baipiao.io/v1beta/models/${data.model}:generateContent?key=${apiKey}`;
    requestBody = {
        "contents": [{
            "parts": [{"text": data.prompts[0].content}]}],
            "generationConfig":{"responseModalities":["Text","Image"]}
    };
}else if (selectedApiPath === '/v1beta/models/model:generateContent?key=apikey' || apiPathSelect.val() === null) { // Gemini models handling
    apiUrl = `https://gemini.baipiao.io/v1beta/models/${data.model}:generateContent?key=${apiKey}`;
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
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
    };
}
    if (data.model.includes("o3") && !data.model.includes("all")) {
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
    };
}
        if (data.model.includes("o4") && !data.model.includes("all")) {
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
    };
}
        if (data.model.includes("grok-2-image")) {
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "n": 1,
    };
}
if (data.model.includes("deepseek-r") ) {
     requestBody = {
     "messages": data.prompts,
     "model": data.model,
     "max_tokens": data.max_tokens,
     "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
     };
 }
     if (data.model.includes("claude-3-7-sonnet-20250219-thinking") ) {
     requestBody = {
     "messages": data.prompts,
     "model": data.model,
     "max_tokens": data.max_tokens,
     "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
     };
 }
     if (data.model.includes("claude-3-7-sonnet-thinking") ) {
     requestBody = {
     "messages": data.prompts,
     "model": data.model,
     "max_tokens": data.max_tokens,
     "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
     };
 }
 if (data.model.includes("claude-3-7-sonnet-thinking-20250219") ) {
     requestBody = {
     "messages": data.prompts,
     "model": data.model,
     "max_tokens": data.max_tokens,
     "n": 1,
    "stream": getCookie('streamOutput') !== 'false'
     };
 }
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: selectedApiPath === '/v1beta/models/model:generateContent?key=apikey'? { // Conditional headers
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

if (model.includes("dall-e-2") || model.includes("dall-e-3") || model.includes("cogview-3") || model.includes("grok-2-image")) {
    const responseData = await response.json();
    if (responseData.data && responseData.data.length > 0 && responseData.data[0].url) {
        const imageUrl = responseData.data[0].url;
        addImageMessage(imageUrl);
        messages.push({"role": "assistant", "content": imageUrl, "isImage": true}); // Store image URL in messages
        localStorage.setItem("session",JSON.stringify(messages)); // Save session immediately after image generation
        resFlag = true;
    } else if (responseData.data && responseData.data.length > 0 && responseData.data[0].revised_prompt) {
        addResponseMessage(responseData.data[0].revised_prompt);
        resFlag = true;
    }else if (responseData.error) {
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
} else if (model.includes("tts")) {
    const audioBlob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        addTTSMessage(base64Audio);
    };
    reader.readAsDataURL(audioBlob);
    resFlag = true;
    return; // For TTS, handle response and return
} else if (model.includes("gemini-2.0-flash-exp-image-generation") && selectedApiPath === '/v1beta/models/model:generateContent?key=apikey') {
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


if (getCookie('streamOutput') !== 'false') { // 从 Cookie 获取流式输出设置, 默认流式
    const reader = response.body.getReader();
    let res = '';
    let str;
    // **新增代码 - 在请求前记录是否滚动到底部**
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

    return str;
}else { // 非流式输出处理
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

}


  }


  // 处理用户输入
  chatBtn.click(function() {
    // 解绑键盘事件
    chatInput.off("keydown",handleEnter);
let data = {};
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
      // 重新绑定键盘事件
      chatInput.on("keydown",handleEnter);
      chatBtn.attr('disabled',false) // 让按钮可点击
      return ;
    }

 // 获取所选的模型
  data.model = $(".settings-common .model").val();
  data.temperature = parseFloat($(".settings-common .temperature").val());
  data.max_tokens = parseInt($(".settings-common .max-tokens").val());

    const selectedModel = data.model.toLowerCase();
    if (selectedModel.includes("dall-e-2") || selectedModel.includes("dall-e-3") || selectedModel.includes("cogview-3") || selectedModel.includes("moderation") || selectedModel.includes("embedding") || selectedModel.includes("tts-1") || selectedModel.includes("grok-2-image")) {
        data.prompts = [{"role": "user", "content": message}]; // For image/moderation/embedding/tts, only send the last message
    } else {
        // 判读是否已开启连续对话
        if(localStorage.getItem('continuousDialogue') == 'true'){
            // 控制上下文，对话长度超过100轮，取最新的99轮,即数组最后199条数据
          data.prompts = messages.slice();  // 拷贝一份全局messages赋值给data.prompts,然后对data.prompts处理
          if (data.prompts.length > 200) {
            data.prompts.splice(0, data.prompts.length - 199);
          }
        }else{
          data.prompts = messages.slice();
          data.prompts.splice(0, data.prompts.length - 1); // 未开启连续对话，取最后一条
        }
    }


    sendRequest(data).then((res) => {
      chatInput.val('');
      // 收到回复，让按钮可点击
      chatBtn.attr('disabled',false)
      // 重新绑定键盘事件
      chatInput.on("keydown",handleEnter);
      // 判断是否是回复正确信息
      if(resFlag && !(selectedModel.includes("dall-e-2") || selectedModel.includes("dall-e-3") || selectedModel.includes("cogview-3") || selectedModel.includes("moderation") || selectedModel.includes("embedding") || selectedModel.includes("tts") || selectedModel.includes("grok-2-image")) ){ // Image/moderation/embedding/tts models don't add to messages array for continuous conversation
        messages.push({"role": "assistant", "content": res});
        // 判断是否本地存储历史会话
        if(localStorage.getItem('archiveSession')=="true"){
          localStorage.setItem("session",JSON.stringify(messages));
        }
      }
      // 添加复制
      copy();
    });
  });
// 停止并隐藏
$('.stop a').click(function() {
  if (ajaxRequest) {
    ajaxRequest.abort();
  }
  // 隐藏具有类名为 "stop" 的父元素（假设你想隐藏整个父元素）
  $(this).closest('.stop').hide();
});
// Enter键盘事件
function handleEnter(e) {
  // 如果是电脑端，判断同时按下Ctrl键和Enter键
  if (!isMobile() && e.ctrlKey && e.keyCode == 13) {
    chatBtn.click();
    e.preventDefault();  //避免回车换行
  }
}

// 绑定键盘事件
chatInput.on("keydown", handleEnter);


  // 设置栏宽度自适应
  let width = $('.function .others').width();
  $('.function .settings .dropdown-menu').css('width', width);

  $(window).resize(function() {
    width = $('.function .others').width();
    $('.function .settings .dropdown-menu').css('width', width);
  });


  // 主题
  function setBgColor(theme){
    $(':root').attr('bg-theme', theme);
    $('.settings-common .theme').val(theme);
    // 定位在文档外的元素也同步主题色
    $('.settings-common').css('background-color', 'var(--bg-color)');
  }

  let theme = localStorage.getItem('theme');
  // 如果之前选择了主题，则将其应用到网站中
  if (theme) {
    setBgColor(theme);
  }else{
    localStorage.setItem('theme', "light"); //默认的主题
    theme = localStorage.getItem('theme');
    setBgColor(theme);
  }

  // 监听主题选择的变化
  $('.settings-common .theme').change(function() {
    const selectedTheme = $(this).val();
    localStorage.setItem('theme', selectedTheme);
    $(':root').attr('bg-theme', selectedTheme);
    // 定位在文档外的元素也同步主题色
    $('.settings-common').css('background-color', 'var(--bg-color)');
  });

  // password
  const password = localStorage.getItem('password');
  if (password) {
    $(".settings-common .password").val(password);
  }

  // password输入框事件
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

  // apiKey输入框事件
  $(".settings-common .api-key").blur(function() {
    const apiKey = $(this).val();
    if(apiKey.length!=0){
      localStorage.setItem('apiKey', apiKey);
    }else{
      localStorage.removeItem('apiKey');
    }
  })

 // 读取apiUrl
  const api_url = localStorage.getItem('api_url');
  if (api_url) {
    $(".settings-common .api_url").val(api_url);
  }

  // apiUrl输入框事件
  $(".settings-common .api_url").blur(function() {
    const api_url = $(this).val();
    if(api_url.length!=0){
      localStorage.setItem('api_url', api_url);
    }else{
      localStorage.removeItem('api_url');
    }
  })

  // 是否保存历史对话
  var archiveSession = localStorage.getItem('archiveSession');

  // 初始化archiveSession
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
      // 开启状态的操作
      localStorage.setItem('archiveSession', true);
      if(messages.length != 0){
        localStorage.setItem("session",JSON.stringify(messages));
      }
    } else {
      // 关闭状态的操作
      localStorage.setItem('archiveSession', false);
      localStorage.removeItem("session");
    }
  });

  // 加载历史保存会话
  if(archiveSession == "true"){
    const messagesList = JSON.parse(localStorage.getItem("session"));
    if(messagesList){
      messages = messagesList;
      $.each(messages, function(index, item) {
        if (item.role === 'user') {
          addRequestMessage(item.content)
        } else if (item.role === 'assistant') {
          if (item.isImage) { // Check if it's an image message
              addImageMessage(item.content); // Use addImageMessage for images
          } else {
              addResponseMessage(item.content); // Use addResponseMessage for text
          }
        }
      });
      // 添加复制
      copy();
    }
  }

  // 是否连续对话
  var continuousDialogue = localStorage.getItem('continuousDialogue');

  // 初始化continuousDialogue
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
// 删除输入框中的消息
function deleteInputMessage() {
  chatInput.val('');
}
  });
// 读取model配置
const selectedModel = localStorage.getItem('selectedModel');

// 检测模型并更新设置
function updateModelSettings(modelName) {

    const isHideStreamSettingModel = modelName.toLowerCase().includes("dall-e") ||
                                      modelName.toLowerCase().includes("cogview") ||
                                      modelName.toLowerCase().includes("moderation") ||
                                      modelName.toLowerCase().includes("embedding") ||
                                      modelName.toLowerCase().includes("grok-2-image") ||
                                      modelName.toLowerCase().includes("tts");

    var streamOutputCheckbox = document.getElementById('streamOutput');

    if (isHideStreamSettingModel) {
        streamOutputSetting.hide(); // 隐藏设置行
    } else {
        streamOutputSetting.show(); // 确保设置行显示
        // 如果之前是非流式，切换到流式
        if (getCookie('streamOutput') === 'false') {
            streamOutputCheckbox.checked = true;
            setCookie('streamOutput', 'true', 30);
        }
    }

    // 检测是否含有"tts"或"dall"并设置连续对话状态 - 保持原有的连续对话逻辑
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

    // 设置连续对话状态
    $("#chck-2").prop("checked", isContinuousDialogueEnabled);
    localStorage.setItem('continuousDialogue', isContinuousDialogueEnabled);

    // 设置是否禁用checkbox
    $("#chck-2").prop("disabled", hasTTS || hasDALL  || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl);

    // 获取上一个模型名称
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


    // 如果从包含tts或dall的模型切换到不包含这些的模型，清除对话
    if ((hadTTS || hadDALL || hadCog || hadCompletion1 || hadCompletion2 || hadCompletion3 || hadTextem || hadTextmo || hadVs || hadVi || hadMj || hadSD || hadFlux || hadVd || hadSora || hadSuno || hadKo || hadKl) && !(hasTTS || hasDALL || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl)) {
        clearConversation();
    }

    // 更新上一个模型名称为当前模型
    localStorage.setItem('previousModel', modelName);

        // --- Start of Path Auto-Switching Logic ---
        let selectedApiPath = null; // Use null to represent the default/empty option if needed
        const lowerModelName = modelName.toLowerCase();

        if (lowerModelName.includes("gpt-3.5-turbo-instruct") || lowerModelName.includes("babbage-002") || lowerModelName.includes("davinci-002")) {
            selectedApiPath = '/v1/completions';
        } else if (lowerModelName.includes("dall-e-2") || lowerModelName.includes("dall-e-3") || lowerModelName.includes("cogview-3")) { // Added grok image
            selectedApiPath = '/v1/images/generations';
        } else if (lowerModelName.includes("moderation")) {
            selectedApiPath = '/v1/moderations';
        } else if (lowerModelName.includes("embedding")) {
            selectedApiPath = '/v1/embeddings';
        } else if (lowerModelName.includes("tts")) {
            selectedApiPath = '/v1/audio/speech';
        } else {
             // Default for most chat models if none of the above conditions match
             selectedApiPath = '/v1/chat/completions';
        }

        // ***** FIX: Update the dropdown selection *****
        apiPathSelect.val(selectedApiPath); // Use the variable holding the selector

        // Optional: Save the auto-selected path to localStorage immediately
        // This makes the auto-selection sticky until the user manually changes it
        if (selectedApiPath) { // Only save if a specific path was determined
             localStorage.setItem('apiPath', selectedApiPath);
        } else {
            // If selectedApiPath is null (or empty string depending on dropdown setup),
            // you might want to remove the item or save an empty string
             localStorage.removeItem('apiPath'); // Or localStorage.setItem('apiPath', '');
        }
        // ***** END FIX *****

    }


        // 初始加载时检测selectedModel
        if (selectedModel) {
            $(".settings-common .model").val(selectedModel);
            updateModelSettings(selectedModel);
            // Update the title to use the selected option's data-description
            $(".title h2").text($(".settings-common .model option:selected").data('description'));
        }

        // 监听model选择的变化
        $('.settings-common .model').change(function() {
            const selectedModel = $(this).val();
            localStorage.setItem('selectedModel', selectedModel);
            updateModelSettings(selectedModel);
            // Update the title to use the selected option's data-description
            $(".title h2").text($(this).find("option:selected").data('description'));
        });

// 删除对话
function clearConversation() {
    chatWindow.empty();
    deleteInputMessage();
    $(".answer .tips").css({"display":"flex"});
    messages = [];
    localStorage.removeItem("session");
    scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down'); // Reset to scroll down icon
    scrollDownBtn.data('scroll-state', 'down'); // Reset scroll state
}

// 删除功能
$(".delete a").click(function(){
    clearConversation();
});

// 添加滚动监听器
chatWindow.on('scroll', function() {
    const isScrolledToBottom = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() < 1;
    const isScrolledToTop = chatWindow.scrollTop() === 0;

    if (isScrolling) return; // Prevent state change during scrolling

    if (isScrolledToBottom) {
        scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        scrollDownBtn.data('scroll-state', 'up');
    } else if (isScrolledToTop) {
        scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        scrollDownBtn.data('scroll-state', 'down');
    } else {
        scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down'); // Keep down arrow when in middle
        scrollDownBtn.data('scroll-state', 'down'); // Keep state as down when in middle, for default down scroll
    }
});

// scroll-down 按钮点击事件
scrollDownBtn.click(function(e) {
    e.preventDefault(); // Prevent default anchor behavior
    if (isScrolling) return; // Prevent multiple clicks during scrolling

    isScrolling = true;
    let scrollState = scrollDownBtn.data('scroll-state') || 'down';
    let targetScrollTop = scrollState === 'down' ? chatWindow[0].scrollHeight : 0; // Scroll to bottom if 'down', top if 'up'

    chatWindow.animate({
        scrollTop: targetScrollTop
    }, scrollDuration, 'linear', function() { // 'linear' for constant speed
        isScrolling = false;
        if (scrollState === 'down') {
            scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
            scrollDownBtn.data('scroll-state', 'up');
        } else {
            scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            scrollDownBtn.data('scroll-state', 'down');
        }
    });
});

// 监听文档点击事件，用于停止滚动
$(document).on('click', function(event) {
    if (isScrolling && !$(event.target).closest('.scroll-down').length) { // Clicked outside scroll button
        chatWindow.stop(true, false); // Stop the animation immediately
        isScrolling = false; // Reset scrolling flag
    }
});


  // 读取temperature
  const temperature = localStorage.getItem('temperature');
  if (temperature) {
    $(".settings-common .temperature-input").val(temperature);
    $(".settings-common .temperature").val(temperature);
  }

  // temperature输入框事件
  $(".settings-common .temperature-input").change(function() {
    const temperature = $(this).val();
    localStorage.setItem('temperature', temperature);
  })

  // temperature滑条事件
  $(".settings-common .temperature").change(function() {
    const temperature = $(this).val();
    localStorage.setItem('temperature', temperature);
     })

// 读取max_tokens
  const max_tokens  = localStorage.getItem('max_tokens ');
  if (max_tokens) {
    $(".settings-common .max-tokens-input").val(max_tokens );
    $(".settings-common .max-tokens ").val(max_tokens );
  }

  // max_tokens 输入框事件
  $(".settings-common .max-tokens-input").change(function() {
    const max_tokens  = $(this).val();
    localStorage.setItem('max_tokens ', max_tokens );
      })

  // max_tokens 滑条事件
  $(".settings-common .max-tokens").change(function() {
    const max_tokens  = $(this).val();
    localStorage.setItem('max_tokens ', max_tokens );
      })

// 删除输入框中的消息
function deleteInputMessage() {
  chatInput.val('');
}

// 删除功能
$(".delete a").click(function(){
  chatWindow.empty();
  deleteInputMessage();
  $(".answer .tips").css({"display":"flex"});
  messages = [];
  localStorage.removeItem("session");
});

// 删除功能
$(".delete a").click(function(){
    clearConversation();
});
  // 截图功能
  $(".screenshot a").click(function() {
    // 创建副本元素
    const clonedChatWindow = chatWindow.clone();
    clonedChatWindow.css({
      position: "absolute",
      left: "-9999px",
      overflow: "visible",
      width: chatWindow.width(),
      height: "auto"
    });
    $("body").append(clonedChatWindow);
    // 截图
    html2canvas(clonedChatWindow[0], {
      allowTaint: false,
      useCORS: true,
      scrollY: 0,
    }).then(function(canvas) {
      // 将 canvas 转换成图片
      const imgData = canvas.toDataURL('image/png');
      // 创建下载链接
      const link = document.createElement('a');
      link.download = "screenshot_" + Math.floor(Date.now() / 1000) + ".png";
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      clonedChatWindow.remove();
    });
  });

  // 复制代码功能
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
      // 创建一个临时的 textarea 元素
      let textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);

      // 选择 textarea 中的文本
      textArea.select();

      // 执行复制命令
      try {
        document.execCommand('copy');
        $(this).text('复制成功');
      } catch (e) {
        $(this).text('复制失败');
      }

      // 从文档中删除临时的 textarea 元素
      document.body.removeChild(textArea);

      setTimeout(() => {
        $(this).text('复制');
      }, 2000);
    });
  }

    // 读取apiPath
    const apiPath = localStorage.getItem('apiPath');
    if (apiPath) {
        $('#apiPathSelect').val(apiPath);
    }

    // apiPath select event
    $('#apiPathSelect').change(function() {
        const selectedApiPath = $(this).val();
        localStorage.setItem('apiPath', selectedApiPath);
    });
});

$(document).ready(function() {
    // 初始化时滚动到底部
    chatWindow.scrollTop(chatWindow.prop('scrollHeight'));
    scrollDownBtn.data('scroll-state', 'down'); // 初始化状态为 'down'
    scrollDownBtn.show(); // 确保按钮默认显示
});
