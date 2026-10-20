const iraqLocations = {
    "ديالى": {
        "قضاء بعقوبة": {
            "ناحية مركز بعقوبة": ["حي التحرير", "حي المعلم", "السور الباب"],
            "ناحية عبارة": ["العبارة المركز"]
        }
    },
    "بغداد": {
        "قضاء الكرخ": {
            "ناحية المنصور": ["المنصور المركز", "الدولعي"]
        }
    }
};

let driversData = [
    { id: 1, name: "أحمد العزاوي", phone: "000000", type: "تكسي", gov: "ديالى", neighborhood: "حي التحرير", landmark: "مستشفى البتول", img: "https://via.placeholder.com/50", status: "active" },
    { id: 2, name: "سعد التكتك", phone: "7777777", type: "تكتك", gov: "ديالى", neighborhood: "حي المعلم", landmark: "الفرع الثاني", img: "https://via.placeholder.com/50", status: "active" }
];

// تهيئة الخريطة
const map = L.map('map').setView([33.3152, 44.3661], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

let mapClickStep = 0;
let selectedVehicleType = 'all';

// التبديل بين طرق تحديد الرحلة
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.method-content').forEach(c => c.classList.remove('active'));
        
        e.target.classList.add('active');
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// التحديد عبر الخريطة مع زر الحذف (✕)
map.on('click', function(e) {
    const coordsText = `خط العرض: ${e.latlng.lat.toFixed(4)}, خط الطول: ${e.latlng.lng.toFixed(4)}`;
    
    if (mapClickStep === 0) {
        document.getElementById('mapStart').value = coordsText;
        mapClickStep = 1;
    } else {
        document.getElementById('mapEnd').value = coordsText;
        mapClickStep = 0;
    }
});

function clearField(fieldId) {
    document.getElementById(fieldId).value = '';
    if(fieldId === 'mapStart') mapClickStep = 0;
}

// نافذة الأدوار
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

// تسلسل دليل المدن
const govSelect = document.getElementById('selectGov');
const distSelect = document.getElementById('selectDistrict');
const subDistSelect = document.getElementById('selectSubdistrict');
const neighSelect = document.getElementById('selectNeighborhood');

govSelect.addEventListener('change', function() {
    distSelect.innerHTML = '<option value="">اختر القضاء...</option>';
    distSelect.disabled = !this.value;
    if(this.value && iraqLocations[this.value]) {
        for (let dist in iraqLocations[this.value]) {
            distSelect.innerHTML += `<option value="${dist}">${dist}</option>`;
        }
    }
});

distSelect.addEventListener('change', function() {
    subDistSelect.innerHTML = '<option value="">اختر الناحية...</option>';
    subDistSelect.disabled = !this.value;
    const gov = govSelect.value;
    if(this.value && iraqLocations[gov][this.value]) {
        for (let sub in iraqLocations[gov][this.value]) {
            subDistSelect.innerHTML += `<option value="${sub}">${sub}</option>`;
        }
    }
});

subDistSelect.addEventListener('change', function() {
    neighSelect.innerHTML = '<option value="">اختر الحي...</option>';
    neighSelect.disabled = !this.value;
    const gov = govSelect.value;
    const dist = distSelect.value;
    if(this.value && iraqLocations[gov][dist][this.value]) {
        iraqLocations[gov][dist][this.value].forEach(n => {
            neighSelect.innerHTML += `<option value="${n}">${n}</option>`;
        });
    }
});

// فلاتر المركبات
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        selectedVehicleType = e.target.getAttribute('data-type');
    });
});

// زر البحث
document.getElementById('searchBtn').addEventListener('click', () => {
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedNeigh = neighSelect.value;

    let filtered = driversData.filter(driver => {
        if (driver.status !== 'active') return false;
        const matchesType = (selectedVehicleType === 'all' || driver.type === selectedVehicleType);
        const matchesNeigh = (selectedNeigh === '' || driver.neighborhood === selectedNeigh);
        const matchesTerm = (term === '' || driver.name.toLowerCase().includes(term) || driver.landmark.toLowerCase().includes(term));
        return matchesType && matchesNeigh && matchesTerm;
    });

    loadDriversList(filtered);
});

// عرض النتائج
function loadDriversList(data) {
    const container = document.getElementById('driversList');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#777;">لا توجد نتائج مطابقة.</p>';
        return;
    }

    data.forEach(driver => {
        const card = document.createElement('div');
        card.className = 'driver-card';
        card.innerHTML = `
            <div class="driver-profile">
                <img src="${driver.img}" alt="${driver.name}">
                <div class="driver-info">
                    <h4>${driver.name} (${driver.type})</h4>
                    <p>📍 ${driver.gov} - ${driver.neighborhood}</p>
                </div>
            </div>
            <div class="driver-actions">
                <a href="tel:${driver.phone}" class="call-btn">📞 اتصال</a>
                <button class="rate-btn" onclick="openReportModal(${driver.id})">⚠️ إبلاغ</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// نظام الإبلاغ والمراجعة
let reportingId = null;
function openReportModal(id) {
    reportingId = id;
    document.getElementById('reviewModal').classList.remove('hidden');
}

document.getElementById('closeReview').addEventListener('click', () => {
    document.getElementById('reviewModal').classList.add('hidden');
});

document.getElementById('reviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const driver = driversData.find(d => d.id === reportingId);
    if (driver) driver.status = 'pending'; // إخفاء فوري لحين المراجعة
    alert('تم إرسال الإبلاغ وإخفاء العنصر مؤقتاً لحين مراجعته من الإدارة.');
    document.getElementById('reviewModal').classList.add('hidden');
    document.getElementById('searchBtn').click();
});

document.getElementById('addLocationBtn').addEventListener('click', () => {
    if(prompt("أدخل اسم المكان أو نقطة الدالة الجديدة المقترحة:")) {
        alert('تم إرسال المقترح للإدارة للمراجعة والنشر.');
    }
});
