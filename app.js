let currentScreen = 'screen-login';
let selectedDate = null;
let selectedTime = null;
let screenHistory = [];
let tickets = {
    'adult': 0,
    'child': 0,
    'student': 0,
    'senior': 0,
    'disabled': 0,
    'disabled-company': 0
};

let user = {
    name: 'Yuri Kato',
    email: 'yuri@example.com',
    isLoggedIn: false
};

let bookingData = {
    exhibition: 'Modern Art Exhibition',
    museum: 'Tokyo Museum',
    date: null,
    time: null,
    tickets: {},
    totalPrice: 0
};

const ticketPrices = {
    'adult': 2000,
    'child': 800,
    'student': 1500,
    'senior': 1200,
    'disabled': 800,
    'disabled-company': 800
};

// Fixed popular exhibitions (always shown at top)
const popularExhibitions = [
    {
        id: 1,
        title: 'Modern Art',
        museum: 'Tokyo Museum',
        period: 'Jan 1 - Mar 31',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        tags: ['contemporary', 'abstract', 'open now'],
        price: 2000,
        image: 'modern-art.jpg'
    },
    {
        id: 2,
        title: 'Ancient History',
        museum: 'National Museum',
        period: 'Feb 15 - May 20',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-05-20'),
        tags: ['history', 'archaeology', 'open now'],
        price: 1800,
        image: 'ancient-history.jpg'
    },
    {
        id: 3,
        title: 'Photography',
        museum: 'Art Gallery',
        period: 'Mar 10 - Jun 30',
        startDate: new Date('2025-03-10'),
        endDate: new Date('2025-06-30'),
        tags: ['photography', 'contemporary', 'open now'],
        price: 1500,
        image: 'photography.jpg'
    }
];

// All exhibitions for filtering
const allExhibitions = [
    {
        id: 4,
        title: 'Music & Sound',
        museum: 'Audio Museum',
        period: 'Apr 1 - Jul 15',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-07-15'),
        tags: ['music', 'interactive', 'contemporary', 'open soon'],
        price: 2200,
        image: 'music-sound.jpg'
    },
    {
        id: 5,
        title: 'Digital Art Revolution',
        museum: 'Mori Art Museum',
        period: 'May 1 - Aug 31',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-08-31'),
        tags: ['digital', 'contemporary', 'interactive', 'open soon'],
        price: 1800,
        image: 'digital-art.jpg'
    },
    {
        id: 6,
        title: 'Impressionist Masters',
        museum: 'Tokyo National Museum',
        period: 'Mar 15 - Jun 30',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-06-30'),
        tags: ['impressionism', 'classic', 'open now'],
        price: 2500,
        image: 'impressionist.jpg'
    },
    {
        id: 7,
        title: 'Abstract Expressions',
        museum: 'Contemporary Art Center',
        period: 'Jun 1 - Sep 15',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-09-15'),
        tags: ['abstract', 'contemporary', 'painting', 'open soon'],
        price: 1900,
        image: 'abstract.jpg'
    },
    {
        id: 8,
        title: 'Traditional Crafts',
        museum: 'Craft Museum',
        period: 'Year round',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        tags: ['traditional', 'crafts', 'open now'],
        price: 1200,
        image: 'crafts.jpg'
    },
    {
        id: 9,
        title: 'Science & Technology',
        museum: 'Science Museum',
        period: 'Apr 20 - Oct 31',
        startDate: new Date('2025-04-20'),
        endDate: new Date('2025-10-31'),
        tags: ['science', 'technology', 'interactive', 'open soon'],
        price: 1600,
        image: 'science.jpg'
    },
    {
        id: 10,
        title: 'Sculpture Garden',
        museum: 'Outdoor Museum',
        period: 'May 10 - Nov 30',
        startDate: new Date('2025-05-10'),
        endDate: new Date('2025-11-30'),
        tags: ['sculpture', 'outdoor', 'contemporary', 'open soon'],
        price: 1400,
        image: 'sculpture.jpg'
    },
    {
        id: 11,
        title: 'Virtual Reality World',
        museum: 'Tech Gallery',
        period: 'Jun 15 - Dec 31',
        startDate: new Date('2025-06-15'),
        endDate: new Date('2025-12-31'),
        tags: ['digital', 'interactive', 'technology', 'open soon'],
        price: 2800,
        image: 'vr-world.jpg'
    },
    {
        id: 12,
        title: 'Classical Music History',
        museum: 'Music Hall',
        period: 'Jul 1 - Sep 30',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-09-30'),
        tags: ['music', 'history', 'classical', 'open soon'],
        price: 1700,
        image: 'classical-music.jpg'
    }
];

