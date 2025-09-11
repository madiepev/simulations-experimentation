// Exercise State Management
let currentPhase = 0;
let exerciseState = {
    phase1: {
        requirementsCompleted: false,
        reflectionCompleted: false
    },
    phase2: {
        dataSelectionCompleted: false,
        qualityChecklistCompleted: false
    },
    phase3: {
        stepOrderingCompleted: false
    },
    phase4: {
        decisionCompleted: false
    }
};

// Initialize the exercise
document.addEventListener('DOMContentLoaded', function() {
    initializeExercise();
});

function initializeExercise() {
    console.log('Initializing exercise...');
    updateProgressBar();
    setupEventListeners();
    showPhase(0);
    
    // Add debug info for Phase 1
    setTimeout(() => {
        const checkboxes = document.querySelectorAll('#requirements-checklist input[type="checkbox"]');
        const issuesSelect = document.getElementById('issues-question');
        const improvementText = document.getElementById('improvement-text');
        const nextButton = document.getElementById('phase1-next');
        
        console.log('Phase 1 elements found:', {
            checkboxes: checkboxes.length,
            issuesSelect: !!issuesSelect,
            improvementText: !!improvementText,
            nextButton: !!nextButton
        });
    }, 1000);
}

function setupEventListeners() {
    // Phase 1 - Requirements checklist
    const requirementsCheckboxes = document.querySelectorAll('#requirements-checklist input[type="checkbox"]');
    requirementsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkPhase1Requirements);
    });

    // Phase 1 - Reflection questions
    const issuesSelect = document.getElementById('issues-question');
    const improvementText = document.getElementById('improvement-text');
    
    if (issuesSelect) {
        issuesSelect.addEventListener('change', checkPhase1Reflection);
    }
    
    if (improvementText) {
        improvementText.addEventListener('input', checkPhase1Reflection);
    }

    // Phase 2 - Data selection drag and drop
    setupDataSelectionDragDrop();

    // Phase 2 - Quality checklist
    const qualityCheckboxes = document.querySelectorAll('#quality-checklist input[type="checkbox"]');
    qualityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkPhase2Quality);
    });

    // Phase 3 - Step ordering drag and drop
    setupStepOrderingDragDrop();

    // Phase 4 - Decision making
    const decisionSelect = document.getElementById('decision-question');
    const decisionJustification = document.getElementById('decision-justification');
    
    if (decisionSelect) {
        decisionSelect.addEventListener('change', checkPhase4Decision);
    }
    
    if (decisionJustification) {
        decisionJustification.addEventListener('input', checkPhase4Decision);
    }
}

// Progress Management
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const indicators = document.querySelectorAll('.phase-indicator');
    
    const progressPercentage = (currentPhase / 4) * 100;
    progressFill.style.width = progressPercentage + '%';
    
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        if (index < currentPhase) {
            indicator.classList.add('completed');
        } else if (index === currentPhase) {
            indicator.classList.add('active');
        }
    });
}

function showPhase(phaseNumber) {
    // Hide all phases
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('active');
    });
    
    // Show target phase
    const targetPhase = document.getElementById(`phase-${phaseNumber}`);
    if (targetPhase) {
        targetPhase.classList.add('active');
    }
    
    currentPhase = phaseNumber;
    updateProgressBar();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPhase(phaseNumber) {
    showPhase(phaseNumber);
}

// Start Exercise
function startExercise() {
    showPhase(1);
}

