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

// My List (interested exhibitions) functionality
let myList = JSON.parse(localStorage.getItem('myList')) || [];

// My Museums (favorite museums) functionality
let myMuseums = JSON.parse(localStorage.getItem('myMuseums')) || [];

// Language settings
let currentLanguage = localStorage.getItem('language') || 'en';

// Translations
const translations = {
    en: {
        // Navigation
        'nav.top': 'Top',
        'nav.allExhibitions': 'All Exhibitions',
        'nav.popularExhibitions': 'Popular Exhibitions',
        'nav.myExhibitions': 'My Exhibitions',
        'nav.myMuseums': 'My Museums',
        'nav.myTickets': 'My Tickets',
        'nav.about': 'About Visit Museums',
        'nav.settings': 'Settings',
        'nav.help': 'Help & FAQ',
        'nav.logout': 'Logout',
        
        // Home page
        'home.popularExhibitions': 'Popular Exhibitions',
        'home.allExhibitions': 'All Exhibitions',
        'home.search': 'Search exhibitions...',
        'home.filter': 'Filter',
        'home.all': 'All',
        'home.currentlyOpen': 'Currently Open',
        'home.openingSoon': 'Opening Soon',
        'home.lastChance': 'Last Chance',
        'home.free': 'Free',
        'home.viewAll': 'View All',
        
        // Exhibition details
        'exhibition.bookTicket': 'Book a ticket',
        'exhibition.about': 'About This Exhibition',
        'exhibition.highlights': 'Exhibition Highlights',
        'exhibition.ticketInfo': 'Ticket Information',
        'exhibition.hours': 'Operating Hours',
        'exhibition.location': 'Location',
        'exhibition.share': 'Share',
        
        // Date selection
        'date.selectDate': 'Select a Date',
        'date.exhibition': 'Exhibition',
        'date.museum': 'Museum',
        'date.busy': 'busy',
        'date.average': 'average',
        'date.light': 'light',
        'date.soldOut': 'SOLD OUT',
        'date.continue': 'Continue',
        
        // Time selection
        'time.selectTime': 'Select a Time',
        'time.selectedDate': 'Selected Date',
        'time.morning': 'Morning',
        'time.afternoon': 'Afternoon',
        'time.evening': 'Evening',
        
        // Ticket selection
        'ticket.selectTickets': 'Select Tickets',
        'ticket.adult': 'Adult',
        'ticket.child': 'Child',
        'ticket.student': 'Student',
        'ticket.senior': 'Senior',
        'ticket.disabled': 'Disabled',
        'ticket.disabledCompany': 'Disabled company',
        'ticket.total': 'Total',
        'ticket.continue': 'Continue',
        
        // Museum details
        'museum.about': 'About This Museum',
        'museum.contactInfo': 'Contact Information',
        'museum.hours': 'Opening Hours',
        'museum.admission': 'Admission Prices',
        'museum.facilities': 'Facilities',
        'museum.viewOnMap': 'View on Google Maps',
        'museum.closed': 'Closed'
    },
    ja: {
        // Navigation
        'nav.top': 'トップ',
        'nav.allExhibitions': 'すべての展覧会',
        'nav.popularExhibitions': '人気の展覧会',
        'nav.myExhibitions': 'マイ展覧会',
        'nav.myMuseums': 'マイミュージアム',
        'nav.myTickets': 'マイチケット',
        'nav.about': 'Visit Museumsについて',
        'nav.settings': '設定',
        'nav.help': 'ヘルプ・FAQ',
        'nav.logout': 'ログアウト',
        
        // Home page
        'home.popularExhibitions': '人気の展覧会',
        'home.allExhibitions': 'すべての展覧会',
        'home.search': '展覧会を検索...',
        'home.filter': 'フィルター',
        'home.all': 'すべて',
        'home.currentlyOpen': '開催中',
        'home.openingSoon': '開催予定',
        'home.lastChance': '最終チャンス',
        'home.free': '無料',
        'home.viewAll': 'すべて見る',
        
        // Exhibition details
        'exhibition.bookTicket': 'チケットを予約',
        'exhibition.about': 'この展覧会について',
        'exhibition.highlights': '展覧会のハイライト',
        'exhibition.ticketInfo': 'チケット情報',
        'exhibition.hours': '開館時間',
        'exhibition.location': '場所',
        'exhibition.share': 'シェア',
        
        // Date selection
        'date.selectDate': '日付を選択',
        'date.exhibition': '展覧会',
        'date.museum': 'ミュージアム',
        'date.busy': '混雑',
        'date.average': '普通',
        'date.light': '空き',
        'date.soldOut': '売り切れ',
        'date.continue': '次へ',
        
        // Time selection
        'time.selectTime': '時間を選択',
        'time.selectedDate': '選択した日付',
        'time.morning': '午前',
        'time.afternoon': '午後',
        'time.evening': '夕方',
        
        // Ticket selection
        'ticket.selectTickets': 'チケットを選択',
        'ticket.adult': '大人',
        'ticket.child': '子供',
        'ticket.student': '学生',
        'ticket.senior': 'シニア',
        'ticket.disabled': '障害者',
        'ticket.disabledCompany': '障害者付添',
        'ticket.total': '合計',
        'ticket.continue': '次へ',
        
        // Museum details
        'museum.about': 'このミュージアムについて',
        'museum.contactInfo': '連絡先',
        'museum.hours': '開館時間',
        'museum.admission': '入館料',
        'museum.facilities': '施設',
        'museum.viewOnMap': 'Googleマップで見る',
        'museum.closed': '休館'
    }
};

// Translation function
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ja' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguageDisplay();
}

// Update all text elements with translations
function updateLanguageDisplay() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Update language toggle button
    const langButton = document.getElementById('language-toggle');
    if (langButton) {
        langButton.textContent = currentLanguage === 'en' ? '日本語' : 'English';
    }
}

const ticketPrices = {
    'adult': 2000,
    'child': 800,
    'student': 1500,
    'senior': 1200,
    'disabled': 800,
    'disabled-company': 800
};

