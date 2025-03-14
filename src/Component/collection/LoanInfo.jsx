import React, { useEffect, useState } from 'react';
import { Button, Box, Paper, Typography, TextField, Alert,useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useStore from '../../Store';
import useAuthStore from '../store/authStore';
import { useRecommendLoanMutation } from '../../Service/applicationQueries';
import { formatDate } from '../../utils/helper';
import dayjs from 'dayjs';

const LoanInfo = ({ repaymentDetails }) => {
  const { applicationProfile } = useStore()
  const { activeRole } = useAuthStore()
  const [remarks, setRemarks] = useState(null);
  const [openRemark, setOpenRemark] = useState(false)
  const navigate = useNavigate()

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  console.log('profile',applicationProfile)

  const { 
    sanction, 
    sanction: { 
      application, 
      application: { 
        cam, 
        lead, 
        lead: { fName, mName, lName } = {} 
      } = {} 
    } = {} 
  } = applicationProfile || {};

  const handleCancel = () => {
    // Reset all states to go back to initial state
    setRemarks('');
    setOpenRemark(false)
  };


  const info = [
    { label: "Loan No.", value: applicationProfile?.loanNo },
    { label: "Customer Name", value: `${fName}${mName ? ` ${mName}` : ``} ${lName}` },
    { label: "Sanctioned Amount", value: repaymentDetails?.repaymentDetails?.sanctionedAmount },
    { label: "Repayment Date", value: cam?.repaymentDate && dayjs(cam?.repaymentDate).format('DD-MM-YYYY') },
    { label: "Repayment Amount", value: cam?.repaymentAmount },
    { label: "Repayment Amount (as on today)", value: repaymentDetails?.repaymentDetails?.outstandingAmount },
    { label: "ROI % (per day)", value: cam?.roi },
    { label: "Processing Fee", value: cam?.netAdminFeeAmount },
    { label: "Tenure", value: cam?.eligibleTenure },
    { label: "DPD", value: repaymentDetails?.repaymentDetails?.dpd },
    // ...(applicationProfile.isDisbursed ? [
    //   { label: "Disbursed From", value: applicationProfile?.payableAccount },
    //   { label: "Disbursed On", value: applicationProfile?.disbursedBy && formatDate(applicationProfile?.disbursedAt) },
    //   { label: "Disbursed By", value: `${applicationProfile?.disbursedBy?.fName}${applicationProfile?.disbursedBy?.mName ? ` ${applicationProfile?.disbursedBy?.mName}` : ``} ${applicationProfile?.disbursedBy?.lName}` },
    //   { label: "Disbursed Amount", value: applicationProfile?.amount },
    // ] : [])
  ];


  return (
    <>
      <Box
        sx={{
          maxWidth: '800px',
          margin: '10px auto',
          padding: '20px',
          borderRadius: '0px 20px',
          backgroundColor: colors.white[100],
          fontSize: '12px',
          lineHeight: '1.5',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          component={Paper}
          elevation={3}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', // Two columns
            gap: '0',
            borderCollapse: 'collapse',
            background: colors.white[100],
            color:colors.black[100],
            borderRadius: '0px 20px',
            lineHeight: '2.5',
            overflow: 'hidden',
          }}
        >
          {/* Map over the data array to create each field in a row */}
          {info.map((field, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', borderBottom: `2px solid ${colors.primary[400]}`, padding: '10px', }}
            >
              <label style={{ fontWeight: 'bold', width: '50%' }}>{field.label}</label>
              <span>{field.value} {field.label === "ROI % (p.d.) Approved" && "%" }</span>
            </Box>
          ))}
        </Box>
      </Box>
      {/* {openRemark &&
        <>
          <Box
            sx={{
              marginTop: 3,
              padding: 4,
              backgroundColor: '#f9f9f9', // Light background for the entire form
              borderRadius: 2,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >

            <Typography variant="h6" gutterBottom>
              Remarks
            </Typography>
            <TextField
              label="Add your remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{
                marginBottom: 3,
                color: '#363535',                // Ensure text is black or dark
                backgroundColor: '#ebebeb',   // Light background for text area
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#c4c4c4',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          </Box>
          {isError &&
              <Alert severity="error" style={{ marginTop: "10px" }}>
                {error?.data?.message}
              </Alert>
            }

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{
                padding: '10px 20px',
                borderRadius: 2,
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                ':hover': { backgroundColor: '#e0e0e0' },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                padding: '10px 20px',
                borderRadius: 2,
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                ':hover': { backgroundColor: '#1565c0' },
              }}
            >
              Submit
            </Button>
          </Box>
        </>

      } */}

    </>
  );
};

export default LoanInfo;
