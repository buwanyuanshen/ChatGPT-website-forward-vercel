// 获取 select 元素
const selectElement = document.querySelector('.form-control.ipt-common.model');
const searchInput = document.querySelector('.model-search-input');

if (selectElement) {
    // 遍历 select 元素下的所有 option 元素
    Array.from(selectElement.options).forEach(option => {
        const originalText = option.textContent; // 保存原始文本
        option.setAttribute('data-description', originalText); // 设置 data-description 属性
        option.textContent = option.value; // 设置 textContent 为 value
    });
}

searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    Array.from(selectElement.options).forEach(option => {
        const description = option.getAttribute('data-description').toLowerCase();
        if (description.includes(searchTerm)) {
            option.style.display = 'block'; // 显示匹配的选项
        } else {
            option.style.display = 'none'; // 隐藏不匹配的选项
        }
    });
    localStorage.setItem('modelSearchInput', searchInput.value); // 保存搜索输入框的值到本地存储
});

function resetImageUpload() {
    imageUpload.value = '';
    base64Image = '';
    imagePreviewContainer.style.display = 'none';
    imagePreview.src = '';
    // 触发 change 事件以更新状态
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
        uploadArea.style.display = 'block'; // 显示上传区域
    } else {
        uploadArea.style.display = 'none'; // 隐藏上传区域
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
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));  // 计算过期时间
        expires = "; expires=" + date.toUTCString();  // 转换为 UTC 字符串
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";  // 设置 cookie
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();  // 清理额外的空格
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);  // 返回 cookie 值
        }
    }
    return null;  // 如果未找到 cookie，则返回 null
}

document.addEventListener('DOMContentLoaded', function() {
    // 余额显示/隐藏功能
    var toggleBalance = document.getElementById('toggleBalance');
    var balanceInfo = document.getElementById('balanceInfo');

    // 读取 Cookie 并设置初始状态
    var balanceVisibility = getCookie('balanceVisibility');
    if (balanceVisibility === 'hidden') {
        toggleBalance.checked = false;
        balanceInfo.style.display = 'none'; // 隐藏余额信息
    } else {
        toggleBalance.checked = true;
        balanceInfo.style.display = 'block'; // 显示余额信息
    }

    // 监听开关变化
    toggleBalance.addEventListener('change', function() {
        if (this.checked) {
            balanceInfo.style.display = 'block'; // 显示余额信息
            setCookie('balanceVisibility', 'visible', 30); // 保存 30 天
        } else {
            balanceInfo.style.display = 'none'; // 隐藏余额信息
            setCookie('balanceVisibility', 'hidden', 30); // 保存 30 天
        }
    });

    // 模型输出方式是否流式
    var streamOutputCheckbox = document.getElementById('streamOutput');
    var streamOutput = getCookie('streamOutput');
    if (streamOutput === 'false') {
        streamOutputCheckbox.checked = false; // 设置为非流式
    } else {
        streamOutputCheckbox.checked = true; // 默认流式或 cookie 未设置
    }

    streamOutputCheckbox.addEventListener('change', function() {
        setCookie('streamOutput', this.checked ? 'true' : 'false', 30); // 保存流式输出设置
    });

    // 连续对话消息上限
    var maxDialogueMessagesInput = document.getElementById('maxDialogueMessages');
    var maxDialogueMessages = getCookie('maxDialogueMessages');
    if (maxDialogueMessages) {
        maxDialogueMessagesInput.value = maxDialogueMessages; // 设置为 cookie 中保存的值
    } else {
        maxDialogueMessagesInput.value = 150; // 默认值，如果 cookie 未设置
    }

    maxDialogueMessagesInput.addEventListener('change', function() {
        setCookie('maxDialogueMessages', this.value, 30); // 保存连续对话消息上限
    });
});


    // Helper function to clean up API URL
    function cleanApiUrl(apiUrl) {
        if (!apiUrl) {
            return apiUrl;
        }
        let cleanedUrl = apiUrl.trim(); // 移除首尾空格
        cleanedUrl = cleanedUrl.replace(/\s/g, ''); // 移除所有空格
        cleanedUrl = cleanedUrl.replace(/\/+$/, ''); // 移除尾部多余的斜杠
        cleanedUrl = cleanedUrl.replace(/\/v1(\/chat\/completions)?$/i, ''); // 移除末尾的 /v1 或 /v1/chat/completions
        return cleanedUrl;
    }


    async function fetchBalance(apiUrl, apiKey) {
        const headers = new Headers({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        });

        try {
            // 清理 API URL
            const cleanedApiUrl = cleanApiUrl(apiUrl);

            // 获取总余额 (quota)
            let subscriptionResponse = await fetch(`${cleanedApiUrl}/v1/dashboard/billing/subscription`, { headers });
            if (!subscriptionResponse.ok) {
                throw new Error('Failed to fetch subscription data'); // 抛出错误如果请求失败
            }
            let subscriptionData = await subscriptionResponse.json();
            let total = subscriptionData.hard_limit_usd; // 总额度

            // 获取使用信息
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 99); // 开始日期为 99 天前
            let endDate = new Date(); // 结束日期为今天
            const usageUrl = `${cleanedApiUrl}/v1/dashboard/billing/usage?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`;

            let usageResponse = await fetch(usageUrl, { headers });
            if (!usageResponse.ok) {
                throw new Error('Failed to fetch usage data'); // 抛出错误如果请求失败
            }
            let usageData = await usageResponse.json();
            let totalUsage = usageData.total_usage / 100; // 总使用量，单位为美元

            let remaining = total - totalUsage; // 剩余额度

            // 更新余额显示
            document.getElementById('totalBalance').innerText = `总额: ${total.toFixed(4)} $`;
            document.getElementById('usedBalance').innerText = `已用: ${totalUsage.toFixed(4)} $`;
            document.getElementById('remainingBalance').innerText = `剩余: ${remaining.toFixed(4)} $`;

        } catch (error) {
            document.getElementById('totalBalance').innerText = '总额: 加载失败';
            document.getElementById('usedBalance').innerText = '已用: 加载失败';
            document.getElementById('remainingBalance').innerText = '剩余: 加载失败';
        }
    }

    // 从后端获取默认余额信息
    let defaultApiUrl = ''; // 存储后端返回的默认 API URL
    async function fetchDefaultBalance() {
        try {
            let response = await fetch('/default_balance');
            if (!response.ok) {
                throw new Error('Failed to fetch default balance data'); // 抛出错误如果请求失败
            }
            let data = await response.json();
            if (data.error) {
                throw new Error(data.error.message); // 抛出错误如果后端返回错误信息
            }

            // 存储默认 API URL
            defaultApiUrl = data.url; // 假设后端在 data 中返回 url

            // 使用默认余额更新显示
            document.getElementById('totalBalance').innerText = `总额: ${data.total_balance.toFixed(4)} $`;
            document.getElementById('usedBalance').innerText = `已用: ${data.used_balance.toFixed(4)} $`;
            document.getElementById('remainingBalance').innerText = `剩余: ${data.remaining_balance.toFixed(4)} $`;

        } catch (error) {
            document.getElementById('totalBalance').innerText = '总额: 加载失败';
            document.getElementById('usedBalance').innerText = '已用: 加载失败';
            document.getElementById('remainingBalance').innerText = '剩余: 加载失败';
        }
    }

    // 初始化监听器
    function initListeners() {
        const apiKeyField = document.querySelector('.api-key');
        const apiUrlField = document.querySelector('.api_url');

        // 初始检查
        if (apiKeyField.value.trim()) {
            let apiUrl = apiUrlField.value.trim();
            if (!apiUrl) {
                apiUrl = defaultApiUrl; // 如果输入为空，则使用默认 API URL
            }
            fetchBalance(apiUrl, apiKeyField.value.trim()); // 获取余额信息
        } else {
            fetchDefaultBalance(); // 获取默认余额信息
        }

        // API Key 输入框事件监听器
        apiKeyField.addEventListener('input', function () {
            const apiKey = apiKeyField.value.trim();
            if (apiKey) {
                let apiUrl = apiUrlField.value.trim();
                if (!apiUrl) {
                    apiUrl = defaultApiUrl; // 如果输入为空，则使用默认 API URL
                }
                fetchBalance(apiUrl, apiKey); // 获取余额信息
            } else {
                fetchDefaultBalance(); // 获取默认余额信息
            }
        });

        // API URL 输入框事件监听器
        apiUrlField.addEventListener('input', function () {
            const apiKey = apiKeyField.value.trim();
            if (apiKey) {
                let apiUrl = apiUrlField.value.trim();
                if (!apiUrl) {
                    apiUrl = defaultApiUrl; // 如果输入为空，则使用默认 API URL
                    apiUrl = apiUrlField.value.trim(); // 否则使用当前输入框中的值
                } else {
                    apiUrl = apiUrlField.value.trim(); // 使用当前输入框中的值
                }
                fetchBalance(apiUrl, apiKey); // 获取余额信息
            } else {
                fetchDefaultBalance(); // 获取默认余额信息
            }
        });
    }

    // 确保 DOM 加载完成后添加事件监听器
    document.addEventListener('DOMContentLoaded', function () {
        initListeners();
    });


