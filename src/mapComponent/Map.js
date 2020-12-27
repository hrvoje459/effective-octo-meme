import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const initialCenter = L.latLng(44.43378, 16.370707);
let currentCenter = L.latLng(44.43378, 16.370707);
let intitialMarkerPostion = L.latLng(45.800623, 15.971131);
let currentMarkerPosition = L.latLng(45.800623, 15.971131);
const zoomLevel = 5;

function MapSearch(props) {
  /* const { handleSubmit, register, errors } = useForm({}); */
  const [searchParam, setSearchParam] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(values) {
    /* e.preventDefault(); */

    const options = {
      method: "GET",
      redirect: "follow",
    };
    let findUrl =
      "https://nominatim.openstreetmap.org/?q=" + searchParam + "&format=json";

    await fetch(findUrl, options)
      .then((response) => response.text())
      .then((result) => {
        if (JSON.stringify(result) !== JSON.stringify("[]")) {
          setErrorMessage("");
          props.map.setView(
            [JSON.parse(result)[0].lat, JSON.parse(result)[0].lon],
            15
          );
        } else {
          setErrorMessage("Ne možemo pronaći lokaciju");
        }
      })
      .catch((error) => setErrorMessage(error));
  }
  function myChangeHandler(event) {
    setSearchParam(event.target.value);
  }
  function logIT(e) {
    if (e.key === "Enter") {
      console.log("heureka");
      onSubmit(e);
    }
  }
  return (
    //<form onSubmit={handleSubmit(onSubmit)}>
    <div /* className="form-group" */>
      <input
        className="form-control leaflet-bar"
        type="search"
        name="q"
        value={searchParam}
        placeholder="Pretraži.."
        /* ref={register()} */
        onChange={myChangeHandler}
        onKeyPress={(e) => logIT(e)}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
    //</form>
  );
}
function HomeButton(props) {
  const onClick = useCallback(() => {
    props.map.setView(initialCenter, zoomLevel);
  }, [props.map]);

  const onMove = useCallback(() => {
    currentCenter = props.map.getCenter();
  }, [props.map]);

  useEffect(() => {
    props.map.on("move", onMove);
    return () => {
      props.map.off("move", onMove);
    };
  }, [props.map, onMove]);

  return (
    <a className="leaflet-control-zoom-out" role="button" onClick={onClick}>
      <svg
        width="20px"
        height="20px"
        className="bi bi-house-door"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M7.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 .146.354v7a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-4H7v4a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l6-6zM2.5 7.707V14H6v-4a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4h3.5V7.707L8 2.207l-5.5 5.5z"
        />
        <path
          fillRule="evenodd"
          d="M13 2.5V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
        />
      </svg>
    </a>
  );
}
function CenterMarker(props) {
  const [markerPos, setMarkerPos] = useState(intitialMarkerPostion);
  const markerRef = useRef(null);

  function postaviMarker() {
    setMarkerPos(currentCenter);
    currentMarkerPosition = currentCenter;
    console.log("bruhJEDAN " + currentMarkerPosition);
    props.setGeoLocation(currentMarkerPosition);
  }
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setMarkerPos(marker.getLatLng());
          currentMarkerPosition = marker.getLatLng();
          console.log("bruhDVA " + currentMarkerPosition);
          props.setGeoLocation(currentMarkerPosition);
        }
      },
    }),
    []
  );

  return (
    <a
      className="leaflet-control-zoom-in"
      role="button"
      onClick={postaviMarker}
    >
      <svg
        width="20px"
        height="20px"
        className="bi bi-geo-alt"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M12.166 8.94C12.696 7.867 13 6.862 13 6A5 5 0 0 0 3 6c0 .862.305 1.867.834 2.94.524 1.062 1.234 2.12 1.96 3.07A31.481 31.481 0 0 0 8 14.58l.208-.22a31.493 31.493 0 0 0 1.998-2.35c.726-.95 1.436-2.008 1.96-3.07zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"
        />
        <path
          fillRule="evenodd"
          d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        />
      </svg>
      <Marker
        map={props.map}
        draggable={true}
        eventHandlers={eventHandlers}
        position={markerPos}
        ref={markerRef}
      ></Marker>
    </a>
  );
}

function Map(props) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    props.setGeoLocation(currentMarkerPosition);
  }, []);

  return (
    <MapContainer
      center={initialCenter}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      whenCreated={setMap}
      className=""
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <TileLayer
        attribution='<a href="https://github.com/hrvoje459" target="_blank">hrvoje459</a> '
        url=""
      ></TileLayer>

      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
          {map ? (
            <CenterMarker map={map} setGeoLocation={props.setGeoLocation} />
          ) : null}
          {map ? <HomeButton map={map} /> : null}
        </div>
      </div>

      <div className="searchBar">{map ? <MapSearch map={map} /> : null}</div>
      {props.children}
    </MapContainer>
  );
}

export default Map;