// Function to update exhibition status based on current date
function updateExhibitionStatus(exhibitions) {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    const thirtyDaysBeforeEnd = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return exhibitions.map(exhibition => {
        const exhibit = {...exhibition};
        const tags = exhibit.tags.filter(tag => !['open now', 'open soon', 'close soon'].includes(tag));
        
        if (exhibit.startDate <= today && exhibit.endDate >= today) {
            // Check if closing soon (within 30 days)
            if (exhibit.endDate <= thirtyDaysBeforeEnd) {
                tags.push('close soon');
            }
            tags.push('open now');
        } else if (exhibit.startDate > today && exhibit.startDate <= thirtyDaysFromNow) {
            tags.push('open soon');
        }
        
        exhibit.tags = tags;
        return exhibit;
    });
}

// Update exhibitions with current status
const popularExhibitionsWithStatus = updateExhibitionStatus(popularExhibitions);
const allExhibitionsWithStatus = updateExhibitionStatus(allExhibitions);

// Combined exhibitions for search
const exhibitionsData = [...popularExhibitionsWithStatus, ...allExhibitionsWithStatus];

let filteredExhibitions = allExhibitionsWithStatus;
let selectedTags = [];

function showScreen(screenId, addToHistory = true) {
    if (addToHistory && currentScreen && currentScreen !== screenId) {
        screenHistory.push(currentScreen);
    }
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    if (screenId === 'screen-ticket-detail') {
        updateTicketDetailPage();
        generateQRCodes();
    }
    
    if (screenId === 'screen-confirmation') {
        updateConfirmationPage();
    }
    
    if (screenId === 'screen-summary') {
        updateSummaryPage();
    }
    
    if (screenId === 'screen-search') {
        renderExhibitions();
    }
    
    if (screenId === 'screen-all-exhibitions') {
        renderAllExhibitions();
    }
    
    if (screenId === 'screen-popular-exhibitions') {
        renderPopularExhibitions();
    }
}

function goBack() {
    if (screenHistory.length > 0) {
        const previousScreen = screenHistory.pop();
        showScreen(previousScreen, false);
    }
}

function goHome() {
    screenHistory = []; // Clear history when going to home
    showScreen('screen-home', false);
}

function selectTime(element) {
    if (element.classList.contains('sold-out')) return;
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    element.classList.add('selected');
    selectedTime = element.textContent;
    bookingData.time = selectedTime;
}

function incrementTicket(type) {
    tickets[type]++;
    updateTicketDisplay(type);
    updateBookingData();
}

function decrementTicket(type) {
    if (tickets[type] > 0) {
        tickets[type]--;
        updateTicketDisplay(type);
        updateBookingData();
    }
}

function updateTicketDisplay(type) {
    document.getElementById(`${type}-count`).textContent = tickets[type];
}

function updateBookingData() {
    bookingData.tickets = {...tickets};
    bookingData.totalPrice = calculateTotal();
}

function calculateTotal() {
    let total = 0;
    for (let type in tickets) {
        total += tickets[type] * ticketPrices[type];
    }
    return total;
}