$(document).ready(function () {
        // 检测输入是否包含链接的函数
    function containsLink(input) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return urlRegex.test(input);
    }

    // 输入框输入事件监听器，用于动态调整输入框大小
    chatInput.addEventListener('input', function () {
        // 保存当前滚动高度
        var currentScrollHeight = chatInput.scrollHeight;

        // 自动调整输入框高度
        chatInput.style.height = 'auto';
        chatInput.style.height = (Math.min(maxHeight, chatInput.scrollHeight)) + 'px';

        // 设置外部容器高度
        iptContainer.style.height = (Math.min(maxHeight, chatInput.scrollHeight) + 20) + 'px';

        // 恢复滚动高度，防止闪烁
        chatInput.scrollTop = currentScrollHeight;

        // 检查输入是否包含链接
        if (containsLink(chatInput.value)) {
            // 如果包含链接，则禁用连续对话
            $("#chck-2").prop("checked", false);
            localStorage.setItem('continuousDialogue', false);
        }
    });

// 从本地存储读取模型列表，并初始化模型选择下拉框
    var savedModels = localStorage.getItem('customModels');
    if (savedModels) {
        $(".model").html(savedModels); // 设置模型下拉框的 HTML 内容
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
                    text: customModelName, // 设置显示文本为模型名称
                    'data-description': customModelName // 设置 data-description 属性为模型名称
                });
                // 添加自定义模型到模型选择下拉框
                $(".model").prepend(newOption); // 添加到下拉框的开头

                // 设置新添加的模型为选中项
                $(".model").val(customModelName);

                // 保存模型列表到本地存储
                saveModelsToLocalStorage();

                // 清空输入框
                $(".custom-model").val("");

                // 添加后立即更新标题
                updateTitle(); // 调用 updateTitle 函数更新标题

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

    // 将模型列表保存到本地存储的函数
    function saveModelsToLocalStorage() {
        var modelsHtml = $(".model").html();
        localStorage.setItem('customModels', modelsHtml);
    }

    // 初始化 data-description 属性的函数
    function initializeDataDescription() {
        $(".model option").each(function() {
            if (!$(this).attr('data-description')) { // 仅在 data-description 不存在时初始化
                const originalText = $(this).text();
                $(this).attr('data-description', originalText); // 设置 data-description 属性
                $(this).text($(this).val()); // 设置显示文本为模型 value
            }

        });
    }

    // 更新标题的函数
    function updateTitle() {
        $(".title h2").text($(".settings-common .model option:selected").data('description'));
    }
    initializeDataDescription(); // 初始化 data-description 属性
    updateTitle(); // 初始化标题

    // 从本地存储加载模型搜索输入框的值
    const savedModelSearchInput = localStorage.getItem('modelSearchInput');
    if (savedModelSearchInput) {
        searchInput.value = savedModelSearchInput; // 设置搜索输入框的值
        searchInput.dispatchEvent(new Event('input')); // 触发输入事件以过滤选项
    }

    const savedApiPath = localStorage.getItem('apiPath');
    if (savedApiPath) {
        $('#apiPathSelect').val(savedApiPath); // 设置 API Path 选择器的值
    }
});


// 获取输入框元素和外部容器
var chatInput = document.getElementById('chatInput');
var iptContainer = document.querySelector('.ipt');

// 设置输入框的最大高度为 250px
var maxHeight = 250;

// 获取发送按钮元素
var chatBtn = document.getElementById('chatBtn');

// 获取删除按钮元素
var deleteBtn = document.getElementById('deleteBtn');
// 获取 scroll-down 按钮元素
var scrollDownBtn = $('.scroll-down a');
// 获取 chatWindow 元素
var chatWindow = $('#chatWindow');

// 设置滚动动画速度 (单位: 毫秒)
var scrollSpeed = 100;
// 标志是否正在滚动
var isScrolling = false;

// 判断是否是移动端
function isMobile() {
  // 使用屏幕宽度判断是否为移动端
  return window.innerWidth <= 768; // 假设小于等于 768 像素宽度为移动端
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
    iptContainer.style.height = (newHeight + 20) + 'px'; // 增加 20px 的额外空间

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
    // 判断同时按下 Ctrl 键和 Enter 键
    if (event.ctrlKey && event.keyCode === 13) {
        // 设置输入框的初始高度
        chatInput.style.height = '32px';
        iptContainer.style.height = '50px'; // 将外部容器的高度也设置为初始值
    }
    // 如果是手机端，直接按下 Enter 键发送
    else if (isMobile() && event.keyCode == 13) {
        chatBtn.click();
        event.preventDefault();  // 避免回车换行
    }
});

// 监听对话窗口点击事件，用于暂停滚动
chatWindow.on('click', function() {
    if (isScrolling) {
        chatWindow.stop(); // 停止滚动动画
        isScrolling = false; // 重置滚动状态
    }
});


// 监听 temperature 变化
$('.settings-common .temperature').on('input', function() {
    const temperatureValue = $(this).val();
    $('.settings-common .temperature-display').text(temperatureValue); // 更新显示值
    $('.settings-common .temperature-input').val(temperatureValue); // 更新输入框值
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
        $(this).val(temperatureValue); // 强制保留一位小数
    } else {
        // 处理以 0 开头后面直接跟数字的情况，如 01
        if (temperatureValue.startsWith('0') && temperatureValue.length > 1 && temperatureValue[1] !== '.') {
            temperatureValue = parseFloat(temperatureValue); // 字符串转数字
            $(this).val(temperatureValue); // 更新输入框的值
        }
        // 字符串转数字
        temperatureValue = parseFloat(temperatureValue);
        if (isNaN(temperatureValue) || temperatureValue < minTemperature) {
            temperatureValue = minTemperature;
            $(this).val(minTemperature); // 最小值限制
        } else if (temperatureValue > maxTemperature) {
            temperatureValue = maxTemperature;
            $(this).val(maxTemperature); // 最大值限制
        }
    }
    $('.settings-common .temperature-display').text(temperatureValue); // 更新显示值
    $('.settings-common .temperature').val(temperatureValue); // 更新滑条值
});


// 监听 max_tokens 变化
$('.settings-common .max-tokens').on('input', function() {
    const maxTokensValue = $(this).val();
    $('.settings-common .max-tokens-display').text(maxTokensValue); // 更新显示值
    $('.settings-common .max-tokens-input').val(maxTokensValue); // 更新输入框值
});

// 监听 max_tokens 输入框键盘按下事件
$('.settings-common .max-tokens-input').on('keypress', function(event) {
const maxTokensValue = $(this).val();
    // 获取按下的键码
    const keyCode = event.which || event.keyCode;
    // 如果按下的键是小数点，阻止默认行为
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
        $(this).val(minTokens); // 最小值限制
    } else if (maxTokensValue > maxTokens) {
        maxTokensValue = maxTokens;
        $(this).val(maxTokens); // 最大值限制
    }

    $('.settings-common .max-tokens-display').text(maxTokensValue); // 更新显示值
    $('.settings-common .max-tokens').val(maxTokensValue); // 更新滑条值
});


// 功能实现
$(document).ready(function() {
  var chatBtn = $('#chatBtn');
  var chatInput = $('#chatInput');
  var chatWindow = $('#chatWindow');
  var streamOutputSetting = $('#streamOutputSetting'); // 模型输出方式设置行
  const apiPathSelect = $('#apiPathSelect'); // API Path 选择器
    const modelSelect = $('.settings-common .model'); // 模型选择 select 元素
    const modelSearchInput = $('.model-search-input'); // 模型搜索 input 元素
    const scrollDownBtn = $('.scroll-down a'); // 下滑按钮

  // 存储对话信息，实现连续对话
  var messages = [];

  // 检查返回的信息是否是正确信息
  var resFlag = true

  // 创建自定义渲染器
  const renderer = new marked.Renderer();

  // 重写 list 方法，用于渲染列表
  renderer.list = function(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul';
    const startAttr = (ordered && start) ? ` start="${start}"` : '';
    return `<${type}${startAttr}>\n${body}</${type}>\n`;
  };

  // 设置 marked 选项
  marked.setOptions({
    renderer: renderer,
    highlight: function (code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : 'javascript';
      return hljs.highlight(code, { language: validLanguage }).value;
    }
  });


  // 转义 html 代码，防止在浏览器渲染
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
        window.open(imageUrl, '_blank'); // 新窗口打开图片
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
    // 绑定复制按钮点击事件
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim()); // 复制消息文本
    });
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove(); // 删除消息气泡
    });
}

