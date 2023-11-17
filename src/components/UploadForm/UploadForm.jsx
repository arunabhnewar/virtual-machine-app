import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "2px solid #ccc", // Solid border for the container
  borderRadius: "15px",
  padding: "15px",
  width: "70%",
  margin: "auto", // Center the container
  marginTop: "20px", // Add margin for better spacing
  height: "200px",
};

const dropzoneStyle = {
  border: "2px dashed #ccc", // Dotted border for the drop zone
  borderRadius: "4px",
  padding: "5px",
  textAlign: "center",
  cursor: "pointer",
  width: "98%",
  height: "100%",
};

const uploadIcon = {
  width: "2em",
  height: "2em",
  fill: "#424242",
};

const textMargin = {
  marginTop: "0px",
};

const emailInput = {
  width: "40%",
  padding: "10px",
};

const AttachFileList = {
  border: "1px solid #000",
  marginBottom: "10px",
  paddingTop: "0px",
  paddingBottom: "0px",
};

//
const UploadModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  height: "auto",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
};

const UploadModalTitle = {
  textAlign: "center",
  paddingTop: "15px",
};

const uploadModalText = {
  textAlign: "center",
  paddingTop: "30px",
  width: "350px",
  margin: "0 auto",
  paddingBottom: "15px",
  color: "#212121",
  fontWeight: 500,
};

const analystEmail = {
  fontSize: "22px",
  fontWeight: 800,
  textAlign: "center",
  fontStyle: "italic",
  paddingBottom: "25px",
};

const notifyTxt = {
  textAlign: "center",
  color: "#424242",
};

const UploadForm = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [open, setOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Handle dropped files
      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        id: Date.now(),
        progress: 0,
      }));
      setUploadedFiles([...uploadedFiles, ...newFiles]);

      // Simulate file upload progress
      newFiles.forEach((file) => {
        const interval = setInterval(() => {
          file.progress += 5;
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.id]: file.progress,
          }));
          if (file.progress >= 100) {
            clearInterval(interval);
            // Remove the progress bar after uploading is complete
            setUploadProgress((prevProgress) => {
              const { [file.id]: deletedFile, ...newProgress } = prevProgress;
              return newProgress;
            });
          }
        }, 5000);
      });
    },
    [uploadedFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleDelete = (id) => {
    setUploadedFiles((prevUploadedFiles) =>
      prevUploadedFiles.filter((file) => file.id !== id)
    );
    setUploadProgress((prevProgress) => {
      const { [id]: deletedFile, ...newProgress } = prevProgress;
      return newProgress;
    });
  };

  //Upload Modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box>
        <div style={containerStyle}>
          <div {...getRootProps()} style={dropzoneStyle}>
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
                <FileUploadOutlinedIcon style={uploadIcon} />

                <Typography variant='h6'>Drop your file(s) here</Typography>
              </Stack>
              <Box>
                <Typography
                  variant='body2'
                  gutterBottom
                  sx={{ color: "#616161" }}>
                  Accepted file formats xyz, xyz, xyz
                </Typography>
              </Box>
              <Box style={textMargin}>
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
          </div>
        </div>

        <Box sx={{ marginTop: "65px" }}>
          <Typography variant='h6' gutterBottom>
            Attached files
          </Typography>

          <List>
            {uploadedFiles?.map((file) => (
              <ListItem key={file.id} style={AttachFileList}>
                <ListItemText primary={file.name} />
                {file.progress < 100 && (
                  <LinearProgress
                    variant='determinate'
                    value={uploadProgress[file.id] || 0}
                  />
                )}

                <ListItemIcon>
                  <IconButton onClick={() => handleDelete(file.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Contact Information */}
        <Box sx={{ marginTop: "100px" }}>
          <Typography variant='h6' gutterBottom>
            What is the contact information of your project analyst?
          </Typography>
          <Typography variant='caption' gutterBottom>
            Your project analyst will be notified of the uploaded files and will
            review them before they are available for use on your virtual
            machine
          </Typography>

          <Box sx={{ marginTop: "15px", marginLeft: "35px" }}>
            <input
              type='email'
              name=''
              id=''
              placeholder='enter email address'
              style={emailInput}
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

        <Stack
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          spacing={2}>
          <Button variant='outlined'>Cancel</Button>
          <Button variant='contained' onClick={handleOpen}>
            Upload
          </Button>
        </Stack>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'>
          <Box sx={{ ...UploadModal }}>
            <h2 id='parent-modal-title' style={UploadModalTitle}>
              Upload files to your database
            </h2>

            <Divider
              sx={{
                borderColor: "#000",
                width: "100%",
              }}
            />

            <p id='parent-modal-description' style={uploadModalText}>
              This will upload the files for your project analyst to review. A
              notification will be sent to:
            </p>

            <p style={analystEmail}>analyst_first.last@mail.com</p>

            <p style={notifyTxt}>
              You will be notified when the files are available for use on your
              VM.
            </p>

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
              <Button variant='outlined'>Cancel</Button>
              <Button variant='contained' onClick={handleOpen}>
                Upload
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default UploadForm;