function generateQRCodes() {
    const qr1Element = document.getElementById('qr1');
    const qr2Element = document.getElementById('qr2');
    
    qr1Element.innerHTML = '';
    qr2Element.innerHTML = '';
    
    const ticketData1 = {
        exhibition: bookingData.exhibition,
        date: bookingData.date || 'July 10, 2025',
        time: bookingData.time || '10:00',
        ticket: 'Ticket #1',
        user: user.name,
        totalPrice: bookingData.totalPrice
    };
    
    const ticketData2 = {
        exhibition: bookingData.exhibition,
        date: bookingData.date || 'July 10, 2025',
        time: bookingData.time || '10:00',
        ticket: 'Ticket #2',
        user: user.name,
        totalPrice: bookingData.totalPrice
    };
    
    if (typeof QRCode !== 'undefined') {
        new QRCode(qr1Element, {
            text: JSON.stringify(ticketData1),
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        new QRCode(qr2Element, {
            text: JSON.stringify(ticketData2),
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize exhibitions display
    renderExhibitions();
    
    document.querySelectorAll('.dates span').forEach(date => {
        date.addEventListener('click', function() {
            document.querySelectorAll('.dates span').forEach(d => {
                d.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedDate = this.textContent;
            bookingData.date = `July ${selectedDate}, 2025`;
            
            // Update crowd indicators visibility based on selected date
            updateCrowdIndicators(this);
        });
    });
    
    // Initialize crowd indicators for the default selected date
    const selectedDateElement = document.querySelector('.dates span.selected');
    if (selectedDateElement) {
        updateCrowdIndicators(selectedDateElement);
        bookingData.date = `July ${selectedDateElement.textContent}, 2025`;
    }
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    const paymentInputs = document.querySelectorAll('.payment-form input');
    paymentInputs.forEach(input => {
        if (input.placeholder === 'expire date') {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
        }
        
        if (input.placeholder === 'card number') {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value;
            });
        }
        
        if (input.placeholder === 'code') {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value;
            });
        }
    });
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const cardForm = document.getElementById('card-form');
            if (this.value === 'credit') {
                cardForm.style.display = 'block';
            } else {
                cardForm.style.display = 'none';
            }
        });
    });
});

// Login and Registration
function login() {
    const email = document.querySelector('#screen-login input[type="email"]').value;
    const password = document.querySelector('#screen-login input[type="password"]').value;
    
    if (email && password) {
        user.isLoggedIn = true;
        screenHistory = []; // Clear navigation history
        showScreen('screen-home', false);
    } else {
        alert('Please enter your email and password');
    }
}

function register() {
    const name = document.querySelector('#screen-register input[type="text"]').value;
    const email = document.querySelector('#screen-register input[type="email"]').value;
    const password = document.querySelector('#screen-register input[type="password"]').value;
    const confirmPassword = document.querySelector('#screen-register input[type="password"]:last-of-type').value;
    const terms = document.querySelector('#screen-register input[type="checkbox"]').checked;
    
    if (name && email && password && confirmPassword && terms) {
        if (password === confirmPassword) {
            user.name = name;
            user.email = email;
            user.isLoggedIn = true;
            screenHistory = []; // Clear navigation history
            showScreen('screen-home', false);
        } else {
            alert('Passwords do not match');
        }
    } else {
        alert('Please fill in all fields and accept the terms');
    }
}

function logout() {
    user.isLoggedIn = false;
    screenHistory = []; // Clear navigation history
    showScreen('screen-login', false);
    // Close profile dropdown if open
    document.getElementById('profile-dropdown').classList.remove('active');
}

// Profile dropdown functionality
function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const profileSection = document.querySelector('.profile-section');
    const dropdown = document.getElementById('profile-dropdown');
    
    if (profileSection && !profileSection.contains(event.target)) {
        dropdown.classList.remove('active');
    }
    
    // Close more filters panel when clicking outside
    const moreFiltersPanel = document.getElementById('more-filters-panel');
    const moreFiltersBtn = document.querySelector('.more-filters-btn');
    const filterPanelContent = document.querySelector('.filter-panel-content');
    
    if (moreFiltersPanel && moreFiltersPanel.classList.contains('active')) {
        if (!filterPanelContent.contains(event.target) && !moreFiltersBtn.contains(event.target)) {
            moreFiltersPanel.classList.remove('active');
        }
    }
});