// 添加 Embedding 结果消息到窗口
function addEmbeddingMessage(embeddingResult) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    // 以 JSON 字符串格式显示 Embedding 结果
    const embeddingString = JSON.stringify(embeddingResult, null, 2); // null, 2 用于格式化 JSON 输出
    lastResponseElement.append(`<div class="message-text"><p></p><pre style="white-space: pre-wrap;">${escapeHtml(embeddingString)}</pre></div>` + '<button class="copy-button"><i class="far fa-copy"></i></button>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');

    // 绑定复制按钮点击事件
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim()); // 复制消息文本
    });
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove(); // 删除消息气泡
    });
}


// 添加 TTS 结果消息到窗口
function addTTSMessage(audioBase64) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    lastResponseElement.append('<div class="message-text">' + '<audio controls><source src="data:audio/mpeg;base64,' + audioBase64 + '" type="audio/mpeg"></audio></div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
    // 绑定删除按钮点击事件
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove(); // 删除消息气泡
    });
}

// 添加请求消息到窗口
function addRequestMessage(message) {
  $(".answer .tips").css({"display":"none"});    // 打赏卡隐藏
  chatInput.val(''); // 清空输入框
  let escapedMessage = escapeHtml(message);  // 对请求消息进行转义
  let requestMessageElement = $('<div class="message-bubble"><span class="chat-icon request-icon"></span><div class="message-text request"><p>' + escapedMessage + '</p><button class="copy-button"><i class="far fa-copy"></i></button><button class="edit-button"><i class="fas fa-edit"></i></button><button class="delete-message-btn"><i class="far fa-trash-alt"></i></button></div></div>');

  chatWindow.append(requestMessageElement); // 添加请求消息到聊天窗口

  // 添加复制按钮点击事件
  requestMessageElement.find('.copy-button').click(function() {
    copyMessage($(this)); // 调用复制消息函数
  });

  let responseMessageElement = $('<div class="message-bubble"><span class="chat-icon response-icon"></span><div class="message-text response"><span class="loading-icon"><i class="fa fa-spinner fa-pulse fa-2x"></i></span></div></div>');
  chatWindow.append(responseMessageElement); // 添加响应消息占位符到聊天窗口
    // 绑定发送按钮点击事件 (目前请求消息中没有发送按钮，此处代码可能冗余)
  requestMessageElement.find('.send-button').click(function() {
  });

  // 绑定编辑按钮点击事件
  requestMessageElement.find('.edit-button').click(function() {
    editMessage(message); // 调用编辑消息函数
  });

  // 添加删除按钮点击事件
  requestMessageElement.find('.delete-message-btn').click(function() {
    $(this).closest('.message-bubble').remove(); // 删除该条请求消息
  });
}

// 编辑消息函数
function editMessage(message) {
  // 清除该条请求消息和回复消息
  $('.message-bubble').last().prev().remove();
  $('.message-bubble').last().remove();

  // 将请求消息粘贴到用户输入框
  chatInput.val(message); // 设置输入框内容为编辑的消息
}

// 添加响应消息到窗口，流式响应此方法会执行多次
function addResponseMessage(message) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty(); // 清空上次的响应内容

    if ($(".answer .others .center").css("display") === "none") {
        $(".answer .others .center").css("display", "flex"); // 显示其他功能按钮
    }

    let escapedMessage;
    let messageContentHTML = ''; // 累积 HTML 内容

    if (Array.isArray(message)) { // 处理结构化消息部分 (用于 Gemini 图像响应)
        message.forEach(part => {
            if (part.text) {
                // 处理文本部分
                let textPart = part.text;
                let codeMarkCount = 0;
                let index = textPart.indexOf('```');

                while (index !== -1) {
                    codeMarkCount++;
                    index = textPart.indexOf('```', index + 3);
                }

                if (codeMarkCount % 2 == 1) {  // 有未闭合的 code 代码块
                    escapedMessage = marked.parse(textPart + '\n\n```');
                } else if (codeMarkCount % 2 == 0 && codeMarkCount != 0) {
                    escapedMessage = marked.parse(textPart);  // 响应消息 markdown 实时转换为 html
                } else if (codeMarkCount == 0) {  // 输出的代码没有 markdown 代码块
                    if (textPart.includes('`')) {
                        escapedMessage = marked.parse(textPart);  // 没有 markdown 代码块，但有代码段，依旧是 markdown 格式
                    } else {
                        escapedMessage = marked.parse(escapeHtml(textPart)); // 可能不是 markdown 格式，用 escapeHtml 处理防止 HTML 紊乱
                    }
                }
                messageContentHTML += '<div class="message-text">' + escapedMessage + '</div><button class="copy-button"><i class="far fa-copy"></i></button>'; // 添加复制按钮到文字部分

            } else if (part.inlineData) {
                // 处理图像部分
                const mimeType = part.inlineData.mimeType;
                const base64Data = part.inlineData.data;
                const imageUrl = `data:${mimeType};base64,${base64Data}`;
                messageContentHTML += `<div class="message-text"><img src="${imageUrl}" style="max-width: 30%; max-height: 30%;" alt="Generated Image"></div>`;
            }
        });
        lastResponseElement.append(messageContentHTML + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>'); // 添加删除按钮

    } else { // 处理常规文本消息
        if (typeof message !== 'string') {
            return; // 如果消息不是字符串则退出
        }
        let codeMarkCount = 0;
        let index = message.indexOf('```');

        while (index !== -1) {
            codeMarkCount++;
            index = message.indexOf('```', index + 3);
        }

        if (codeMarkCount % 2 == 1) {  // 有未闭合的 code 代码块
            escapedMessage = marked.parse(message + '\n\n```');
        } else if (codeMarkCount % 2 == 0 && codeMarkCount != 0) {
            escapedMessage = marked.parse(message);  // 响应消息 markdown 实时转换为 html
        } else if (codeMarkCount == 0) {  // 输出的代码没有 markdown 代码块
            if (message.includes('`')) {
                escapedMessage = marked.parse(message);  // 没有 markdown 代码块，但有代码段，依旧是 markdown 格式
            } else {
                escapedMessage = marked.parse(escapeHtml(message)); // 可能不是 markdown 格式，用 escapeHtml 处理防止 HTML 紊乱
            }
        }

        messageContent = escapedMessage;
        let viewButtons = [];

        // 解析消息内容为 HTML 以查找 <a> 标签
        let tempElement = $('<div>').html(messageContent);
        let links = tempElement.find('a');


        if (links.length > 0) {
            links.each(function() {
                let url = $(this).attr('href');
                if (url) {
                    let viewButton = $('<button class="view-button"><i class="fas fa-search"></i></button>');
                    viewButton.data('url', url); // 存储 URL 数据
                    viewButtons.push(viewButton); // 添加查看按钮到数组
                }
            });
             messageContent = tempElement.html(); // 更新消息内容为处理后的 HTML
        }


        if (message.startsWith('"//')) {
            // 处理包含 base64 编码的音频
            const base64Data = message.replace(/"/g, '');
            lastResponseElement.append('<div class="message-text">' + '<audio controls=""><source src="data:audio/mpeg;base64,' + base64Data + '" type="audio/mpeg"></audio> ' + '</div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
        } else if (message.startsWith('//')) {
            // 处理包含 base64 编码的音频
            const base64Data = message;
            lastResponseElement.append('<div class="message-text">' + '<audio controls=""><source src="data:audio/mpeg;base64,' + base64Data + '" type="audio/mpeg"></audio> ' + '</div>' + '<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>');
        } else {
            lastResponseElement.append('<div class="message-text">' + messageContent + '</div>' + '<button class="copy-button"><i class="far fa-copy"></i></button>'); // 添加复制按钮
            viewButtons.forEach(button => {
                lastResponseElement.append(button); // 添加查看按钮
            });
            lastResponseElement.append('<button class="delete-message-btn"><i class="far fa-trash-alt"></i></button>'); // 添加删除按钮
        }
        // ... (文本消息的按钮绑定代码保持不变) ...
    }

    // **检查滚动位置**
    const wasScrolledToBottomBeforeResponse = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() <= 1;

    chatWindow.append(lastResponseElement.closest('.message-bubble')); // 添加消息气泡到聊天窗口

    // **条件性自动滚动**
    if (wasScrolledToBottomBeforeResponse) {
        scrollToBottom(); // 滚动到底部
    }

    // 绑定按钮事件 (文字和图像消息通用)
    lastResponseElement.find('.view-button').on('click', function() {
        const urlToOpen = $(this).data('url');
        window.open(urlToOpen, '_blank'); // 新窗口打开链接
    });
    lastResponseElement.find('.copy-button').click(function() {
        copyMessage($(this).prev().text().trim()); // 复制消息文本
    });
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove(); // 删除消息气泡
    });
    lastResponseElement.find('.delete-message-btn').click(function() {
        $(this).closest('.message-bubble').remove(); // 再次绑定删除按钮，确保事件绑定
    });
}

