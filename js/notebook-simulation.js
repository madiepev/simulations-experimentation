// Notebook Simulation JavaScript
// Handles loading and rendering of markdown-based notebook content

let cellRunCount = 0;

// Main function to load notebook content
async function loadNotebookContent(contentPath) {
    try {
        showLoading();
        
        const response = await fetch(contentPath);
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.status}`);
        }
        
        const content = await response.text();
        const parsedContent = parseNotebookContent(content);
        
        renderNotebook(parsedContent);
        hideLoading();
        
    } catch (error) {
        showError(`Error loading notebook content: ${error.message}`);
    }
}

// Parse markdown content into structured data
function parseNotebookContent(content) {
    const lines = content.split('\n');
    const cells = [];
    let currentCell = null;
    let metadata = {};
    let inMetadata = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Parse YAML front matter
        if (line === '---') {
            if (!inMetadata && i === 0) {
                inMetadata = true;
                continue;
            } else if (inMetadata) {
                inMetadata = false;
                continue;
            }
        }
        
        if (inMetadata) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                metadata[key.trim()] = valueParts.join(':').trim().replace(/"/g, '');
            }
            continue;
        }
        
        // Parse cell headers
        if (line.startsWith('## [') && line.endsWith(']')) {
            // Save previous cell if exists
            if (currentCell) {
                cells.push(currentCell);
            }
            
            const cellType = line.substring(4, line.length - 1);
            currentCell = {
                type: cellType.toLowerCase(),
                content: [],
                reflection: null
            };
            continue;
        }
        
        // Parse reflection JSON blocks
        if (currentCell && line.startsWith('```json') && 
            i + 1 < lines.length && lines[i + 1].includes('"question"')) {
            
            let jsonContent = '';
            i++; // Skip the ```json line
            
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                jsonContent += lines[i] + '\n';
                i++;
            }
            
            try {
                currentCell.reflection = JSON.parse(jsonContent);
            } catch (e) {
                console.warn('Failed to parse reflection JSON:', e);
            }
            continue;
        }
        
        // Add content to current cell
        if (currentCell) {
            currentCell.content.push(lines[i]);
        }
    }
    
    // Add last cell
    if (currentCell) {
        cells.push(currentCell);
    }
    
    return {
        metadata,
        cells
    };
}

