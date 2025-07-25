// Global Variables
let currentSlide = 0;
let currentQuizQuestion = 0;
let quizScore = 0;
let quizQuestions = [
    {
        question: "What is the primary goal of Explainable AI?",
        options: ["Increase AI speed", "Make AI decisions understandable", "Reduce AI costs"],
        correct: 1
    },
    {
        question: "Which country was first to implement comprehensive AI regulation?",
        options: ["United States", "China", "European Union"],
        correct: 2
    },
    {
        question: "What does AGI stand for?",
        options: ["Advanced General Intelligence", "Artificial General Intelligence", "Automated General Intelligence"],
        correct: 1
    },
    {
        question: "Which Canadian city is NOT a major AI hub?",
        options: ["Toronto", "Montreal", "Vancouver"],
        correct: 2
    },
    {
        question: "What is the main concern with algorithmic bias?",
        options: ["Slow processing", "Perpetuating societal inequalities", "High costs"],
        correct: 1
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCounterAnimations();
    setupEventListeners();
    initializeProgressBars();
});

// Initialize Animations
function initializeAnimations() {
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observe elements with fade-in animation
    const animatedElements = document.querySelectorAll('.stat-card, .nav-card, .ai-type-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize Counter Animations
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('#countries-count, #investment-count, #companies-count');
    counters.forEach(counter => {
        counter.style.opacity = '0';
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add click sound to buttons
    document.querySelectorAll('button, .nav-card, .stat-card').forEach(element => {
        element.addEventListener('click', playClickSound);
    });
}

// Initialize Progress Bars
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    });

    progressBars.forEach(bar => observer.observe(bar));
}

