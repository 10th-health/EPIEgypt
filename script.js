// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA Install Functionality
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

// Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') return;
        
        // Remove previous highlights
        removeHighlights();
        
        // Search through all content sections
        const sections = document.querySelectorAll('.content-section');
        let found = false;
        
        sections.forEach(section => {
            const textContent = section.textContent.toLowerCase();
            if (textContent.includes(searchTerm)) {
                highlightText(section, searchTerm);
                if (!found) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    found = true;
                }
            }
        });
        
        if (!found) {
            alert('لم يتم العثور على نتائج للبحث: ' + searchTerm);
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Tab Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            const tabContainer = this.closest('.content-card') || this.closest('.method-section');
            
            if (tabContainer) {
                // Remove active class from all tabs and contents in this container
                tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                tabContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = tabContainer.querySelector(`#${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
        });
    });

    // Intersection Observer for Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        observer.observe(section);
    });

    // Active Navigation Link Based on Scroll Position
    window.addEventListener('scroll', () => {
        let current = '';
        contentSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Accordion Functionality for Campaign Components
    const componentHeaders = document.querySelectorAll('.component-header');
    componentHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const section = this.parentElement;
            
            if (content && content.classList.contains('component-content')) {
                section.classList.toggle('active');
                
                if (section.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            }
        });
    });

    // Print Functionality
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '🖨️ طباعة';
    printBtn.className = 'print-btn';
    printBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: #28a745;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
        z-index: 1002;
        display: none;
    `;
    
    document.body.appendChild(printBtn);
    
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Show print button on all screens
printBtn.style.display = 'block';

// Keep print button visible on all screen sizes
window.addEventListener('resize', () => {
    printBtn.style.display = 'block';
});


    // Local Storage for User Preferences
    const userPrefs = {
        fontSize: localStorage.getItem('fontSize') || 'medium',
        theme: localStorage.getItem('theme') || 'light'
    };

    // Apply saved preferences
    applyFontSize(userPrefs.fontSize);
    applyTheme(userPrefs.theme);

    // Font Size Controls
    const fontSizeControls = document.createElement('div');
    fontSizeControls.innerHTML = `
        <div class="accessibility-controls" style="
            position: fixed;
            top: 80px;
            left: 20px;
            background: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 1001;
            display: none;
        ">
            <h4>إعدادات العرض</h4>
            <div class="font-controls">
                <label>حجم الخط:</label>
                <button onclick="changeFontSize('small')">صغير</button>
                <button onclick="changeFontSize('medium')">متوسط</button>
                <button onclick="changeFontSize('large')">كبير</button>
            </div>
            <div class="theme-controls">
                <label>المظهر:</label>
                <button onclick="changeTheme('light')">فاتح</button>
                <button onclick="changeTheme('dark')">داكن</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(fontSizeControls);

    // Accessibility Toggle Button
    const accessibilityBtn = document.createElement('button');
    accessibilityBtn.innerHTML = '⚙️ الإعدادات';
    accessibilityBtn.className = 'accessibility-btn';
    accessibilityBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 120px;
        background: #6c757d;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
        z-index: 1003;
        display: none;
    `;
    
    document.body.appendChild(accessibilityBtn);
    
    accessibilityBtn.addEventListener('click', () => {
        const controls = document.querySelector('.accessibility-controls');
        controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
    });

    // Show accessibility button on all screens
accessibilityBtn.style.display = 'block';

// Keep accessibility button visible on all screen sizes
window.addEventListener('resize', () => {
    accessibilityBtn.style.display = 'block';
});


    // Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑ العودة للأعلى';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        background: #17a2b8;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(23, 162, 184, 0.4);
        z-index: 1001;
        display: none;
        transition: all 0.3s;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/Hide Back to Top Button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
});

// Global Functions for Accessibility
function changeFontSize(size) {
    applyFontSize(size);
    localStorage.setItem('fontSize', size);
}

function changeTheme(theme) {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
}

function applyFontSize(size) {
    const root = document.documentElement;
    switch(size) {
        case 'small':
            root.style.fontSize = '14px';
            break;
        case 'large':
            root.style.fontSize = '18px';
            break;
        default:
            root.style.fontSize = '16px';
    }
}

function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
}

// Search Helper Functions
function highlightText(element, searchTerm) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    textNodes.forEach(textNode => {
        const text = textNode.textContent.toLowerCase();
        const index = text.indexOf(searchTerm);
        if (index !== -1) {
            const parent = textNode.parentNode;
            const beforeText = textNode.textContent.substring(0, index);
            const matchText = textNode.textContent.substring(index, index + searchTerm.length);
            const afterText = textNode.textContent.substring(index + searchTerm.length);

            const highlightSpan = document.createElement('span');
            highlightSpan.className = 'search-highlight';
            highlightSpan.style.cssText = 'background: yellow; font-weight: bold; padding: 2px 4px; border-radius: 3px;';
            highlightSpan.textContent = matchText;

            parent.removeChild(textNode);
            if (beforeText) parent.appendChild(document.createTextNode(beforeText));
            parent.appendChild(highlightSpan);
            if (afterText) parent.appendChild(document.createTextNode(afterText));
        }
    });
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

// Offline Detection
window.addEventListener('online', () => {
    showNotification('تم الاتصال بالإنترنت', 'success');
});