// Render the complete notebook
function renderNotebook(parsedContent) {
    const container = document.getElementById('notebook-container');
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');
    const pageTitle = document.getElementById('notebook-title');
    
    // Update titles
    if (parsedContent.metadata.title) {
        headerTitle.textContent = parsedContent.metadata.title;
        pageTitle.textContent = parsedContent.metadata.title;
    }
    
    if (parsedContent.metadata.subtitle) {
        headerSubtitle.textContent = parsedContent.metadata.subtitle + ' • Azure AI Lab • Interactive Notebook Simulation';
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Render cells
    parsedContent.cells.forEach((cell, index) => {
        const cellElement = renderCell(cell, index + 1);
        container.appendChild(cellElement);
    });
}

// Render individual cell
function renderCell(cell, cellNumber) {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    
    const cellType = getCellDisplayType(cell.type);
    
    // Handle special cell types
    if (cell.type === 'gradient_header') {
        cellDiv.className += ' markdown-cell';
        cellDiv.innerHTML = `
            <div class="cell-header">
                <span class="cell-type markdown">Markdown</span>
                <span>In [${cellNumber}]:</span>
            </div>
            <div class="cell-content">
                <div class="gradient-header">
                    ${parseMarkdown(cell.content.join('\n'))}
                </div>
            </div>
        `;
        return cellDiv;
    }
    
    if (cell.type === 'step_navigation') {
        cellDiv.className += ' markdown-cell';
        cellDiv.innerHTML = `
            <div class="cell-header">
                <span class="cell-type markdown">Markdown</span>
                <span>In [${cellNumber}]:</span>
            </div>
            <div class="cell-content">
                ${renderStepNavigation(cell.content)}
            </div>
        `;
        return cellDiv;
    }
    
    if (cell.type === 'insight') {
        cellDiv.className += ' markdown-cell';
        cellDiv.innerHTML = `
            <div class="cell-header">
                <span class="cell-type markdown">Markdown</span>
                <span>In [${cellNumber}]:</span>
            </div>
            <div class="cell-content">
                <div class="insight-box">
                    ${parseMarkdown(cell.content.join('\n'))}
                </div>
            </div>
        `;
        return cellDiv;
    }
    
    if (cell.type === 'quote') {
        cellDiv.className += ' markdown-cell';
        cellDiv.innerHTML = `
            <div class="cell-header">
                <span class="cell-type markdown">Markdown</span>
                <span>In [${cellNumber}]:</span>
            </div>
            <div class="cell-content">
                <div class="quote-box">
                    ${parseMarkdown(cell.content.join('\n'))}
                </div>
            </div>
        `;
        return cellDiv;
    }
    
    // Standard markdown cell
    if (cell.type === 'markdown') {
        cellDiv.className += ' markdown-cell';
        cellDiv.innerHTML = `
            <div class="cell-header">
                <span class="cell-type markdown">Markdown</span>
                <span>In [${cellNumber}]:</span>
            </div>
            <div class="cell-content">
                ${parseMarkdown(cell.content.join('\n'))}
            </div>
        `;
        return cellDiv;
    }
    
    // Code cell
    if (cell.type === 'code') {
        const { code, output } = parseCodeCell(cell.content);
        const cellId = `cell-${cellNumber}`;
        
        cellDiv.className += ' code-cell';
        cellDiv.innerHTML = `
            <div class="cell-header">
                <span class="cell-type code">Code</span>
                <span>In [${cellNumber}]:</span>
            </div>
            <div class="cell-content">
                <div class="code-input">${escapeHtml(code)}</div>
                <button class="run-button" onclick="runCell(this, '${cellId}')">
                    <span>▶</span> Run
                </button>
                <div class="cell-output" id="${cellId}-output">${escapeHtml(output)}</div>
                ${cell.reflection ? renderReflection(cell.reflection, cellId) : ''}
            </div>
        `;
        return cellDiv;
    }
    
    return cellDiv;
}

// Parse code cell content to separate code from output
function parseCodeCell(content) {
    const lines = content;
    let code = '';
    let output = '';
    let inOutput = false;
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim() === '**Output:**') {
            inOutput = true;
            continue;
        }
        
        if (line.trim() === '**Reflection:**') {
            break; // Reflection is handled separately
        }
        
        if (inOutput) {
            if (line.startsWith('```') && !inCodeBlock) {
                inCodeBlock = true;
                continue;
            }
            if (line.startsWith('```') && inCodeBlock) {
                inCodeBlock = false;
                continue;
            }
            if (inCodeBlock || !line.startsWith('```')) {
                output += line + '\n';
            }
        } else {
            if (line.startsWith('```') && !inCodeBlock) {
                inCodeBlock = true;
                continue;
            }
            if (line.startsWith('```') && inCodeBlock) {
                inCodeBlock = false;
                continue;
            }
            if (inCodeBlock || !line.startsWith('```')) {
                code += line + '\n';
            }
        }
    }
    
    return {
        code: code.trim(),
        output: output.trim()
    };
}

// Render step navigation
function renderStepNavigation(content) {
    let html = '';
    
    content.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
            const stepText = trimmed.substring(2);
            const isCompleted = stepText.includes('(completed)');
            const cleanText = stepText.replace(' (completed)', '');
            
            html += `
                <div class="step-button ${isCompleted ? 'completed' : ''}">
                    ${cleanText}
                </div>
            `;
        }
    });
    
    return html;
}

