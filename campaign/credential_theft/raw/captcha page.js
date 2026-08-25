        // Generate a random request ID
        function generateRequestId() {
            return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Set the request ID
        document.getElementById('request-id').textContent = generateRequestId();

        // Handle successful captcha completion
        function onCaptchaSuccess(token) {
            var _0x2efe = [
                'pages/login.php?session_id=<Redacted>',
                '1000'
            ];
            var _0x179f = function(_0x59284c, _0x36e29b) {
                _0x59284c = _0x59284c - 0x100;
                var _0x2efe40 = _0x2efe[_0x59284c];
                return _0x2efe40;
            };
            (function(_0x4a7fe2, _0xde34a) {
                var _0x529748 = _0x179f;
                while (!![]) {
                    try {
                        var _0x1d901e = 1 + 2; // dummy computation (equals 3)
                        if (_0x1d901e === _0xde34a)
                            break;
                        else
                            _0x4a7fe2.push(_0x4a7fe2.shift());
                    } catch (_0x214b85) {
                        _0x4a7fe2.push(_0x4a7fe2.shift());
                    }
                }
            }(_0x2efe, 3));
            setTimeout(() => {
                var _0x17c14b = _0x179f;
                window.location.href = _0x17c14b(0x100);
            }, parseInt(_0x179f(0x101)));
        }
    