// 滚动到聊天窗口底部
function scrollToBottom() {
    isScrolling = true; // 设置为正在滚动状态
    chatWindow.animate({ scrollTop: chatWindow.prop('scrollHeight') }, scrollSpeed, 'linear', function() {
        isScrolling = false; // 滚动完成后重置状态
    });
    scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up'); // 切换为上滑图标
    scrollDownBtn.attr('title', '滑动到顶部'); // 更改提示文字
}

// 滚动到聊天窗口顶部
function scrollToTop() {
    isScrolling = true; // 设置为正在滚动状态
    chatWindow.animate({ scrollTop: 0 }, scrollSpeed, 'linear', function() {
        isScrolling = false; // 滚动完成后重置状态
    });
    scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down'); // 切换为下滑图标
    scrollDownBtn.attr('title', '滑动到底部'); // 更改提示文字
}


// 复制按钮点击事件
$(document).on('click', '.copy-button', function() {
  let messageText = $(this).prev().text().trim(); // 获取消息文本并去除首尾空格
  // 创建一个临时文本框用于复制内容
  let tempTextarea = $('<textarea>');
  tempTextarea.val(messageText).css({position: 'absolute', left: '-9999px'}).appendTo('body').select(); // 创建并选中 textarea
  document.execCommand('copy'); // 执行复制命令
  tempTextarea.remove(); // 移除临时 textarea

  // 将复制按钮显示为 √
  let checkMark = $('<i class="far fa-check-circle"></i>'); // 创建 √ 图标元素
  $(this).html(checkMark); // 替换按钮内容为 √ 图标

  // 延时一段时间后恢复原始复制按钮
  let originalButton = $(this);
  setTimeout(function() {
    originalButton.html('<i class="far fa-copy"></i>'); // 恢复原始复制按钮内容
  }, 2000); // 设置延时时间为 2 秒
});

  // 添加失败信息到窗口
  function addFailMessage(message) {
    let lastResponseElement = $(".message-bubble .response").last();
    lastResponseElement.empty();
    lastResponseElement.append('<p class="error">' + message + '</p>'); // 显示错误消息
    messages.pop() // 失败时将用户输入信息从数组删除
  }

let datas;

// 解码 Base64 编码的 API 密钥
function decodeApiKey(encodedApiKey) {
  return atob(encodedApiKey); // 使用 atob 解码
}

// 获取配置信息
async function getConfig() {
  try {
    const response = await fetch("/config");
    const data = await response.json();

    if (data.api_url) {
      datas = { "api_url": data.api_url }; // 从配置中获取 API URL
    } else {
      datas = { "api_url": "" }; // 如果配置中没有 API URL，则设置为空
    }
  } catch (error) {
    // 处理错误情况
  }
}

// 获取随机的 API 密钥
function getRandomApiKey() {
  const apiKeyInput = $(".settings-common .api-key").val().trim();
  if (apiKeyInput) {
    const apiKeys = apiKeyInput.split(',').map(key => key.trim()); // 分割 API 密钥列表
    return apiKeys[Math.floor(Math.random() * apiKeys.length)]; // 随机选择一个 API 密钥
  }
  return null; // 如果没有输入 API 密钥，则返回 null
}

// 获取 API 密钥
async function getApiKey() {
  try {
    let apiKey = getRandomApiKey(); // 尝试获取随机 API 密钥

    if (!apiKey) {
      const password = $(".settings-common .password").val(); // 获取密码

      if (!password) {
        addFailMessage("请输入正确的访问密码或者输入自己的 API key 和 API URL 使用！"); // 提示输入密码或 API Key
        return null;
      }

      const response = await fetch("/get_api_key", {
        method: "POST",
        body: new URLSearchParams({ password }), // 发送密码到后端验证
      });

      if (response.status === 403) {
        const errorData = await response.json();
        addFailMessage("请输入正确的访问密码或者输入自己的 API Key 和 API URL 使用！"); // 提示密码错误或 API Key
        return null;
      }

      const data = await response.json();

      if (data.apiKey) {
        // 解码 API 密钥
        apiKey = decodeApiKey(data.apiKey); // 解码 Base64 编码的 API 密钥
        return apiKey;
      } else {
        addFailMessage("请在设置填写好环境变量"); // 提示环境变量未配置
        return null;
      }
    } else {
      return apiKey; // 返回随机 API 密钥
    }
  } catch (error) {
    addFailMessage("出错了，请稍后再试！"); // 提示错误，稍后重试
    return null;
  }
}

// 发送请求获得响应
async function sendRequest(data) {
  await getConfig(); // 获取配置信息
  const apiKey = await getApiKey(); // 获取 API 密钥

  if (!datas || !datas.api_url || !apiKey) {
    addFailMessage("请输入正确的访问密码或者输入自己的 API Key 和 API URL 使用！"); // 提示输入密码或 API Key
    return;
  }

// 检查 api_url 是否存在非空值
if ($(".settings-common .api_url").val().trim()) {
    // 存储 api_url 值
    datas.api_url =cleanApiUrl($(".settings-common .api_url").val()); // 清理和存储 API URL
    // 检查 api_url 是否是正确的网址格式
    var apiUrlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!apiUrlRegex.test(datas.api_url)) {
        // 如果不是正确的网址格式，则返回错误消息
        addFailMessage("请检查并输入正确的代理网址"); // 提示输入正确的代理网址
    }
}

let apiUrl = datas.api_url + "/v1/chat/completions"; // 默认路径
let requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": data.temperature,
    "top_p": 1,
    "n": 1,
    "stream": getCookie('streamOutput') !== 'false' // 从 Cookie 获取流式输出设置
};

// 使用选择的 API 路径，如果不是默认路径
const selectedApiPath = apiPathSelect.val();
if (selectedApiPath) {
    apiUrl = datas.api_url + selectedApiPath; // 使用选择的 API 路径
} else {
    apiUrl = datas.api_url + "/v1/chat/completions"; // 默认路径
}


const model = data.model.toLowerCase(); // 将模型名称转换为小写，方便比较

