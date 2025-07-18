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
        tags: ['contemporary', 'abstract', 'open now'],
        price: 2000,
        image: 'modern-art.jpg'
    },
    {
        id: 2,
        title: 'Ancient History',
        museum: 'National Museum',
        period: 'Feb 15 - May 20',
        tags: ['history', 'archaeology', 'open now'],
        price: 1800,
        image: 'ancient-history.jpg'
    },
    {
        id: 3,
        title: 'Photography',
        museum: 'Art Gallery',
        period: 'Mar 10 - Jun 30',
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
        tags: ['music', 'interactive', 'contemporary'],
        price: 2200,
        image: 'music-sound.jpg'
    },
    {
        id: 5,
        title: 'Digital Art Revolution',
        museum: 'Mori Art Museum',
        period: 'May 1 - Aug 31',
        tags: ['digital', 'contemporary', 'interactive'],
        price: 1800,
        image: 'digital-art.jpg'
    },
    {
        id: 6,
        title: 'Impressionist Masters',
        museum: 'Tokyo National Museum',
        period: 'Mar 15 - Jun 30',
        tags: ['impressionism', 'classic', 'open now'],
        price: 2500,
        image: 'impressionist.jpg'
    },
    {
        id: 7,
        title: 'Abstract Expressions',
        museum: 'Contemporary Art Center',
        period: 'Jun 1 - Sep 15',
        tags: ['abstract', 'contemporary', 'painting'],
        price: 1900,
        image: 'abstract.jpg'
    },
    {
        id: 8,
        title: 'Traditional Crafts',
        museum: 'Craft Museum',
        period: 'Year round',
        tags: ['traditional', 'crafts', 'open now'],
        price: 1200,
        image: 'crafts.jpg'
    },
    {
        id: 9,
        title: 'Science & Technology',
        museum: 'Science Museum',
        period: 'Apr 20 - Oct 31',
        tags: ['science', 'technology', 'interactive'],
        price: 1600,
        image: 'science.jpg'
    },
    {
        id: 10,
        title: 'Sculpture Garden',
        museum: 'Outdoor Museum',
        period: 'May 10 - Nov 30',
        tags: ['sculpture', 'outdoor', 'contemporary'],
        price: 1400,
        image: 'sculpture.jpg'
    },
    {
        id: 11,
        title: 'Virtual Reality World',
        museum: 'Tech Gallery',
        period: 'Jun 15 - Dec 31',
        tags: ['digital', 'interactive', 'technology'],
        price: 2800,
        image: 'vr-world.jpg'
    },
    {
        id: 12,
        title: 'Classical Music History',
        museum: 'Music Hall',
        period: 'Jul 1 - Sep 30',
        tags: ['music', 'history', 'classical'],
        price: 1700,
        image: 'classical-music.jpg'
    }
];

// Combined exhibitions for search
const exhibitionsData = [...popularExhibitions, ...allExhibitions];

let filteredExhibitions = allExhibitions;
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
    filterExhibitions();
    updateTagButtons();
    renderExhibitions();
}

function filterExhibitions() {
    if (selectedTags.length === 0) {
        filteredExhibitions = allExhibitions;
    } else {
        filteredExhibitions = allExhibitions.filter(exhibition => 
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
    filterExhibitions();
    updateTagButtons();
    renderExhibitions();
}

function renderExhibitions() {
    const popularGrid = document.querySelector('.popular-section .exhibition-grid');
    const mainGrid = document.querySelector('.filtered-results-section .exhibition-grid');
    const searchList = document.getElementById('search-exhibition-list');
    const searchCount = document.getElementById('search-results-count');
    const filteredTitle = document.getElementById('filtered-results-title');
    
    // Popular exhibitions are always fixed
    if (popularGrid) {
        popularGrid.innerHTML = generateExhibitionCards(popularExhibitions);
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
                ${exhibition.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
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
                    ${exhibition.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
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
        list.innerHTML = generateSearchExhibitionItems(popularExhibitions);
    }
}