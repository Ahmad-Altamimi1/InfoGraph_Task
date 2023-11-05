
import {
  React,Box,SpeedDial,SpeedDialIcon,SaveIcon,CircularProgress,green,Fab,CheckIcon,
} from "./imports";

export default function AddNewLocation({
  AddNewLocation,
  AddNewLocationButtonContent,
  SaveNewLocation,
  handleButtonClick,
}) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };
console.log(AddNewLocation);
  return (
    <>
      {AddNewLocation ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
              <Fab
                aria-label="save"
                color="primary"
                sx={buttonSx}
                onClick={()=>{
                    handleButtonClick();
                }}>
                {<CheckIcon />}
              </Fab>
              {loading && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: 0,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            sx={{ position: "absolute", top: 0, right: 0 }}
            icon={
              <SpeedDialIcon
                openIcon={<SaveIcon />}
                onClick={() => {
                  SaveNewLocation();
                }}
              />
            }>
            {AddNewLocationButtonContent}
          </SpeedDial>
        </Box>
      )}
    </>
  );
}