if (selectedApiPath === '/v1/completions' || (apiPathSelect.val() === null && model.includes("gpt-3.5-turbo-instruct") || model.includes("babbage-002") || model.includes("davinci-002"))) {
    apiUrl = datas.api_url + "/v1/completions"; // 使用 completions API 路径
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
    apiUrl = datas.api_url + "/v1/chat/completions"; // 使用 chat completions API 路径处理图像
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
    apiUrl = datas.api_url + "/v1/images/generations"; // 使用 images generations API 路径
    let size = "1024x1024"; // 默认图片尺寸
    let quality = "standard"; // 默认图片质量
    let style = "natural"; // 默认图片风格

    if (model.includes("256x256")) size = "256x256"; // 根据模型调整尺寸
    if (model.includes("512x512")) size = "512x512";
    if (model.includes("1792x1024")) size = "1792x1024";
    if (model.includes("1024x1792")) size = "1024x1792";
    if (model.includes("-hd")) quality = "hd"; // 根据模型调整质量
    if (model.includes("-v") || model.includes("-p")) style = "vivid"; // 根据模型调整风格


    requestBody = {
        "prompt": data.prompts[0].content, // 图像生成仅使用最后一条消息作为提示
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
    apiUrl = datas.api_url + "/v1/moderations"; // 使用 moderations API 路径
    requestBody = {
        "input": data.prompts[0].content, // 内容审查仅使用最后一条消息作为输入
        "model": data.model,
    };
} else if ((selectedApiPath === '/v1/embeddings' || apiPathSelect.val() === null ) && model.includes("embedding")) {
    apiUrl = datas.api_url + "/v1/embeddings"; // 使用 embeddings API 路径
    requestBody = {
        "input": data.prompts[0].content, // Embedding 获取仅使用最后一条消息作为输入
        "model": data.model,
    };
} else if ((selectedApiPath === '/v1/audio/speech' || apiPathSelect.val() === null ) && model.includes("tts-1")) {
    apiUrl = datas.api_url + "/v1/audio/speech"; // 使用 audio speech API 路径
    requestBody = {
        "input": data.prompts[0].content, // TTS 仅使用最后一条消息作为输入
        "model": data.model,
        "voice": "alloy", // 设置语音
    };
} else if (model.includes("gemini-2.0-flash-exp-image-generation") && selectedApiPath === '/v1beta/models/model:generateContent?key=apikey') { // Gemini 模型处理
    apiUrl =`https://gemini.baipiao.io/v1beta/models/${data.model}:generateContent?key=${apiKey}`; // Gemini 图片生成 API 路径
    requestBody = {
        "contents": [{
            "parts": [{"text": data.prompts[0].content}]}],
            "generationConfig":{"responseModalities":["Text","Image"]} // 配置响应模式为文本和图像
    };
}else if (selectedApiPath === '/v1beta/models/model:generateContent?key=apikey') { // Gemini 模型处理
    apiUrl =`https://gemini.baipiao.io/v1beta/models/${data.model}:generateContent?key=${apiKey}`; // Gemini 通用 API 路径
    requestBody = {
        "contents": [{
            "parts": [{"text": data.prompts[0].content}] // 内容部分
        }]
    };
}
 else { // 其他模型默认使用 /v1/chat/completions 路径
    apiUrl = datas.api_url + "/v1/chat/completions"; // 默认 chat completions API 路径
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
    apiUrl = datas.api_url + "/v1/chat/completions"; // 特殊模型 o1 强制非流式
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": false // 强制非流式
    };
}
    if (data.model.includes("o3") && !data.model.includes("all")) {
    apiUrl = datas.api_url + "/v1/chat/completions"; // 特殊模型 o3 强制非流式
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": false // 强制非流式
    };
}
        if (data.model.includes("deepseek-r") ) {
    apiUrl = datas.api_url + "/v1/chat/completions"; // 特殊模型 deepseek-r 强制非流式
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // 强制非流式
    };
}
    if (data.model.includes("claude-3-7-sonnet-20250219-thinking") ) {
    apiUrl = datas.api_url + "/v1/chat/completions"; // 特殊模型 claude-3 强制非流式
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // 强制非流式
    };
}
    if (data.model.includes("claude-3-7-sonnet-thinking") ) {
    apiUrl = datas.api_url + "/v1/chat/completions"; // 特殊模型 claude-3 强制非流式
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // 强制非流式
    };
}
if (data.model.includes("claude-3-7-sonnet-thinking-20250219") ) {
    apiUrl = datas.api_url + "/v1/chat/completions"; // 特殊模型 claude-3 强制非流式
    requestBody = {
    "messages": data.prompts,
    "model": data.model,
    "max_tokens": data.max_tokens,
    "n": 1,
    "stream": false // 强制非流式
    };
}

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: selectedApiPath === '/v1beta/models/model:generateContent?key=apikey' ? { // 条件性请求头
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey // 携带 API 密钥
        },
        body: JSON.stringify(requestBody) // 请求体
    });

if (!response.ok) {
    const errorData = await response.json();
    addFailMessage(`请求失败，状态码: ${response.status}, 错误信息: ${errorData.error ? errorData.error.message : response.statusText}`); // 显示错误信息
    return;
}

if (model.includes("dall-e-2") || model.includes("dall-e-3") || model.includes("cogview-3")) {
    const responseData = await response.json();
    if (responseData.data && responseData.data.length > 0 && responseData.data[0].url) {
        addImageMessage(responseData.data[0].url); // 添加图片消息
        resFlag = true; // 标记为成功响应
    } else if (responseData.error) {
        addFailMessage(responseData.error.message); // 显示错误信息
        resFlag = false; // 标记为失败响应
    } else {
        addFailMessage("图片生成失败，返回数据格式不正确"); // 提示图片生成失败
        resFlag = false; // 标记为失败响应
    }
    return; // 图片生成处理结束
} else if (model.includes("moderation")) {
    const responseData = await response.json();
    if (responseData.results) {
        addModerationMessage(responseData.results); // 添加审查结果消息
        resFlag = true; // 标记为成功响应
    } else if (responseData.error) {
        addFailMessage(responseData.error.message); // 显示错误信息
        resFlag = false; // 标记为失败响应
    } else {
        addFailMessage("内容审查失败，返回数据格式不正确"); // 提示内容审查失败
        resFlag = false; // 标记为失败响应
    }
    return; // 内容审查处理结束
} else if (model.includes("embedding")) {
    const responseData = await response.json();
    if (responseData.data && responseData.data.length > 0 && responseData.data[0].embedding) {
        addEmbeddingMessage(responseData.data[0].embedding); // 添加 Embedding 结果消息
        resFlag = true; // 标记为成功响应
    } else if (responseData.error) {
        addFailMessage(responseData.error.message); // 显示错误信息
        resFlag = false; // 标记为失败响应
    } else {
        addFailMessage("Embedding 获取失败，返回数据格式不正确"); // 提示 Embedding 获取失败
        resFlag = false; // 标记为失败响应
    }
    return; // Embedding 处理结束
} else if (model.includes("tts-1")) {
    const audioBlob = await response.blob(); // 获取音频 blob 数据
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1]; // 转换为 base64 格式
        addTTSMessage(base64Audio); // 添加 TTS 消息
    };
    reader.readAsDataURL(audioBlob); // 读取为 DataURL
    resFlag = true; // 标记为成功响应
    return; // TTS 处理结束
} else if (model.includes("gemini-2.0-flash-exp-image-generation") && selectedApiPath === '/v1beta/models/model:generateContent?key=apikey') {
    const responseData = await response.json();
    if (responseData.candidates && responseData.candidates[0].content && responseData.candidates[0].content.parts) {
        addResponseMessage(responseData.candidates[0].content.parts); // 添加 Gemini 图片生成响应消息
        resFlag = true; // 标记为成功响应
    } else if (responseData.error) {
        addFailMessage(responseData.error.message); // 显示错误信息
        resFlag = false; // 标记为失败响应
    } else {
        addFailMessage("图片生成失败，返回数据格式不正确"); // 提示图片生成失败
        resFlag = false; // 标记为失败响应
    }
    return;
}


