// بيانات تجريبية افتراضية للسائقين (تُخزن وتُحدث عبر LocalStorage أو ملف محلي)
let driversData = [
    { id: 1, name: "أحمد العزاوي", phone: "07711223344", type: "تكسي", city: "بعقوبة - التحرير", img: "https://via.placeholder.com/50" },
    { id: 2, name: "سعد التكتك", phone: "07822334455", type: "تكتك", city: "بعقوبة - المعلم", img: "https://via.placeholder.com/50" },
    { id: 3, name: "علي الدراجة", phone: "07733445566", type: "دراجة", city: "خالص", img: "https://via.placeholder.com/50" }
];

// تهيئة الخريطة (المركز على العراق: خط عرض 33.3152، خط طول 44.3661)
const map = L.map('map').setView([33.3152, 44.3661], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

// فحص ما إذا كان المستخدم قد سجل مسبقاً
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('taxi_user');
    if (!savedUser) {
        document.getElementById('registerModal').classList.remove('hidden');
    }
    loadDriversList(driversData);
});

// التعامل مع نموذج التسجيل الأولي
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newUser = {
        name: document.getElementById('regName').value,
        phone: document.getElementById('regPhone').value,
        type: document.getElementById('regType').value,
        city: document.getElementById('regCity').value,
        img: document.getElementById('regImg').value || 'https://via.placeholder.com/50'
    };

    // حفظ البيانات محلياً وإضافتها للقائمة العامة
    localStorage.setItem('taxi_user', JSON.stringify(newUser));
    driversData.unshift(newUser);
    
    document.getElementById('registerModal').classList.add('hidden');
    loadDriversList(driversData);
});

// عرض قائمة السائقين
function loadDriversList(data) {
    const container = document.getElementById('driversList');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#777;">لا يوجد سائقون متاحون حالياً.</p>';
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
                <a href="tel:${driver.phone}" class="call-btn" onclick="handleCall(${index})">📞 اتصال</a>
                <button class="rate-btn" onclick="openReviewModal()">تقييم / إبلاغ</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// محاكاة قاعدة الخصوصية: عند الاتصال أو الحجز، يمكن إخفاء السائق مؤقتاً للآخرين إذا أردت
function handleCall(index) {
    console.slog(`تم الاتصال بالسائق: ${driversData[index].name}`);
}

// الفلترة حسب نوع المركبة
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const type = e.target.getAttribute('data-type');
        if (type === 'all') {
            loadDriversList(driversData);
        } else {
            const filtered = driversData.filter(d => d.type === type);
            loadDriversList(filtered);
        }
    });
} );

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
