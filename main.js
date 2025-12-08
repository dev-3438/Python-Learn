// Python Learning Platform - Main JavaScript
// Handles all interactive functionality across the platform

class PythonLearningPlatform {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.userProgress = JSON.parse(localStorage.getItem('progress')) || {};
        this.currentQuiz = null;
        this.codeEditor = null;
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupAnimations();
        this.setupProgressTracking();
        this.initializePageSpecificFeatures();
    }

    // Theme Management
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Update theme icon
        const icon = document.querySelector('#theme-icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    // Navigation Management
    setupNavigation() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
        const mobileMenu = document.querySelector('#mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Active page highlighting
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Animation Setup
    setupAnimations() {
        // Initialize Anime.js animations
        if (typeof anime !== 'undefined') {
            this.setupScrollAnimations();
            this.setupHoverAnimations();
        }

        // Initialize Typed.js for hero text
        if (typeof Typed !== 'undefined') {
            this.setupTypewriterEffect();
        }
    }

    setupScrollAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    setupHoverAnimations() {
        // Card hover effects
        document.querySelectorAll('.hover-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.05,
                    rotateY: 5,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    rotateY: 0,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });
    }

    setupTypewriterEffect() {
        const heroText = document.querySelector('#hero-typewriter');
        if (heroText) {
            new Typed('#hero-typewriter', {
                strings: [
                    'Learn Python the Smart Way',
                    'Master Python Programming',
                    'Build Amazing Projects',
                    'Start Your Coding Journey'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // Progress Tracking
    setupProgressTracking() {
        // Initialize progress from localStorage
        if (!this.userProgress.lessons) {
            this.userProgress = {
                lessons: {},
                quizzes: {},
                projects: {},
                streak: 0,
                totalTime: 0,
                achievements: []
            };
        }
        this.updateProgressDisplay();
    }

    markLessonComplete(lessonId) {
        this.userProgress.lessons[lessonId] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        this.saveProgress();
        this.updateProgressDisplay();
        this.checkAchievements();
    }

    updateQuizScore(quizId, score) {
        this.userProgress.quizzes[quizId] = {
            score: score,
            completedAt: new Date().toISOString()
        };
        this.saveProgress();
        this.updateProgressDisplay();
    }

    saveProgress() {
        localStorage.setItem('progress', JSON.stringify(this.userProgress));
    }

    updateProgressDisplay() {
        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const lessonId = bar.getAttribute('data-lesson');
            if (this.userProgress.lessons[lessonId]) {
                bar.style.width = '100%';
                bar.classList.add('completed');
            }
        });

        // Update completion checkmarks
        const checkmarks = document.querySelectorAll('.completion-check');
        checkmarks.forEach(check => {
            const lessonId = check.getAttribute('data-lesson');
            if (this.userProgress.lessons[lessonId]) {
                check.classList.add('completed');
                check.innerHTML = '✅';
            }
        });
    }

    checkAchievements() {
        const completedLessons = Object.keys(this.userProgress.lessons).length;
        const achievements = this.userProgress.achievements;

        // First lesson achievement
        if (completedLessons === 1 && !achievements.includes('first-lesson')) {
            achievements.push('first-lesson');
            this.showAchievement('First Steps', 'Completed your first lesson!');
        }

        // Streak achievements
        if (completedLessons >= 7 && !achievements.includes('week-warrior')) {
            achievements.push('week-warrior');
            this.showAchievement('Week Warrior', 'Completed 7 lessons!');
        }

        this.saveProgress();
    }

    showAchievement(title, description) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <h4>🏆 Achievement Unlocked!</h4>
                <h5>${title}</h5>
                <p>${description}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateY: [-100, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutCubic'
        });

        // Remove after 4 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateY: [0, -100],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInCubic',
                complete: () => notification.remove()
            });
        }, 4000);
    }

    // Page-specific feature initialization
    initializePageSpecificFeatures() {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch(currentPage) {
            case 'index.html':
            case '':
                this.initHomePage();
                break;
            case 'course.html':
                this.initCoursePage();
                break;
            case 'playground.html':
                this.initPlaygroundPage();
                break;
            case 'quiz.html':
                this.initQuizPage();
                break;
            case 'projects.html':
                this.initProjectsPage();
                break;
            case 'dashboard.html':
                this.initDashboardPage();
                break;
        }
    }

    // Home Page Features
    initHomePage() {
        this.setupTestimonialCarousel();
        this.setupStatsCounters();
    }

    setupTestimonialCarousel() {
        const testimonials = document.querySelectorAll('.testimonial');
        let currentIndex = 0;

        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        };

        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000);

        showTestimonial(0);
    }

    setupStatsCounters() {
        const counters = document.querySelectorAll('.stat-counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Course Page Features
    initCoursePage() {
        this.setupChapterNavigation();
        this.setupLessonExpansion();
    }

    setupChapterNavigation() {
        const chapters = document.querySelectorAll('.chapter');
        chapters.forEach(chapter => {
            const header = chapter.querySelector('.chapter-header');
            const content = chapter.querySelector('.chapter-content');

            header.addEventListener('click', () => {
                const isExpanded = chapter.classList.contains('expanded');
                
                // Close all other chapters
                chapters.forEach(c => c.classList.remove('expanded'));
                
                // Toggle current chapter
                if (!isExpanded) {
                    chapter.classList.add('expanded');
                }
            });
        });
    }

    setupLessonExpansion() {
        const lessons = document.querySelectorAll('.lesson-item');
        lessons.forEach(lesson => {
            lesson.addEventListener('click', () => {
                const content = lesson.querySelector('.lesson-content');
                if (content) {
                    content.classList.toggle('hidden');
                }
            });
        });
    }

    // Playground Page Features
    initPlaygroundPage() {
        this.setupCodeEditor();
        this.setupCodeExecution();
    }

    setupCodeEditor() {
        const editorElement = document.querySelector('#code-editor');
        if (editorElement) {
            // Simple code editor implementation
            this.codeEditor = {
                element: editorElement,
                getValue: () => editorElement.value,
                setValue: (code) => editorElement.value = code
            };

            // Syntax highlighting simulation
            editorElement.addEventListener('input', () => {
                this.highlightSyntax();
            });
        }
    }

    setupCodeExecution() {
        const runButton = document.querySelector('#run-code');
        const output = document.querySelector('#code-output');

        if (runButton && output) {
            runButton.addEventListener('click', () => {
                this.executeCode();
            });
        }
    }

    executeCode() {
        const code = this.codeEditor.getValue();
        const output = document.querySelector('#code-output');
        
        try {
            // Simulate Python execution with JavaScript
            const result = this.simulatePythonExecution(code);
            output.innerHTML = `<pre class="text-green-400">${result}</pre>`;
        } catch (error) {
            output.innerHTML = `<pre class="text-red-400">Error: ${error.message}</pre>`;
        }
    }

    simulatePythonExecution(code) {
        // Basic Python-to-JavaScript simulation
        let jsCode = code
            .replace(/print\(/g, 'console.log(')
            .replace(/input\(/g, 'prompt(')
            .replace(/def /g, 'function ')
            .replace(/:/g, ' {')
            .replace(/\belif\b/g, 'else if')
            .replace(/\bNone\b/g, 'null')
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false');

        // Simple evaluation for basic expressions
        if (code.includes('print(')) {
            const match = code.match(/print\((.+)\)/);
            if (match) {
                return eval(match[1]).toString();
            }
        }

        return "Code executed successfully!";
    }

    highlightSyntax() {
        // Basic syntax highlighting
        const editor = this.codeEditor.element;
        // Implementation would add syntax highlighting classes
    }

    // Quiz Page Features
    initQuizPage() {
        this.loadQuizQuestions();
        this.setupQuizInterface();
    }

    loadQuizQuestions() {
        // Sample quiz questions
        this.quizQuestions = [
            {
                id: 1,
                question: "What is the correct way to create a variable in Python?",
                options: [
                    "var x = 5",
                    "x = 5",
                    "int x = 5",
                    "create x = 5"
                ],
                correct: 1,
                explanation: "In Python, you create variables by simply assigning a value: x = 5"
            },
            {
                id: 2,
                question: "Which function is used to get user input in Python?",
                options: [
                    "get()",
                    "input()",
                    "read()",
                    "scan()"
                ],
                correct: 1,
                explanation: "The input() function is used to get user input in Python 3."
            }
        ];
    }

    setupQuizInterface() {
        this.currentQuiz = {
            questions: this.quizQuestions,
            currentQuestion: 0,
            score: 0,
            answers: []
        };

        this.displayQuestion();
    }

    displayQuestion() {
        const quiz = this.currentQuiz;
        const question = quiz.questions[quiz.currentQuestion];
        
        const questionContainer = document.querySelector('#quiz-question');
        const optionsContainer = document.querySelector('#quiz-options');
        
        if (questionContainer && optionsContainer) {
            questionContainer.textContent = question.question;
            
            optionsContainer.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-option w-full p-4 text-left border rounded-lg hover:bg-gray-100 transition-colors';
                button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
                button.addEventListener('click', () => this.selectAnswer(index));
                optionsContainer.appendChild(button);
            });
        }
    }

    selectAnswer(selectedIndex) {
        const quiz = this.currentQuiz;
        const question = quiz.questions[quiz.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        quiz.answers.push({
            questionId: question.id,
            selected: selectedIndex,
            correct: isCorrect
        });

        if (isCorrect) {
            quiz.score++;
        }

        // Show feedback
        this.showAnswerFeedback(isCorrect, question.explanation);
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    showAnswerFeedback(isCorrect, explanation) {
        const feedback = document.querySelector('#quiz-feedback');
        if (feedback) {
            feedback.innerHTML = `
                <div class="p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    <p class="font-bold">${isCorrect ? 'Correct!' : 'Incorrect'}</p>
                    <p>${explanation}</p>
                </div>
            `;
            feedback.classList.remove('hidden');
        }
    }

    nextQuestion() {
        const quiz = this.currentQuiz;
        quiz.currentQuestion++;

        if (quiz.currentQuestion >= quiz.questions.length) {
            this.showQuizResults();
        } else {
            this.displayQuestion();
            document.querySelector('#quiz-feedback').classList.add('hidden');
        }
    }

    showQuizResults() {
        const quiz = this.currentQuiz;
        const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
        
        const resultsContainer = document.querySelector('#quiz-container');
        resultsContainer.innerHTML = `
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-4">Quiz Complete!</h2>
                <div class="text-6xl mb-4">${percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}</div>
                <p class="text-xl mb-2">Your Score: ${quiz.score}/${quiz.questions.length} (${percentage}%)</p>
                <p class="text-gray-600 mb-6">${percentage >= 70 ? 'Excellent work!' : percentage >= 50 ? 'Good job!' : 'Keep practicing!'}</p>
                <button onclick="location.reload()" class="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                    Try Again
                </button>
            </div>
        `;

        // Save quiz score
        this.updateQuizScore('sample-quiz', percentage);
    }

    // Projects Page Features
    initProjectsPage() {
        this.setupProjectFiltering();
        this.setupProjectDetails();
    }

    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projects.forEach(project => {
                    const category = project.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        project.style.display = 'block';
                        anime({
                            targets: project,
                            opacity: [0, 1],
                            scale: [0.8, 1],
                            duration: 300
                        });
                    } else {
                        project.style.display = 'none';
                    }
                });
            });
        });
    }

    setupProjectDetails() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const detailsBtn = card.querySelector('.show-details');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => {
                    const details = card.querySelector('.project-details');
                    details.classList.toggle('hidden');
                });
            }
        });
    }

    // Dashboard Page Features
    initDashboardPage() {
        this.setupProgressCharts();
        this.setupAchievementGallery();
    }

    setupProgressCharts() {
        if (typeof echarts !== 'undefined') {
            // Initialize ECharts for progress visualization
            const chartContainer = document.querySelector('#progress-chart');
            if (chartContainer) {
                const chart = echarts.init(chartContainer);
                
                const option = {
                    title: {
                        text: 'Learning Progress'
                    },
                    tooltip: {},
                    xAxis: {
                        data: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5']
                    },
                    yAxis: {},
                    series: [{
                        name: 'Completion %',
                        type: 'bar',
                        data: [100, 85, 70, 45, 20],
                        itemStyle: {
                            color: '#0d9488'
                        }
                    }]
                };
                
                chart.setOption(option);
            }
        }
    }

    setupAchievementGallery() {
        const achievements = [
            { id: 'first-lesson', title: 'First Steps', icon: '🎯', unlocked: true },
            { id: 'week-warrior', title: 'Week Warrior', icon: '🗓️', unlocked: true },
            { id: 'quiz-master', title: 'Quiz Master', icon: '🧠', unlocked: false },
            { id: 'project-builder', title: 'Project Builder', icon: '🔨', unlocked: false }
        ];

        const gallery = document.querySelector('#achievement-gallery');
        if (gallery) {
            gallery.innerHTML = achievements.map(achievement => `
                <div class="achievement-card p-4 rounded-lg border-2 ${achievement.unlocked ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50'}">
                    <div class="text-3xl mb-2">${achievement.icon}</div>
                    <h4 class="font-bold">${achievement.title}</h4>
                    <p class="text-sm text-gray-600">${achievement.unlocked ? 'Unlocked!' : 'Locked'}</p>
                </div>
            `).join('');
        }
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pythonPlatform = new PythonLearningPlatform();
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Code copied to clipboard!', 'success');
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PythonLearningPlatform;
}