window.addEventListener('offline', () => {
    showNotification('أنت الآن في وضع عدم الاتصال - يمكنك الاستمرار في التصفح', 'info');
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 2000;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#000';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('حدث خطأ غير متوقع', 'error');
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        if (loadTime > 3000) {
            showNotification('الصفحة تحتاج وقت أطول للتحميل - تحقق من اتصال الإنترنت', 'warning');
        }
    });
}



// Catch-up Schedule Logic
document.addEventListener('DOMContentLoaded', function() {
    const ageButtons = document.querySelectorAll('.age-group-btn');
    const resultContainer = document.getElementById('catchupResult');

    const catchupSchedules = {
        '0-12': {
            title: 'الأطفال المتخلفون من عمر يوم إلى أقل من سنة',
            description: 'يتم استكمال التطعيمات الناقصة طبقاً لجدول التطعيمات الإجبارية مع مراعاة المسافات البينية بين الجرعات.',
            table: [
                { vaccine: 'BCG', dose: 'جرعة واحدة', condition: 'إذا لم يكن قد أخذها' },
                { vaccine: 'bOPV', dose: 'استكمال الجرعات', condition: 'فاصل شهر بين الجرعات' },
                { vaccine: 'Penta', dose: 'استكمال الجرعات', condition: 'فاصل شهر بين الجرعات' },
                { vaccine: 'IPV', dose: 'جرعة واحدة', condition: 'عند عمر ٤ شهور أو أكبر' },
                { vaccine: 'MMR', dose: 'لا يعطى', condition: 'يعطى عند عمر سنة' }
            ]
        },
        '12-24': {
            title: 'الأطفال المتخلفون من عمر سنة إلى أقل من سنتين',
            description: 'يتم التعامل مع هذه الفئة العمرية بحرص لضمان استكمال الجرعات الأساسية والمنشطة.',
            table: [
                { vaccine: 'BCG', dose: 'لا يعطى', condition: 'لا يعطى بعد عمر سنة' },
                { vaccine: 'bOPV', dose: 'استكمال الجرعات', condition: 'فاصل شهر بين الجرعات' },
                { vaccine: 'Penta/DPT', dose: 'استكمال الجرعات', condition: 'فاصل شهر بين الجرعات الأساسية، و٦ أشهر قبل المنشطة' },
                { vaccine: 'IPV', dose: 'جرعة واحدة', condition: 'إذا لم يكن قد أخذها' },
                { vaccine: 'MMR', dose: 'جرعتان', condition: 'فاصل شهر بين الجرعتين' }
            ]
        },
        '24-60': {
            title: 'الأطفال المتخلفون من عمر سنتين إلى أقل من ٥ سنوات',
            description: 'التركيز على الجرعات الأساسية والمنشطة الضرورية قبل دخول المدرسة.',
            table: [
                { vaccine: 'BCG', dose: 'لا يعطى', condition: 'لا يعطى بعد عمر سنة' },
                { vaccine: 'bOPV', dose: 'جرعتان', condition: 'فاصل شهر بينهما' },
                { vaccine: 'DPT', dose: 'جرعتان', condition: 'فاصل شهر بينهما' },
                { vaccine: 'IPV', dose: 'لا يعطى', condition: 'لا يعطى بعد عمر سنتين' },
                { vaccine: 'MMR', dose: 'جرعتان', condition: 'فاصل شهر بين الجرعتين' }
            ]
        },
        'school': {
            title: 'الأطفال عند دخول المدرسة (حتى ٧ سنوات)',
            description: 'يتم إعطاء جرعات منشطة لتعزيز المناعة المكتسبة.',
            table: [
                { vaccine: 'bOPV', dose: 'جرعة منشطة', condition: 'عند دخول المدرسة' },
                { vaccine: 'DT', dose: 'جرعة منشطة', condition: 'عند دخول المدرسة (طعم الثنائي)' },
                { vaccine: 'MMR', dose: 'جرعة واحدة', condition: 'إذا لم يكن قد أخذ جرعتين' }
            ]
        }
    };

    ageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ageGroup = this.getAttribute('data-age-group');
            
            // Remove active class from all buttons
            ageButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            this.classList.add('active');
            
            displayCatchupSchedule(ageGroup);
        });
    });

    function displayCatchupSchedule(ageGroup) {
        try {
            const schedule = catchupSchedules[ageGroup];
            if (!schedule) {
                resultContainer.innerHTML = '<p class="error">لا توجد بيانات لهذه الفئة العمرية.</p>';
                return;
            }

            let tableHTML = `
                <div class="catchup-card animated">
                    <h3>${schedule.title}</h3>
                    <p>${schedule.description}</p>
                    <table class="catchup-table">
                        <thead>
                            <tr>
                                <th>اللقاح</th>
                                <th>الجرعة المطلوبة</th>
                                <th>الشروط</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            schedule.table.forEach(row => {
                tableHTML += `
                    <tr>
                        <td>${row.vaccine}</td>
                        <td>${row.dose}</td>
                        <td>${row.condition}</td>
                    </tr>
                `;
            });

            tableHTML += `
                        </tbody>
                    </table>
                </div>
            `;

            resultContainer.innerHTML = tableHTML;
        } catch (error) {
            console.error('Error displaying catch-up schedule:', error);
            resultContainer.innerHTML = '<p class="error">حدث خطأ غير متوقع أثناء عرض الجدول.</p>';
        }
    }
});
