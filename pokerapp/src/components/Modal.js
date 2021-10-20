import React from 'react'

export default function Modal({display,close,content}) {
    let show= display?"flex":"none";
    return (
        <div id="myModal" className="modal" style={{display:show}}>
                
                <div className="modal-content">
                    <span className="close" onClick={()=>close()} >&times;</span>
                    {content}
                </div>
            </div>
    )
}
