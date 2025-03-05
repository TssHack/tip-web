document.getElementById('trackingForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const trackingCode = document.getElementById('trackingCode').value.trim();

    if (trackingCode.length === 21 && /^\d+$/.test(trackingCode)) {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('packageInfo').classList.add('hidden');

        try {
            const response = await fetch(`https://open.wiki-api.ir/apis-1/TipaxInfo?code=${trackingCode}`);
            const data = await response.json();

            if (data.status) {
                const packageInfo = data.results;
                const senderInfo = packageInfo.sender;
                const receiverInfo = packageInfo.receiver;
                const statusInfo = packageInfo.status_info
                    .map(status => `📅 ${status.date} - ${status.status} - ${status.representation}`)
                    .join("\n");

                const message = `
                    **📦 اطلاعات مرسوله:**
                    **فرستنده:** ${senderInfo.name} - ${senderInfo.city}
                    **گیرنده:** ${receiverInfo.name} - ${receiverInfo.city}

                    **اطلاعات بسته:**
                    - ⚖️ وزن: ${packageInfo.weight} کیلوگرم
                    - 💰 هزینه کل: ${packageInfo.total_cost} ریال
                    - 💳 نوع پرداخت: ${packageInfo.pay_type}
                    - 🌍 مسافت: ${packageInfo.city_distance} کیلومتر (زون ${packageInfo.distance_zone})

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

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('packageInfo').classList.add('hidden');
    document.getElementById('trackingForm').reset();
});