if (getCookie('streamOutput') !== 'false') { // 从 Cookie 获取流式输出设置，默认为流式
    const reader = response.body.getReader(); // 获取响应 body 的 reader
    let res = ''; // 存储所有响应数据
    let str; // 存储单次解析的文本
    // **新增代码 - 在请求前记录是否滚动到底部**
    const wasScrolledToBottomBeforeRequest = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() <= 1;
    while (true) {
        const { done, value } = await reader.read(); // 读取数据块
        if (done) {
            break; // 读取完成
        }
        str = ''; // 重置单次解析文本
        res += new TextDecoder().decode(value).replace(/^data: /gm, '').replace("[DONE]", ''); // 解码数据并处理
        const lines = res.trim().split(/[\n]+(?=\{)/); // 分割数据行
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let jsonObj;
            try {
                jsonObj = JSON.parse(line); // 解析 JSON 对象
            } catch (e) {
                break; // 解析失败，跳出循环
            }
    if (jsonObj.choices) {
        if (apiUrl === datas.api_url + "/v1/chat/completions" && jsonObj.choices[0].delta) {
            const reasoningContent = jsonObj.choices[0].delta.reasoning_content;
            const content = jsonObj.choices[0].delta.content;

            if (reasoningContent && reasoningContent.trim() !== "") {
                str += "思考过程:" + "\n" + reasoningContent + "\n"  + "最终回答:" + "\n" + content ; // 拼接思考过程和最终回答
            } else if (content && content.trim() !== "") {
                str += content; // 拼接内容
            }
        } else if (apiUrl === datas.api_url + "/v1/completions" && jsonObj.choices[0].text) {
            str += jsonObj.choices[0].text; // 拼接文本
        } else if (apiUrl === datas.api_url + "/v1/chat/completions" && jsonObj.choices[0].message) {
            const message = jsonObj.choices[0].message;
            const reasoningContent = message.reasoning_content;
            const content = message.content;

            if (reasoningContent && reasoningContent.trim() !== "") {
                str += "思考过程:" + "\n" + reasoningContent + "\n" + "最终回答:" + "\n" + content ; // 拼接思考过程和最终回答
            } else if (content && content.trim() !== "") {
                str += content; // 拼接内容
            }
        }
                addResponseMessage(str); // 添加响应消息
                resFlag = true; // 标记为成功响应
            } else if (jsonObj.candidates) { // Gemini stream 响应处理
                let geminiContent = '';
                if (jsonObj.candidates[0].content && jsonObj.candidates[0].content.parts && jsonObj.candidates[0].content.parts[0].text) {
                    geminiContent = jsonObj.candidates[0].content.parts[0].text; // 获取 Gemini 内容
                }
                str += geminiContent; // 拼接 Gemini 内容
                addResponseMessage(str); // 添加响应消息
                resFlag = true; // 标记为成功响应
            }

             else {
                if (jsonObj.error) {
                    addFailMessage(jsonObj.error.type + " : " + jsonObj.error.message + jsonObj.error.code); // 显示错误信息
                    resFlag = false; // 标记为失败响应
                }
            }
        }
    }

    // **新增代码 - 流式响应结束后判断是否滚动到底部**
    if (wasScrolledToBottomBeforeRequest) {
        scrollToBottom(); // 如果请求前在底部，则滚动到底部
    }


    return str; // 返回最终响应文本
} else { // 非流式输出处理
    const responseData = await response.json(); // 解析 JSON 响应
    if (responseData.choices && responseData.choices.length > 0) {
        let content = '';
        if (apiUrl === datas.api_url + "/v1/chat/completions" && responseData.choices[0].message) {
            content = responseData.choices[0].message.content; // 获取 chat completions 内容
        } else if (apiUrl === datas.api_url + "/v1/completions" && responseData.choices[0].text) {
            content = responseData.choices[0].text; // 获取 completions 内容
        }
        addResponseMessage(content); // 添加响应消息
        resFlag = true; // 标记为成功响应
        return content; // 返回响应内容
    } else if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content && responseData.candidates[0].content.parts && responseData.candidates[0].content.parts.length > 0) { // Gemini 非流式响应处理
        const content = responseData.candidates[0].content.parts[0].text; // 获取 Gemini 内容
        addResponseMessage(content); // 添加响应消息
        resFlag = true; // 标记为成功响应
        return content; // 返回响应内容
    }
     else if (responseData.error) {
        addFailMessage(responseData.error.message); // 显示错误信息
        resFlag = false; // 标记为失败响应
        return null; // 返回 null 表示失败
    } else {
        addFailMessage("Unexpected response format."); // 提示意外的响应格式
        resFlag = false; // 标记为失败响应
        return null; // 返回 null 表示失败
    }

    // **新增代码 - 非流式响应结束后判断是否滚动到底部**
    const wasScrolledToBottomBeforeRequest = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() <= 1;
    if (wasScrolledToBottomBeforeRequest) {
        scrollToBottom(); // 如果请求前在底部，则滚动到底部
    }
}


  }


  // 处理用户输入
  chatBtn.click(function() {
    // 解绑键盘事件
    chatInput.off("keydown",handleEnter);
let data = {};
let imageSrc = document.getElementById('imagePreview').src;
    data.image_base64 = imageSrc.split(',')[1]; // 获取图片 base64 编码
    let message = chatInput.val(); // 获取输入消息
    if (message.length == 0){
      // 重新绑定键盘事件
      chatInput.on("keydown",handleEnter); // 重新绑定 Enter 键事件
      return // 消息为空直接返回
    }

    addRequestMessage(message); // 添加请求消息到窗口
    // 将用户消息保存到数组
    messages.push({"role": "user", "content": message}) // 保存用户消息

    // 获取连续对话消息上限，默认值 150
    let maxMessages = parseInt(getCookie('maxDialogueMessages')) || 150;

    if(messages.length> maxMessages){
      addFailMessage("此次对话长度过长，请点击下方删除按钮清除对话内容！"); // 提示对话过长
      // 重新绑定键盘事件
      chatInput.on("keydown",handleEnter); // 重新绑定 Enter 键事件
      chatBtn.attr('disabled',false) // 让按钮可点击
      return ; // 对话过长直接返回
    }

 // 获取所选的模型
  data.model = $(".settings-common .model").val(); // 获取模型名称
  data.temperature = parseFloat($(".settings-common .temperature").val()); // 获取 temperature 参数
  data.max_tokens = parseInt($(".settings-common .max-tokens").val()); // 获取 max_tokens 参数

    const selectedModel = data.model.toLowerCase(); // 模型名称转小写
    if (selectedModel.includes("dall-e-2") || selectedModel.includes("dall-e-3") || selectedModel.includes("cogview-3") || selectedModel.includes("moderation") || selectedModel.includes("embedding") || selectedModel.includes("tts-1")) {
        data.prompts = [{"role": "user", "content": message}]; // 图片/审查/Embedding/TTS 模型仅发送最后一条消息
    } else {
        // 判断是否已开启连续对话
        if(localStorage.getItem('continuousDialogue') == 'true'){
            // 控制上下文，对话长度超过 4 轮，取最新的 3 轮，即数组最后 7 条数据
          data.prompts = messages.slice();  // 拷贝一份全局 messages 赋值给 data.prompts
          if (data.prompts.length > 8) {
            data.prompts.splice(0, data.prompts.length - 7); // 截取最新的 7 条消息
          }
        }else{
          data.prompts = messages.slice();
          data.prompts.splice(0, data.prompts.length - 1); // 未开启连续对话，取最后一条
        }
    }


    sendRequest(data).then((res) => {
      chatInput.val(''); // 清空输入框
      // 收到回复，让按钮可点击
      chatBtn.attr('disabled',false) // 启用发送按钮
      // 重新绑定键盘事件
      chatInput.on("keydown",handleEnter); // 重新绑定 Enter 键事件
      // 判断是否是回复正确信息
      if(resFlag && !(selectedModel.includes("dall-e-2") || selectedModel.includes("dall-e-3") || selectedModel.includes("cogview-3") || selectedModel.includes("moderation") || selectedModel.includes("embedding") || selectedModel.includes("tts-1")) ){ // 图片/审查/Embedding/TTS 模型不添加到对话历史
        messages.push({"role": "assistant", "content": res}); // 保存助手回复消息
        // 判断是否本地存储历史会话
        if(localStorage.getItem('archiveSession')=="true"){
          localStorage.setItem("session",JSON.stringify(messages)); // 保存会话到本地存储
        }
      }
      // 添加复制功能
      copy();
    });
  });
// 停止并隐藏
$('.stop a').click(function() {
  if (ajaxRequest) {
    ajaxRequest.abort(); // 中止 AJAX 请求
  }
  // 隐藏停止按钮
  $(this).closest('.stop').hide();
});
// Enter 键盘事件处理函数
function handleEnter(e) {
  // 如果是电脑端，判断同时按下 Ctrl 键和 Enter 键
  if (!isMobile() && e.ctrlKey && e.keyCode == 13) {
    chatBtn.click(); // 触发发送按钮点击事件
    e.preventDefault();  // 避免回车换行
  }
}

