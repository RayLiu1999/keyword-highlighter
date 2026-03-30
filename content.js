let lastKeywords = [];

function highlightKeywords(keywords) {
  // console.log('highlightKeywords 被呼叫，關鍵詞:', keywords);
  
  // 移除舊的標示
  unhighlight();
  
  // 更新關鍵詞快取
  lastKeywords = [...keywords];
  
  // 檢查關鍵詞是否有效
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    // console.log('沒有提供有效的關鍵詞');
    return;
  }
  
  // 過濾掉空字串或無效的關鍵詞
  const validKeywords = keywords.filter(kw => kw && typeof kw === 'string' && kw.trim() !== '');
  if (validKeywords.length === 0) {
    // console.log('沒有有效的關鍵詞需要標記');
    return;
  }
  
  // console.log('有效的關鍵詞:', validKeywords);

  // 建立正規表達式（大小寫不敏感）
  const pattern = validKeywords
    .map(kw => escapeRegExp(kw))
    .join('|');
  
  // console.log('正規表達式模式:', pattern);
  
  let regex;
  try {
    regex = new RegExp(`(${pattern})`, 'gi');
  } catch (e) {
    console.error('建立正規表達式時出錯:', e);
    return;
  }
  
  // 建立 TreeWalker 來遍歷頁面上的文字節點
  let walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // 忽略 SCRIPT 和 STYLE 標籤內的文字，以及已經標示的元素
        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || 
            parent.classList.contains('highlighted-keyword')) {
          return NodeFilter.FILTER_REJECT;
        }
        // 只處理包含非空白字符的文字節點
        if (/[^\s]/.test(node.nodeValue)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    },
    false
  );
  
  // 記錄開始時間
  const startTime = performance.now();

  // 限制處理的節點數量，避免效能問題
  const MAX_NODES = 1000;
  let node;
  const nodesToProcess = [];
  
  // 先計算總節點數
  while (walker.nextNode()) {
    nodesToProcess.push(null); // 只計算數量，不儲存節點
  }
  
  // 重置 TreeWalker
  walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || 
            parent.classList.contains('highlighted-keyword')) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!/[^\s]/.test(node.nodeValue)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );
  
  // 只處理前 MAX_NODES 個節點
  const processedNodes = [];
  let nodeCount = 0;
  while ((node = walker.nextNode()) && nodeCount < MAX_NODES) {
    processedNodes.push(node);
    nodeCount++;
  }

  // console.log(`找到 ${nodesToProcess.length} 個文字節點，將處理前 ${processedNodes.length} 個節點`);
  
  processedNodes.forEach((node, index) => {
    try {
      // 確保節點和其 nodeValue 存在
      if (!node || !node.nodeValue) {
        return;
      }

      const parent = node.parentNode;
      if (!parent) {
        return;
      }

      const text = node.nodeValue;
      const matches = text.match(regex);
      
      if (matches && matches.length > 0) {
        // console.log(`在節點 #${index} 中找到 ${matches.length} 個匹配`);
        
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        
        // 重置正規表達式的 lastIndex
        regex.lastIndex = 0;
        
        while ((match = regex.exec(text)) !== null) {
          // 添加匹配前的文字
          if (match.index > lastIndex) {
            const textBefore = document.createTextNode(text.substring(lastIndex, match.index));
            fragment.appendChild(textBefore);
          }
          
          // 添加高亮標記
          const span = document.createElement('span');
          span.className = 'highlighted-keyword';
          span.textContent = match[0];
          fragment.appendChild(span);
          
          lastIndex = regex.lastIndex;
          
          // 避免無限迴圈
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
        
        // 添加剩餘的文字
        if (lastIndex < text.length) {
          const textAfter = document.createTextNode(text.substring(lastIndex));
          fragment.appendChild(textAfter);
        }
        
        // 替換原始節點
        parent.replaceChild(fragment, node);
      }
    } catch (error) {
      console.error(`處理節點時出錯:`, error);
    }
  });
}

function unhighlight() {
    const highlighted = document.querySelectorAll('span.highlighted-keyword');
    highlighted.forEach(el => {
        const parent = el.parentNode;
        if (!parent) return;
        const text = document.createTextNode(el.textContent);
        parent.replaceChild(text, el);
        parent.normalize();
    });
}


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function run() {
    chrome.storage.sync.get({ keywords: [] }, (data) => {
        highlightKeywords(data.keywords);
    });
}

// 監聽來自 popup 的訊息，以即時更新標示
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlight") {
    run();
    sendResponse({status: "ok"}); // 回應訊息，避免 port-closing 錯誤
  }
  return true; // 異步回應
});

// 頁面載入後延遲 3-5 秒執行關鍵詞標記
const delay = 3000 + Math.random() * 2000; // 3-5 秒隨機延遲
// console.log(`將在 ${Math.round(delay/100)/10} 秒後執行關鍵詞標記`);

setTimeout(() => {
  // console.log('開始執行關鍵詞標記');
  run();
}, delay);
