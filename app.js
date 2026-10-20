let driversData = [
    { id: 1, name: "أحمد العزاوي", phone: "07711223344", type: "تكسي", city: "بعقوبة - التحرير", img: "https://via.placeholder.com/50" },
    { id: 2, name: "سعد التكتك", phone: "07822334455", type: "تكتك", city: "بعقوبة - المعلم", img: "https://via.placeholder.com/50" },
    { id: 3, name: "علي الدراجة", phone: "07733445566", type: "دراجة", city: "خالص", img: "https://via.placeholder.com/50" }
];

// تهيئة الخريطة
const map = L.map('map').setView([33.3152, 44.3661], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

let clickCount = 0;
let selectedVehicleType = 'all';

// تفاعل النقر على الخريطة لتحديد المسار (الانطلاق ثم الوصول)
map.on('click', function(e) {
    const latlngText = `خط العرض: ${e.latlng.lat.toFixed(4)}, خط الطول: ${e.latlng.lng.toFixed(4)}`;
    
    if (clickCount === 0) {
        document.getElementById('startPoint').value = latlngText;
        L.marker(e.latlng).addTo(map).bindPopup('نقطة الانطلاق').openPopup();
        clickCount = 1;
    } else if (clickCount === 1) {
        document.getElementById('stopPoint').value = latlngText;
        L.marker(e.latlng).addTo(map).bindPopup('نقطة التوقف').openPopup();
        clickCount = 2;
    } else {
        document.getElementById('endPoint').value = latlngText;
        L.marker(e.latlng).addTo(map).bindPopup('نقطة الوصول').openPopup();
        clickCount = 0; // إعادة تعيين للدورة القادمة
    }
});

// إدارة شاشة اختيار الدور (سائق / راكب)
window.addEventListener('DOMContentLoaded', () => {
    const roleModal = document.getElementById('roleModal');
    const registerModal = document.getElementById('registerModal');

    document.getElementById('btnDriverRole').addEventListener('click', () => {
        roleModal.classList.add('hidden');
        registerModal.classList.remove('hidden');
    });

    document.getElementById('btnPassengerRole').addEventListener('click', () => {
        roleModal.classList.add('hidden');
    });
});

// تسجيل السائق الجديد
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newUser = {
        name: document.getElementById('regName').value,
        phone: document.getElementById('regPhone').value,
        type: document.getElementById('regType').value,
        city: document.getElementById('regCity').value,
        img: document.getElementById('regImg').value || 'https://via.placeholder.com/50'
    };

    driversData.unshift(newUser);
    document.getElementById('registerModal').classList.add('hidden');
    alert('تم تسجيل بياناتك بنجاح وأصبحت متاحة في الدليل.');
});

// اختيار نوع المركبة في الفلتر
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        selectedVehicleType = e.target.getAttribute('data-type');
    });
});

// تنفيذ البحث فقط عند الضغط على زر "بحث"
document.getElementById('searchBtn').addEventListener('click', () => {
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filtered = driversData.filter(driver => {
        const matchesType = (selectedVehicleType === 'all' || driver.type === selectedVehicleType);
        const matchesTerm = (driver.name.toLowerCase().includes(term) || driver.city.toLowerCase().includes(term) || term === '');
        return matchesType && matchesTerm;
    });

    loadDriversList(filtered);
});

// عرض السائقين تحت قسم "نتائج البحث"
function loadDriversList(data) {
    const container = document.getElementById('driversList');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#777;">لا توجد نتائج مطابقة لبحثك.</p>';
        return;
    }

    data.forEach((driver, index) => {
        const card = document.createElement('div');
        card.className = 'driver-card';
        card.innerHTML = `
            <div class="driver-profile">
                <img src="${driver.img}" alt="${driver.name}">
                <div class="driver-info">
                    <h4>${driver.name} (${driver.type})</h4>
                    <p>📍 ${driver.city}</p>
                </div>
            </div>
            <div class="driver-actions">
                <a href="tel:${driver.phone}" class="call-btn">📞 اتصال</a>
                <button class="rate-btn" onclick="openReviewModal()">تقييم / إبلاغ</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// نافذة التقييم والإبلاغ
function openReviewModal() {
    document.getElementById('reviewModal').classList.remove('hidden');
}

document.getElementById('closeReview').addEventListener('click', () => {
    document.getElementById('reviewModal').classList.add('hidden');
});

document.getElementById('reviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('شكراً لك، تم إرسال التقرير/التقييم بنجاح.');
    document.getElementById('reviewModal').classList.add('hidden');
});
