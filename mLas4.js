function toString(A) {
    let count = A.length;
    let str = "";

    for (var i = 0; i < count; i++) {
        str += String.fromCharCode(A[i]);
    }
    return str;
}

//used for defining a chunk
const Block = (name,type,size, func) => {
    return {
        name: name,
        type: type,
        size: size,
        func: func,
        val: null
    }
}

function getDefinitionElementByName(def, name) {
    for (let i = 0; i < def.length; i++)
        if (def[i].name === name)
            return def[i];
    return null;
}

function log(eleId, str) {
    let out = document.getElementById(eleId);
    let li = document.createElement('li');
    let txtNode = document.createTextNode(str);
    li.appendChild(txtNode);
    out.appendChild(li);
}

// char - uint8
// ushort - uint16
// ulong - uint32

//las 1.4 header definition
var DEF_LAS1_4_HEADER = [
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
    Block("xScaleFactor", Float64Array, 8, null),
    Block("yScaleFactor", Float64Array, 8, null),
    Block("zScaleFactor", Float64Array, 8, null),
    Block("xOffset", Float64Array, 8, null),
    Block("yOffset", Float64Array, 8, null),
    Block("zOffset", Float64Array, 8, null),
    Block("xMax", Float64Array, 8, null),
    Block("xMin", Float64Array, 8, null),
    Block("yMax", Float64Array, 8, null),
    Block("yMin", Float64Array, 8, null),
    Block("zMax", Float64Array, 8, null),
    Block("zMin", Float64Array, 8, null),
    Block("startOfWaveformDataPacketRecord", BigUint64Array, 8, null),
    Block("startOfFirstExtendedVariableLengthRecord", BigUint64Array, 8, null),
    Block("numberOfExtendedVariableLengthRecords", Uint32Array, 4, null),
    Block("numberOfPointRecords", BigUint64Array, 8, null),
    Block("numberOfPointsByReturn", BigUint64Array, 120, null),

];
console.log(DEF_LAS1_4_HEADER);

function loadBlocksFromDefinition(def, buffer, startingIndex=0, callback) {
    let _idx = startingIndex;
    try {
        for (let i = 0; i < def.length; i++) {
            var headerBuff = buffer.slice(_idx, _idx + def[i].size);
            _idx += def[i].size;
            var headerView = def[i].func 
                           ? def[i].func(new def[i].type(headerBuff)) 
                           : new def[i].type(headerBuff);
            def[i].val = String(headerView);
            log("out", `${def[i].name}: ` + headerView );
        }
        callback();
    }
    catch (e) {
        console.error(e);
    }
}

function readlas4(evt) {
    let offsetToPointData = -1;
    let f = evt.target.files[0];
    if (f) {
        let r = new FileReader();
        r.onload = function(e) {
            let contents = e.target.result;
            let buffer = r.result;  
            log("out", "Parsing Header...");
            loadBlocksFromDefinition(DEF_LAS1_4_HEADER, buffer, 0, () => {
                offsetToPointData = getDefinitionElementByName(DEF_LAS1_4_HEADER, "offsetToPointData").val;
                if (offsetToPointData === null || offsetToPointData < 0) {
                    console.error("offset to point data field is empty.");
                    log("out", "ERROR: offset to point data field is empty.");
                    return;
                }

                //try points
                
            });
        }
        r.readAsArrayBuffer(f);

    }
    else {
        alert("failed to load");
    }
}