import React, { useState } from 'react';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';
import { useBulkUploadMutation } from '../Service/Query';

const ImportCSV = () => {

  const [bulkUpload,{data,isSuccess,isError,error}] = useBulkUploadMutation()
  const [file, setFile] = useState(null);
  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData()
    if (file) {
      formData.append("csv",file)
      bulkUpload(formData)
    } else {
      alert('Please select a file to upload');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5" style={{ color: colors.primary[400] }}>
      <h2 className="text-center mb-4">Import CSV File</h2>
      <form 
        onSubmit={handleSubmit} 
        className="p-4 shadow rounded bg-light" 
        style={{ width: '400px' }}
      >
        <div className="form-group mb-3">
          <label htmlFor="csvInput" className="form-label">
            Choose CSV File
          </label>
          <input 
            type="file" 
            className="form-control" 
            id="csvInput" 
            accept=".csv" 
            onChange={handleFileChange} 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary w-100"
          style={{ backgroundColor: colors.primary[400], border: 'none' }}
        >
          Import CSV
        </button>
      </form>
    </div>
  );
};

export default ImportCSV;