// Museum data
const museumsData = [
    {
        id: 1,
        name: 'Tokyo Museum',
        description: 'A premier cultural institution showcasing Japanese and international art',
        address: '1-2-3 Ueno, Taito City, Tokyo 110-0007',
        phone: '+81 3-1234-5678',
        email: 'info@tokyomuseum.jp',
        hours: {
            'Tuesday - Thursday': '10:00 - 18:00',
            'Friday - Saturday': '10:00 - 20:00',
            'Sunday': '10:00 - 17:00',
            'Monday': 'Closed'
        },
        admission: {
            'General': '¥1,000',
            'University Students': '¥500',
            'High School & Below': 'Free',
            'Seniors (65+)': '¥800'
        },
        facilities: [
            'Restaurant & Café',
            'Museum Shop',
            'Parking Available',
            'Wheelchair Accessible',
            'Audio Guides',
            'Locker Room',
            'Free Wi-Fi'
        ]
    },
    {
        id: 2,
        name: 'National Museum',
        description: 'Japan\'s oldest and largest museum featuring extensive collections',
        address: '13-9 Ueno Park, Taito City, Tokyo 110-8712',
        phone: '+81 3-3822-1111',
        email: 'info@nationalmuseum.jp',
        hours: {
            'Tuesday - Sunday': '9:30 - 17:00',
            'Friday & Saturday': '9:30 - 20:00',
            'Monday': 'Closed'
        },
        admission: {
            'General': '¥1,000',
            'University Students': '¥500',
            'Under 18': 'Free',
            'Seniors (70+)': 'Free'
        },
        facilities: [
            'Multiple Restaurants',
            'Gift Shop',
            'Parking',
            'Barrier-Free Access',
            'Guided Tours',
            'Research Library'
        ]
    },
    {
        id: 3,
        name: 'Art Gallery',
        description: 'Contemporary art space featuring rotating exhibitions',
        address: '3-1-1 Roppongi, Minato City, Tokyo 106-0032',
        phone: '+81 3-5777-8600',
        email: 'contact@artgallery.jp',
        hours: {
            'Wednesday - Monday': '10:00 - 18:00',
            'Tuesday': 'Closed'
        },
        admission: {
            'General': '¥1,800',
            'Students': '¥800',
            'Children': '¥600'
        },
        facilities: [
            'Café',
            'Art Shop',
            'Event Space',
            'Accessible Facilities'
        ]
    }
];

// Fixed popular exhibitions (always shown at top)
const popularExhibitions = [
    {
        id: 1,
        title: 'Modern Art',
        museum: 'Tokyo Museum',
        area: 'Ueno',
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
        area: 'Ueno',
        period: 'Feb 15 - May 20',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-05-20'),
        tags: ['history', 'traditional', 'open now'],
        price: 1800,
        image: 'ancient-history.jpg'
    },
    {
        id: 3,
        title: 'Photography',
        museum: 'Art Gallery',
        area: 'Roppongi',
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
        title: 'Digital Innovation',
        museum: 'Tech Museum',
        area: 'Shibuya',
        period: 'Jan 5 - Apr 10',
        startDate: new Date('2025-01-05'),
        endDate: new Date('2025-04-10'),
        tags: ['technology', 'digital', 'interactive', 'open now'],
        price: 2200,
        image: 'digital-innovation.jpg'
    },
    {
        id: 5,
        title: 'Impressionist Masters',
        museum: 'Fine Arts Museum',
        area: 'Ueno',
        period: 'Feb 1 - May 15',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-05-15'),
        tags: ['impressionism', 'painting', 'classical', 'open now'],
        price: 2500,
        image: 'impressionist.jpg'
    },
    {
        id: 6,
        title: 'Sculpture Garden',
        museum: 'Outdoor Gallery',
        area: 'Roppongi',
        period: 'Mar 1 - Aug 31',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-08-31'),
        tags: ['sculpture', 'outdoor', 'contemporary', 'open now'],
        price: 1200,
        image: 'sculpture.jpg'
    },
    {
        id: 7,
        title: 'Future Craft',
        museum: 'Design Center',
        area: 'Harajuku',
        period: 'Apr 1 - Jul 31',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-07-31'),
        tags: ['crafts', 'contemporary', 'open soon'],
        price: 1800,
        image: 'future-craft.jpg'
    },
    {
        id: 8,
        title: 'Ancient Civilizations',
        museum: 'History Museum',
        area: 'Ueno',
        period: 'May 1 - Sep 30',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-09-30'),
        tags: ['history', 'archaeology', 'traditional', 'open soon'],
        price: 2000,
        image: 'ancient-civilizations.jpg'
    },
    {
        id: 9,
        title: 'Modern Portraits',
        museum: 'Portrait Gallery',
        area: 'Ginza',
        period: 'Jun 1 - Oct 15',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-10-15'),
        tags: ['portrait', 'contemporary', 'photography', 'open soon'],
        price: 1600,
        image: 'modern-portraits.jpg'
    },
    {
        id: 10,
        title: 'Science & Art',
        museum: 'Science Museum',
        area: 'Odaiba',
        period: 'Jul 1 - Nov 30',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-11-30'),
        tags: ['science', 'interactive', 'educational', 'open soon'],
        price: 1900,
        image: 'science-art.jpg'
    },
    {
        id: 11,
        title: 'Traditional Crafts',
        museum: 'Cultural Center',
        area: 'Asakusa',
        period: 'Aug 1 - Dec 31',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-12-31'),
        tags: ['crafts', 'traditional', 'cultural', 'open soon'],
        price: 1400,
        image: 'traditional-crafts.jpg'
    },
    {
        id: 12,
        title: 'Abstract Expressions',
        museum: 'Modern Art Gallery',
        area: 'Roppongi',
        period: 'Sep 1 - Jan 31',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-01-31'),
        tags: ['abstract', 'contemporary', 'painting', 'open soon'],
        price: 2100,
        image: 'abstract.jpg'
    },
    {
        id: 13,
        title: 'Video Art Festival',
        museum: 'Media Center',
        area: 'Shibuya',
        period: 'Oct 1 - Feb 28',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-02-28'),
        tags: ['video', 'digital', 'contemporary', 'open soon'],
        price: 1700,
        image: 'video-art.jpg'
    },
    {
        id: 14,
        title: 'Photography Pioneers',
        museum: 'Photo Museum',
        area: 'Ebisu',
        period: 'Nov 1 - Mar 31',
        startDate: new Date('2025-11-01'),
        endDate: new Date('2026-03-31'),
        tags: ['photography', 'history', 'classical', 'open soon'],
        price: 1800,
        image: 'photo-pioneers.jpg'
    },
    {
        id: 15,
        title: 'Interactive Installations',
        museum: 'New Media Gallery',
        area: 'Shinjuku',
        period: 'Dec 1 - Apr 30',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-04-30'),
        tags: ['interactive', 'digital', 'contemporary', 'open soon'],
        price: 2300,
        image: 'interactive.jpg'
    }
];

