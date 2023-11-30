import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import { LinearProgress, List, ListItem, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";

const UploadForm = () => {
  // State to store the uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // State to manage the visibility of the file upload modal
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // State to manage the visibility of the file delete modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // State to store the currently selected file for deletion
  const [selectedFile, setSelectedFile] = useState(null);

  // State to track whether the upload button is clicked
  const [uploadButtonClicked, setUploadButtonClicked] = useState(false);

  // Log the uploaded files to the console for debugging purposes
  console.log(uploadedFiles);

  // Callback function triggered when files are dropped onto the drop zone

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Create new file objects with additional properties

      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        id: `${Date.now()}-${Math.random()}`,
        size: file.size,
        progress: 0,
      }));

      // Update the state with the new files
      setUploadedFiles((prevUploadedFiles) => [
        ...prevUploadedFiles,
        ...newFiles,
      ]);

      newFiles.forEach((file) => {
        const interval = setInterval(() => {
          file.progress += 10;
          setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles]);
          if (file.progress >= 100) {
            clearInterval(interval);
          }
        }, 100);
      });
    },
    [setUploadedFiles]
  );

  // Configuration for the drop zone using the useDropzone hook
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  // Function to format file size from bytes to a human-readable format
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Function to open the file upload modal
  const handleOpenUploadModal = () => {
    setOpenUploadModal(true);
  };

  // Function to close the file upload modal
  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
  };

  // Function to open the file delete modal and set the selected file
  const handleOpenDeleteModal = (file) => {
    setSelectedFile(file);
    setOpenDeleteModal(true);
  };

  // Function to close the file delete modal and reset the selected file
  const handleCloseDeleteModal = () => {
    setSelectedFile(null);
    setOpenDeleteModal(false);
  };

  // Function to delete the selected file and update the state
  const handleDeleteFile = () => {
    const deletedFileName = selectedFile?.name || "Unknown File";
    setUploadedFiles((prevUploadedFiles) =>
      prevUploadedFiles.filter((file) => file.id !== selectedFile.id)
    );
    handleCloseDeleteModal();
    // Show success message
    toast.success(`File "${deletedFileName}" deleted successfully!`);
  };

  // Function to handle the submission of the upload modal
  const handleSubmitModal = () => {
    setOpenUploadModal(false);
    setUploadButtonClicked(true);
    toast.success(
      "Files successfully uploaded to the Server for review. You will be notified when they are available on your VM."
    );
  };

  return (
    <>
      {/* Toast Message */}
      <Toaster
        position='top-left'
        toastOptions={{
          style: {
            width: "auto",
            maxWidth: "600px",
          },
        }}
      />
      <Box>
        {/* File Drop Zone Area  */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px solid #ccc",
            borderRadius: "15px",
            padding: "15px",
            width: "80%",
            margin: "auto",
            marginTop: "20px",
            height: "200px",
            background: "#ffffff",
          }}>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: "4px",
              padding: "5px",
              textAlign: "center",
              cursor: "pointer",
              width: "98%",
              height: "100%",
              "&:focus": {
                outline: "2px solid red", // Add the desired focus style
              },
            }}>
            <input {...getInputProps()} />

            <Stack
              direction='column'
              justifyContent='center'
              alignItems='center'
              spacing={2}
              textAlign='center'
              height='100%'>
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={2}
                textAlign='center'>
                <FileUploadOutlinedIcon
                  sx={{ width: "2em", height: "2em", fill: "#424242" }}
                />
                <Typography variant='h6'>Drop your file(s) here</Typography>
              </Stack>
              <Box>
                <Typography
                  variant='body2'
                  gutterBottom
                  sx={{ color: "#616161", marginBottom: "-15px" }}>
                  Accepted file formats xyz, xyz, xyz
                </Typography>
              </Box>
              <Box sx={{ marginTop: "0px" }}>
                <Typography
                  variant='body2'
                  sx={{ color: "#616161" }}
                  gutterBottom>
                  Maximum file size xyz GB
                </Typography>
              </Box>
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={1}
                textAlign='center'>
                <FolderIcon />
                <Typography
                  variant='body2'
                  sx={{
                    color: "#000",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                  gutterBottom>
                  Choose file(s)
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {/* Attached File(s) List */}
        <Box sx={{ marginTop: "65px", marginLeft: "35px" }}>
          <Typography variant='body1' sx={{ fontWeight: "600" }} gutterBottom>
            Attached files
          </Typography>

          {/* List of files */}
          {uploadedFiles.length > 0 ? (
            <List>
              {uploadedFiles.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "95%",
                    border: "1px solid #000",
                    padding: "5px",
                    marginBottom: "10px",
                  }}>
                  {/* File Name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "85%",
                    }}>
                    <Typography
                      variant='body2'
                      sx={{ paddingLeft: "10px", fontWeight: "600" }}>
                      {file.name}
                    </Typography>
                    {file.progress < 100 && (
                      <LinearProgress
                        variant='determinate'
                        value={file.progress}
                        sx={{ width: "50%", marginLeft: "10px" }}
                      />
                    )}
                  </Box>
                  {/* File Size & Delete Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <Typography
                      variant='body2'
                      sx={{
                        paddingLeft: "10px",
                        fontWeight: "600",
                        width: "80px",
                      }}>
                      {formatBytes(file.size)}
                    </Typography>
                    <Button
                      aria-label='Delete'
                      onClick={() => handleOpenDeleteModal(file)}>
                      <DeleteIcon sx={{ fill: "#676262", cursor: "pointer" }} />
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant='body1'
              sx={{ color: "#616161", fontSize: "0.875rem" }}
              gutterBottom>
              No Files Attached Yet
            </Typography>
          )}
        </Box>

        {/* Contact Information */}
        <Box sx={{ marginTop: "30px" }}>
          <Typography variant='h6' gutterBottom>
            What is the contact information of your project analyst?
          </Typography>
          <Typography variant='caption' gutterBottom>
            Your project analyst will be notified of the uploaded files and will
            review them before they are available for use on your virtual
            machine
          </Typography>
          {/* Enter email address input form */}
          <Box sx={{ marginTop: "15px", marginLeft: "35px" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: "450px",
                minWidth: "200px",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}>
              <input
                type='email'
                name='email'
                id='email'
                placeholder='enter email address'
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #000",
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                }}
              />
              {/* Email Service */}
              <Typography
                variant='body2'
                sx={{ position: "absolute", right: "10px" }}>
                @gmail.com
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{
            margin: "100px 0 10px",
            borderWidth: "1px",
            borderColor: "#000",
          }}
        />

        {/* Upload And Cancel Form */}
        <Stack
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          spacing={2}>
          <Button
            variant='outlined'
            sx={{
              background: "#ffffff",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}>
            Cancel
          </Button>
          <Button
            disabled={uploadedFiles.length === 0}
            sx={{
              bgcolor: "#1976D2",
              minWidth: "64px",
              padding: "6px 16px",
              "&:hover": {
                background: "#1565C0",
                boxShadow:
                  "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.1)",
              },
            }}
            onClick={handleOpenUploadModal}>
            <Typography variant='body' sx={{ color: "#ffffff" }}>
              Upload
            </Typography>
          </Button>
        </Stack>

        {/* Upload Data Modal */}
        <Modal
          open={openUploadModal}
          onClose={handleCloseUploadModal}
          aria-labelledby='upload-modal-title'
          aria-describedby='upload-modal-description'>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 550,
              height: "auto",
              bgcolor: "background.paper",
              borderRadius: "5px",
              boxShadow: 24,
            }}>
            <Typography
              variant='h2'
              sx={{
                textAlign: "center",
                paddingTop: "15px",
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "18px",
              }}>
              Upload files to the database
            </Typography>

            <Divider
              sx={{
                borderColor: "#000",
                width: "100%",
              }}
            />

            <Typography
              variant='body2'
              sx={{
                textAlign: "center",
                paddingTop: "30px",
                width: "390px",
                margin: "0 auto",
                paddingBottom: "15px",
                color: "#212121",
                fontWeight: 500,
                fontSize: "0.9rem",
              }}>
              This will upload the files for your project analyst to review. A
              notification will be sent to:
            </Typography>

            <Typography
              variant='body2'
              sx={{
                fontSize: "0.9rem",
                fontWeight: 800,
                textAlign: "center",
                fontStyle: "italic",
                paddingBottom: "25px",
              }}>
              analyst_first.last@mail.com
            </Typography>

            <Typography
              variant='body2'
              sx={{ textAlign: "center", color: "#424242" }}>
              You will be notified when the files are available for use on your
              VM.
            </Typography>

            <Divider
              sx={{
                marginTop: "30px",
                marginBottom: "30px",
                borderColor: "#000",
                width: "100%",
              }}
            />

            <Stack
              direction='row'
              justifyContent='center'
              alignItems='center'
              spacing={2}
              marginBottom='20px'>
              <Button variant='outlined' onClick={handleCloseUploadModal}>
                Cancel
              </Button>
              <Button variant='contained' onClick={handleSubmitModal}>
                Upload
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Delete File Modal */}
        <Modal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby='delete-modal-title'
          aria-describedby='delete-modal-description'>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 550,
              height: "auto",
              bgcolor: "background.paper",
              borderRadius: "5px",
              boxShadow: 24,
              display: "flex",
              flexDirection: "column",
            }}>
            <Typography
              variant='h5'
              id='delete-modal-title'
              sx={{
                textAlign: "center",
                paddingTop: "15px",
                fontWeight: "600",
              }}>
              Delete this file?
            </Typography>

            <Typography
              variant='body1'
              id='delete-modal-title'
              sx={{
                textAlign: "center",
                padding: "15px 10px 30px 10px",
                fontSize: "1rem",
              }}>
              Delete file &quot;{selectedFile?.name}&quot;
            </Typography>

            <Stack
              direction='row'
              justifyContent='center'
              alignItems='center'
              spacing={2}
              marginBottom='20px'>
              <Button variant='outlined' onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant='contained' onClick={handleDeleteFile}>
                Delete File
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default UploadForm;
