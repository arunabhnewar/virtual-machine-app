import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UploadForm from "../components/UploadForm/UploadForm";

const Home = () => {
  return (
    <>
      <Container
        sx={{
          marginTop: "20px",
          background: "#FAF9F6",
          padding: "20px 0px",
          borderRadius: "15px",
        }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}>
          <Box sx={{ width: "100%", maxWidth: 500 }}>
            <Typography variant='h6' gutterBottom>
              Upload files to my virtual machine
            </Typography>
          </Box>
          <Box sx={{ width: "100%", maxWidth: 500, textAlign: "right" }}>
            <Typography variant='subtitle2' gutterBottom>
              VM: gHcz49TuM10
            </Typography>
          </Box>
        </Stack>
        <Divider
          sx={{
            borderWidth: "1px",
            borderColor: "#000",
          }}
        />

        <Box sx={{ width: "100%", marginTop: "30px" }}>
          <Typography variant='body1' gutterBottom sx={{ fontWeight: 500 }}>
            Drop/attach the file(s) below to be uploaded to your virtual
            machine.
          </Typography>

          <Typography variant='caption' display='block' gutterBottom>
            Files will be reviewed by your project analyst before being made
            available on your virtual machine.
          </Typography>
        </Box>
        <UploadForm className='p-16 mt-10 border border-neutral-200' />
      </Container>
    </>
  );
};

export default Home;
