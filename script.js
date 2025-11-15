// Copyright 2022 BadAimWeeb. All rights reserved. MIT license.

var stringToBlob = function (str, mimetype) {
    var raw = str;
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    var bb = new Blob([uInt8Array.buffer], {
        type: mimetype
    });
    return bb;
};

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

window.onload = function () {
    function toastNotification(message) {
        var x = document.getElementById("snackbar");
        x.addEventListener("click", function () {
            x.className = x.className.replace("show", "");
        });
        x.innerHTML = message;
        x.className = "show";
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 3000);
    }
    
    async function exportFunc(encrypted) {
        chrome.cookies.getAll({
            domain: "facebook.com"
        }, function (cookies) {
            var cok = cookies.map(v => ({
                key: v.name,
                value: v.value,
                domain: "facebook.com",
                path: v.path,
                hostOnly: v.hostOnly,
                creation: new Date().toISOString(),
                lastAccessed: new Date().toISOString()
            }));
            var fbstate = JSON.stringify(cok, null, 4);

            if (encrypted === "base64") {
                fbstate = utf8_to_b64(fbstate);
            } else if (encrypted === "payload") {
                let fbstateValue = [];
                var fbstateToPayload;
                var fbstatePayloadData = JSON.parse(fbstate)
                fbstatePayloadData.forEach(async (data) => {
                    const data1 = `${data.key.trim()}=${data.value.trim()}`;
                    await fbstateValue.push(data1);
                })
                try {
                    fbstateToPayload = fbstateValue.join('; ');
                } catch (err) {
                    fbstateToPayload = ""
                }
                if (fbstateToPayload) {
                    fbstate = fbstateToPayload;
                } else {
                    fbstate = "error converting into payload"
                }
            } else if (encrypted) {
                let pwdKey = prompt("Please enter key to encrypt:");
                let keyHash = [...sha256(pwdKey || "").match(/.{2}/g)].map(e => parseInt(e, 16));

                let bytes = aesjs.utils.utf8.toBytes(fbstate);
                let aesCtr = new aesjs.ModeOfOperation.ctr(keyHash);
                let encryptedData = aesCtr.encrypt(bytes);
                fbstate = aesjs.utils.hex.fromBytes(encryptedData);
            } 
            const yourFbstate = document.getElementById("yourFbstate");
            const btnCopy = document.getElementById("btnCopy");
            const btnDownload = document.getElementById("btnDownload");
            yourFbstate.value = fbstate;
       
            btnCopy.onclick = function () {
                yourFbstate.select();
                document.execCommand("copy");
                toastNotification('Copied cookie to clipboard!');
            };

            btnDownload.onclick = function () {
                var blob = stringToBlob(fbstate, "application/json");
                var url = window.webkitURL || window.URL || window.mozURL || window.msURL;
                var a = document.createElement('a');
                a.download = 'fbcookie.json';
                a.href = url.createObjectURL(blob);
                a.textContent = '';
                a.dataset.downloadurl = ['json', a.download, a.href].join(':');
                a.click();
                toastNotification('Downloaded cookie! ' + a.download);
                a.remove();
            };
        });
    }

    function logout() {
        const result = confirm("Are you sure you want to logout?");
        if (result) {
            chrome.cookies.getAll({
                domain: "facebook.com"
            }, function (cookies) {
                // * it helps you not to lose the list of recently logged in accounts
                cookies = cookies.filter(c => c.name != "sb" && c.name != "dbln");

                for (let i in cookies) {
                    chrome.cookies.remove({
                        url: `https://facebook.com${cookies[i].path}`,
                        name: cookies[i].name
                    });
                }
                chrome.tabs.query({
                    active: true
                }, function (tabs) {
                    const {
                        host
                    } = new URL(tabs[0].url);
                    if (host.split(".")[1] == "facebook") {
                        chrome.tabs.update(tabs[0].id, {
                            url: tabs[0].url
                        });
                    }
                });
            });
        }
    }

    document.getElementById("export").onclick = () => exportFunc(false);
    document.getElementById("exportenc").onclick = () => exportFunc(true);
    document.getElementById("exportbase64").onclick = () => exportFunc("base64");
    document.getElementById("exportpayload").onclick = () => exportFunc("payload");

    document.getElementById("logout").onclick = () => logout();
    exportFunc(false);
};
