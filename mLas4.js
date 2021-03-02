function toString(A) {
    let count = A.length;
    let str = "";

    for (var i = 0; i < count; i++) {
        str += String.fromCharCode(A[i]);
    }
    return str;
}

const Block = (name,type,size, func) => {
    return {
        name: name,
        type: type,
        size: size,
        func: func
    }
}
// char - uint8
// ushort - uint16
// ulong - uint32

var DEF_LAS1_4 = [
    Block("fileSignature", Uint8Array, 4, toString),
    Block("fileSourceId", Uint16Array, 2, null),
    Block("globalEncoding", Uint16Array, 2, null),
    Block("projectGuidId1", Uint32Array, 4, null),
    Block("projectGuidId2", Uint8Array, 2, null),
    Block("projectGuidId3", Uint8Array, 2, null),
    Block("projectGuidId4", Uint8Array, 8, null),
    Block("versionMajor", Uint8Array, 1, null),
    Block("versionMinor", Uint8Array, 1, null),
    Block("systemIdentifier", Uint8Array, 32, toString),
    Block("generatingSoftware", Uint8Array, 32, toString),
    Block("fileCreationDayOfYear", Uint16Array, 2, null),
    Block("fileCreationYear", Uint16Array, 2, null),
    Block("headerSize", Uint16Array, 2, null),
    Block("offsetToPointData", Uint32Array, 4, null),
    Block("numberOfVariableLengthRecords", Uint32Array, 4, null),
    Block("pointDataRecordFormat", Uint8Array, 1, null),
    Block("pointDataRecordLength", Uint16Array, 2, null),
    Block("legacyNumberofPointRecords", Uint32Array, 4, null),
    Block("legacyNumberofPointsByReturn", Uint32Array, 20, null),

];
console.log(DEF_LAS1_4);


function readlas4(evt) {
    let _idx = 0;
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
                for (let i = 0; i < DEF_LAS1_4.length; i++) {
                    var headerBuff = buffer.slice(_idx, _idx + DEF_LAS1_4[i].size);
                    _idx += DEF_LAS1_4[i].size;
                    var headerView = DEF_LAS1_4[i].func 
                                   ? DEF_LAS1_4[i].func(new DEF_LAS1_4[i].type(headerBuff)) 
                                   : new DEF_LAS1_4[i].type(headerBuff);
                    console.log(`${DEF_LAS1_4[i].name}: ` + headerView );
                }

                // var headerBuff = buffer.slice(0,4);
                // var headerView = new Uint8Array(headerBuff);
                // _header.fileSignature = toString(headerView);
                // console.log("File Signature: " + _header.fileSignature);


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