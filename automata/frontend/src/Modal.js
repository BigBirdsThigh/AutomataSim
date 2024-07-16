import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, title, selectedState, onCreateTransition }) => {
  const [stateTo, setStateTo] = useState('');
  const [stateFrom, setStateFrom] = useState(selectedState);
  const [push, setPush] = useState('');
  const [pop, setPop] = useState('');
  const [inputChar, setInputChar] = useState('');

  const handleCreateTransition = async () => {
    await onCreateTransition({ stateTo, stateFrom, push, pop, inputChar });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full z-10">
        <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <button className="text-gray-700" onClick={onClose}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="State To"
            value={stateTo}
            onChange={(e) => setStateTo(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="State From"
            value={stateFrom}
            onChange={(e) => setStateFrom(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Input Character"
            value={inputChar}
            onChange={(e) => setInputChar(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Push"
            value={push}
            onChange={(e) => setPush(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Pop"
            value={pop}
            onChange={(e) => setPop(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={handleCreateTransition}
            className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 w-1/2"
          >
            Create Transition
          </button>
        </div>
        <div className="bg-gray-100 px-4 py-2 flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