// Search and filter functionality
function toggleFilters() {
    const filterPanel = document.getElementById('filter-panel');
    filterPanel.classList.toggle('active');
}

// FAQ functionality
function toggleFAQ(element) {
    element.classList.toggle('active');
}

// Payment processing
function processPayment() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const terms = document.querySelector('#screen-payment input[type="checkbox"]').checked;
    
    if (!terms) {
        alert('Please agree to the terms and conditions');
        return;
    }
    
    if (paymentMethod === 'credit') {
        const cardNumber = document.querySelector('#card-form input[placeholder="card number"]').value;
        const cardHolder = document.querySelector('#card-form input[placeholder="card holder name"]').value;
        const expireDate = document.querySelector('#card-form input[placeholder="expire date"]').value;
        const code = document.querySelector('#card-form input[placeholder="code"]').value;
        
        if (!cardNumber || !cardHolder || !expireDate || !code) {
            alert('Please fill in all card details');
            return;
        }
    }
    
    // Simulate payment processing
    setTimeout(() => {
        showScreen('screen-confirmation');
    }, 1000);
}

// Update crowd indicators based on selected date
function updateCrowdIndicators(selectedElement) {
    const indicators = document.querySelectorAll('.crowd-indicators .indicator');
    
    // Reset all indicators
    indicators.forEach(indicator => {
        indicator.style.opacity = '0.3';
    });
    
    // Highlight the current crowd level
    if (selectedElement.classList.contains('crowd-busy')) {
        document.querySelector('.indicator.busy').style.opacity = '1';
    } else if (selectedElement.classList.contains('crowd-average')) {
        document.querySelector('.indicator.average').style.opacity = '1';
    } else if (selectedElement.classList.contains('crowd-light')) {
        document.querySelector('.indicator.light').style.opacity = '1';
    }
}

// Update confirmation page with booking data
function updateConfirmationPage() {
    const confirmationScreen = document.getElementById('screen-confirmation');
    const summaryCard = confirmationScreen.querySelector('.summary-card .card-info');
    
    // Get ticket summary
    const ticketSummary = getTicketSummary();
    
    summaryCard.innerHTML = `
        <h3>${bookingData.exhibition}</h3>
        <p>${bookingData.museum}</p>
        <p>${bookingData.date || 'July 10, 2025'} at ${bookingData.time || '10:00'}</p>
        <p>${ticketSummary}</p>
        <p class="total">Total: ¥${bookingData.totalPrice.toLocaleString()}</p>
    `;
}

// Update summary page with booking data
function updateSummaryPage() {
    const summaryScreen = document.getElementById('screen-summary');
    const summaryCard = summaryScreen.querySelector('.summary-card .card-info');
    
    // Get ticket summary
    const ticketSummary = getTicketSummary();
    
    summaryCard.innerHTML = `
        <h3>${bookingData.exhibition}</h3>
        <p>${bookingData.museum}</p>
        <p>${bookingData.date || 'July 10, 2025'} at ${bookingData.time || '10:00'}</p>
        <p class="ticket-info">${ticketSummary}</p>
    `;
}

// Get formatted ticket summary
function getTicketSummary() {
    const ticketList = [];
    for (let type in bookingData.tickets) {
        if (bookingData.tickets[type] > 0) {
            const typeName = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
            ticketList.push(`${typeName} x${bookingData.tickets[type]}`);
        }
    }
    return ticketList.length > 0 ? ticketList.join(', ') : 'No tickets selected';
}

// Update ticket detail page with booking data
function updateTicketDetailPage() {
    const ticketDetailScreen = document.getElementById('screen-ticket-detail');
    const summaryCard = ticketDetailScreen.querySelector('.summary-card .card-info');
    
    // Get ticket summary
    const ticketSummary = getTicketSummary();
    
    summaryCard.innerHTML = `
        <h3>${bookingData.exhibition}</h3>
        <p>${bookingData.museum}</p>
        <p>${bookingData.date || 'July 10, 2025'} at ${bookingData.time || '10:00'}</p>
        <p>${ticketSummary}</p>
    `;
}

