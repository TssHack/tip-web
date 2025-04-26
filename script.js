document.getElementById('themeToggle').addEventListener('click', function() {
    const body = document.body;
    const currentMode = body.classList.contains('light-mode') ? 'light' : 'dark';
    if (currentMode === 'light') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '🌕'; // نشان تغییر به تم روشن
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        document.getElementById('themeToggle').textContent = '🌙'; // نشان تغییر به تم تاریک
    }
});

// اضافه کردن قابلیت پیگیری کد رهگیری
document.getElementById('trackingForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const trackingCode = document.getElementById('trackingCode').value.trim();

    if (trackingCode.length === 21 && /^\d+$/.test(trackingCode)) {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('packageInfo').classList.add('hidden');

        try {
            const response = await fetch(`https://open.wiki-api.ir/apis-1/TipaxInfo?key=eLwm3cR-2XegSsv-9l9DCta-q4ng622-EeuAsSy&code=${trackingCode}`);
            const data = await response.json();

            if (data.detail && data.detail.status === 'success') {
                const packageInfo = data.detail.data;
                const senderInfo = packageInfo.sender;
                const receiverInfo = packageInfo.receiver;
                const statusInfo = packageInfo.status_info
                    .map(status => `📅 ${status.date} - ${status.status} - ${status.representation}`)
                    .join("\n");

                const message = `
📦 **اطلاعات مرسوله:**
**فرستنده:** ${senderInfo.name} - ${senderInfo.city}
**گیرنده:** ${receiverInfo.name} - ${receiverInfo.city}

**اطلاعات بسته:**
- ⚖️ وزن: ${packageInfo.weight} کیلوگرم
- 💰 هزینه بسته: ${packageInfo.package_cost} ریال
- 💳 نوع پرداخت: ${packageInfo.pay_type}
- 🛍️ تعداد ارسال: ${packageInfo.dispatch_count}
- 🚫 پرداخت در محل: ${packageInfo.COD}
- 🌍 مسافت: ${packageInfo.city_distance} کیلومتر ( ${packageInfo.distance_zone} )

**📝 وضعیت بسته:**
${statusInfo}
                `;

                document.getElementById('packageDetails').innerText = message;
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('packageInfo').classList.remove('hidden');
            } else {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error').classList.remove('hidden');
            }
        } catch (error) {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error').classList.remove('hidden');
            console.error('Error:', error);
        }
    } else {
        alert('لطفاً کد رهگیری معتبر وارد کنید. کد رهگیری باید 21 رقم باشد.');
    }
});

// دکمه بازگشت برای بازگشت به فرم اولیه
document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('packageInfo').classList.add('hidden');
    document.getElementById('trackingForm').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('loading').classList.add('hidden');
});
