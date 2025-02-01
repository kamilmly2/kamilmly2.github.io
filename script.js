// Updated JavaScript
let currentTab = 'all-models';

async function classifyText() {
  const inputText = document.getElementById("inputText").value.trim();
  if (!inputText) {
    showToast("Please enter some text to analyze", "error");
    return;
  }

  if (inputText.length < 10) {
    showToast("Please enter at least 10 characters for better accuracy", "warning");
    return;
  }

  showLoading(true);

  try {
    // Category detection
    const categoryResponse = await fetch("http://127.0.0.1:8000/classify_category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText })
    });

    if (!categoryResponse.ok) throw new Error("Category detection failed");
    
    const categoryData = await categoryResponse.json();
    displayCategoryResults(categoryData);

    // Text classification
    const classificationResponse = await fetch("http://127.0.0.1:8000/classify_text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText })
    });

    if (!classificationResponse.ok) throw new Error("Classification failed");
    
    const classificationData = await classificationResponse.json();
    displayFinalVerdict(classificationData);
    displayClassificationResults(classificationData);

    document.querySelector(".results-container").style.display = "grid";
    document.querySelector(".verdict-content").style.display = "flex";

    showToast("Analysis completed successfully!", "success");

  } catch (error) {
    showToast(error.message, "error");
  } finally {
    showLoading(false);
  }
}

function displayCategoryResults(data) {
  const container = document.getElementById("result_cat");
  container.innerHTML = `
    <div class="category-badge">
      <span class="badge-label">BERT</span>
      <span class="badge-value">${data.labels.BERT}</span>
      <span class="badge-confidence">${data.confidences.BERT.toFixed(1)}%</span>
    </div>
    <div class="category-badge">
      <span class="badge-label">RoBERTa</span>
      <span class="badge-value">${data.labels.RoBERTa}</span>
      <span class="badge-confidence">${data.confidences.RoBERTa.toFixed(1)}%</span>
    </div>
    <div class="category-badge">
      <span class="badge-label">GPT-2</span>
      <span class="badge-value">${data.labels.GPT2}</span>
      <span class="badge-confidence">${data.confidences.GPT2.toFixed(1)}%</span>
    </div>
  `;
}

function displayClassificationResults(data) {
  const container = document.getElementById("result_combined");
  let html = '';

  // Get actual color values from CSS variables
  const errorColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--error-color').trim();
  const successColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--success-color').trim();

  for (const [modelName, modelData] of Object.entries(data.classification)) {
    const labelColor = modelData.label === 'AI-generated' ? errorColor : successColor;

    html += `
      <div class="model-card ${modelName}">
        <div class="model-info">
          <div class="model-name">${modelName.replace(/_/g, ' ').toUpperCase()}</div>
          <div class="model-label" style="color: ${labelColor}">
            ${modelData.label}
          </div>
        </div>
        <div class="model-confidence">
          <div class="confidence-percent">${modelData.confidence.toFixed(1)}%</div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${modelData.confidence}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  filterModels(currentTab);
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => 
    btn.classList.toggle('active', btn.onclick.toString().includes(tab))
  );
  filterModels(tab);
}

function filterModels(tab) {
  document.querySelectorAll('.model-card').forEach(card => {
    const isDeepLearning = ['bert', 'roberta', 'gpt2'].includes(card.className.split(' ')[1]);
    const showAll = tab === 'all-models';
    const showDL = tab === 'deep-learning' && isDeepLearning;
    const showTraditional = tab === 'traditional' && !isDeepLearning;
    card.style.display = showAll || showDL || showTraditional ? 'flex' : 'none';
  });
}

function showLoading(show) {
  document.getElementById("loadingOverlay").style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Add an icon based on the type
  let icon;
  switch (type) {
    case 'error': icon = '<i class="fas fa-times-circle"></i>'; break;
    case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
    case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i>'; break;
    case 'info': icon = '<i class="fas fa-info-circle"></i>'; break;
    default: icon = '';
  }

  toast.innerHTML = `${icon} ${message}`;
  document.body.appendChild(toast);

  // Trigger the fade-in animation immediately
  toast.style.animation = "fadeIn 0.3s ease-in-out";  // Apply fadeIn animation

  // Remove toast after 2.5 seconds (trigger fade-out upwards after that)
  setTimeout(() => {
    toast.style.animation = "fadeOutUp 0.5s ease-in-out forwards"; // Fade out upwards after 2.5 seconds
    setTimeout(() => toast.remove(), 500); // Remove the toast after fade-out animation ends
  }, 5000); // Ensure the toast stays visible for 2.5s before starting to fade out
}

// Character counter
document.addEventListener("DOMContentLoaded", function () {
  // Character counter
  document.getElementById("inputText").addEventListener("input", function (e) {
    const charCountElement = document.getElementById("charCount");
    if (charCountElement) {
      charCountElement.textContent = e.target.value.length;
    }
  });

  // Other JavaScript code...
});

function displayFinalVerdict(data) {
  const container = document.getElementById("final_verdict");
  const errorColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--error-color').trim();
  const successColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--success-color').trim();
  const verdictColor = data.final_verdict.verdict === 'AI-generated' ? errorColor : successColor;

  container.innerHTML = `
    <div class="verdict-row">
      <span class="verdict-label">Category:</span>
      <span class="verdict-value">${data.final_verdict.category} (${data.final_verdict.category_confidence.toFixed(1)}%)</span>
    </div>
    <div class="verdict-row">
      <span class="verdict-label">Verdict:</span>
      <span class="verdict-value" style="color: ${verdictColor}">
        ${data.final_verdict.verdict} (${data.final_verdict.ai_percentage.toFixed(1)}%)
      </span>
    </div>
  `;
}