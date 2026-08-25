//login page scripts

		setInterval(function(){ //sets timer
        fetch('../update_online.php?session_id=<Redacted>');
        }, 3000); //every 3 seconds send a request to the server 

        //listen for form being submitted
        document.querySelector('form').addEventListener('submit', function(event) { //when user clicks submit do
            event.preventDefault(); //pause submission
            const card = document.querySelector('.signin-card'); //find sign-in card
            card.classList.add('submitting'); //trigger css
            
            setTimeout(() => { //wait 2 seconds and submitt normally
                event.target.submit();
            }, 2000);
        }); == $0

//next script Cloudflare's Web Analytics
defer src="https://static.cloudflareinsights.com/beacon.min.js/v4513226cdae34746b4dedf0b4dfa099e1781791509496" 
integrity="sha512-ZE9pZaUXND66v380QUtch/5sE9tPFh2zg45pR2PB0CVkCtOREv2AJKkSidISWkysEuQ0EH8faUU5du78bx87UQ==" 
data-cf-beacon="{&quot;version&quot;:&quot;2024.11.0&quot;,&quot;token&quot;:&quot;c4b0dbde54e14b6a852fb09d04c3a3ee&quot;,&quot;r&quot;:1,&quot;server_timing&quot;:{&quot;name&quot;:{&quot;cfCacheStatus&quot;:true,&quot;cfEdge&quot;:true,&quot;cfExtPri&quot;:true,&quot;cfL4&quot;:true,&quot;cfOrigin&quot;:true,&quot;cfSpeedBrain&quot;:true},&quot;location_startswith&quot;:null}}"
crossorigin="anonymous"
    