// Phase 1 Functions
function checkPhase1Requirements() {
    const checkboxes = document.querySelectorAll('#requirements-checklist input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('#requirements-checklist input[type="checkbox"]:checked');
    
    console.log('Requirements check:', {
        totalCheckboxes: checkboxes.length,
        checkedBoxes: checkedBoxes.length
    });
    
    exerciseState.phase1.requirementsCompleted = checkedBoxes.length === checkboxes.length && checkboxes.length > 0;
    updatePhase1Progress();
}

function checkPhase1Reflection() {
    const issuesAnswer = document.getElementById('issues-question').value;
    const improvementText = document.getElementById('improvement-text').value.trim();
    
    console.log('Reflection check:', {
        issuesAnswer: issuesAnswer,
        improvementTextLength: improvementText.length,
        isCorrectAnswer: issuesAnswer === 'correct',
        hasEnoughText: improvementText.length > 10
    });
    
    exerciseState.phase1.reflectionCompleted = issuesAnswer === 'correct' && improvementText.length > 10;
    updatePhase1Progress();
}

function updatePhase1Progress() {
    const nextButton = document.getElementById('phase1-next');
    const canProceed = exerciseState.phase1.requirementsCompleted && exerciseState.phase1.reflectionCompleted;
    
    console.log('Phase 1 Progress Check:', {
        requirementsCompleted: exerciseState.phase1.requirementsCompleted,
        reflectionCompleted: exerciseState.phase1.reflectionCompleted,
        canProceed: canProceed
    });
    
    if (nextButton) {
        nextButton.disabled = !canProceed;
        
        if (canProceed) {
            nextButton.classList.add('pulse');
        } else {
            nextButton.classList.remove('pulse');
        }
    }
}

function completePhase1() {
    if (exerciseState.phase1.requirementsCompleted && exerciseState.phase1.reflectionCompleted) {
        showPhase(2);
    }
}

// Phase 2 Functions
function setupDataSelectionDragDrop() {
    const draggableItems = document.querySelectorAll('.example-item.draggable');
    const dropzone = document.getElementById('training-set');
    
    draggableItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('drop', handleDrop);
    dropzone.addEventListener('dragenter', handleDragEnter);
    dropzone.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.quality);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const quality = e.dataTransfer.getData('text/plain');
    const feedbackElement = document.getElementById('selection-feedback');
    
    if (quality === 'good') {
        feedbackElement.innerHTML = '<div class="feedback-message success">✓ Excellent choice! This example demonstrates good politeness and helpfulness.</div>';
        exerciseState.phase2.dataSelectionCompleted = true;
    } else {
        feedbackElement.innerHTML = '<div class="feedback-message error">❌ This example lacks the politeness and detail we need. Try selecting a different example.</div>';
        exerciseState.phase2.dataSelectionCompleted = false;
    }
    
    updatePhase2Progress();
}

function checkPhase2Quality() {
    const checkboxes = document.querySelectorAll('#quality-checklist input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('#quality-checklist input[type="checkbox"]:checked');
    
    exerciseState.phase2.qualityChecklistCompleted = checkedBoxes.length === checkboxes.length;
    updatePhase2Progress();
}

function updatePhase2Progress() {
    const nextButton = document.getElementById('phase2-next');
    const canProceed = exerciseState.phase2.dataSelectionCompleted && exerciseState.phase2.qualityChecklistCompleted;
    
    nextButton.disabled = !canProceed;
}

function completePhase2() {
    if (exerciseState.phase2.dataSelectionCompleted && exerciseState.phase2.qualityChecklistCompleted) {
        showPhase(3);
    }
}

// Phase 3 Functions
function setupStepOrderingDragDrop() {
    const stepItems = document.querySelectorAll('.step-item.draggable');
    const orderSlots = document.querySelectorAll('.order-slot');
    const availableStepsContainer = document.getElementById('available-steps');
    
    stepItems.forEach(item => {
        item.addEventListener('dragstart', handleStepDragStart);
        item.addEventListener('dragend', handleStepDragEnd);
    });
    
    orderSlots.forEach(slot => {
        slot.addEventListener('dragover', handleSlotDragOver);
        slot.addEventListener('drop', handleSlotDrop);
        slot.addEventListener('dragenter', handleSlotDragEnter);
        slot.addEventListener('dragleave', handleSlotDragLeave);
        
        // Add click to remove functionality
        slot.addEventListener('click', handleSlotClick);
    });
    
    // Make available steps area a drop zone too
    if (availableStepsContainer) {
        availableStepsContainer.addEventListener('dragover', handleSlotDragOver);
        availableStepsContainer.addEventListener('drop', handleReturnToAvailable);
        availableStepsContainer.addEventListener('dragenter', handleSlotDragEnter);
        availableStepsContainer.addEventListener('dragleave', handleSlotDragLeave);
    }
}

function handleStepDragStart(e) {
    const stepText = e.target.textContent;
    const stepNumber = e.target.dataset.step;
    
    e.dataTransfer.setData('text/plain', JSON.stringify({
        step: stepNumber,
        text: stepText,
        isFromSlot: e.target.classList.contains('order-slot')
    }));
    e.target.classList.add('dragging');
}

function handleStepDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleSlotDragOver(e) {
    e.preventDefault();
}

function handleSlotDragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('order-slot') || e.target.id === 'available-steps') {
        e.target.classList.add('drag-over');
    }
}

function handleSlotDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleSlotDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    if (!e.target.classList.contains('order-slot')) return;
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const position = e.target.dataset.position;
    
    // If slot is already filled, return the existing item to available steps
    if (e.target.classList.contains('filled')) {
        returnStepToAvailable(e.target.dataset.step, e.target.textContent.replace(/^\d+\.\s*/, ''));
    }
    
    // Clear the slot and add the step
    e.target.textContent = `${position}. ${data.text}`;
    e.target.classList.add('filled');
    e.target.dataset.step = data.step;
    
    checkStepOrderCompletion();
}

function handleReturnToAvailable(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Only handle if dragging from a slot
    if (data.isFromSlot) {
        // Find and clear the original slot
        const slots = document.querySelectorAll('.order-slot');
        slots.forEach(slot => {
            if (slot.dataset.step === data.step) {
                const position = slot.dataset.position;
                slot.textContent = `${position}.`;
                slot.classList.remove('filled');
                delete slot.dataset.step;
            }
        });
        
        // Add back to available steps
        returnStepToAvailable(data.step, data.text);
        checkStepOrderCompletion();
    }
}

function handleSlotClick(e) {
    if (e.target.classList.contains('filled')) {
        const stepNumber = e.target.dataset.step;
        const stepText = e.target.textContent.replace(/^\d+\.\s*/, '');
        const position = e.target.dataset.position;
        
        // Return to available steps
        returnStepToAvailable(stepNumber, stepText);
        
        // Clear the slot
        e.target.textContent = `${position}.`;
        e.target.classList.remove('filled');
        delete e.target.dataset.step;
        
        checkStepOrderCompletion();
    }
}

function returnStepToAvailable(stepNumber, stepText) {
    const availableStepsContainer = document.querySelector('#available-steps .steps-list');
    if (availableStepsContainer) {
        const stepElement = document.createElement('div');
        stepElement.className = 'step-item draggable';
        stepElement.draggable = true;
        stepElement.dataset.step = stepNumber;
        stepElement.textContent = stepText;
        
        // Add event listeners
        stepElement.addEventListener('dragstart', handleStepDragStart);
        stepElement.addEventListener('dragend', handleStepDragEnd);
        
        availableStepsContainer.appendChild(stepElement);
    }
}

function checkStepOrderCompletion() {
    const slots = document.querySelectorAll('.order-slot');
    const filledSlots = document.querySelectorAll('.order-slot.filled');
    
    if (filledSlots.length === slots.length) {
        document.getElementById('check-order').style.display = 'inline-block';
    }
}

function checkStepOrder() {
    const slots = document.querySelectorAll('.order-slot');
    let correctOrder = true;
    let feedbackHtml = '';
    
    slots.forEach((slot, index) => {
        const expectedStep = (index + 1).toString();
        const actualStep = slot.dataset.step;
        
        slot.classList.remove('correct', 'incorrect');
        
        if (actualStep === expectedStep) {
            slot.classList.add('correct');
        } else {
            slot.classList.add('incorrect');
            correctOrder = false;
        }
    });
    
    const feedbackElement = document.getElementById('ordering-feedback');
    
    if (correctOrder) {
        feedbackHtml = '<div class="feedback-message success">🎉 Perfect! You\'ve arranged the fine-tuning steps in the correct order.</div>';
        exerciseState.phase3.stepOrderingCompleted = true;
        document.getElementById('ui-walkthrough').style.display = 'block';
        updatePhase3Progress();
    } else {
        feedbackHtml = '<div class="feedback-message error">Not quite right. Review the steps and try reordering them. Think about the logical flow from data preparation to deployment.</div>';
        exerciseState.phase3.stepOrderingCompleted = false;
    }
    
    feedbackElement.innerHTML = feedbackHtml;
}

function updatePhase3Progress() {
    const nextButton = document.getElementById('phase3-next');
    nextButton.disabled = !exerciseState.phase3.stepOrderingCompleted;
}

