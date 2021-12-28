import React, { useRef, useEffect } from 'react'


function EditsModal(props) {
  const background = useRef();
  const modal = useRef();
  const counter = useRef(0);
  const { editArray, viewEditsPosition, exitHandler } = props;
  
  useEffect(() => {
    modal.current.style.position = 'fixed';
    modal.current.style.top = `${viewEditsPosition.y - 300}px`;
    modal.current.style.left = `${viewEditsPosition.x}px`;
    modal.current.style.height = '300px';
    modal.current.style.transition = 'height .4s';
   
  }, [ modal, editArray, viewEditsPosition.y, viewEditsPosition.x ])
 

  return (
    <div>
      <div ref={background} id='modalDivParent' onClick={exitHandler}></div>
    
      <div ref={modal} id='modalDiv'>
        <div></div>
        <h3>Ticket Edit History</h3>
        <ul className='editsUL'>
        {editArray.map(edit => (
          <div  key={edit.dateOfEdit+edit.timeOfEdit+counter.current++} className='editsLI'>
          <li>Date: {edit.dateOfEdit}</li> 
          <li>Time: {edit.timeOfEdit}</li>
          { edit.oldStatus !== edit.newStatus ? 
            <li><span className='change'>Completion</span> changed from <span className='change'>'{ edit.oldStatus === true ? 'Complete' : 'Not Complete' }'</span> to <span className='change'>'{ edit.newStatus === true ? 'Complete' : 'Not Complete' }'</span></li>
          :
            null
          }

          { edit.oldPriority !== edit.newPriority ? 
            <li><span className='change'>Priority</span> changed from <span className='change'>'{edit.oldPriority}'</span> to <span className='change'>'{edit.newPriority}'</span></li>
          :
            null
          }

          { edit.oldTicketType !== edit.newTicketType ? 
            <li><span className='change'>Ticket Type</span> changed from <span className='change'>'{edit.oldTicketType}'</span> to <span className='change'>'{edit.newTicketType}'</span></li>
          :
            null
          }

          { edit.oldUserAssigned !== edit.newUserAssigned ? 
            <li><span className='change'>User Assigned</span> changed from <span className='change'>'{edit.oldUserAssigned}'</span> to <span className='change'>'{edit.newUserAssigned}'</span></li>
          :
            null
          }
          <li>Ticket Editor: <span className='change'>{edit.ticketEditor}</span></li>
          <li>Comments Made: <span className='change'>{edit.editComment}</span></li>
          </div>
        ))}
        </ul>
      </div>
    </div>
  )
}

export default EditsModal
