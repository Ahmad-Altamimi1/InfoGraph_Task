import { React,useEffect, useRef, useState, useMemo, useCallback, MapContainer, TileLayer,
  Marker,Popup,axios,Swal,Icon,pinnedimage,Typography,Box,SpeedDial,SpeedDialIcon,
  SaveIcon,CansleIcon,EditIcon,CircularProgress,green,AppBar,CssBaseline,GlobalStyles,
  Toolbar,Fab,CheckIcon,List,ListItem,ListItemText,ListItemAvatar,Avatar,ImageIcon,
  Divider,NavigationIcon,useMapEvent,IconButton, DeleteIcon,useMap,
} from "./components/imports";
// import LocationButton from './ButtonLocation'
import SideBar from "./components/SideBar";
import AddNewLocationInMap from "./components/AddNewLocation";
import Button from "@mui/material/Button";
function MapComponent() {
  // _______________________________________________________________________________________________________
  // const datas
  // _______________________________________________________________________________________________________
  const [userLocation, setUserLocation] = useState([
    31.95217588333013, 35.93904197216035,
  ]);

  const [Locations, setLocations] = useState([]);
  const [AddNewLocation, setAddNewLocation] = useState(false);
  const [AddNewLocationButtonContent, setAddNewLocationButtonContent] =
    useState("Add New Location");
  const [Latt, setLat] = useState(31.95217588333013);
  const [Lngg, setLng] = useState(35.93904197216035);
  const [draggable, setDraggable] = useState(false);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(null);
  // const [Preestoedit, setPreestoedit] = useState({});
  const [DeleteAll, setDeleteAll] = useState([]);
  const [ClickedbuttonLocation, setClickedbuttonLocation] = useState({});
  const mapRef = useRef();
  const [locationData, setLocationData] = useState({
    id: null,
    lat: null,
    lng: null,
    name: "",
    notes: "",
  });
  

  const customIcon = new Icon({
    iconUrl: pinnedimage,
    iconSize: [38, 38],
  });
  console.log("latt", Latt);
  console.log("Lngg", Lngg);

  function SetViewOnClick({ animateRef }) {
    const map = useMapEvent("click", (e) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: animateRef.current || false,
      });
    });

    return null;
  }
  const eventHandlers = useMemo(
    () => ({
      dragend(event) {
        const marker = event.target;

        if (marker != null) {
          setPosition(marker.getLatLng());
          marker.Position = marker.getLatLng();
          setLocationData((prevState) => ({
            ...prevState,
            LAT: marker.Position.lat,
            LNG: marker.Position.lng,
          }));
        }
      },
    }),
    []
  );
  // const customIcon = new Icon({
  //   iconUrl: pinnedimage,
  //   iconSize: [38, 38],
  // });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();





  // ____________________________________________________________________  ___________________________________
  // End const Data
  // _______________________________________________________________________________________________________

  // _______________________________________________________________________________________________________
  //Fetch Data from Api
  // _______________________________________________________________________________________________________
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function SaveLocation() {
    const { value: formValues } = await Swal.fire({
      title: "Multiple inputs",
      html:
        "<label>Name</label>" +
        ' <input id="swal-input1" class="swal2-input">' +
        "<label>Notes</label>" +
        '<input id="swal-input2" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (formValues) {
      const formData = {
        Name: formValues[0],
        Notes: formValues[1],
        LAT: Latt,
        LNG: Lngg,
      };

      try {
        const response = await axios.post(
          "http://localhost:4000/locations",
          formData
        );

        fetchData();
        SaveNewLocation();
        setSuccess(false);
        setLoading(true);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  async function EditLocation(locationData) {
    const { value: formValues } = await Swal.fire({
      title: "Edit Location",
      html:
        `<input id="swal-input1" type='hidden' class="swal2-input" value="${locationData.LAT}">` +
        `<input id="swal-input2" type='hidden'  class="swal2-input" value="${locationData.LNG}">` +
        "<label>Name</label>" +
        `<input id="swal-input-name" class="swal2-input" value="${locationData.Name}">` +
        "<label>Notes</label>" +
        `<input id="swal-input-notes" class="swal2-input" value="${locationData.Notes}">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input-name").value,
          document.getElementById("swal-input-notes").value,
        ];
      },
    });

    if (formValues) {
      const updatedData = {
        LAT: formValues[0],
        LNG: formValues[1],
        Name: formValues[2],
        Notes: formValues[3],
      };

      try {
        const response = await axios.put(
          `http://localhost:4000/locations/${locationData.ID}`,
          updatedData
        );
        setPosition(null);
        fetchData();
        toggleDraggable();
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  }

  function deleteLocation(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:4000/locations/${id}`).then(() => {
          fetchData();
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        });
      }
    });
  }

  function DeletAll(DeleteAll) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Delete All!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteAll.map((id) => {
          axios.delete(`http://localhost:4000/locations/${id}`).then(() => {
            fetchData();
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          });
        });
      }
    });
  }

  useEffect(() => {
    for (const location of Locations) {
      DeleteAll.push(location.ID);
    }
  }, [Locations]);
  // _______________________________________________________________________________________________________
  //End Fetch Data from Api
  // _______________________________________________________________________________________________________


  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
    const marker = markerRef.current;
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([Latt, Lngg], 13);
    }
  }, [Latt, Lngg]);

  function showLocationInMap(latt, lngg) {
    setLat(latt);
    setLng(lngg);

    setUserLocation([latt, lngg]);
  }
  // -------------------------------------------------------------------------------------
  // Show all Marker Button
  // -------------------------------------------------------------------------------------
  function SaveNewLocation() {
    if (AddNewLocation) {
      setAddNewLocation(false);
    } else {
      setAddNewLocation(true);

    }
  }
  // -------------------------------------------------------------------------------------
  // End Show all Marker Button
  // -------------------------------------------------------------------------------------
  // saveeeeee



  const handleButtonClick = () => {
    if (!loading) {
      SaveLocation()
    }
  };

  // saveeeeee
  // -------------------------------------------------------------------------------------
  // Render the data in page
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------------------------------------------------------------------------
  // Render the data in page
  // -------------------------------------------------------------------------------------


  return (
    <>
      <AddNewLocationInMap
        AddNewLocation={AddNewLocation}
        handleButtonClick={handleButtonClick}
        SaveNewLocation={SaveNewLocation}
        AddNewLocationButtonContent={AddNewLocationButtonContent}
      />
      <>
        <MapContainer
          center={[Latt, Lngg]}
          ref={mapRef}
          scrollWheelZoom={true}
          zoom={20}
          style={{ height: "100vh", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* <MarkerClusterGroup chunkedLoading> */}

          <Marker
            position={[31.95217588333013, 35.93904197216035]}
            icon={customIcon}>
            <Popup>
              <img
                width={"90%"}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Roman_theater_of_Amman_01.jpg/1280px-Roman_theater_of_Amman_01.jpg"></img>{" "}
              <h4>Roman Theatre</h4>AMMAN
            </Popup>
          </Marker>

          {Locations.map((location) => (
            <>
              <Marker
                key={location.ID}
                draggable={draggable}
                ref={markerRef}
                eventHandlers={eventHandlers}
                position={
                  position && ClickedbuttonLocation == location
                    ? position
                    : [location.LAT, location.LNG]
                }>
                <Popup minWidth={90}>
                  <span>
                    {draggable ? (
                      <>
                       <Button variant="outlined" color="error" onClick={toggleDraggable}>
        Cansle
      </Button>
                       <Button variant="outlined" color="success" onClick={()=>{
                        EditLocation(locationData);
                       }}>
        Save
      </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          color="error"
                          onClick={() => {
                            deleteLocation(location.ID);
                          }}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          color="success"
                          onClick={() => {
                            toggleDraggable();
                            setLocationData(location);
                            setClickedbuttonLocation(location);
                          }}>
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </span>
                  <br/>
                  <span style={{ fontSize: "20px" }}>
                    Name: {location.Name}
                    <br />
                    Notes: {location.Notes}
                  </span>
                </Popup>
              </Marker>
            </>
          ))}

          {/* </MarkerClusterGroup> */}
          {AddNewLocation && (
            <Marker position={userLocation} zoom={13}>
              <Popup>Select Location</Popup>
            </Marker>
          )}

          <LocationButton
            setUserLocation={setUserLocation}
            setLat={setLat}
            setLng={setLng}
            AddNewLocation={AddNewLocation}
          />
          <SetViewOnClick animateRef={useRef(true)} />
        </MapContainer>
      </>

      <SideBar
        Locations={Locations}
        showLocationInMap={showLocationInMap}
        locationData={locationData}
        EditLocation={EditLocation}
        setLocationData={setLocationData}
        toggleDraggable={toggleDraggable}
        draggable={draggable}
        setLat={setLat}
        setLng={setLng}
        ClickedbuttonLocation={ClickedbuttonLocation}
        setClickedbuttonLocation={setClickedbuttonLocation}
        deleteLocation={deleteLocation}
        DeleteAll={DeleteAll}
        DeletAll={DeletAll}
      />
    </>
  );
}

function LocationButton({ setUserLocation, setLat, setLng, AddNewLocation }) {
  const map = useMap();
  if (AddNewLocation) {
    // useEffect(() => {
    // Move this logic inside the useEffect
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setLat(lat);
      setLng(lng);
      setUserLocation([lat, lng]);
      map.flyTo([lat, lng], map.getZoom());
    });
    // }, [setLat, setLng, setUserLocation]);

    return null;
  }
}



export default MapComponent;