// 绑定键盘事件
chatInput.on("keydown", handleEnter); // 绑定 Enter 键事件处理函数


  // 设置栏宽度自适应
  let width = $('.function .others').width(); // 获取功能栏宽度
  $('.function .settings .dropdown-menu').css('width', width); // 设置下拉菜单宽度与功能栏一致

  $(window).resize(function() {
    width = $('.function .others').width(); // 窗口大小改变时重新获取功能栏宽度
    $('.function .settings .dropdown-menu').css('width', width); // 并更新下拉菜单宽度
  });


  // 主题设置函数
  function setBgColor(theme){
    $(':root').attr('bg-theme', theme); // 设置根元素的 bg-theme 属性
    $('.settings-common .theme').val(theme); // 更新主题选择器值
    // 定位在文档外的元素也同步主题色
    $('.settings-common').css('background-color', 'var(--bg-color)'); // 同步设置栏背景色
  }

  let theme = localStorage.getItem('theme'); // 从本地存储获取主题
  // 如果之前选择了主题，则将其应用到网站中
  if (theme) {
    setBgColor(theme); // 应用已保存的主题
  }else{
    localStorage.setItem('theme', "light"); // 默认主题为 light
    theme = localStorage.getItem('theme'); // 获取默认主题
    setBgColor(theme); // 应用默认主题
  }

  // 监听主题选择的变化
  $('.settings-common .theme').change(function() {
    const selectedTheme = $(this).val(); // 获取选择的主题值
    localStorage.setItem('theme', selectedTheme); // 保存主题到本地存储
    $(':root').attr('bg-theme', selectedTheme); // 设置根元素的 bg-theme 属性
    // 定位在文档外的元素也同步主题色
    $('.settings-common').css('background-color', 'var(--bg-color)'); // 同步设置栏背景色
  });

  // password 设置
  const password = localStorage.getItem('password'); // 从本地存储获取 password
  if (password) {
    $(".settings-common .password").val(password); // 设置密码输入框的值
  }

  // password 输入框失去焦点事件
  $(".settings-common .password").blur(function() {
    const password = $(this).val(); // 获取密码输入框的值
    if(password.length!=0){
      localStorage.setItem('password', password); // 保存密码到本地存储
    }else{
      localStorage.removeItem('password'); // 移除本地存储的密码
    }

  })
  // apiKey 设置
  const apiKey = localStorage.getItem('apiKey'); // 从本地存储获取 apiKey
  if (apiKey) {
    $(".settings-common .api-key").val(apiKey); // 设置 apiKey 输入框的值
  }

  // apiKey 输入框失去焦点事件
  $(".settings-common .api-key").blur(function() {
    const apiKey = $(this).val(); // 获取 apiKey 输入框的值
    if(apiKey.length!=0){
      localStorage.setItem('apiKey', apiKey); // 保存 apiKey 到本地存储
    }else{
      localStorage.removeItem('apiKey'); // 移除本地存储的 apiKey
    }
  })

 // 读取 apiUrl 设置
  const api_url = localStorage.getItem('api_url'); // 从本地存储获取 api_url
  if (api_url) {
    $(".settings-common .api_url").val(api_url); // 设置 apiUrl 输入框的值
  }

  // apiUrl 输入框失去焦点事件
  $(".settings-common .api_url").blur(function() {
    const api_url = $(this).val(); // 获取 apiUrl 输入框的值
    if(api_url.length!=0){
      localStorage.setItem('api_url', api_url); // 保存 apiUrl 到本地存储
    }else{
      localStorage.removeItem('api_url'); // 移除本地存储的 apiUrl
    }
  })

  // 是否保存历史对话设置
  var archiveSession = localStorage.getItem('archiveSession'); // 从本地存储获取 archiveSession 设置

  // 初始化 archiveSession 设置
  if(archiveSession == null){
    archiveSession = "true"; // 默认开启保存历史对话
    localStorage.setItem('archiveSession', archiveSession); // 保存到本地存储
  }

  if(archiveSession == "true"){
    $("#chck-1").prop("checked", true); // 勾选保存历史对话复选框
  }else{
    $("#chck-1").prop("checked", false); // 取消勾选保存历史对话复选框
  }

  $('#chck-1').click(function() {
    if ($(this).prop('checked')) {
      // 开启状态的操作
      localStorage.setItem('archiveSession', true); // 保存 archiveSession 为 true
      if(messages.length != 0){
        localStorage.setItem("session",JSON.stringify(messages)); // 保存当前会话到本地存储
      }
    } else {
      // 关闭状态的操作
      localStorage.setItem('archiveSession', false); // 保存 archiveSession 为 false
      localStorage.removeItem("session"); // 移除本地存储的会话
    }
  });

  // 加载历史保存会话
  if(archiveSession == "true"){
    const messagesList = JSON.parse(localStorage.getItem("session")); // 从本地存储读取会话
    if(messagesList){
      messages = messagesList; // 加载会话消息列表
      $.each(messages, function(index, item) {
        if (item.role === 'user') {
          addRequestMessage(item.content) // 添加用户请求消息到窗口
        } else if (item.role === 'assistant') {
          addResponseMessage(item.content) // 添加助手响应消息到窗口
        }
      });
      // 添加复制功能
      copy();
    }
  }

  // 是否连续对话设置
  var continuousDialogue = localStorage.getItem('continuousDialogue'); // 从本地存储获取 continuousDialogue 设置

  // 初始化 continuousDialogue 设置
  if(continuousDialogue == null){
    continuousDialogue = "true"; // 默认开启连续对话
    localStorage.setItem('continuousDialogue', continuousDialogue); // 保存到本地存储
  }

  if(continuousDialogue == "true"){
    $("#chck-2").prop("checked", true); // 勾选连续对话复选框
  }else{
    $("#chck-2").prop("checked", false); // 取消勾选连续对话复选框
  }

  $('#chck-2').click(function() {
    if ($(this).prop('checked')) {
      localStorage.setItem('continuousDialogue', true); // 保存 continuousDialogue 为 true
    } else {
      localStorage.setItem('continuousDialogue', false); // 保存 continuousDialogue 为 false
    }
  });
// 读取 model 配置
const selectedModel = localStorage.getItem('selectedModel'); // 从本地存储获取 selectedModel

// 检测模型并更新设置
function updateModelSettings(modelName) {
    const isNonStreamModel = modelName.toLowerCase().includes("o1") && !modelName.toLowerCase().includes("all") ||
                               modelName.toLowerCase().includes("o3") && !modelName.toLowerCase().includes("all") ||
                               modelName.toLowerCase().includes("deepseek-r") ||
                               modelName.toLowerCase().includes("claude-3-7-sonnet-20250219-thinking") ||
                               modelName.toLowerCase().includes("claude-3-7-sonnet-thinking") ||
                               modelName.toLowerCase().includes("claude-3-7-sonnet-thinking-20250219"); // 非流式模型列表

    const isHideStreamSettingModel = modelName.toLowerCase().includes("dall-e") ||
                                      modelName.toLowerCase().includes("cogview") ||
                                      modelName.toLowerCase().includes("moderation") ||
                                      modelName.toLowerCase().includes("embedding") ||
                                      modelName.toLowerCase().includes("tts-1"); // 隐藏流式设置的模型列表

    var streamOutputCheckbox = document.getElementById('streamOutput'); // 流式输出复选框

    if (isNonStreamModel) {
        streamOutputCheckbox.checked = false; // 非流式模型默认关闭流式输出
        setCookie('streamOutput', 'false', 30); // 设置 cookie 为非流式
        streamOutputSetting.show(); // 显示流式输出设置行
    } else if (isHideStreamSettingModel) {
        streamOutputSetting.hide(); // 隐藏流式输出设置行
    } else {
        streamOutputSetting.show(); // 显示流式输出设置行
        // 如果之前是非流式，切换到流式
        if (getCookie('streamOutput') === 'false') {
            streamOutputCheckbox.checked = true; // 切换为流式输出
            setCookie('streamOutput', 'true', 30); // 设置 cookie 为流式
        }
    }

    // 检测是否含有 "tts" 或 "dall" 并设置连续对话状态
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


    const isContinuousDialogueEnabled = !(hasTTS || hasDALL || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl); // 判断是否启用连续对话

    // 设置连续对话状态
    $("#chck-2").prop("checked", isContinuousDialogueEnabled); // 设置连续对话复选框状态
    localStorage.setItem('continuousDialogue', isContinuousDialogueEnabled); // 保存连续对话设置

    // 设置是否禁用 checkbox
    $("#chck-2").prop("disabled", hasTTS || hasDALL  || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl); // 禁用特定模型的连续对话

    // 获取上一个模型名称
    const previousModel = localStorage.getItem('previousModel') || ""; // 获取上一个模型名称
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


    // 如果从包含 tts 或 dall 的模型切换到不包含这些的模型，清除对话
    if ((hadTTS || hadDALL || hadCog || hadCompletion1 || hadCompletion2 || hadCompletion3 || hadTextem || hadTextmo || hadVs || hadVi || hadMj || hadSD || hadFlux || hadVd || hadSora || hadSuno || hadKo || hadKl) && !(hasTTS || hasDALL || hasCog || hasCompletion1 || hasCompletion2 || hasCompletion3 || hasTextem || hasTextmo || hasVs || hasVi || hasMj || hasSD || hasFlux || hasVd || hasSora || hasSuno || hasKo || hasKl)) {
        clearConversation(); // 清除对话
    }

    // 更新上一个模型名称为当前模型
    localStorage.setItem('previousModel', modelName); // 保存当前模型名称

    // --- Start of Path Auto-Switching Logic ---
    let targetApiPath = null; // 目标 API 路径
    const lowerModelName = modelName.toLowerCase(); // 模型名称转小写

    if (lowerModelName.includes("gpt-3.5-turbo-instruct") || lowerModelName.includes("babbage-002") || lowerModelName.includes("davinci-002")) {
        targetApiPath = '/v1/completions'; // completions API 路径
    } else if (lowerModelName.includes("dall-e-2") || lowerModelName.includes("dall-e-3") || lowerModelName.includes("cogview-3")) {
        targetApiPath = '/v1/images/generations'; // images generations API 路径
    } else if (lowerModelName.includes("moderation")) {
        targetApiPath = '/v1/moderations'; // moderations API 路径
    } else if (lowerModelName.includes("embedding")) {
        targetApiPath = '/v1/embeddings'; // embeddings API 路径
    } else if (lowerModelName.includes("tts-1")) {
        targetApiPath = '/v1/audio/speech'; // audio speech API 路径
    } else if (lowerModelName.includes("gemini")) {
        targetApiPath = '/v1/chat/completions'; // Gemini 模型使用 chat completions 路径，不覆盖选择器
    }
    else {
        targetApiPath = '/v1/chat/completions'; // 默认 chat completions API 路径
    }

    if (targetApiPath && !lowerModelName.includes("gemini")) { // 非 Gemini 模型才自动切换 API 路径
        apiPathSelect.val(targetApiPath); // 设置 API 路径选择器值
        localStorage.setItem('apiPath', targetApiPath); // 保存 API 路径到本地存储
    } else if (lowerModelName.includes("gemini")) {
        apiPathSelect.val(targetApiPath); // Gemini 模型使用默认路径，清除选择器值
        localStorage.removeItem('apiPath'); // 移除本地存储的 API 路径设置
    }
    // --- End of Path Auto-Switching Logic ---
}


        // 初始加载时检测 selectedModel
        if (selectedModel) {
            $(".settings-common .model").val(selectedModel); // 设置模型选择器值
            updateModelSettings(selectedModel); // 更新模型设置
            // Update the title to use the selected option's data-description
            $(".title h2").text($(".settings-common .model option:selected").data('description')); // 更新标题为模型描述
        }

        // 监听 model 选择的变化
        $('.settings-common .model').change(function() {
            const selectedModel = $(this).val(); // 获取选择的模型名称
            localStorage.setItem('selectedModel', selectedModel); // 保存模型名称到本地存储
            updateModelSettings(selectedModel); // 更新模型设置
            // Update the title to use the selected option's data-description
            $(".title h2").text($(this).find("option:selected").data('description')); // 更新标题为模型描述
        });

