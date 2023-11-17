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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  console.log(uploadedFiles);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        id: `${Date.now()}-${Math.random()}`,
        size: file.size,
        progress: 0,
      }));

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleOpenUploadModal = () => {
    setOpenUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
  };

  const handleOpenDeleteModal = (file) => {
    setSelectedFile(file);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedFile(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteFile = () => {
    const deletedFileName = selectedFile?.name || "Unknown File";
    setUploadedFiles((prevUploadedFiles) =>
      prevUploadedFiles.filter((file) => file.id !== selectedFile.id)
    );
    handleCloseDeleteModal();
    // Show success message
    toast.success(`File "${deletedFileName}" deleted successfully!`);
  };

  const handleSubmitModal = () => {
    setOpenUploadModal(false);
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
        <Box sx={{ marginTop: "65px" }}>
          <Typography variant='h6' gutterBottom>
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}>
                    <Typography
                      variant='body2'
                      sx={{ paddingLeft: "10px", fontWeight: "600" }}>
                      {file.name}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ paddingLeft: "10px", fontWeight: "600" }}>
                      {formatBytes(file.size)}
                    </Typography>
                    {file.progress < 100 && (
                      <LinearProgress
                        variant='determinate'
                        value={file.progress}
                        sx={{ width: "50%", marginLeft: "10px" }}
                      />
                    )}
                  </Box>
                  <DeleteIcon
                    sx={{ fill: "#676262", cursor: "pointer" }}
                    onClick={() => handleOpenDeleteModal(file)}
                  />
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
            <input
              type='email'
              name='email'
              id='email'
              placeholder='enter email address'
              style={{
                width: "40%",
                padding: "10px",
                border: "1px solid #000",
              }}
            />
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
          <Button variant='outlined'>Cancel</Button>
          <Button variant='contained' onClick={handleOpenUploadModal}>
            Upload
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

/*  */

export default UploadForm;