// Sound Functions
function playWelcomeSound() {
    // Create audio context for welcome sound
    if (typeof(AudioContext) !== "undefined" || typeof(webkitAudioContext) !== "undefined") {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // Scroll to next section
    const nextSection = document.querySelector('.overview-section');
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function playClickSound() {
    // Simple click sound
    if (typeof(AudioContext) !== "undefined" || typeof(webkitAudioContext) !== "undefined") {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Counter Animation Functions
function updateCounter(element, targetValue) {
    const counter = element.querySelector('h3') || element.querySelector('span');
    if (!counter) return;
    
    const start = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(progress * targetValue);
        
        if (targetValue === 2.6) {
            counter.textContent = currentValue.toFixed(1);
        } else {
            counter.textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Navigation Functions
function navigateToPage(page) {
    window.location.href = page;
}

// Quiz Functions
function checkAnswer(button, isCorrect) {
    const buttons = button.parentElement.querySelectorAll('.quiz-btn');
    const resultDiv = document.getElementById('quiz-result');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn === button) {
            if (isCorrect) {
                btn.classList.add('correct');
                resultDiv.innerHTML = '<p style="color: #28a745; font-weight: bold;">✓ Correct! Great job!</p>';
            } else {
                btn.classList.add('incorrect');
                resultDiv.innerHTML = '<p style="color: #dc3545; font-weight: bold;">✗ Incorrect. The correct answer is "Artificial Intelligence".</p>';
            }
        } else if (isCorrect && btn.textContent.includes('Artificial Intelligence')) {
            btn.classList.add('correct');
        }
    });
    
    setTimeout(() => {
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
        resultDiv.innerHTML = '';
        
        // Load next question or reset
        const questions = [
            {
                question: "Which technology enables machines to understand human language?",
                options: ["Computer Vision", "Natural Language Processing", "Robotics"],
                correct: 1
            },
            {
                question: "What is machine learning?",
                options: ["Programming robots", "Algorithms that improve through experience", "Building computers"],
                correct: 1
            }
        ];
        
        // Cycle through questions
        const currentQuestion = Math.floor(Math.random() * questions.length);
        const questionData = questions[currentQuestion];
        
        document.getElementById('quiz-question').innerHTML = `<p>${questionData.question}</p>`;
        buttons.forEach((btn, index) => {
            btn.textContent = questionData.options[index];
            btn.onclick = () => checkAnswer(btn, index === questionData.correct);
        });
    }, 2000);
}

// Global Trends Page Functions
function showCountryInfo(country) {
    // Hide all country info
    document.querySelectorAll('.country-info').forEach(info => {
        info.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.country-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected country info
    const countryInfo = document.getElementById(`${country}-info`);
    if (countryInfo) {
        countryInfo.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Animate progress bars
    setTimeout(() => {
        const progressBars = countryInfo.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.classList.contains('usa-progress') ? '85%' :
                          bar.classList.contains('china-progress') ? '60%' : '45%';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 300);
}

function showTimelineDetails(year) {
    const detailsDiv = document.getElementById('timeline-details');
    const details = {
        '2018': {
            title: 'China\'s AI Development Plan',
            content: 'China announced its ambitious plan to become the world leader in AI by 2030, with massive government investment and strategic initiatives across all sectors.'
        },
        '2020': {
            title: 'GPT-3 Revolution',
            content: 'OpenAI released GPT-3, demonstrating unprecedented natural language capabilities and sparking global interest in large language models.'
        },
        '2022': {
            title: 'ChatGPT Goes Viral',
            content: 'ChatGPT reached 100 million users in just 2 months, making AI accessible to the general public and transforming how people interact with technology.'
        },
        '2024': {
            title: 'EU AI Act Implementation',
            content: 'The European Union\'s AI Act came into effect, establishing the world\'s first comprehensive legal framework for artificial intelligence regulation.'
        }
    };
    
    const detail = details[year];
    if (detail) {
        detailsDiv.innerHTML = `
            <h4>${detail.title}</h4>
            <p>${detail.content}</p>
        `;
        detailsDiv.classList.add('active');
        detailsDiv.style.display = 'block';
    }
}

function checkGlobalAnswer(button, isCorrect) {
    const buttons = button.parentElement.querySelectorAll('.quiz-btn');
    const resultDiv = document.getElementById('global-quiz-result');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn === button) {
            if (isCorrect) {
                btn.classList.add('correct');
                resultDiv.innerHTML = '<p style="color: #28a745; font-weight: bold;">✓ Correct! China leads in AI patent filings globally.</p>';
            } else {
                btn.classList.add('incorrect');
                resultDiv.innerHTML = '<p style="color: #dc3545; font-weight: bold;">✗ Incorrect. China currently leads in AI patent filings.</p>';
            }
        }
    });
    
    setTimeout(() => {
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
        resultDiv.innerHTML = '';
    }, 3000);
}

// Canada Page Functions
function showInstituteDetails(institute) {
    const detailsDiv = document.getElementById('institute-details');
    const titleDiv = document.getElementById('details-title');
    const descDiv = document.getElementById('details-description');
    const statsDiv = document.getElementById('details-stats');
    
    const institutes = {
        'vector': {
            title: 'Vector Institute',
            description: 'The Vector Institute is an independent, not-for-profit research institution dedicated to advancing artificial intelligence, excelling in machine learning and deep learning. Located in Toronto, it bridges the gap between academic research and industry application.',
            stats: [
                { label: 'Founded', value: '2017' },
                { label: 'Researchers', value: '500+' },
                { label: 'Industry Partners', value: '30+' },
                { label: 'Focus', value: 'Deep Learning' }
            ]
        },
        'mila': {
            title: 'Mila - Quebec AI Institute',
            description: 'Mila is a research institute in artificial intelligence which rallies researchers specialized in machine learning. Founded by Yoshua Bengio, it is recognized globally for its contributions to deep learning and neural networks.',
            stats: [
                { label: 'Founded', value: '1993' },
                { label: 'Researchers', value: '800+' },
                { label: 'Publications', value: '2000+' },
                { label: 'Focus', value: 'Machine Learning' }
            ]
        },
        'amii': {
            title: 'Alberta Machine Intelligence Institute',
            description: 'AMII is one of Canada\'s national AI institutes, conducting world-class research in machine intelligence and reinforcement learning. Based in Edmonton, it focuses on advancing AI through research, talent development, and industry partnerships.',
            stats: [
                { label: 'Founded', value: '2002' },
                { label: 'Faculty', value: '40+' },
                { label: 'Students', value: '200+' },
                { label: 'Focus', value: 'Reinforcement Learning' }
            ]
        },
        'cifar': {
            title: 'Canadian Institute for Advanced Research',
            description: 'CIFAR is a Canadian-based global research organization that brings together extraordinary minds to address the most important questions facing science and humanity. It played a crucial role in the AI renaissance through its Learning in Machines & Brains program.',
            stats: [
                { label: 'Founded', value: '1982' },
                { label: 'Global Fellows', value: '400+' },
                { label: 'Research Programs', value: '18' },
                { label: 'Focus', value: 'Interdisciplinary Research' }
            ]
        }
    };
    
    const instituteData = institutes[institute];
    if (instituteData) {
        titleDiv.textContent = instituteData.title;
        descDiv.textContent = instituteData.description;
        
        statsDiv.innerHTML = instituteData.stats.map(stat => `
            <div>
                <strong>${stat.label}:</strong><br>
                ${stat.value}
            </div>
        `).join('');
        
        detailsDiv.style.display = 'block';
        detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.company-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function previousSlide() {
    const slides = document.querySelectorAll('.company-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function showApplicationDetails(application) {
    const applications = {
        'healthcare': {
            title: 'AI in Healthcare',
            description: 'Artificial Intelligence is revolutionizing healthcare through medical imaging analysis, drug discovery acceleration, patient monitoring systems, and personalized treatment plans.',
            examples: [
                'Medical imaging analysis for cancer detection',
                'Drug discovery and development acceleration',
                'Personalized treatment recommendations',
                'Patient monitoring and early warning systems'
            ]
        },
        'finance': {
            title: 'AI in Finance',
            description: 'The financial sector leverages AI for fraud detection, algorithmic trading, risk assessment, customer service automation, and regulatory compliance.',
            examples: [
                'Real-time fraud detection systems',
                'Algorithmic trading and portfolio management',
                'Credit risk assessment and loan approval',
                'Automated customer service chatbots'
            ]
        }
    };
    
    const appData = applications[application];
    if (appData) {
        alert(`${appData.title}\n\n${appData.description}\n\nKey Applications:\n${appData.examples.map(ex => `• ${ex}`).join('\n')}`);
    }
}

// Future & Ethics Page Functions
function showPredictionDetails(year) {
    const detailsDiv = document.getElementById('prediction-details');
    const titleDiv = document.getElementById('prediction-title');
    const descDiv = document.getElementById('prediction-description');
    const implicationsDiv = document.getElementById('prediction-implications');
    
    const predictions = {
        '2025': {
            title: 'Autonomous Vehicles Mainstream (2025)',
            description: 'Self-driving cars become common in major cities worldwide, with regulatory frameworks established and public acceptance growing.',
            implications: [
                'Reduced traffic accidents and fatalities',
                'New business models in transportation',
                'Job displacement for professional drivers',
                'Infrastructure adaptation requirements'
            ]
        },
        '2027': {
            title: 'AI Medical Diagnosis (2027)',
            description: 'AI systems achieve human-level accuracy in medical diagnosis across multiple specialties, becoming standard healthcare tools.',
            implications: [
                'Improved diagnostic accuracy and speed',
                'Better healthcare access in remote areas',
                'Changes in medical education and training',
                'Regulatory and liability considerations'
            ]
        },
        '2030': {
            title: 'General AI Emergence (2030)',
            description: 'First true Artificial General Intelligence systems are demonstrated, capable of human-level performance across diverse tasks.',
            implications: [
                'Potential acceleration of scientific discovery',
                'Significant economic and social disruption',
                'New governance and safety challenges',
                'Transformation of human-AI relationships'
            ]
        },
        '2032': {
            title: 'AI-Human Collaboration (2032)',
            description: 'Most knowledge workers collaborate with AI systems daily, fundamentally changing how work is performed.',
            implications: [
                'Increased productivity and creativity',
                'New skill requirements for workers',
                'Evolution of workplace structures',
                'Enhanced human capabilities through AI'
            ]
        },
        '2035': {
            title: 'Quantum-AI Integration (2035)',
            description: 'Quantum computing revolutionizes AI capabilities, enabling breakthroughs in optimization and simulation.',
            implications: [
                'Exponential improvements in AI performance',
                'New applications in drug discovery and materials',
                'Advances in cryptography and security',
                'Transformation of scientific research methods'
            ]
        }
    };
    
    const prediction = predictions[year];
    if (prediction) {
        titleDiv.textContent = prediction.title;
        descDiv.textContent = prediction.description;
        
        implicationsDiv.innerHTML = `
            <h4>Key Implications:</h4>
            <ul>
                ${prediction.implications.map(imp => `<li>${imp}</li>`).join('')}
            </ul>
        `;
        
        detailsDiv.style.display = 'block';
        detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showTech(tech) {
    // Hide all tech content
    document.querySelectorAll('.tech-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tech-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tech content
    const techContent = document.getElementById(tech);
    if (techContent) {
        techContent.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

function showEthicsDetails(concern) {
    const detailsDiv = document.getElementById('ethics-details');
    const titleDiv = document.getElementById('ethics-title');
    const descDiv = document.getElementById('ethics-description');
    const solutionsDiv = document.getElementById('ethics-solutions');
    const examplesDiv = document.getElementById('ethics-examples');
    
    const concerns = {
        'bias': {
            title: 'Algorithmic Bias',
            description: 'AI systems can perpetuate or amplify existing societal biases present in training data, leading to unfair treatment of certain groups.',
            solutions: [
                'Diverse and representative training datasets',
                'Bias detection and mitigation techniques',
                'Regular algorithm auditing and testing',
                'Inclusive development teams and processes'
            ],
            examples: [
                'Facial recognition systems with higher error rates for certain ethnicities',
                'Hiring algorithms that discriminate against women',
                'Criminal justice algorithms showing racial bias'
            ]
        },
        'privacy': {
            title: 'Privacy Concerns',
            description: 'AI systems often require vast amounts of personal data, raising concerns about privacy, consent, and data protection.',
            solutions: [
                'Privacy-preserving AI techniques',
                'Strong data governance frameworks',
                'User consent and transparency mechanisms',
                'Data minimization principles'
            ],
            examples: [
                'Facial recognition in public spaces',
                'Personal data collection by smart devices',
                'Location tracking and behavior analysis'
            ]
        },
        'employment': {
            title: 'Job Displacement',
            description: 'Automation through AI threatens to displace workers across various industries, potentially leading to unemployment and economic inequality.',
            solutions: [
                'Retraining and reskilling programs',
                'Universal basic income consideration',
                'New job creation in AI-related fields',
                'Gradual transition planning'
            ],
            examples: [
                'Manufacturing automation',
                'Customer service chatbots',
                'Automated financial analysis'
            ]
        },
        'transparency': {
            title: 'Lack of Transparency',
            description: 'Many AI systems operate as "black boxes," making decisions through processes that are difficult to understand or explain.',
            solutions: [
                'Explainable AI development',
                'Transparent decision-making processes',
                'Clear documentation and audit trails',
                'Regulatory requirements for transparency'
            ],
            examples: [
                'Deep learning neural networks',
                'Complex recommendation algorithms',
                'Automated decision systems in finance'
            ]
        },
        'accountability': {
            title: 'Accountability Issues',
            description: 'Determining responsibility for AI decisions and actions remains challenging, especially when systems make autonomous choices.',
            solutions: [
                'Clear accountability frameworks',
                'Human oversight requirements',
                'Liability and insurance mechanisms',
                'Regulatory compliance standards'
            ],
            examples: [
                'Autonomous vehicle accidents',
                'Medical AI misdiagnosis',
                'Financial AI trading losses'
            ]
        },
        'security': {
            title: 'Security Risks',
            description: 'AI systems are vulnerable to various attacks and can be misused for malicious purposes, posing significant security risks.',
            solutions: [
                'Robust security by design',
                'Regular security auditing',
                'Adversarial training techniques',
                'International cooperation on AI security'
            ],
            examples: [
                'Adversarial attacks on AI systems',
                'Deepfake technology misuse',
                'AI-powered cyber attacks'
            ]
        }
    };
    
    const concernData = concerns[concern];
    if (concernData) {
        titleDiv.textContent = concernData.title;
        descDiv.textContent = concernData.description;
        
        solutionsDiv.innerHTML = `
            <h4>Potential Solutions:</h4>
            <ul>
                ${concernData.solutions.map(solution => `<li>${solution}</li>`).join('')}
            </ul>
        `;
        
        examplesDiv.innerHTML = `
            <h4>Real-world Examples:</h4>
            <ul>
                ${concernData.examples.map(example => `<li>${example}</li>`).join('')}
            </ul>
        `;
        
        detailsDiv.style.display = 'block';
        detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateImpactAssessment() {
    const sectorSelect = document.getElementById('sector-select');
    const selectedSector = sectorSelect.value;
    
    if (selectedSector) {
        // Enable sliders
        document.getElementById('job-impact').disabled = false;
        document.getElementById('efficiency-gain').disabled = false;
        document.getElementById('ethical-risk').disabled = false;
        
        // Update assessment based on sector
        updateAssessment();
    }
}

function updateAssessment() {
    const jobValue = document.getElementById('job-impact').value;
    const efficiencyValue = document.getElementById('efficiency-gain').value;
    const ethicalValue = document.getElementById('ethical-risk').value;
    
    document.getElementById('job-value').textContent = jobValue;
    document.getElementById('efficiency-value').textContent = efficiencyValue;
    document.getElementById('ethical-value').textContent = ethicalValue;
}

function generateAssessment() {
    const sector = document.getElementById('sector-select').value;
    const jobImpact = parseInt(document.getElementById('job-impact').value);
    const efficiencyGain = parseInt(document.getElementById('efficiency-gain').value);
    const ethicalRisk = parseInt(document.getElementById('ethical-risk').value);
    
    if (!sector) {
        alert('Please select an industry first.');
        return;
    }
    
    const resultsDiv = document.getElementById('assessment-results');
    const vizDiv = document.getElementById('impact-visualization');
    
    // Calculate overall impact score
    const overallScore = (efficiencyGain + (10 - jobImpact) + (10 - ethicalRisk)) / 3;
    
    let impactLevel, impactColor, recommendation;
    
    if (overallScore >= 7) {
        impactLevel = 'High Positive Impact';
        impactColor = '#28a745';
        recommendation = 'Strong candidate for AI implementation with proper safeguards.';
    } else if (overallScore >= 5) {
        impactLevel = 'Moderate Impact';
        impactColor = '#ffc107';
        recommendation = 'Proceed with caution and continuous monitoring.';
    } else {
        impactLevel = 'High Risk';
        impactColor = '#dc3545';
        recommendation = 'Requires significant risk mitigation before implementation.';
    }
    
    resultsDiv.innerHTML = `
        <h4>Assessment Results for ${sector.charAt(0).toUpperCase() + sector.slice(1)}</h4>
        <div style="background: ${impactColor}; color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
            <strong>${impactLevel}</strong><br>
            Overall Score: ${overallScore.toFixed(1)}/10
        </div>
        <p><strong>Recommendation:</strong> ${recommendation}</p>
        
        <div style="margin-top: 1.5rem;">
            <h5>Factor Breakdown:</h5>
            <div style="margin: 0.5rem 0;"><strong>Job Impact Risk:</strong> ${jobImpact}/10</div>
            <div style="margin: 0.5rem 0;"><strong>Efficiency Potential:</strong> ${efficiencyGain}/10</div>
            <div style="margin: 0.5rem 0;"><strong>Ethical Risk:</strong> ${ethicalRisk}/10</div>
        </div>
    `;
    
    // Create simple visualization
    vizDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: ${impactColor}; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                ${overallScore.toFixed(1)}
            </div>
            <p style="margin-top: 1rem; font-weight: bold;">${impactLevel}</p>
        </div>
    `;
}

function showScenario(scenario) {
    // Hide all scenario content
    document.querySelectorAll('.scenario-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.scenario-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected scenario content
    const scenarioContent = document.getElementById(scenario);
    if (scenarioContent) {
        scenarioContent.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Final Quiz Functions
function checkFinalAnswer(button, isCorrect) {
    const buttons = button.parentElement.querySelectorAll('.quiz-btn');
    const resultDiv = document.getElementById('final-quiz-result');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn === button) {
            if (isCorrect) {
                btn.classList.add('correct');
                resultDiv.innerHTML = '<p style="color: #28a745; font-weight: bold;">✓ Correct!</p>';
                quizScore++;
            } else {
                btn.classList.add('incorrect');
                resultDiv.innerHTML = '<p style="color: #dc3545; font-weight: bold;">✗ Incorrect.</p>';
            }
        }
    });
    
    setTimeout(() => {
        currentQuizQuestion++;
        if (currentQuizQuestion < quizQuestions.length) {
            loadNextQuestion();
        } else {
            showQuizCompletion();
        }
    }, 1500);
}

function loadNextQuestion() {
    const questionData = quizQuestions[currentQuizQuestion];
    const questionDiv = document.getElementById('final-question');
    const optionsDiv = document.querySelector('.quiz-options');
    const resultDiv = document.getElementById('final-quiz-result');
    const progressFill = document.getElementById('progress-fill');
    const questionCounter = document.getElementById('question-counter');
    
    // Update question
    questionDiv.textContent = questionData.question;
    
    // Update options
    const buttons = optionsDiv.querySelectorAll('.quiz-btn');
    buttons.forEach((btn, index) => {
        btn.textContent = questionData.options[index];
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
        btn.onclick = () => checkFinalAnswer(btn, index === questionData.correct);
    });
    
    // Clear result
    resultDiv.innerHTML = '';
    
    // Update progress
    const progress = ((currentQuizQuestion + 1) / quizQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    questionCounter.textContent = `Question ${currentQuizQuestion + 1} of ${quizQuestions.length}`;
}

function showQuizCompletion() {
    const quizContent = document.getElementById('final-quiz-content');
    const completionDiv = document.getElementById('quiz-completion');
    const scoreSpan = document.getElementById('final-score');
    
    quizContent.style.display = 'none';
    completionDiv.style.display = 'block';
    scoreSpan.textContent = quizScore;
}

function restartQuiz() {
    currentQuizQuestion = 0;
    quizScore = 0;
    
    const quizContent = document.getElementById('final-quiz-content');
    const completionDiv = document.getElementById('quiz-completion');
    const progressFill = document.getElementById('progress-fill');
    
    quizContent.style.display = 'block';
    completionDiv.style.display = 'none';
    progressFill.style.width = '20%';
    
    loadNextQuestion();
}

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize final quiz if on future page
    if (document.getElementById('final-quiz-content')) {
        loadNextQuestion();
    }
    
    // Auto-advance company slider
    if (document.querySelector('.company-slider')) {
        setInterval(() => {
            nextSlide();
        }, 5000);
    }
});