// Tag filtering functions
function toggleTag(tag) {
    const tagIndex = selectedTags.indexOf(tag);
    if (tagIndex > -1) {
        selectedTags.splice(tagIndex, 1);
    } else {
        selectedTags.push(tag);
    }
    filterAndRenderExhibitions();
    updateTagButtons();
}

function filterExhibitions() {
    if (selectedTags.length === 0) {
        filteredExhibitions = allExhibitionsWithStatus;
    } else {
        filteredExhibitions = allExhibitionsWithStatus.filter(exhibition => 
            selectedTags.every(tag => exhibition.tags.includes(tag))
        );
    }
}

function updateTagButtons() {
    const tagButtons = document.querySelectorAll('.tag-btn');
    tagButtons.forEach(btn => {
        const tag = btn.textContent.toLowerCase().replace(' ', '-');
        if (selectedTags.includes(tag)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function toggleMoreFilters() {
    const panel = document.getElementById('more-filters-panel');
    panel.classList.toggle('active');
    
    // Update button states in the panel
    updateTagButtons();
}

function clearAllFilters() {
    selectedTags = [];
    searchQuery = '';
    // Clear search input if exists
    const searchInput = document.getElementById('home-search');
    if (searchInput) searchInput.value = '';
    filterAndRenderExhibitions();
    updateTagButtons();
}

function renderExhibitions() {
    const popularGrid = document.querySelector('.popular-section .exhibition-grid');
    const mainGrid = document.querySelector('.filtered-results-section .exhibition-grid');
    const searchList = document.getElementById('search-exhibition-list');
    const searchCount = document.getElementById('search-results-count');
    const filteredTitle = document.getElementById('filtered-results-title');
    
    // Popular exhibitions are always fixed
    if (popularGrid) {
        popularGrid.innerHTML = generateExhibitionCards(popularExhibitionsWithStatus);
    }
    
    // Bottom area shows filtered results
    if (mainGrid) {
        mainGrid.innerHTML = generateExhibitionCards(filteredExhibitions);
    }
    
    // Update filtered results section title
    if (filteredTitle) {
        if (selectedTags.length === 0) {
            filteredTitle.textContent = 'All exhibitions';
        } else {
            filteredTitle.textContent = `Filtered results (${selectedTags.join(', ')})`;
        }
    }
    
    // Search screen shows all filtered results
    if (searchList) {
        searchList.innerHTML = generateSearchExhibitionItems(filteredExhibitions);
    }
    
    if (searchCount) {
        searchCount.textContent = `${filteredExhibitions.length} exhibitions found`;
    }
}

function generateExhibitionCards(exhibitions) {
    return exhibitions.map(exhibition => `
        <div class="exhibition-card" onclick="selectExhibition(${exhibition.id})">
            <div class="card-image"></div>
            <h3>${exhibition.title}</h3>
            <p>${exhibition.museum}</p>
            <p>${exhibition.period}</p>
            <div class="tags">
                ${exhibition.tags.map(tag => {
                    let className = 'tag';
                    if (tag === 'open now') className += ' tag-open-now';
                    else if (tag === 'open soon') className += ' tag-open-soon';
                    else if (tag === 'close soon') className += ' tag-close-soon';
                    return `<span class="${className}">${tag}</span>`;
                }).join('')}
            </div>
        </div>
    `).join('');
}

function generateSearchExhibitionItems(exhibitions) {
    return exhibitions.map(exhibition => `
        <div class="exhibition-item" onclick="selectExhibition(${exhibition.id})">
            <div class="card-image"></div>
            <div class="card-info">
                <h3>${exhibition.title}</h3>
                <p>${exhibition.museum}</p>
                <p>${exhibition.period}</p>
                <p class="price">¥${exhibition.price.toLocaleString()}</p>
                <div class="tags">
                    ${exhibition.tags.map(tag => {
                        let className = 'tag';
                        if (tag === 'open now') className += ' tag-open-now';
                        else if (tag === 'open soon') className += ' tag-open-soon';
                        else if (tag === 'close soon') className += ' tag-close-soon';
                        return `<span class="${className}">${tag}</span>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function selectExhibition(id) {
    const exhibition = exhibitionsData.find(ex => ex.id === id);
    if (exhibition) {
        bookingData.exhibition = exhibition.title;
        bookingData.museum = exhibition.museum;
        showScreen('screen-detail');
    }
}

function toggleMainMenu() {
    const menu = document.getElementById('main-menu');
    menu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menuSection = document.querySelector('.menu-section');
    const mainMenu = document.getElementById('main-menu');
    
    if (menuSection && !menuSection.contains(event.target)) {
        mainMenu.classList.remove('active');
    }
});

function renderAllExhibitions() {
    const count = document.getElementById('all-exhibitions-count');
    const list = document.getElementById('all-exhibitions-list');
    
    if (count) {
        count.textContent = `${exhibitionsData.length} exhibitions found`;
    }
    
    if (list) {
        list.innerHTML = generateSearchExhibitionItems(exhibitionsData);
    }
}

function renderPopularExhibitions() {
    const count = document.getElementById('popular-exhibitions-count');
    const list = document.getElementById('popular-exhibitions-list');
    
    if (count) {
        count.textContent = `${popularExhibitions.length} popular exhibitions`;
    }
    
    if (list) {
        list.innerHTML = generateSearchExhibitionItems(popularExhibitionsWithStatus);
    }
}

// Search functionality
let searchQuery = '';

function searchExhibitions(query) {
    searchQuery = query.toLowerCase();
    filterAndRenderExhibitions();
    toggleClearButton('home-search');
}

function filterAndRenderExhibitions() {
    let filtered = allExhibitionsWithStatus;
    
    // Apply search query
    if (searchQuery) {
        filtered = filtered.filter(exhibition => 
            exhibition.title.toLowerCase().includes(searchQuery) ||
            exhibition.museum.toLowerCase().includes(searchQuery) ||
            exhibition.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
        filtered = filtered.filter(exhibition => 
            selectedTags.every(tag => exhibition.tags.includes(tag))
        );
    }
    
    filteredExhibitions = filtered;
    renderExhibitions();
    
    // Show no results message if needed
    showNoResultsMessage('filtered-results-section', filtered.length === 0 && (searchQuery || selectedTags.length > 0));
}

function filterExhibitions() {
    if (selectedTags.length === 0) {
        filteredExhibitions = allExhibitionsWithStatus;
    } else {
        filteredExhibitions = allExhibitionsWithStatus.filter(exhibition => 
            selectedTags.every(tag => exhibition.tags.includes(tag))
        );
    }
    
    renderExhibitions();
    
    // Show no results message if needed
    showNoResultsMessage('filtered-results-section', filteredExhibitions.length === 0 && selectedTags.length > 0);
}

// FAQ search functionality
function searchFAQ(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchTerm = query.toLowerCase();
    toggleClearButton('help-search');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            if (searchTerm && searchTerm.length > 2) {
                item.classList.add('active'); // Expand matching FAQs
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show all FAQs if search is empty
    if (!searchTerm) {
        faqItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('active');
        });
    }
    
    // Show no results message if no FAQs match
    const faqSection = document.querySelector('.faq-section');
    let noResultsDiv = faqSection.querySelector('.no-results');
    
    const visibleFAQs = Array.from(faqItems).filter(item => item.style.display !== 'none');
    
    if (searchTerm && visibleFAQs.length === 0) {
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = '<p>No help articles found matching your search.</p><p>Try searching with different keywords or browse all questions below.</p>';
            faqSection.appendChild(noResultsDiv);
        }
        noResultsDiv.style.display = 'block';
    } else {
        if (noResultsDiv) {
            noResultsDiv.style.display = 'none';
        }
    }
}

// Function to toggle clear button visibility
function toggleClearButton(inputId) {
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(inputId + '-clear');
    
    if (input && clearBtn) {
        if (input.value.length > 0) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }
    }
}

// Function to clear search input
function clearSearch(inputId) {
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(inputId + '-clear');
    
    if (input) {
        input.value = '';
        input.focus();
        
        // Trigger the appropriate search function
        if (inputId === 'home-search') {
            searchExhibitions('');
        } else if (inputId === 'all-exhibitions-search') {
            searchAllExhibitions('');
        } else if (inputId === 'popular-exhibitions-search') {
            searchPopularExhibitions('');
        } else if (inputId === 'help-search') {
            searchFAQ('');
        }
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
}

// Search for all exhibitions page
function searchAllExhibitions(query) {
    const searchTerm = query.toLowerCase();
    const count = document.getElementById('all-exhibitions-count');
    const list = document.getElementById('all-exhibitions-list');
    toggleClearButton('all-exhibitions-search');
    
    const filtered = exhibitionsData.filter(exhibition => 
        exhibition.title.toLowerCase().includes(searchTerm) ||
        exhibition.museum.toLowerCase().includes(searchTerm) ||
        exhibition.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    if (count) {
        count.textContent = `${filtered.length} exhibitions found`;
    }
    
    if (list) {
        if (filtered.length === 0 && searchTerm) {
            list.innerHTML = '<div class="no-results"><p>No exhibitions found matching your search.</p><p>Try searching with different keywords or check your spelling.</p></div>';
        } else {
            list.innerHTML = generateSearchExhibitionItems(filtered);
        }
    }
}

// Search for popular exhibitions page
function searchPopularExhibitions(query) {
    const searchTerm = query.toLowerCase();
    const count = document.getElementById('popular-exhibitions-count');
    const list = document.getElementById('popular-exhibitions-list');
    toggleClearButton('popular-exhibitions-search');
    
    const filtered = popularExhibitionsWithStatus.filter(exhibition => 
        exhibition.title.toLowerCase().includes(searchTerm) ||
        exhibition.museum.toLowerCase().includes(searchTerm) ||
        exhibition.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    if (count) {
        count.textContent = `${filtered.length} popular exhibitions`;
    }
    
    if (list) {
        if (filtered.length === 0 && searchTerm) {
            list.innerHTML = '<div class="no-results"><p>No popular exhibitions found matching your search.</p><p>Try searching with different keywords or check your spelling.</p></div>';
        } else {
            list.innerHTML = generateSearchExhibitionItems(filtered);
        }
    }
}

// Function to show/hide no results message for home page
function showNoResultsMessage(sectionClass, show) {
    const section = document.querySelector(`.${sectionClass}`);
    if (!section) return;
    
    let noResultsDiv = section.querySelector('.no-results');
    
    if (show) {
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = '<p>No exhibitions found matching your search and filters.</p><p>Try adjusting your search terms or removing some filters.</p>';
            section.appendChild(noResultsDiv);
        }
        noResultsDiv.style.display = 'block';
    } else {
        if (noResultsDiv) {
            noResultsDiv.style.display = 'none';
        }
    }
}

// Function to toggle clear button visibility
function toggleClearButton(inputId) {
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(inputId + '-clear');
    
    if (input && clearBtn) {
        if (input.value.length > 0) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }
    }
}

// Function to clear search input
function clearSearch(inputId) {
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(inputId + '-clear');
    
    if (input) {
        input.value = '';
        input.focus();
        
        // Trigger the appropriate search function
        if (inputId === 'home-search') {
            searchExhibitions('');
        } else if (inputId === 'all-exhibitions-search') {
            searchAllExhibitions('');
        } else if (inputId === 'popular-exhibitions-search') {
            searchPopularExhibitions('');
        } else if (inputId === 'help-search') {
            searchFAQ('');
        }
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
}