function completePhase3() {
    if (exerciseState.phase3.stepOrderingCompleted) {
        showPhase(4);
    }
}

// Phase 4 Functions
function checkPhase4Decision() {
    const decision = document.getElementById('decision-question').value;
    const justification = document.getElementById('decision-justification').value.trim();
    
    exerciseState.phase4.decisionCompleted = decision === 'correct' && justification.length > 20;
    updatePhase4Progress();
}

function updatePhase4Progress() {
    const completeButton = document.getElementById('phase4-complete');
    completeButton.disabled = !exerciseState.phase4.decisionCompleted;
}

function completeExercise() {
    if (exerciseState.phase4.decisionCompleted) {
        showPhase('completion');
        // Update progress to 100%
        document.getElementById('progressFill').style.width = '100%';
        
        // Mark all indicators as completed
        document.querySelectorAll('.phase-indicator').forEach(indicator => {
            indicator.classList.remove('active');
            indicator.classList.add('completed');
        });
        
        // Show completion screen
        document.getElementById('completion').style.display = 'block';
        document.getElementById('completion').classList.add('active');
    }
}

function restartExercise() {
    // Reset exercise state
    currentPhase = 0;
    exerciseState = {
        phase1: {
            requirementsCompleted: false,
            reflectionCompleted: false
        },
        phase2: {
            dataSelectionCompleted: false,
            qualityChecklistCompleted: false
        },
        phase3: {
            stepOrderingCompleted: false
        },
        phase4: {
            decisionCompleted: false
        }
    };
    
    // Reset all form elements
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    
    // Reset step ordering
    document.querySelectorAll('.order-slot').forEach(slot => {
        slot.textContent = slot.dataset.position + '.';
        slot.classList.remove('filled', 'correct', 'incorrect');
        delete slot.dataset.step;
    });
    
    // Reset buttons
    document.querySelectorAll('.nav-button.primary').forEach(btn => btn.disabled = true);
    document.getElementById('check-order').style.display = 'none';
    document.getElementById('ui-walkthrough').style.display = 'none';
    
    // Clear feedback messages
    document.querySelectorAll('.feedback-message').forEach(msg => msg.innerHTML = '');
    
    // Go back to start
    showPhase(0);
}

// Utility Functions
function showFeedback(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="feedback-message ${type}">${message}</div>`;
    }
}

// Add some visual enhancements
function addPulseEffect() {
    const style = document.createElement('style');
    style.textContent = `
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Debug function - call this from browser console if needed
function debugPhase1() {
    console.log('=== PHASE 1 DEBUG ===');
    
    const checkboxes = document.querySelectorAll('#requirements-checklist input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('#requirements-checklist input[type="checkbox"]:checked');
    const issuesSelect = document.getElementById('issues-question');
    const improvementText = document.getElementById('improvement-text');
    const nextButton = document.getElementById('phase1-next');
    
    console.log('Elements:', {
        checkboxes: checkboxes.length,
        checkedBoxes: checkedBoxes.length,
        issuesSelectValue: issuesSelect ? issuesSelect.value : 'NOT FOUND',
        improvementTextLength: improvementText ? improvementText.value.length : 'NOT FOUND',
        nextButtonDisabled: nextButton ? nextButton.disabled : 'NOT FOUND'
    });
    
    console.log('Exercise State:', exerciseState.phase1);
    
    // Force check
    checkPhase1Requirements();
    checkPhase1Reflection();
    
    return {
        checkboxes: checkboxes.length,
        checkedBoxes: checkedBoxes.length,
        state: exerciseState.phase1
    };
}

// Make debug function globally available
window.debugPhase1 = debugPhase1;

// Initialize pulse effect
document.addEventListener('DOMContentLoaded', addPulseEffect);

// Add smooth scrolling for better UX
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('nav-button') && !e.target.disabled) {
        e.target.click();
    }
});

// Add loading states for better user feedback
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        element.disabled = true;
    }
}

function hideLoading(elementId, originalText) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = originalText;
        element.disabled = false;
    }
}

// Add accessibility improvements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Screen reader only class
const srOnlyStyle = document.createElement('style');
srOnlyStyle.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(srOnlyStyle);
