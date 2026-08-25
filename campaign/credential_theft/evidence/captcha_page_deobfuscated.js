        // Generate a random request ID
        function generateRequestId() {
            // Template that will be filled with random hex characters
            const requestIdTemplate = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
            // Replace every 'x' and 'y' in the template
            return requestIdTemplate.replace(/[xy]/g, function (currentCharacter) {
                // Generate a random number between 0 and 15
                const randomHexValue = Math.floor(Math.random() * 16);
                let replacementValue;
                if (currentCharacter === 'x') {
                    // For 'x', use any hexadecimal value (0-15)
                    replacementValue = randomHexValue;
                } else {
                replacementValue = (randomHexValue & 0x3) | 0x8;} //bitwise calulation, after 0x3 output is either 0,1,2,or 3, after the second bitwise, options are 8,9,10,11
                // Convert number to a hexadecimal character
            return replacementValue.toString(16);
        });}

        // Set the request ID
        document.getElementById('request-id').textContent = generateRequestId();

        // Handle successful captcha completion
        function onCaptchaSuccess(captchaToken) {
            const redirectUrl = 'pages/login.php?session_id=<Redacted>';
            const redirectDelayMs = 1000;    
            setTimeout(() => {
                window.location.href = redirectUrl; //win.location.href is whatever the current url of the browser page is. therfore this line is the redirect
            }, redirectDelayMs); //1 sec delay
        }

