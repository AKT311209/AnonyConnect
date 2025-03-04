import React from 'react'

const ToastMessage = ({ header, body }) => {
  return (
    <div className='toast-container top-0 end-0 p-3' style={{ position: 'fixed', display: 'flex' }}>
      <div className='toast fade hide' role='alert' data-bs-delay='5000' id='toast-1'>
        <div className='toast-header'>
          <strong className='text-danger me-auto'>{header}</strong>
          <button className='btn-close ms-2 mb-1 close' type='button' aria-label='Close' data-bs-dismiss='toast' />
        </div>
        <div className='toast-body' role='alert'>
          <p>{body}</p>
        </div>
      </div>
    </div>
  )
}

export default ToastMessage