// 删除对话
function clearConversation() {
    chatWindow.empty(); // 清空聊天窗口
    deleteInputMessage(); // 清空输入框
    $(".answer .tips").css({"display":"flex"}); // 显示提示信息
    messages = []; // 清空消息数组
    localStorage.removeItem("session"); // 移除本地存储的会话
    scrollDownBtn.hide(); // 隐藏下滑按钮
}

// 删除功能
$(".delete a").click(function(){
    clearConversation(); // 调用清除对话函数
});

// 添加滚动监听器
chatWindow.on('scroll', function() {
    const isScrolledToBottom = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() <= 1;
    if (!isScrolledToBottom) {
        scrollDownBtn.show(); // 如果未滚动到底部则显示下滑按钮
        scrollDownBtn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down'); // 切换为下滑图标
        scrollDownBtn.attr('title', '滑动到底部'); // 更改提示文字
    } else {
        scrollDownBtn.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up'); // 切换为上滑图标
        scrollDownBtn.attr('title', '滑动到顶部'); // 更改提示文字
    }
});

// scroll-down 按钮点击事件
scrollDownBtn.click(function() {
    const isAtBottom = chatWindow[0].scrollHeight - chatWindow.scrollTop() - chatWindow.innerHeight() <= 1;
    if (isAtBottom) {
        scrollToTop(); // 如果在底部，则滑动到顶部
    } else {
        scrollToBottom(); // 否则滑动到底部
    }
});


  // 读取 temperature 设置
  const temperature = localStorage.getItem('temperature'); // 从本地存储获取 temperature
  if (temperature) {
    $(".settings-common .temperature-input").val(temperature); // 设置 temperature 输入框的值
    $(".settings-common .temperature").val(temperature); // 设置 temperature 滑条的值
  }

  // temperature 输入框事件
  $(".settings-common .temperature-input").change(function() {
    const temperature = $(this).val(); // 获取输入框的值
    localStorage.setItem('temperature', temperature); // 保存 temperature 到本地存储
  })

  // temperature 滑条事件
  $(".settings-common .temperature").change(function() {
    const temperature = $(this).val(); // 获取滑条的值
    localStorage.setItem('temperature', temperature); // 保存 temperature 到本地存储
     })

// 读取 max_tokens 设置
  const max_tokens  = localStorage.getItem('max_tokens '); // 从本地存储获取 max_tokens
  if (max_tokens) {
    $(".settings-common .max-tokens-input").val(max_tokens ); // 设置 max_tokens 输入框的值
    $(".settings-common .max-tokens ").val(max_tokens ); // 设置 max_tokens 滑条的值
  }

  // max_tokens 输入框事件
  $(".settings-common .max-tokens-input").change(function() {
    const max_tokens  = $(this).val(); // 获取输入框的值
    localStorage.setItem('max_tokens ', max_tokens ); // 保存 max_tokens 到本地存储
      })

  // max_tokens 滑条事件
  $(".settings-common .max-tokens").change(function() {
    const max_tokens  = $(this).val(); // 获取滑条的值
    localStorage.setItem('max_tokens ', max_tokens ); // 保存 max_tokens 到本地存储
      })

// 删除输入框中的消息
function deleteInputMessage() {
  chatInput.val(''); // 清空输入框
}

// 删除功能
$(".delete a").click(function(){
  chatWindow.empty(); // 清空聊天窗口
  deleteInputMessage(); // 清空输入框
  $(".answer .tips").css({"display":"flex"}); // 显示提示信息
  messages = []; // 清空消息数组
  localStorage.removeItem("session"); // 移除本地存储的会话
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
    $("body").append(clonedChatWindow); // 添加副本到 body

    html2canvas(clonedChatWindow[0], {
      allowTaint: false,
      useCORS: true,
      scrollY: 0,
    }).then(function(canvas) {
      // 将 canvas 转换成图片
      const imgData = canvas.toDataURL('image/png'); // 转换为 DataURL
      // 创建下载链接
      const link = document.createElement('a');
      link.download = "screenshot_" + Math.floor(Date.now() / 1000) + ".png"; // 设置下载文件名
      link.href = imgData; // 设置下载链接
      document.body.appendChild(link); // 添加链接到 body
      link.click(); // 触发下载
      document.body.removeChild(link); // 移除链接
      clonedChatWindow.remove(); // 移除副本元素
    });
  });

  // 代码复制功能
  function copy(){
    $('pre').each(function() {
      let btn = $('<button class="copy-btn">复制</button>'); // 创建复制按钮
      $(this).append(btn); // 添加按钮到代码块
      btn.hide(); // 初始隐藏按钮
    });

    $('pre').hover(
      function() {
        $(this).find('.copy-btn').show(); // 鼠标悬停时显示按钮
      },
      function() {
        $(this).find('.copy-btn').hide(); // 鼠标移开时隐藏按钮
      }
    );

    $('pre').on('click', '.copy-btn', function() {
      let text = $(this).siblings('code').text(); // 获取代码文本
      // 创建一个临时的 textarea 元素
      let textArea = document.createElement("textarea");
      textArea.value = text; // 设置 textarea 值
      document.body.appendChild(textArea); // 添加到 body
      textArea.select(); // 选中 textarea 内容

      // 执行复制命令
      try {
        document.execCommand('copy'); // 执行复制
        $(this).text('复制成功'); // 按钮文本改为复制成功
      } catch (e) {
        $(this).text('复制失败'); // 按钮文本改为复制失败
      }

      // 从文档中删除临时的 textarea 元素
      document.body.removeChild(textArea); // 移除临时 textarea

      setTimeout(() => {
        $(this).text('复制'); // 延时后按钮文本恢复为复制
      }, 2000); // 延时 2 秒
    });
  }

    // 读取 apiPath 设置
    const apiPath = localStorage.getItem('apiPath'); // 从本地存储读取 apiPath
    if (apiPath) {
        $('#apiPathSelect').val(apiPath); // 设置 apiPath 选择器值
    }

    // apiPath select 事件
    $('#apiPathSelect').change(function() {
        const selectedApiPath = $(this).val(); // 获取选择的 apiPath
        localStorage.setItem('apiPath', selectedApiPath); // 保存 apiPath 到本地存储
    });
});
