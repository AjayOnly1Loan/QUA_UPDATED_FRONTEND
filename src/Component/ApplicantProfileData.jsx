import React from 'react'
import { tokens } from '../theme';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, useTheme } from '@mui/material';
import { formatDate } from '../utils/helper';


const ApplicantProfileData = ({leadData}) => {

    console.log(leadData)

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns =  [
        { label: "First Name", value: leadData?.fName, label2: "Middle Name", value2: leadData?.mName },
        { label: "Last Name", value: leadData?.lName, label2: "Gender", value2: leadData?.gender },
        { label: "Date of Birth", value: leadData?.dob && formatDate(leadData?.dob), label2: "Mother's Name", value2: leadData?.extraDetails?.personalDetails?.mothersName },
        { label: "Aadhaar Number", value: leadData?.aadhaar, label2: "PAN Number", value2: leadData?.pan },
        { label: "Mobile Number", value: leadData?.mobile, label2: "Alternate Mobile", value2: leadData?.alternateMobile },
        { label: "Personal Email", value: leadData?.personalEmail, label2: "Office Email", value2: leadData?.officeEmail },
        { label: "Working Since", value: leadData?.extraDetails?.employeDetails?.employedSince && formatDate(leadData?.extraDetails?.employeDetails?.employedSince), label2: "Salary", value2: leadData?.salary },
        { label: "Loan Applied", value: leadData?.loanAmount, label2: "State", value2: leadData?.state },
        { label: "City", value: leadData?.city, label2: "Pin Code", value2: leadData?.pinCode},
      ]
    return (
        <>
            <TableContainer component={Paper} sx={{ 
                borderRadius: '0px 20px 0px 20px',
                background: colors.white[100],
                boxShadow:'0px 0px 30px rgba(0,0,0,0.1)',
                '& .MuiPaper-root':{
                    background:colors.white[100],
                },
                '& .MuiTableCell-root': {
                    color: colors.black[100], // Text color for table cells
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Optional: Customize cell borders
                },
                '& .MuiTableRow-root':{
                    borderBottom: `2px solid ${colors.primary[400]}`
                }
                }}>
                <Table aria-label="application details table">
                    <TableBody>
                        {columns.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                                <TableCell align="left">{row.value || ''}</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label2}</TableCell>
                                <TableCell align="left">{row.value2 || ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    )
}

export default ApplicantProfileData
