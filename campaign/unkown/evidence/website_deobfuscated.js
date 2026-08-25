/*
 * Arlento Proof-of-Work Verification Script
 *
 * Purpose:
 *   Implements a browser-side Proof-of-Work (PoW) challenge
 *   before granting access to the next stage of the workflow.
 *
 * Observations:
 *   - Uses Web Workers for parallel computation.
 *   - Uses SHA-256 hashing via Web Crypto API.
 *   - Downloads challenge parameters from backend.
 *   - Verifies PoW with backend.
 *   - Redirects user upon successful validation.
 *
 * Relevant Endpoints:
 *   GET  /c4a8b2      -> Retrieve challenge
 *   POST /v9f3e1      -> Submit solution
 *   GET  /get-session -> Retrieve session redirect
 */

(function () {

    //
    // DOM Elements
    //

    const verifyButton = document.getElementById("ugxrd0m9cfrmf1a");
    const loadingIcon  = document.getElementById("lpcst6scx8");
    const statusText   = document.getElementById("didirkc580wh");
    const sessionIdTag = document.getElementById("jbsia16ndm0e0");

    let verificationInProgress = false;

    //
    // Display random session identifier
    //

    if (sessionIdTag) {
        sessionIdTag.textContent =
            Math.random()
                .toString(36)
                .slice(2, 10)
                .toUpperCase();
    }

    if (!verifyButton || !loadingIcon || !statusText) {
        return;
    }

    /*
     * Worker Code
     *
     * Each worker receives:
     *   challenge  -> server nonce
     *   difficulty -> required work factor
     *   workerId   -> starting offset
     *   workers    -> total worker count
     *   rounds     -> additional hashing rounds
     *
     * Goal:
     *   Find an integer value which produces
     *   a SHA-256 hash below a server-defined threshold.
     */

    const workerUrl = URL.createObjectURL(
        new Blob([
`
self.onmessage = async function (event) {

    try {

        const {
            challenge,
            difficulty,
            workerId,
            rounds,
            workers
        } = event.data;

        const threshold =
            Math.pow(2, 32) /
            Math.pow(2, difficulty);

        let current = workerId || 0;

        const encoder = new TextEncoder();

        while (true) {

            const input =
                encoder.encode(challenge + current);

            let hash =
                await crypto.subtle.digest(
                    "SHA-256",
                    input
                );

            /*
             * Optional repeated hashing
             *
             * Increases computational cost.
             */

            for (let i = 0; i < (rounds || 1); i++) {
                hash = await crypto.subtle.digest(
                    "SHA-256",
                    hash
                );
            }

            const bytes =
                new Uint8Array(hash);

            const value =
                (
                    bytes[0] << 24 |
                    bytes[1] << 16 |
                    bytes[2] << 8  |
                    bytes[3]
                ) >>> 0;

            if (value < threshold) {

                postMessage({
                    solution: current
                });

                return;
            }

            current += workers;
        }

    } catch (error) {

        postMessage({
            error: String(error)
        });
    }
};
`
        ], {
            type: "text/javascript"
        })
    );

    /*
     * Analyst Note
     *
     * Creates a worker pool matching the
     * number of available CPU cores and
     * distributes the search space between them.
     */

    function solveProofOfWork(challenge, difficulty, rounds) {

        return new Promise((resolve, reject) => {

            const workerCount =
                navigator.hardwareConcurrency || 4;

            const workers = [];

            let completed = false;

            function cleanup() {
                workers.forEach(worker => {
                    try {
                        worker.terminate();
                    } catch (_) {}
                });
            }

            for (let i = 0; i < workerCount; i++) {

                const worker = new Worker(workerUrl);

                worker.onmessage = function (event) {

                    if (completed) {
                        return;
                    }

                    if (
                        event.data &&
                        event.data.error
                    ) {

                        completed = true;

                        cleanup();

                        reject(
                            new Error(
                                event.data.error
                            )
                        );

                        return;
                    }

                    completed = true;

                    cleanup();

                    resolve(
                        event.data.solution
                    );
                };

                worker.onerror = function (event) {

                    event.preventDefault();

                    if (!completed) {

                        completed = true;

                        cleanup();

                        reject(event);
                    }
                };

                worker.postMessage({
                    challenge,
                    difficulty,
                    workerId: i,
                    workers: workerCount,
                    rounds
                });

                workers.push(worker);
            }
        });
    }

    /*
     * Verification Workflow
     */

    verifyButton.addEventListener(
        "click",
        async function () {

            if (
                verificationInProgress ||
                verifyButton.classList.contains("p04ar2of7w")
            ) {
                return;
            }

            verificationInProgress = true;

            loadingIcon.style.display = "inline-block";
            statusText.textContent = "Processing...";

            try {

                /*
                 * Step 1
                 * Request challenge from backend.
                 */

                const challengeResponse =
                    await fetch("/c4a8b2");

                if (!challengeResponse.ok) {
                    throw new Error(
                        "Challenge request failed"
                    );
                }

                const challenge =
                    await challengeResponse.json();

                /*
                 * Step 2
                 * Solve proof-of-work locally.
                 */

                const start =
                    performance.now();

                const solution =
                    await solveProofOfWork(
                        challenge.nonce,
                        challenge.difficulty,
                        challenge.rounds
                    );

                const elapsed =
                    performance.now() - start;

                /*
                 * Analyst Note
                 *
                 * Script enforces a minimum
                 * verification time of 3 seconds.
                 *
                 * Purpose could include:
                 *   - Anti-bot protection
                 *   - Traffic shaping
                 *   - Behavioral filtering
                 */

                if (elapsed < 3000) {

                    await new Promise(resolve => {

                        setTimeout(
                            resolve,
                            3000 - elapsed
                        );
                    });
                }

                /*
                 * Step 3
                 * Submit proof-of-work result.
                 */

                const formData =
                    new URLSearchParams();

                formData.append(
                    "cid",
                    challenge.cid
                );

                formData.append(
                    "pow",
                    solution
                );

                const verifyResponse =
                    await fetch(
                        "/v9f3e1",
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            }
                        }
                    );

                const result =
                    await verifyResponse.json();

                /*
                 * Step 4
                 * Process verification result.
                 */

                if (result.success) {

                    loadingIcon.style.display =
                        "none";

                    verifyButton.classList.add(
                        "p04ar2of7w"
                    );

                    statusText.textContent =
                        "Verified";

                    const currentHash =
                        window.location.hash;

                    /*
                     * Direct redirect provided
                     * by backend.
                     */

                    if (result.redirect) {

                        window.location.href =
                            result.redirect +
                            currentHash;

                        return;
                    }

                    /*
                     * Retrieve session target
                     * if redirect not supplied.
                     */

                    fetch(
                        "/get-session",
                        {
                            credentials:
                                "same-origin"
                        }
                    )
                    .then(response =>
                        response.json()
                    )
                    .then(data => {

                        window.location.href =
                            (data.url || "/") +
                            currentHash;
                    })
                    .catch(() => {

                        window.location.href =
                            "/" + currentHash;
                    });

                } else {

                    throw new Error(
                        "Verification failed"
                    );
                }

            } catch (error) {

                loadingIcon.style.display =
                    "none";

                statusText.textContent =
                    "Try again";

                verificationInProgress = false;
            }
        }
    );

})();