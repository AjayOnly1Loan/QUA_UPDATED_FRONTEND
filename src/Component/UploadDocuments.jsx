import React, { useEffect, useRef, useState } from 'react';
import { tokens } from "../theme";
import {
    Typography,
    Button,
    Box,
    IconButton,
    Checkbox,
    TextField,
    CircularProgress,
    Tooltip,
    useTheme,
    Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useUploadDocumentsMutation } from '../Service/Query';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuthStore from './store/authStore';
import DocumentsTable from './documentsTable';

const UploadDocuments = ({ leadData }) => {

    const { id } = useParams();
    const fileInputRef = useRef()
    const { empInfo, activeRole } = useAuthStore();
    const [uploadedDocs, setUploadedDocs] = useState()
    const [selectedDocuments, setSelectedDocuments] = useState([])
    const [selectedDocType, setSelectedDocType] = useState(null);
    const [fileInputs, setFileInputs] = useState([{ file: null, remarks: '' }]);
    const [documents, setDocuments] = useState({
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
        salarySlip: [],
        bankStatement: [],
    });
    const [uploadDocuments, { data, isSuccess: docSuccess, isLoading, isError: isDocError, error: docError }] = useUploadDocumentsMutation();

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Handle file selection
    const handleFileChange = (index, event) => {
        const selectedFile = event.target.files[0];
        event.target.value = null;
        setFileInputs((prevFileInputs) => {
            const newFileInputs = [...prevFileInputs];
            newFileInputs[index].file = selectedFile;
            return newFileInputs;
        });
        setSelectedDocuments((prevFileInputs) => ({
            ...prevFileInputs,
            file: selectedFile,
        }));

    };

    // Handle remarks input
    const handleRemarksChange = (index, event) => {
        const { value } = event.target;
        setFileInputs((prevFileInputs) => {
            const newFileInputs = [...prevFileInputs];
            newFileInputs[index].remarks = value;
            return newFileInputs;
        });
        setSelectedDocuments((prevFileInputs) => ({
            ...prevFileInputs,
            remarks: value,
        }));
    };

    // Add new file input
    const handleAddFileInput = () => {
        const lastInput = fileInputs[fileInputs.length - 1];
        if (!lastInput || !lastInput.file) {
            Swal.fire('Warning!', 'Please select a file for the current input before adding a new one.', 'warning');
            return;
        }
        setFileInputs([...fileInputs, { file: null, remarks: '' }]);
    };

    // Remove file input
    const handleRemoveFileInput = (index) => {
        const updatedInputs = fileInputs.filter((_, i) => i !== index);
        setFileInputs(updatedInputs);
    };



    const handleSubmit = async () => {
        const hasFileSelected = fileInputs.some((input) => input.file);

        if (!hasFileSelected) {
            Swal.fire('Warning!', 'Please select at least one file to upload.', 'warning');
            return;
        }

        const formData = new FormData();

        // Prepare data to be sent to the FormData
        fileInputs.forEach((input, index) => {
            if (input.file) {
                formData.append(`${selectedDocType}`, input.file); // Append file to formData
                formData.append(`remarks`, input.remarks); // Append remarks to formData
            }
        });

        try {
            // Call the mutation to upload the documents with formData
            await uploadDocuments({ id: leadData._id, docsData: formData }).unwrap();
            Swal.fire('Success!', 'Documents uploaded successfully!', 'success');

            // Reset state after successful upload
            setDocuments({
                aadhaarFront: null,
                aadhaarBack: null,
                panCard: null,
                salarySlip: [],
                bankStatement: [],
            });
            setFileInputs([{ file: null, remarks: '' }]); // Reset file inputs
            setSelectedDocType(null)

        } catch (error) {
            Swal.fire('Error!', 'Failed to upload documents. Please try again.', 'error');
            console.error('Upload error:', error); // Log error for debugging
        }
    };


    useEffect(() => {
        if (docSuccess) {
            Swal.fire({
                title: 'Documents uploaded successfully!',
                icon: 'success',
            });
        }
    }, [docSuccess]);
    useEffect(() => {
        if (leadData?.documents?.document && Object.keys(leadData?.documents?.document)) {
            const merged = [
                ...leadData?.documents?.document?.multipleDocuments?.salarySlip,
                ...leadData?.documents?.document?.multipleDocuments?.bankStatement,
                ...leadData?.documents?.document?.multipleDocuments?.others,
                // ...leadData?.documents?.document?.multipleDocuments?.sanctionLetter,
                ...leadData?.documents?.document?.singleDocuments
            ];
            setUploadedDocs(merged)
        }
    }, [leadData]);




    return (
        <>

        {activeRole === "screener" && 
            <>
        <Box 
            sx={{ 
                maxWidth: '1000px', 
                margin: '0 auto', 
                mt: 3, 
                p: 3, 
                backgroundColor: colors.white[100], 
                color:colors.primary[400],
                borderRadius: "0px 20px 0px 20px",
                border: `1px solid ${colors.primary[400]}`,
                boxShadow : `0px 0px 20px rgb(0,0,0,0.2)`,
            }}
        >
            
            <Typography variant="h6" style={{ fontWeight: '600', color: colors.primary[400], marginBottom:"10px", textAlign:"center", fontSize:"18px" }}>
                Upload Documents
            </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" gap={2}>
                            {['aadhaarFront', 'aadhaarBack', 'panCard', 'salarySlip', 'bankStatement', 'others'].map((key) => (
                                <Box 
                                    key={key} 
                                    sx={{
                                        display: 'flex',
                                        flexWrap:"wrap",
                                        alignItems:"center",
                                        gap:"1",
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedDocType === key}
                                        onChange={(e) => {
                                            setSelectedDocType(null);
                                            setFileInputs([{ file: null, remarks: '' }]);

                                    if (e.target.checked) {
                                        setSelectedDocType(key);
                                    }
                                }}
                                sx={{ color: colors.primary[400],'&.Mui-checked':{color:colors.primary[400]} }}
                            />
                            <Typography variant="subtitle2" style={{ fontWeight: '600', color: colors.black[100], fontSize: '14px' }}>
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {selectedDocType && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, }}>
                            {fileInputs.map((input, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2,
                                        borderRadius: "0px 20px 0px 20px",
                                        backgroundColor: colors.white[100],
                                        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        // onClick={() => fileInputRef.current.click()}
                                        sx={{
                                            minWidth: 120,
                                            background: colors.primary[400],
                                            borderColor: colors.primary[400],
                                            color: colors.white[100],
                                            borderRadius:"0px 10px 0px 10px",
                                            '&:hover': {
                                                background: colors.primary[100],
                                            },
                                        }}
                                    >
                                        Choose File
                                        <input
                                            type="file"
                                            // ref={fileInputRef}
                                            hidden
                                            onChange={(event) => handleFileChange(index, event)}
                                        />
                                    </Button>

                                    {/* Remarks Input */}
                                    <TextField
                                        label="Remarks"
                                        value={input.remarks}
                                        onChange={(event) => handleRemarksChange(index, event)}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            '& .MuiInputBase-input': { color: colors.primary[400] },
                                            '& .MuiInputLabel-root': { color: colors.primary[400] },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: colors.primary[400],borderRadius:"0px 10px 0px 10px", },
                                                '&:hover fieldset': { borderColor: colors.primary[400] },
                                            },
                                        }}
                                    />

                                    {/* View Button */}
                                    {input.file && (
                                        <IconButton
                                            color="primary"
                                            component="a"
                                            href={URL.createObjectURL(input.file)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: colors.primary[400] }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    )}

                                            {/* Remove File Button */}
                                            {index > 0 && <IconButton
                                                color="secondary"
                                                onClick={() => handleRemoveFileInput(index)}
                                                sx={{ color: '#ff4d4f' }}
                                            >
                                                <RemoveCircleOutlineIcon />
                                            </IconButton>}

                                            {/* Add New Input Button */}
                                            {(
                                                index === fileInputs.length - 1 &&
                                                !["aadhaarFront", "aadhaarBack", "panCard"].includes(selectedDocType)) &&
                                                fileInputs[fileInputs.length - 1].file &&
                                                (
                                                    <IconButton
                                                        color="primary"
                                                        onClick={handleAddFileInput}
                                                        sx={{
                                                            backgroundColor: '#007bff',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#0056b3',
                                                            },
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                )}
                                        </Box>
                                    ))}
                                </Box>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    // variant="contained"
                                    sx={{
                                        backgroundColor: isLoading ? "#ccc" : colors.white[100],
                                        border: isLoading ? "ccc" : `1px solid ${colors.primary[400]}`,
                                        borderRadius:"0px 10px 0px 10px",
                                        color: isLoading ? "#666" : colors.primary[400],
                                        cursor: isLoading ? "not-allowed" : "pointer",
                                        "&:hover": {
                                            backgroundColor: isLoading ? "#ccc" : colors.primary[400],
                                            color: isLoading ? "#ccc" : colors.white[100],
                                        },
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                                </Button>
                    </>
                )}
            </Box>
            </Box>
            </>
            }
        <Box>

            {
                uploadedDocs && uploadedDocs.length > 0 &&
                <DocumentsTable
                    leadData={leadData}
                    uploadedDocs={uploadedDocs}
                />
            }
        </Box>
        </>
    );
};

export default UploadDocuments;