// Function to update exhibition status based on current date
function updateExhibitionStatus(exhibitions) {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    return exhibitions.map(exhibition => {
        const exhibit = {...exhibition};
        const tags = exhibit.tags.filter(tag => !['open now', 'open soon', 'close soon'].includes(tag));
        
        if (exhibit.startDate <= today && exhibit.endDate >= today) {
            if (exhibit.endDate <= sevenDaysFromNow) {
                tags.push('close soon');
            } else {
                tags.push('open now');
            }
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
let selectedAreas = [];

// Pagination variables
let currentPage = 1;
let itemsPerPage = 6;
let totalPages = 1;
let currentExhibitionsData = [];

// Home page pagination variables
let homeCurrentPage = 1;
let homeItemsPerPage = 6;
let homeTotalPages = 1;
let homeCurrentExhibitionsData = [];

function showScreen(screenId, addToHistory = true) {
    if (addToHistory && currentScreen && currentScreen !== screenId) {
        screenHistory.push(currentScreen);
    }
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show the selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
    }
    
    // Close any open menus
    closeAllMenus();
    
    if (screenId === 'screen-all-exhibitions') {
        renderAllExhibitions();
    }
    
    if (screenId === 'screen-popular-exhibitions') {
        renderPopularExhibitions();
    }
    
    if (screenId === 'screen-my-list') {
        renderMyList();
    }
    
    if (screenId === 'screen-ticket-detail') {
        generateQRCodes();
    }
    
    if (screenId === 'screen-detail') {
        // Reset carousel to first slide
        currentSlide = 0;
        updateCarousel();
        // Update detail heart button
        updateDetailHeartButton();
        // Re-initialize touch support
        setTimeout(() => {
            initCarouselTouch();
        }, 100);
    }
    
    if (screenId === 'screen-summary') {
        updateOrderSummary();
    }
    
    if (screenId === 'screen-confirmation') {
        updateConfirmationPage();
    }
    
    if (screenId === 'screen-time') {
        updateTimePageDate();
    }
    
    if (screenId === 'screen-tickets') {
        updateTicketPageDateTime();
    }
    
    if (screenId === 'screen-museum-detail') {
        updateMuseumDetailPage();
    }
    
    if (screenId === 'screen-my-museums') {
        renderMyMuseums();
    }
}

function goBack() {
    if (screenHistory.length > 0) {
        const previousScreen = screenHistory.pop();
        showScreen(previousScreen, false);
    } else {
        showScreen('screen-home', false);
    }
}

function goHome() {
    screenHistory = [];
    showScreen('screen-home', false);
}

function login() {
    user.isLoggedIn = true;
    showScreen('screen-home');
}

function register() {
    user.isLoggedIn = true;
    showScreen('screen-home');
}

function logout() {
    user.isLoggedIn = false;
    screenHistory = [];
    showScreen('screen-login', false);
}

function toggleProfileMenu(event) {
    // Close all other dropdowns first
    const allDropdowns = document.querySelectorAll('.profile-dropdown');
    allDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    
    // Find the dropdown within the current context
    const clickedElement = event ? event.target : null;
    let dropdown;
    
    if (clickedElement) {
        // Find the dropdown within the same profile section
        const profileSection = clickedElement.closest('.profile-section');
        dropdown = profileSection ? profileSection.querySelector('.profile-dropdown') : null;
    }
    
    // Fallback: find dropdown in active screen
    if (!dropdown) {
        const activeScreen = document.querySelector('.screen.active');
        dropdown = activeScreen ? activeScreen.querySelector('.profile-dropdown') : null;
    }
    
    // Final fallback: use first dropdown found
    if (!dropdown) {
        dropdown = document.querySelector('.profile-dropdown');
    }
    
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function toggleMainMenu(event) {
    // Close all other menus first
    const allMenus = document.querySelectorAll('.main-menu');
    allMenus.forEach(menu => menu.classList.remove('active'));
    
    // Find the menu within the current screen
    const clickedElement = event ? event.target : null;
    let menu;
    
    if (clickedElement) {
        // Find the menu within the same header
        const header = clickedElement.closest('.app-header');
        menu = header ? header.querySelector('.main-menu') : null;
    }
    
    // Fallback: find menu in active screen
    if (!menu) {
        const activeScreen = document.querySelector('.screen.active');
        menu = activeScreen ? activeScreen.querySelector('.main-menu') : null;
    }
    
    // Final fallback: use first menu found
    if (!menu) {
        menu = document.querySelector('.main-menu');
    }
    
    if (menu) {
        menu.classList.toggle('active');
    }
}

function closeAllMenus() {
    const dropdowns = document.querySelectorAll('.profile-dropdown, .main-menu');
    dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
}

function selectTime(timeSlot) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked slot
    timeSlot.classList.add('selected');
    selectedTime = timeSlot.textContent;
    bookingData.time = selectedTime;
}

function selectDate(date) {
    selectedDate = date;
    bookingData.date = `July ${date}, 2025`;
}

function generateQRCodes() {
    const qr1 = document.getElementById('qr1');
    const qr2 = document.getElementById('qr2');
    
    if (qr1 && typeof QRCode !== 'undefined') {
        qr1.innerHTML = '';
        QRCode.toCanvas(qr1, JSON.stringify({
            exhibition: bookingData.exhibition,
            date: bookingData.date || 'July 10, 2025',
            time: bookingData.time || '10:00',
            ticketId: 'TKT001',
            type: 'Adult'
        }), function (error) {
            if (error) console.error(error);
        });
    }
    
    if (qr2 && typeof QRCode !== 'undefined') {
        qr2.innerHTML = '';
        QRCode.toCanvas(qr2, JSON.stringify({
            exhibition: bookingData.exhibition,
            date: bookingData.date || 'July 10, 2025',
            time: bookingData.time || '10:00',
            ticketId: 'TKT002',
            type: 'Adult'
        }), function (error) {
            if (error) console.error(error);
        });
    }
}

function incrementTicket(type) {
    tickets[type]++;
    document.getElementById(`${type}-count`).textContent = tickets[type];
    updateBookingSummary();
}

function decrementTicket(type) {
    if (tickets[type] > 0) {
        tickets[type]--;
        document.getElementById(`${type}-count`).textContent = tickets[type];
        updateBookingSummary();
    }
}

function updateBookingSummary() {
    let totalPrice = 0;
    bookingData.tickets = {};
    
    for (const [type, count] of Object.entries(tickets)) {
        if (count > 0) {
            totalPrice += count * ticketPrices[type];
            bookingData.tickets[type] = count;
        }
    }
    
    bookingData.totalPrice = totalPrice;
}

function processPayment() {
    // Simulate payment processing
    setTimeout(() => {
        showScreen('screen-confirmation');
    }, 1000);
}

function updateOrderSummary() {
    // Update exhibition details
    document.getElementById('summary-exhibition-title').textContent = bookingData.exhibition;
    document.getElementById('summary-museum-name').textContent = bookingData.museum;
    document.getElementById('summary-date-time').textContent = `${bookingData.date} at ${bookingData.time}`;
    
    // Update ticket breakdown
    const ticketBreakdown = document.getElementById('summary-ticket-breakdown');
    ticketBreakdown.innerHTML = '';
    
    const ticketTypeNames = {
        'adult': 'Adult',
        'child': 'Child',
        'student': 'Student',
        'senior': 'Senior',
        'disabled': 'Disabled',
        'disabled-company': 'Disabled company'
    };
    
    for (const [type, count] of Object.entries(bookingData.tickets)) {
        if (count > 0) {
            const ticketLine = document.createElement('div');
            ticketLine.className = 'ticket-line';
            ticketLine.innerHTML = `
                <span>${ticketTypeNames[type]} x${count}</span>
                <span>¥${(count * ticketPrices[type]).toLocaleString()}</span>
            `;
            ticketBreakdown.appendChild(ticketLine);
        }
    }
    
    // Update total
    document.getElementById('summary-total-amount').textContent = `¥${bookingData.totalPrice.toLocaleString()}`;
}

function updateConfirmationPage() {
    // Update exhibition details
    document.getElementById('confirmation-exhibition-title').textContent = bookingData.exhibition;
    document.getElementById('confirmation-museum-name').textContent = bookingData.museum;
    document.getElementById('confirmation-date-time').textContent = `${bookingData.date} at ${bookingData.time}`;
    
    // Update ticket breakdown
    const ticketBreakdown = document.getElementById('confirmation-ticket-breakdown');
    ticketBreakdown.innerHTML = '';
    
    const ticketTypeNames = {
        'adult': 'Adult',
        'child': 'Child',
        'student': 'Student',
        'senior': 'Senior',
        'disabled': 'Disabled',
        'disabled-company': 'Disabled company'
    };
    
    for (const [type, count] of Object.entries(bookingData.tickets)) {
        if (count > 0) {
            const ticketLine = document.createElement('div');
            ticketLine.className = 'ticket-line';
            ticketLine.innerHTML = `
                <span>${ticketTypeNames[type]} x${count}</span>
                <span>¥${(count * ticketPrices[type]).toLocaleString()}</span>
            `;
            ticketBreakdown.appendChild(ticketLine);
        }
    }
    
    // Update total
    document.getElementById('confirmation-total-amount').textContent = `¥${bookingData.totalPrice.toLocaleString()}`;
}

function updateTimePageDate() {
    const dateElement = document.getElementById('time-selected-date');
    if (dateElement && bookingData.date) {
        dateElement.textContent = `Selected Date: ${bookingData.date}`;
    }
}

function updateTicketPageDateTime() {
    const datetimeElement = document.getElementById('ticket-selected-datetime');
    if (datetimeElement && bookingData.date && bookingData.time) {
        datetimeElement.textContent = `${bookingData.date} at ${bookingData.time}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language display
    updateLanguageDisplay();
    
    // Initialize exhibitions display
    renderExhibitions();
    
    // Initialize My List UI
    updateMyListUI();
    
    // Add click listeners to close menus when clicking outside
    document.addEventListener('click', function(event) {
        const profileSection = event.target.closest('.profile-section');
        const menuSection = event.target.closest('.menu-section');
        
        if (!profileSection) {
            const allDropdowns = document.querySelectorAll('.profile-dropdown');
            allDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
        
        if (!menuSection) {
            const allMenus = document.querySelectorAll('.main-menu');
            allMenus.forEach(menu => menu.classList.remove('active'));
        }
    });
    
    // Add click listeners for calendar dates
    document.addEventListener('click', function(event) {
        if (event.target.parentElement && event.target.parentElement.classList.contains('dates') && event.target.tagName === 'SPAN') {
            // Remove previous selection
            document.querySelectorAll('.dates span').forEach(span => {
                span.classList.remove('selected');
            });
            
            // Add selection to clicked date
            event.target.classList.add('selected');
            selectDate(event.target.textContent);
        }
    });
});

// Search functionality
let searchQuery = '';

function searchExhibitions(query) {
    searchQuery = query.toLowerCase();
    toggleClearButton('home-search');
    renderExhibitions();
}

function renderExhibitions() {
    const popularGrid = document.querySelector('.popular-section .exhibition-grid');
    const filteredTitle = document.getElementById('filtered-results-title');
    
    // Popular exhibitions are always fixed
    if (popularGrid) {
        popularGrid.innerHTML = generateExhibitionCards(popularExhibitionsWithStatus);
    }
    
    // Filter exhibitions based on search and tags
    let displayed = filteredExhibitions;
    
    if (searchQuery) {
        displayed = displayed.filter(exhibition => 
            exhibition.title.toLowerCase().includes(searchQuery) ||
            exhibition.museum.toLowerCase().includes(searchQuery) ||
            exhibition.area.toLowerCase().includes(searchQuery) ||
            exhibition.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
        
        if (filteredTitle) {
            filteredTitle.textContent = `Search results for "${searchQuery}"`;
        }
    } else {
        if (filteredTitle) {
            let titleText = 'All exhibitions';
            let filters = [];
            
            if (selectedTags.length > 0) {
                filters.push(selectedTags.join(', '));
            }
            if (selectedAreas.length > 0) {
                filters.push(selectedAreas.join(', '));
            }
            
            if (filters.length > 0) {
                titleText = `Filtered results (${filters.join(' | ')})`;
            }
            
            filteredTitle.textContent = titleText;
        }
    }
    
    // Update home page pagination with filtered results
    homeCurrentPage = 1; // Reset to first page when filtering/searching
    updateHomePagination(displayed);
    renderHomeExhibitionsWithPagination();
}

function generateExhibitionCards(exhibitions) {
    return exhibitions.map(exhibition => `
        <div class="exhibition-card" onclick="selectExhibition(${exhibition.id})">
            <div class="card-image"></div>
            <button class="heart-btn ${isInMyList(exhibition.id) ? 'active' : ''}" 
                    data-exhibition-id="${exhibition.id}" 
                    onclick="event.stopPropagation(); toggleMyList(${exhibition.id});">
                ${isInMyList(exhibition.id) ? '❤️' : '🤍'}
            </button>
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
            <button class="heart-btn ${isInMyList(exhibition.id) ? 'active' : ''}" 
                    data-exhibition-id="${exhibition.id}" 
                    onclick="event.stopPropagation(); toggleMyList(${exhibition.id});">
                ${isInMyList(exhibition.id) ? '❤️' : '🤍'}
            </button>
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

function toggleTag(tag) {
    const tagIndex = selectedTags.indexOf(tag);
    
    if (tagIndex === -1) {
        selectedTags.push(tag);
    } else {
        selectedTags.splice(tagIndex, 1);
    }
    
    // Update tag button appearance
    updateTagButtons();
    
    // Filter exhibitions
    filterExhibitions();
}

function toggleArea(area) {
    const areaIndex = selectedAreas.indexOf(area);
    
    if (areaIndex === -1) {
        selectedAreas.push(area);
    } else {
        selectedAreas.splice(areaIndex, 1);
    }
    
    // Update area button appearance
    updateAreaButtons();
    
    // Filter exhibitions
    filterExhibitions();
}

function renderAllExhibitions() {
    const count = document.getElementById('all-exhibitions-count');
    const list = document.getElementById('all-exhibitions-list');
    
    // Reset pagination when loading all exhibitions
    currentPage = 1;
    updatePagination(exhibitionsData);
    renderAllExhibitionsWithPagination();
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

function updateTagButtons() {
    const tagButtons = document.querySelectorAll('.tag-btn');
    tagButtons.forEach(button => {
        const tag = button.textContent.toLowerCase();
        if (selectedTags.includes(tag)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function updateAreaButtons() {
    const areaButtons = document.querySelectorAll('.area-btn');
    areaButtons.forEach(button => {
        const area = button.textContent;
        if (selectedAreas.includes(area)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
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
    
    const mainGrid = document.querySelector('.filtered-results-section .exhibition-grid');
    const filteredTitle = document.getElementById('filtered-results-title');
    
    if (selectedTags.length === 0) {
        filteredExhibitions = allExhibitionsWithStatus;
    } else {
        filteredExhibitions = allExhibitionsWithStatus.filter(exhibition => 
            selectedTags.every(tag => exhibition.tags.includes(tag))
        );
    }
    
    if (mainGrid) {
        if (filtered.length === 0) {
            mainGrid.innerHTML = '<div class="no-results"><p>No exhibitions found matching your criteria.</p></div>';
        } else {
            mainGrid.innerHTML = generateExhibitionCards(filtered);
        }
    }
    
    if (filteredTitle) {
        if (selectedTags.length === 0) {
            filteredTitle.textContent = 'All exhibitions';
        } else {
            filteredTitle.textContent = `Filtered results (${selectedTags.join(', ')})`;
        }
    }
}

function filterExhibitions() {
    const title = document.getElementById('filtered-results-title');
    
    let filtered = allExhibitionsWithStatus;
    
    // Apply tag filters
    if (selectedTags.length > 0) {
        filtered = filtered.filter(exhibition => 
            selectedTags.every(tag => exhibition.tags.includes(tag))
        );
    }
    
    // Apply area filters
    if (selectedAreas.length > 0) {
        filtered = filtered.filter(exhibition => 
            selectedAreas.includes(exhibition.area)
        );
    }
    
    if (title) {
        let titleText = 'All exhibitions';
        let filters = [];
        
        if (selectedTags.length > 0) {
            filters.push(selectedTags.join(', '));
        }
        if (selectedAreas.length > 0) {
            filters.push(selectedAreas.join(', '));
        }
        
        if (filters.length > 0) {
            titleText = `Filtered results (${filters.join(' | ')})`;
        }
        
        title.textContent = titleText;
    }
    
    filteredExhibitions = filtered;
    
    // Update home page pagination with filtered results
    homeCurrentPage = 1; // Reset to first page when filtering
    updateHomePagination(filtered);
    renderHomeExhibitionsWithPagination();
}

function toggleMoreFilters() {
    const panel = document.getElementById('more-filters-panel');
    panel.classList.toggle('active');
}

function clearAllFilters() {
    selectedTags = [];
    selectedAreas = [];
    updateTagButtons();
    updateAreaButtons();
    filterExhibitions();
    toggleMoreFilters();
}

// My List functionality
function addToMyList(exhibitionId) {
    if (!myList.includes(exhibitionId)) {
        myList.push(exhibitionId);
        localStorage.setItem('myList', JSON.stringify(myList));
        updateMyListUI();
    }
}

function removeFromMyList(exhibitionId) {
    const index = myList.indexOf(exhibitionId);
    if (index > -1) {
        myList.splice(index, 1);
        localStorage.setItem('myList', JSON.stringify(myList));
        updateMyListUI();
    }
}

function toggleMyList(exhibitionId) {
    if (myList.includes(exhibitionId)) {
        removeFromMyList(exhibitionId);
    } else {
        addToMyList(exhibitionId);
    }
}

function isInMyList(exhibitionId) {
    return myList.includes(exhibitionId);
}

function renderMyList() {
    const count = document.getElementById('my-list-count');
    const list = document.getElementById('my-list-exhibitions');
    
    if (!count || !list) return;
    
    const myExhibitions = exhibitionsData.filter(ex => myList.includes(ex.id));
    
    if (myExhibitions.length === 0) {
        count.textContent = '0 exhibitions in your list';
        list.innerHTML = `
            <div class="no-results">
                <p>No exhibitions added to your list yet.</p>
                <p>Browse exhibitions and tap the heart icon to add them to your list.</p>
            </div>
        `;
    } else {
        count.textContent = `${myExhibitions.length} exhibitions in your list`;
        list.innerHTML = generateExhibitionCards(myExhibitions);
    }
}

function updateMyListUI() {
    // Update heart icons throughout the app
    const heartButtons = document.querySelectorAll('.heart-btn');
    heartButtons.forEach(btn => {
        const exhibitionId = parseInt(btn.dataset.exhibitionId);
        if (isInMyList(exhibitionId)) {
            btn.classList.add('active');
            btn.innerHTML = '❤️';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍';
        }
    });
    
    // Update detail page heart button
    updateDetailHeartButton();
    
    // Update My List page if currently visible
    if (currentScreen === 'screen-my-list') {
        renderMyList();
    }
}

function toggleMyListFromDetail() {
    // Get the current exhibition from bookingData
    const exhibition = exhibitionsData.find(ex => ex.title === bookingData.exhibition);
    if (exhibition) {
        toggleMyList(exhibition.id);
    }
}

function updateDetailHeartButton() {
    const detailHeartBtn = document.getElementById('detail-heart-btn');
    if (detailHeartBtn && bookingData.exhibition) {
        const exhibition = exhibitionsData.find(ex => ex.title === bookingData.exhibition);
        if (exhibition) {
            if (isInMyList(exhibition.id)) {
                detailHeartBtn.classList.add('active');
                detailHeartBtn.innerHTML = '❤️';
            } else {
                detailHeartBtn.classList.remove('active');
                detailHeartBtn.innerHTML = '🤍';
            }
        }
    }
}

function shareExhibition() {
    const exhibition = exhibitionsData.find(ex => ex.title === bookingData.exhibition);
    if (!exhibition) return;
    
    const shareData = {
        title: exhibition.title,
        text: `Check out this amazing exhibition: ${exhibition.title} at ${exhibition.museum}`,
        url: window.location.href
    };
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `${shareData.text}\n${shareData.url}`;
        
        // Try to copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    alert('Exhibition details copied to clipboard!');
                })
                .catch(() => {
                    fallbackShare(shareText);
                });
        } else {
            fallbackShare(shareText);
        }
    }
}

function fallbackShare(text) {
    // Create a temporary text area to copy text
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Exhibition details copied to clipboard!');
    } catch (err) {
        // If all else fails, show a simple dialog
        prompt('Copy this text to share:', text);
    } finally {
        document.body.removeChild(textArea);
    }
}

function openGoogleMaps() {
    // Tokyo Museum coordinates (using National Museum of Tokyo as example)
    const lat = 35.7187;
    const lng = 139.7776;
    const address = '1-2-3 Ueno, Taito City, Tokyo 110-0007';
    
    // Check if we're on mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Open Google Maps app if available, otherwise web
        const mapsAppUrl = `comgooglemaps://?q=${lat},${lng}&center=${lat},${lng}&zoom=16`;
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        
        // Try to open in Google Maps app first
        window.location.href = mapsAppUrl;
        
        // Fallback to web after a short delay
        setTimeout(() => {
            window.open(webUrl, '_blank');
        }, 500);
    } else {
        // Desktop - open in new tab
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(webUrl, '_blank');
    }
}

// Toggle clear button visibility
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

// Clear search input
function clearSearch(inputId) {
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(inputId + '-clear');
    
    if (input) {
        input.value = '';
        
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
        exhibition.area.toLowerCase().includes(searchTerm) ||
        exhibition.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    // Reset pagination and update with filtered results
    currentPage = 1;
    updatePagination(filtered);
    renderAllExhibitionsWithPagination();
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
        exhibition.area.toLowerCase().includes(searchTerm) ||
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

// FAQ search functionality
function searchFAQ(query) {
    const searchTerm = query.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    let visibleCount = 0;
    
    toggleClearButton('help-search');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm) || searchTerm === '') {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    const existingNoResults = document.querySelector('.faq-section .no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    if (visibleCount === 0 && searchTerm) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = '<p>No FAQ items found matching your search.</p><p>Try different keywords or contact support directly.</p>';
        document.querySelector('.faq-section').appendChild(noResultsDiv);
    }
}

function toggleFAQ(faqItem) {
    const answer = faqItem.querySelector('.faq-answer');
    const arrow = faqItem.querySelector('.faq-arrow');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        arrow.textContent = '▼';
        faqItem.classList.remove('active');
    } else {
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq-answer').style.display = 'none';
                item.querySelector('.faq-arrow').textContent = '▼';
                item.classList.remove('active');
            }
        });
        
        answer.style.display = 'block';
        arrow.textContent = '▲';
        faqItem.classList.add('active');
    }
}

// Pagination functions
function updatePagination(exhibitions) {
    currentExhibitionsData = exhibitions;
    totalPages = Math.ceil(exhibitions.length / itemsPerPage);
    
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = 1;
    }
    
    renderPaginationControls();
}

function renderPaginationControls() {
    const paginationContainer = document.getElementById('all-exhibitions-pagination');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    if (!paginationContainer) return;
    
    // Update previous/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Generate page numbers
    pageNumbers.innerHTML = '';
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Show max 5 page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('div');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderAllExhibitionsWithPagination();
}

function goToPreviousPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

function renderAllExhibitionsWithPagination() {
    const list = document.getElementById('all-exhibitions-list');
    const count = document.getElementById('all-exhibitions-count');
    
    if (!list || !count) return;
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageExhibitions = currentExhibitionsData.slice(startIndex, endIndex);
    
    // Update count display
    const totalItems = currentExhibitionsData.length;
    const startItem = totalItems > 0 ? startIndex + 1 : 0;
    const endItem = Math.min(endIndex, totalItems);
    count.textContent = `Showing ${startItem}-${endItem} of ${totalItems} exhibitions`;
    
    // Render exhibitions for current page
    if (pageExhibitions.length === 0 && currentExhibitionsData.length === 0) {
        list.innerHTML = '<div class="no-results"><p>No exhibitions found.</p></div>';
    } else {
        list.innerHTML = generateSearchExhibitionItems(pageExhibitions);
    }
    
    // Update pagination controls
    renderPaginationControls();
}

// Home page pagination functions
function updateHomePagination(exhibitions) {
    homeCurrentExhibitionsData = exhibitions;
    homeTotalPages = Math.ceil(exhibitions.length / homeItemsPerPage);
    
    if (homeCurrentPage > homeTotalPages && homeTotalPages > 0) {
        homeCurrentPage = 1;
    }
    
    renderHomePaginationControls();
}

function renderHomePaginationControls() {
    const paginationContainer = document.getElementById('home-exhibitions-pagination');
    const prevBtn = document.getElementById('home-prev-page');
    const nextBtn = document.getElementById('home-next-page');
    const pageNumbers = document.getElementById('home-page-numbers');
    
    if (!paginationContainer) return;
    
    // Update previous/next buttons
    prevBtn.disabled = homeCurrentPage === 1;
    nextBtn.disabled = homeCurrentPage === homeTotalPages || homeTotalPages === 0;
    
    // Generate page numbers
    pageNumbers.innerHTML = '';
    
    if (homeTotalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Show max 5 page numbers
    let startPage = Math.max(1, homeCurrentPage - 2);
    let endPage = Math.min(homeTotalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('div');
        pageBtn.className = `page-number ${i === homeCurrentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToHomePage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

function goToHomePage(page) {
    if (page < 1 || page > homeTotalPages) return;
    homeCurrentPage = page;
    renderHomeExhibitionsWithPagination();
}

function goToHomePreviousPage() {
    if (homeCurrentPage > 1) {
        goToHomePage(homeCurrentPage - 1);
    }
}

function goToHomeNextPage() {
    if (homeCurrentPage < homeTotalPages) {
        goToHomePage(homeCurrentPage + 1);
    }
}

function renderHomeExhibitionsWithPagination() {
    const grid = document.getElementById('home-exhibitions-grid');
    const count = document.getElementById('home-exhibitions-count');
    
    if (!grid || !count) return;
    
    // Calculate start and end indices for current page
    const startIndex = (homeCurrentPage - 1) * homeItemsPerPage;
    const endIndex = startIndex + homeItemsPerPage;
    const pageExhibitions = homeCurrentExhibitionsData.slice(startIndex, endIndex);
    
    // Update count display
    const totalItems = homeCurrentExhibitionsData.length;
    const startItem = totalItems > 0 ? startIndex + 1 : 0;
    const endItem = Math.min(endIndex, totalItems);
    count.textContent = `Showing ${startItem}-${endItem} of ${totalItems} exhibitions`;
    
    // Render exhibitions for current page
    if (pageExhibitions.length === 0 && homeCurrentExhibitionsData.length === 0) {
        grid.innerHTML = '<div class="no-results"><p>No exhibitions found.</p></div>';
    } else {
        grid.innerHTML = generateExhibitionCards(pageExhibitions);
    }
    
    // Update pagination controls
    renderHomePaginationControls();
}

// Carousel variables
let currentSlide = 0;
const totalSlides = 5;

function updateCarousel() {
    const track = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('#carousel-indicators .indicator');
    
    if (!track) return;
    
    // Update track position
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Touch/swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

function initCarouselTouch() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
    }
}

// Calendar functionality
let currentCalendarMonth = 7; // July (1-based)
let currentCalendarYear = 2025;

function goToNextMonth() {
    currentCalendarMonth++;
    if (currentCalendarMonth > 12) {
        currentCalendarMonth = 1;
        currentCalendarYear++;
    }
    updateCalendarDisplay();
}

function goToPreviousMonth() {
    currentCalendarMonth--;
    if (currentCalendarMonth < 1) {
        currentCalendarMonth = 12;
        currentCalendarYear--;
    }
    updateCalendarDisplay();
}

function updateCalendarDisplay() {
    const monthYearElement = document.getElementById('calendar-month-year');
    if (monthYearElement) {
        monthYearElement.textContent = `${currentCalendarYear}, ${currentCalendarMonth}`;
    }
}

// Initialize carousel touch support when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCarouselTouch();
});

// Museum functionality
let currentMuseumId = null;

function showMuseumDetail(museumName) {
    const museum = museumsData.find(m => m.name === museumName);
    if (museum) {
        currentMuseumId = museum.id;
        showScreen('screen-museum-detail');
    }
}

function updateMuseumDetailPage() {
    if (!currentMuseumId) return;
    
    const museum = museumsData.find(m => m.id === currentMuseumId);
    if (!museum) return;
    
    // Update museum name and description
    document.getElementById('museum-name').textContent = museum.name;
    document.getElementById('museum-description').textContent = museum.description;
    
    // Update contact info
    document.getElementById('museum-address').textContent = museum.address;
    document.getElementById('museum-phone').textContent = museum.phone;
    document.getElementById('museum-email').textContent = museum.email;
    
    // Update hours
    const hoursContainer = document.getElementById('museum-hours');
    hoursContainer.innerHTML = '';
    for (const [day, hours] of Object.entries(museum.hours)) {
        const hoursItem = document.createElement('div');
        hoursItem.className = hours === 'Closed' ? 'hours-item closed' : 'hours-item';
        hoursItem.innerHTML = `
            <span class="day-label">${day}</span>
            <span class="time-value">${hours}</span>
        `;
        hoursContainer.appendChild(hoursItem);
    }
    
    // Update admission prices
    const admissionContainer = document.getElementById('museum-admission');
    admissionContainer.innerHTML = '';
    for (const [type, price] of Object.entries(museum.admission)) {
        const priceItem = document.createElement('div');
        priceItem.className = 'price-item';
        priceItem.innerHTML = `
            <span class="price-label">${type}</span>
            <span class="price-value">${price}</span>
        `;
        admissionContainer.appendChild(priceItem);
    }
    
    // Update facilities
    const facilitiesContainer = document.getElementById('museum-facilities');
    facilitiesContainer.innerHTML = '';
    museum.facilities.forEach(facility => {
        const facilityItem = document.createElement('div');
        facilityItem.className = 'facility-item';
        facilityItem.innerHTML = `<span>✓ ${facility}</span>`;
        facilitiesContainer.appendChild(facilityItem);
    });
    
    // Update heart button
    updateMuseumHeartButton();
}

function toggleMyMuseum() {
    if (!currentMuseumId) return;
    
    if (myMuseums.includes(currentMuseumId)) {
        removeFromMyMuseums(currentMuseumId);
    } else {
        addToMyMuseums(currentMuseumId);
    }
}

function addToMyMuseums(museumId) {
    if (!myMuseums.includes(museumId)) {
        myMuseums.push(museumId);
        localStorage.setItem('myMuseums', JSON.stringify(myMuseums));
        updateMuseumHeartButton();
    }
}

function removeFromMyMuseums(museumId) {
    const index = myMuseums.indexOf(museumId);
    if (index > -1) {
        myMuseums.splice(index, 1);
        localStorage.setItem('myMuseums', JSON.stringify(myMuseums));
        updateMuseumHeartButton();
        
        // Update My Museums page if currently visible
        if (currentScreen === 'screen-my-museums') {
            renderMyMuseums();
        }
    }
}

function updateMuseumHeartButton() {
    const heartBtn = document.getElementById('museum-heart-btn');
    if (heartBtn && currentMuseumId) {
        if (myMuseums.includes(currentMuseumId)) {
            heartBtn.classList.add('active');
            heartBtn.textContent = '❤️';
        } else {
            heartBtn.classList.remove('active');
            heartBtn.textContent = '🤍';
        }
    }
}

function renderMyMuseums() {
    const count = document.getElementById('my-museums-count');
    const list = document.getElementById('my-museums-list');
    
    if (!count || !list) return;
    
    const favoriteMuseums = museumsData.filter(m => myMuseums.includes(m.id));
    
    if (favoriteMuseums.length === 0) {
        count.textContent = '0 museums in your list';
        list.innerHTML = `
            <div class="no-results">
                <p>No museums added to your favorites yet.</p>
                <p>Visit museum pages and tap the heart icon to add them to your list.</p>
            </div>
        `;
    } else {
        count.textContent = `${favoriteMuseums.length} museums in your list`;
        list.innerHTML = favoriteMuseums.map(museum => `
            <div class="museum-item" onclick="showMuseumDetail('${museum.name}')">
                <div class="museum-item-info">
                    <h3>${museum.name}</h3>
                    <p>${museum.address}</p>
                </div>
                <button class="heart-btn active" 
                        onclick="event.stopPropagation(); currentMuseumId = ${museum.id}; toggleMyMuseum();">
                    ❤️
                </button>
            </div>
        `).join('');
    }
}

function shareMuseum() {
    if (!currentMuseumId) return;
    
    const museum = museumsData.find(m => m.id === currentMuseumId);
    if (!museum) return;
    
    const shareData = {
        title: museum.name,
        text: `Check out ${museum.name} - ${museum.description}`,
        url: window.location.href
    };
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Museum shared successfully'))
            .catch((error) => console.log('Error sharing museum:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `${shareData.text}\n${shareData.url}`;
        
        // Try to copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    alert('Museum details copied to clipboard!');
                })
                .catch(() => {
                    fallbackShareMuseum(shareText);
                });
        } else {
            fallbackShareMuseum(shareText);
        }
    }
}

function fallbackShareMuseum(text) {
    // Create a temporary text area to copy text
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Museum details copied to clipboard!');
    } catch (err) {
        // If all else fails, show a simple dialog
        prompt('Copy this text to share:', text);
    } finally {
        document.body.removeChild(textArea);
    }
}

function openMuseumMap() {
    if (!currentMuseumId) return;
    
    const museum = museumsData.find(m => m.id === currentMuseumId);
    if (!museum) return;
    
    // For demo purposes, using example coordinates
    const coordinates = {
        'Tokyo Museum': { lat: 35.7187, lng: 139.7776 },
        'National Museum': { lat: 35.7188, lng: 139.7754 },
        'Art Gallery': { lat: 35.6654, lng: 139.7297 }
    };
    
    const coords = coordinates[museum.name] || { lat: 35.6762, lng: 139.6503 };
    const address = encodeURIComponent(museum.address);
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        const mapsAppUrl = `comgooglemaps://?q=${coords.lat},${coords.lng}&center=${coords.lat},${coords.lng}&zoom=16`;
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
        
        window.location.href = mapsAppUrl;
        
        setTimeout(() => {
            window.open(webUrl, '_blank');
        }, 500);
    } else {
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
        window.open(webUrl, '_blank');
    }
}