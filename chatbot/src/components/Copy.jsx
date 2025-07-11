import Image from "next/image";
import React from "react";
import copy from '../../assets/copy.svg'

function Copy({copyCode}) {

    function parseCode(e) {
    
        copyCode(e.target.parentNode)
    }

    return (
        <Image width={40} height={40} alt="copy" src={copy} className="copy" onClick={parseCode}/>
    )
}

export default React.memo(Copy)