import React, { useState, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  Typography,
  Checkbox,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  useTheme,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme";
import useAuthStore from "../store/authStore";
import { Controller, useForm } from "react-hook-form";
import LoanInfo from "../collection/loanInfo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OutstandingLoanAmount from "../collection/OutstandingLoanAmount";
import CommonTable from "../CommonTable";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentReceivedSchema } from "../../utils/validations";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAddPaymentMutation } from "../../Service/LMSQueries";

const RepaymentDetails = (disburse) => {
  const { activeRole } = useAuthStore();
  const [checkedFields, setCheckedFields] = useState({
    loanNo: false,
    loanAmount: false,
    tenure: false,
    repayAmount: false,
    blacklist: false, // State for the "Add to Blacklist" checkbox
  });

  const defaultValue = {
    paymentReceived: "",
    referenceNumber: "",
    paymentMode: "",
    repaymentType: "",
    paymentDiscount: "",
    refund: "",
    paymentRemarks: "",
    paymentUpload: "",
  };

  const [repaymentStatus, setRepaymentStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("Select a Reason");
  const [selectedDiscountType, setSelectedDiscountType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState(0);
  const fileInputRef = useRef(null);

  // const {handleSubmit, control, setValue } = useForm({
  //   resolver: yupResolver(paymentReceivedSchema),
  //   mode: 'onBlur',
  //   reValidateMode: 'onChange',
  // })

  const [addPayment, { isLoading }] = useAddPaymentMutation();

  const { handleSubmit, control, setValue, getValues } = useForm({
    resolver: yupResolver(paymentReceivedSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedFields((prevCheckedFields) => ({
      ...prevCheckedFields,
      [name]: checked,
    }));
  };

  const handleKeyDown = (e) => {
    if (
      e.key.length === 1 &&
      !(e.key >= "0" && e.key <= "9") &&
      e.key !== "."
    ) {
      e.preventDefault();
    }
    if (e.key === "." && e.target.value.includes(".")) {
      e.preventDefault();
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const columns = [
    { field: "sno", headerName: "S.No", width: 50 },
    { field: "loanNo", headerName: "Loan No.", width: 150 },
    { field: "recoveryRemarks", headerName: "Remarks", width: 150 },
    { field: "paymentMode", headerName: "Payment Mode", width: 150 },
    { field: "paymentAmount", headerName: "Payment Amount", width: 150 },
    { field: "recoveryDiscount", headerName: "Discount", width: 150 },
    // { field: 'recoveryDiscountType', headerName: 'Discount Type', width: 150 },
    { field: "recoveryRefund", headerName: "Refund", width: 150 },
    {
      field: "recoveryReferenceNumber",
      headerName: "Reference No",
      width: 150,
    },
    { field: "recoveryDate", headerName: "Recovery Date", width: 150 },
    { field: "loanStatus", headerName: "Loan Status", width: 150 },
    {
      field: "paymentVerification",
      headerName: "Payment Verification",
      width: 150,
    },
    {
      field: "paymentUploadedBy",
      headerName: "Payment Uploaded By",
      width: 150,
    },
    {
      field: "paymentUploadedOn",
      headerName: "Payment Uploaded On",
      width: 150,
    },
    {
      field: "paymentVerifiedBy",
      headerName: "Payment Verified By",
      width: 150,
    },
    {
      field: "paymentVerifiedOn",
      headerName: "Payment Verified On",
      width: 150,
    },
    { field: "recoveryAction", headerName: "Action", width: 150 },
  ];

  const handleSaveBlacklist = () => {
    // Handle save logic here
    // You can use the blacklistReason and remarks state variables
    // to save the data to your backend or database
    console.log("Blacklist reason:", blacklistReason);
    console.log("Remarks:", remarks);
  };

  const handleRepaymentStatusChange = (event) => {
    setRepaymentStatus(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleBlacklistReasonChange = (event) => {
    setBlacklistReason(event.target.value);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setKey((prevKey) => prevKey + 1);
  };

  const handleClickChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current.click();
  };

  // const onSubmit = (event) => {
  //   event.preventDefault();
  //   // Handle form submission logic here
  // };

  const onSubmit = async (data) => {
    console.log("Form data: sdfsdfsdf", data);  
    try {
      const formData = new FormData();
      formData.append("paymentReceived", data.paymentReceived);
      formData.append("paymentReceivedDate", data.paymentReceivedDate);
      formData.append("closingType", data.closingType);
      formData.append("paymentMode", data.paymentMode);
      formData.append("referenceNumber", data.referenceNumber);
      formData.append("paymentDiscount", data.paymentDiscount);
      formData.append("refund", data.refund);
      formData.append("paymentRemarks", data.paymentRemarks);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Call API with formData
      const response = await addPayment({ id: disburse.id, data: formData });

      if (response?.error) {
        console.error("Error adding payment:", response.error);
      } else {
        console.log("Payment added successfully", response);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  return (
    <>
      {/* Loan Information */}
      <LoanInfo disburse={disburse?.sanction?.application} />
      {console.log(disburse)}

      {/* Payable and Outstanding Amount Information */}
      <OutstandingLoanAmount />

      {/* Add to Blacklist */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: colors.white[100],
          color: colors.black[100],
          maxWidth: "800px",
          margin: "0px auto",
          padding: "20px",
          borderRadius: "0px 20px",
        }}
      >
        <Checkbox
          name="blacklist"
          checked={checkedFields.blacklist}
          onChange={handleCheckboxChange}
          sx={{ color: colors.primary[400] }}
        />
        <Typography variant="body1" style={{ color: colors.black[100] }}>
          Add to Blacklist
        </Typography>
        {checkedFields.blacklist && (
          <Box
            component={Paper}
            elevation={4}
            sx={{
              maxWidth: "400px",
              marginTop: "20px",
              background: colors.white[100],
              padding: "10px 10px",
              borderRadius: "0px 20px",
            }}
          >
            <Typography variant="body2" style={{ color: colors.black[100] }}>
              Reason for Blacklisting:
            </Typography>
            <Select
              value={blacklistReason}
              onChange={handleBlacklistReasonChange}
              sx={{
                width: "100%",
                margin: "10px 0",
                background: colors.white[100],
                color: colors.black[100],
                borderColor: colors.black[100],
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "& .MuiSelect-select": {
                  color: colors.black[100],
                },
              }}
            >
              <MenuItem value="default" disabled>
                Select a reason
              </MenuItem>
              <MenuItem value="fraud">Fraud</MenuItem>
              <MenuItem value="non-payment">Non-payment</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <Typography variant="body1" style={{ color: colors.black[100] }}>
              Remarks:
            </Typography>
            <TextField
              value={remarks}
              onChange={handleRemarksChange}
              sx={{
                width: "100%",
                margin: "10px 0",
                background: colors.white[100],
                color: colors.black[100],
                borderColor: colors.black[100],
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                marginTop: "10px",
                background: colors.primary[400],
                borderRadius: "0px 10px",
              }}
              onClick={handleSaveBlacklist}
            >
              Save
            </Button>
          </Box>
        )}
      </Paper>

      {/* Recovery History */}
      <Accordion
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "800px",
          background: colors.white[100],
          borderRadius: "0px 20px",
          border: "0px",
          margin: "0px auto",
          marginTop: "20px",
          boxShadow: "0px 0px 10px rgb(0,0,0,0.2)",
          "&.Mui-expanded": {
            margin: "20px auto",
            display: "flex",
            justifyContent: "center",
          },
          "&.MuiAccordion-root:last-of-type": {
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: colors.primary[400] }} />}
        >
          <Typography variant="h6" style={{ color: colors.primary[400] }}>
            Payment History
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              background: colors.white[100],
              color: colors.primary[400],
              margin: "0 auto",
              borderRadius: "0px 20px",
              boxShadow: "0px 0px 10px rgb(0,0,0,0.2)",
            }}
          >
            <CommonTable
              columns={columns}
              // rows={rows}
              // paginationModel={paginationModel}
              // onPageChange={handlePageChange}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* New Payment Recieved */}
      <Accordion
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "800px",
          background: colors.white[100],
          borderRadius: "0px 20px",
          border: "0px",
          margin: "0px auto",
          marginTop: "20px",
          boxShadow: "0px 0px 10px rgb(0,0,0,0.2)",
          "&.Mui-expanded": {
            margin: "20px auto",
            display: "flex",
            justifyContent: "center",
          },
          "&.MuiAccordion-root:last-of-type": {
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: colors.primary[400] }} />}
        >
          <Typography variant="h6" style={{ color: colors.primary[400] }}>
            New Payment Received
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              background: colors.white[100],
              color: colors.primary[400],
              margin: "0 auto",
              borderRadius: "0px 20px",
              boxShadow: "0px 0px 10px rgb(0,0,0,0.2)",
            }}
          >
            <Paper sx={{ borderRadius: "20px" }}>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  background: colors.white[100],
                  color: colors.black[100],
                  padding: "30px",
                  borderRadius: "0px 20px",
                  boxShadow: "0 0px 18px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  "& .MuiTextField-root": {
                    color: colors.black[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.black[100],
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary[400],
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: colors.primary[400],
                    },
                  "& .MuiSelect-icon": {
                    color: colors.black[100],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary[400],
                  },
                  "& .MuiInputBase-root": {
                    color: colors.black[100],
                  },
                  "& .Mui-disabled": {
                    color: colors.black[100],
                    background: colors.grey[100],
                    borderRadius: "3px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary[400],
                    },
                  },
                }}
              >
                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                  <Controller
                    name="paymentReceived"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        onKeyDown={handleKeyDown}
                        fullWidth
                        label="Payment Received"
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : ""
                        }
                      />
                    )}
                  />
                </Box>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box
                    sx={{
                      flex: { xs: "1 1 100%", sm: "1 1 45%" },
                      "& .MuiButtonBase-root": { color: "black" },
                    }}
                  >
                    <Controller
                      name="paymentReceivedDate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          {...field}
                          required
                          maxDate={dayjs()}
                          slotProps={{ textField: { format: "DD/MM/YYYY" } }}
                          label="Payment Receive Date"
                          error={!!fieldState.error}
                          helperText={
                            fieldState.error ? fieldState.error.message : ""
                          }
                          sx={{ width: "100%" }}
                        />
                      )}
                    />
                  </Box>
                </LocalizationProvider>

                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                  <Controller
                    name="closingType"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        variant="outlined"
                        fullWidth
                        required
                        error={!!fieldState.error}
                      >
                        <InputLabel htmlFor="closing-type">
                          Closing Type
                        </InputLabel>
                        <Select
                          {...field}
                          input={
                            <OutlinedInput
                              label="Closing Type"
                              id="closing-type"
                            />
                          }
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="closed">Closed</MenuItem>
                          <MenuItem value="settled">Settled</MenuItem>
                          <MenuItem value="writeOff">WriteOff</MenuItem>
                          <MenuItem value="partPayment">Part-Payment</MenuItem>
                        </Select>
                        {fieldState.error && (
                          <Typography color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                  <Controller
                    name="paymentMode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        variant="outlined"
                        fullWidth
                        required
                        error={!!fieldState.error}
                      >
                        <InputLabel htmlFor="payment-select">
                          Payment Mode
                        </InputLabel>
                        <Select
                          {...field}
                          input={
                            <OutlinedInput
                              label="Payment Mode"
                              id="payment-select"
                            />
                          }
                        >
                          <MenuItem value="" disable>
                            Select
                          </MenuItem>
                          <MenuItem value="upi" name="upiPayment">
                            UPI
                          </MenuItem>
                          <MenuItem value="cash" name="cashpayment">
                            Cash
                          </MenuItem>
                          <MenuItem value="cheque" name="chequePayment">
                            Cheque
                          </MenuItem>
                          <MenuItem
                            value="Bank Transfer"
                            name="bankTransferPayment"
                          >
                            Bank Transfer
                          </MenuItem>
                        </Select>
                        {fieldState.error && (
                          <Typography color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                  <Controller
                    name="referenceNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Reference No."
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : ""
                        }
                      />
                    )}
                  />
                </Box>

                {/* <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                  <Controller
                    name="discountType"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl variant="outlined" fullWidth error={!!fieldState.error}>
                        <InputLabel htmlFor="discount-type">Discount Type</InputLabel>
                        <Select
                          {...field}
                          value={selectedDiscountType}
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedDiscountType(e.target.value);
                          }}
                          input={<OutlinedInput label="Discount Type" id="discount-type" />}
                        >
                          <MenuItem >Select</MenuItem>
                          <MenuItem value="PENALTY_DISCOUNT">Penalty Discount</MenuItem>
                          <MenuItem value="PRINCIPAL_DISCOUNT">Principle Discount</MenuItem>
                          <MenuItem value="INTEREST_DISCOUNT">Interest Discount</MenuItem>
                        </Select>
                        {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                      </FormControl>
                    )}
                  />
                </Box> */}

                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                  <Controller
                    name="paymentDiscount"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        onKeyDown={handleKeyDown}
                        // disabled={!selectedDiscountType}
                        fullWidth
                        label="Discount Amount"
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : ""
                        }
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                  <Controller
                    name="refund"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        onKeyDown={handleKeyDown}
                        label="Excess/Refund"
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : ""
                        }
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 100%" } }}>
                  <Controller
                    name="paymentRemarks"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Remarks"
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : ""
                        }
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 100%" } }}>
                  <Stack
                    spacing={1}
                    flexDirection="row"
                    flexWrap="wrap"
                    alignItems="center"
                  >
                    <input
                      type="file"
                      id="paymentUpload"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="paymentUpload">
                      <Button
                        variant="contained"
                        sx={{
                          color: colors.black[100],
                          background: colors.white[100],
                          borderRadius: "0px 10px",
                          border: `1px solid ${colors.primary[400]}`,
                        }}
                        onClick={handleClickChooseFile}
                        component="span"
                      >
                        Upload Screenshot
                      </Button>
                    </label>
                    {/* Display Selected File */}
                    {selectedFile && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        paddingLeft="10px"
                      >
                        <Typography>
                          Selected File: {selectedFile.name}
                        </Typography>
                        <IconButton color="error" onClick={handleRemoveFile}>
                          <CloseIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                <Typography
                  variant="h6"
                  sx={{ fontStyle: "italic", color: colors.grey[400] }}
                >
                  ( * ) Mandatory Fields are Required
                </Typography>

                <Box
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 100%" },
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    // onClick={handleSubmit}
                    sx={{
                      background: colors.primary[400],
                      color: colors.white[100],
                      borderRadius: "0px 10px",
                      ":hover": { background: colors.primary[100] },
                    }}
                  >
                    Add Payment
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default RepaymentDetails;
