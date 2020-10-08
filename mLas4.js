$( "#fileread" ).change(function(e) {
    readlas4(e);
});

function stringFromUInt8(A) {
    let count = A.length;
    let str = "";

    for (var i = 0; i < count; i++) {
        str += String.fromCharCode(A[i]);
    }
    return str;
}

function readlas4(evt) {
    var _header = {
        fileSignature:""
    }
    let f = evt.target.files[0];
    if (f) {
        let r = new FileReader();
        r.onload = function(e) {
            let contents = e.target.result;
            let buffer = r.result;  
            console.log("Parsing Header...");
            try {
                var headerBuff = buffer.slice(0,4);
                var headerView = new Uint8Array(headerBuff);
                _header.fileSignature = stringFromUInt8(headerView);
                console.log("File Signature: " + _header.fileSignature);
            }
            catch (e) {
                console.error(e);
            }
            

        }
        r.readAsArrayBuffer(f);

    }
    else {
        alert("failed to load");
    }
}