// Render reflection questions
function renderReflection(reflection, cellId) {
    const reflectionId = `${cellId}-reflection`;
    
    if (reflection.type === 'multiple-choice') {
        return `
            <div class="reflection-box" id="${reflectionId}">
                <div class="reflection-title">Reflection Question</div>
                <div class="reflection-question">${reflection.question}</div>
                <div class="reflection-choices">
                    ${reflection.choices.map((choice, index) => `
                        <div class="choice-option" onclick="selectChoice('${reflectionId}', ${index}, ${choice.correct})">
                            <input type="radio" name="${reflectionId}" class="choice-radio" value="${index}">
                            <div class="choice-text">${choice.text}</div>
                        </div>
                        <div class="choice-feedback" id="${reflectionId}-feedback-${index}">
                            ${choice.feedback}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    if (reflection.type === 'true-false') {
        return `
            <div class="reflection-box" id="${reflectionId}">
                <div class="reflection-title">Reflection Question</div>
                <div class="reflection-question">${reflection.question}</div>
                <div class="reflection-choices">
                    <div class="choice-option" onclick="selectChoice('${reflectionId}', 0, ${reflection.correct === true})">
                        <input type="radio" name="${reflectionId}" class="choice-radio" value="true">
                        <div class="choice-text">True</div>
                    </div>
                    <div class="choice-feedback" id="${reflectionId}-feedback-0">
                        ${reflection.correct ? reflection.feedback.correct : reflection.feedback.incorrect}
                    </div>
                    <div class="choice-option" onclick="selectChoice('${reflectionId}', 1, ${reflection.correct === false})">
                        <input type="radio" name="${reflectionId}" class="choice-radio" value="false">
                        <div class="choice-text">False</div>
                    </div>
                    <div class="choice-feedback" id="${reflectionId}-feedback-1">
                        ${reflection.correct ? reflection.feedback.incorrect : reflection.feedback.correct}
                    </div>
                </div>
            </div>
        `;
    }
    
    return '';
}

// Handle choice selection
function selectChoice(reflectionId, choiceIndex, isCorrect) {
    const reflection = document.getElementById(reflectionId);
    const choices = reflection.querySelectorAll('.choice-option');
    const feedbacks = reflection.querySelectorAll('.choice-feedback');
    
    // Clear previous selections
    choices.forEach(choice => {
        choice.classList.remove('selected', 'correct', 'incorrect');
    });
    feedbacks.forEach(feedback => {
        feedback.classList.remove('show');
    });
    
    // Mark selected choice
    const selectedChoice = choices[choiceIndex];
    selectedChoice.classList.add('selected');
    selectedChoice.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    // Show feedback
    const feedback = document.getElementById(`${reflectionId}-feedback-${choiceIndex}`);
    feedback.classList.add('show');
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    // Check the radio button
    const radio = selectedChoice.querySelector('.choice-radio');
    radio.checked = true;
}

// Run cell simulation
function runCell(button, cellId) {
    const outputId = cellId + '-output';
    const reflectionId = cellId + '-reflection';
    const output = document.getElementById(outputId);
    const reflection = document.getElementById(reflectionId);
    
    // Update button state
    button.innerHTML = '<span class="loading-spinner"></span> Running...';
    button.classList.add('running');
    button.disabled = true;
    
    // Simulate execution delay
    setTimeout(() => {
        // Show output
        output.classList.add('show');
        
        // Reset button
        button.innerHTML = '<span>▶</span> Run';
        button.classList.remove('running');
        button.disabled = false;
        
        // Show reflection question after a brief delay
        setTimeout(() => {
            if (reflection) {
                reflection.classList.add('show');
            }
        }, 500);
        
        // Update cell counter
        cellRunCount++;
        updateNotebookStatus();
        
    }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
}

// Update notebook status
function updateNotebookStatus() {
    const statusElement = document.getElementById('status-text');
    if (cellRunCount > 0) {
        statusElement.textContent = `Cells Run: ${cellRunCount}`;
    } else {
        statusElement.textContent = 'Kernel Ready';
    }
}

// Simple markdown parser
function parseMarkdown(text) {
    return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n/g, '<br>');
}

// Get display type for cell
function getCellDisplayType(type) {
    const typeMap = {
        'markdown': 'Markdown',
        'code': 'Code',
        'gradient_header': 'Markdown',
        'step_navigation': 'Markdown',
        'insight': 'Markdown',
        'quote': 'Markdown'
    };
    return typeMap[type] || 'Markdown';
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading() {
    const container = document.getElementById('notebook-container');
    container.innerHTML = '<div class="loading">Loading notebook content...</div>';
}

function hideLoading() {
    // Loading is cleared when content is rendered
}

function showError(message) {
    const container = document.getElementById('notebook-container');
    container.innerHTML = `<div class="error">${message}</div>`;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Shift + Enter to run current cell (simplified)
    if (e.shiftKey && e.key === 'Enter') {
        const activeButton = document.querySelector('.run-button:hover');
        if (activeButton) {
            activeButton.click();
        }
    }
});
