import {
  React,
  Typography,
  SaveIcon,
  CansleIcon,
  EditIcon,
  AppBar,
  CssBaseline,
  GlobalStyles,
  Toolbar,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ImageIcon,
  Divider,
  NavigationIcon,
  IconButton,
  DeleteIcon,
} from "./imports";
export default function SideBar({
  Locations,
  showLocationInMap,
  EditLocation,
  locationData,
  toggleDraggable,
  setLocationData,
  draggable,
  setLng,
  setLat,
  ClickedbuttonLocation,
  setClickedbuttonLocation,
  deleteLocation,
  DeleteAll,
  DeletAll,
}) {
  return (
    <React.Fragment>
      <CssBaseline />
      <GlobalStyles
        styles={(theme) => ({
          body: {
            backgroundColor: theme.palette.background.paper,
            height: "100px",
          },
        })}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          zIndex: 1000,
          maxHeight: "100vh",
          width: "400px",
          overflowY: "auto",
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "red green", // For Firefox
          "&::-webkit-scrollbar": {
            width: "500px", // For WebKit browsers (Chrome, Safari)
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "blue", // Color of the scrollbar thumb
          },
        }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <IconButton
              edge="start"
              sx={{ mr: 2 }}
              color="inherit"
              aria-label="menu">
              {/* <MenuIcon /> */}
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Saved Location
              <Fab
                style={{
                  width: "63px",
                  height: "10px",
                  marginLeft: "129px",
                  fontWeight: 900,
                  color: "red",
                  fontSize: "8px",
                }}
                onClick={() => {
                  DeletAll(DeleteAll);
                }}>
                Delete All
              </Fab>
            </Typography>
          </Toolbar>
        </AppBar>
        <Typography style={{ backgroundColor: "white" }}>
          <List
            sx={{
              width: "100%",
              height: "70vh",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}>
            {Locations.length > 0 ? (
              Locations.map((location) => (
                <div>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={location.Name}
                      secondary={location.Notes}
                    />

                    {draggable && ClickedbuttonLocation === location ? (
                      <>
                        <Fab
                          color="secondary"
                          aria-label="edit"
                          style={{ width: "35px", height: "30px" }}
                          onClick={() => {
                            EditLocation(locationData);
                          }}>
                          <SaveIcon />
                        </Fab>
                        <Fab
                          color="secondary"
                          aria-label="edit"
                          style={{ width: "35px", height: "30px" }}
                          onClick={() => {
                            toggleDraggable();
                          }}>
                          <CansleIcon />
                        </Fab>
                      </>
                    ) : (
                      <>
                        <Fab
                          color="secondary"
                          style={{ width: "35px", height: "30px" }}
                          onClick={() => {
                            setClickedbuttonLocation(location);

                            toggleDraggable();
                            setLocationData(location);
                            setLat(location.LAT);
                            setLng(location.LNG);
                          }}>
                          <EditIcon />
                        </Fab>
                      </>
                    )}

                    <Fab
                      style={{
                        width: "25px",
                        height: "15px",
                        margin: "0 10px",
                      }}
                      onClick={() => {
                        showLocationInMap(location.LAT, location.LNG);
                      }}>
                      <NavigationIcon sx={{ mr: 0 }} />
                    </Fab>
                    <Fab
                      color="error"
                      aria-label="edit"
                      style={{ width: "25px", height: "5px" }}
                      onClick={() => deleteLocation(location.ID)}>
                      <DeleteIcon style={{ width: "15px" }} />
                    </Fab>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))
            ) : (
              <div>No Location Save</div>
            )}
          </List>
        </Typography>
      </div>
    </React.Fragment>
  );
}
