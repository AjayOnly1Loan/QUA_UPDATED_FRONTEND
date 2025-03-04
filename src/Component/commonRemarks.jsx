import React, { useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useAuthStore from './store/authStore';

const CommonRemarks = ({ id, onRemarksChange }) => {
    const { commonRemarks, setCommonRemarks } = useState([]);
    const { empInfo, activeRole } = useAuthStore();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { control } = useForm({
        defaultValues: {
            addRemarks: '',
        }
    });

    const handleRemarksChange = (event) => {
        const newRemarks = event.target.value;
        onRemarksChange(newRemarks);
    };

    return (
        <>
            <Box
                component="form"
                className="p-3 m-3"
                sx={{
                    background: colors.white[100],
                    color: colors.black[100],
                    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
                    borderRadius: "0px 20px",
                    height: "auto",
                }}
            >
                <Typography variant="h6" style={{ fontWeight: '600', color: colors.primary[400], marginBottom: "10px", textAlign: "center", fontSize: "18px" }}>
                    Add Remarks
                </Typography>
                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                    <Controller
                        name="addRemarks"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl
                                variant="outlined"
                                fullWidth
                                required
                                error={!!fieldState.error}
                                sx={{
                                    colors: colors.black[100],
                                    '& .MuiOutlinedInput-root': {
                                        color: colors.white[100]
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.primary[400],
                                        "&:hover": {
                                            borderColor: colors.primary[400]
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: colors.primary[400],
                                    },
                                    '& .MuiOutlinedInput-input':{
                                        color:colors.black[100]
                                    },
                                }}
                            >
                                <TextField
                                    {...field}
                                    id="add-remarks"
                                    label="Remarks"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    inputProps={{
                                        minLength: 30
                                    }}
                                    onChange={(e) => {
                                        field.onChange(e); // Update the form state
                                        handleRemarksChange(e.target.value); // Send the value to the parent component
                                    }}
                                    sx={{
                                        color: colors.primary[100],
                                        "&:hover": {
                                            color: colors.primary[100],
                                        },
                                        '& .MuiInputBase-root': {
                                            color: colors.black[100],
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: colors.primary[400],
                                            "&:hover": {
                                                borderColor: colors.primary[400]
                                            }
                                        },
                                    }}
                                />
                            </FormControl>
                        )}
                    />
                </Box>
            </Box>
        </>
    );
}

export default CommonRemarks;