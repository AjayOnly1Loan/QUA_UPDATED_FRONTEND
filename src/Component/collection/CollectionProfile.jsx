import React, { useEffect, useState } from 'react';
import { tokens } from '../../theme';
import { Paper, Box, Alert, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchActiveLeadQuery } from '../../Service/LMSQueries';
import useAuthStore from '../store/authStore';
import useStore from '../../Store';
import BarButtons from '../BarButtons';
import ApplicantProfileData from '../applicantProfileData';
import InternalDedupe from '../InternalDedupe';
import ApplicationLogHistory from '../ApplicationLogHistory';
import PersonalDetails from '../applications/PersonalDetails';
import BankDetails from '../applications/BankDetails';
import EKycVerification from '../leads/DetailsVerification';
import UploadDocuments from '../UploadDocuments';
import Cam from '../applications/Cam';
import DisburseLoan from '../disbursal/DisburseLoan';
import ClosingRequest from './ClosingRequest';
import Payment from '../accounts/Payment';
import CollectionDetails from './CollectionDetails';
import RepaymentDetails from '../repayment/RepaymentDetails';

const CollectionProfile = () => {
    const { id } = useParams();
    const [collectionData, setCollectionData] = useState()
    const { empInfo, activeRole } = useAuthStore()
    const { setApplicationProfile,setLead } = useStore();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState("application");


    const { data, isSuccess, isError, error } = useFetchActiveLeadQuery(id, { skip: id === null });
    const { lead } = collectionData?.disbursal?.sanction?.application ?? {}
    const { application } = collectionData?.disbursal?.sanction ?? {}

    console.log(data)

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    console.log('collection profile 1', data, collectionData)
    const barButtonOptions = [
        'Application',
        'Documents',
        'Personal',
        'Banking',
        'Verification',
        'Cam',
        'Disbursal',
        'Collection',
        'Repayment',
        // 'accounts',
        ...(activeRole === "accountExecutive" ? ["Accounts"]:[])
    ]

    useEffect(() => {
        if (isSuccess && data) {
            setLead(data?.data?.disbursal?.sanction?.application?.lead)
            setCollectionData(data?.data)
            setApplicationProfile(data?.data?.disbursal);
        }
    }, [isSuccess, data]);

    return (
        <div className="crm-container" style={{display:"flex", justifyContent:"center", }}>
            <div className='p-3' style={{ width:"90%",}}>
                {data?.data?.isActive ?
                <h1 style={{color:colors.primary[400]}}>Lead : Active</h1>
                :
                data?.data?.isClosed ?
                <h1 style={{color:colors.primary[400]}}>Lead : Closed</h1>
                :
                <h1 style={{color:colors.primary[400]}}>Lead : Pending Payment Verification</h1>
                }
                <BarButtons
                    barButtonOptions={barButtonOptions}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    />
                {currentPage === "application" &&(
                    <>
                        {lead?._id && (
                            <>
                                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', borderRadius: '0px 20px', background:colors.white[100], }}>
                                    <ApplicantProfileData leadData={lead} />
                                </Paper>
                                <InternalDedupe id={lead?._id} />
                                <ApplicationLogHistory id={lead?._id} />
                            </>
                        )}
                    </>
                )}

                {collectionData && Object.keys(collectionData).length > 0 && (
                    <>
                        {console.log('collection profile',)}
                        {currentPage === "personal" && <PersonalDetails id={application?.applicant} />}
                        {currentPage === "banking" && <BankDetails id={application?.applicant} />}

                        {currentPage === "verification" &&(
                            <EKycVerification
                                isMobileVerified={lead?.isMobileVerified}
                                isEmailVerified={lead?.isEmailVerified}
                                isAadhaarVerified={lead?.isAadhaarVerified}
                                isAadhaarDetailsSaved={
                                    lead?.isAadhaarDetailsSaved
                                }
                                isPanVerified={lead?.isPanVerified}
                                isESignPending={collectionData?.disbursal?.sanction?.eSignPending}
                                isESigned={collectionData?.disbursal?.sanction?.eSigned}
                                leadId={lead?._id}
                            />
                        )}
                        {currentPage === "documents" && lead && (
                            <UploadDocuments leadData={lead} />
                        )}

                        {currentPage === "cam" && <Cam id={application?._id} />}
                        {currentPage === "disbursal" && <DisburseLoan disburse={collectionData?.disbursal?.sanction} />}
                        {currentPage === "collection" && <CollectionDetails disburse={collectionData?.disbursal?.sanction} repaymentId={collectionData?.loanNo} />}
                        {currentPage === "repayment" && <RepaymentDetails disburse={collectionData?.disbursal} repaymentId={collectionData?.loanNo} collectionData={collectionData} />}
                        {/* {currentPage === "repayment" && <ClosingRequest disburse={collectionData?.disbursal} />} */}
                        {currentPage === "accounts" && (
                            <>
                                {collectionData ? (
                                    <Payment
                                        collectionData={collectionData}
                                        leadId={id}
                                        activeRole={activeRole}
                                    />
                                ) : (
                                    <div>Loading account details...</div>
                                )}
                                {isError && (
                                    <Alert
                                        severity="error"
                                        style={{ marginTop: "10px" }}
                                    >
                                        {error?.data?.message ||
                                            "Failed to load account details."}
                                    </Alert>
                                )}
                            </>
                        )}
                    </>
                )}
                {isError && (
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {error?.data?.message}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default CollectionProfile;
