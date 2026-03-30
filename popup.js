// 取得 DOM 元素
const keywordInput = document.getElementById('keyword-input');
const addKeywordBtn = document.getElementById('add-keyword-btn');
const keywordsList = document.getElementById('keywords-list');
const countBadge = document.getElementById('count-badge');

// 從 chrome.storage 載入並顯示關鍵詞
function loadKeywords() {
  chrome.storage.sync.get({ keywords: [] }, (data) => {
    if (data.keywords.length === 0) {
      // 如果沒有關鍵詞，則載入預設資料庫
      loadDefaultKeywords();
    } else {
      renderKeywords(data.keywords);
    }
  });
}

// 載入預設關鍵詞資料庫
async function loadDefaultKeywords() {
  try {
    const response = await fetch('default_keywords.json');
    const defaultKeywords = await response.json();
    
    chrome.storage.sync.set({ keywords: defaultKeywords }, () => {
      renderKeywords(defaultKeywords);
      triggerHighlighting();
      showToast('已自動載入預設資料庫');
    });
  } catch (error) {
    console.error('載入預設關鍵詞失敗:', error);
  }
}

// 渲染關鍵詞列表
function renderKeywords(keywords) {
  keywordsList.innerHTML = ''; // 清空現有列表
  
  // 更新計數器
  if (countBadge) {
    countBadge.textContent = keywords.length;
  }

  keywords.forEach((keyword, index) => {
    const li = document.createElement('li');
    li.style.animationDelay = `${index * 0.05}s`;
    
    const keywordSpan = document.createElement('span');
    keywordSpan.textContent = keyword;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×'; // 使用乘號作為刪除按鈕
    deleteBtn.title = '刪除';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      deleteKeyword(index);
    });
    
    li.appendChild(keywordSpan);
    li.appendChild(deleteBtn);
    keywordsList.appendChild(li);
  });
}

// 新增關鍵詞
function addKeyword() {
  const newKeyword = keywordInput.value.trim();
  if (newKeyword) {
    chrome.storage.sync.get({ keywords: [] }, (data) => {
      const keywords = data.keywords;
      if (!keywords.includes(newKeyword)) {
        // 將新關鍵詞加入到陣列最前面
        keywords.unshift(newKeyword);
        chrome.storage.sync.set({ keywords }, () => {
          renderKeywords(keywords);
          keywordInput.value = '';
          triggerHighlighting();
          showToast('已新增關鍵詞');
        });
      } else {
        showToast('關鍵詞已存在！', 'warning');
      }
    });
  }
}

// 刪除關鍵詞
function deleteKeyword(indexToDelete) {
  chrome.storage.sync.get({ keywords: [] }, (data) => {
    const keywords = data.keywords;
    keywords.splice(indexToDelete, 1);
    chrome.storage.sync.set({ keywords }, () => {
      renderKeywords(keywords);
      triggerHighlighting();
    });
  });
}

// 提示訊息功能
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }, 100);
}

// 觸發內容腳本重新執行標示
function triggerHighlighting() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0] && tabs[0].id && tabs[0].url.startsWith('http')) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "highlight" });
        }
    });
}

// 事件監聽
addKeywordBtn.addEventListener('click', addKeyword);
keywordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addKeyword();
  }
});

// 初始載入
document.addEventListener('DOMContentLoaded', loadKeywords);
