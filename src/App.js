import logo from "./logo.svg";
import "./App.css";
import TestComponent from "./components/TestComponent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Lottie from "lottie-react";
import cloud from "./assets/cloud.json";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import axios from "axios";
import moment from "moment";
import "moment/min/locales"
import { use } from "i18next";
moment.locale("ar")

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancleAxios = null;



function App() {

  const [local,setLocal]=useState("ar")
  const { t, i18n } = useTranslation();
  const [dateAndTime , setDateAndTime]=useState(null)
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon:null,
  });


  function handleLanguageClick(){
    if(local=="en"){
      setLocal("ar")
      i18n.changeLanguage("ar")
      moment.locale("ar")
    }else{
      setLocal("en")
      i18n.changeLanguage("en")
      moment.locale("en")



    }
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));


  }

  useEffect(()=>{
    i18n.changeLanguage(local)
  },[] )

  useEffect(() => {
   
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=24.6877&lon=46.7219&appid=20c96fb6d69f122e4510a8e73fc5ce34",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancleAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const responseMin = Math.round(response.data.main.temp_min-272.15);
        const responseMax = Math.round(response.data.main.temp_max-272.15);
        const responseDescription = response.data.weather[0].description;
        const responseIcon=response.data.weather[0].icon;
        console.log(response.data);
        console.log(responseIcon);
        setTemp({
          number: responseTemp,
          description: responseDescription,
          min: responseMin,
          max: responseMax,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    return () => {
      console.log("Canceling");
      cancleAxios();
    };
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* CONTENT CONTAINER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              flexDirection: "column",
            }}
          >
            {/* CARD */}
            <div
              style={{
                background: "rgba(43, 133, 197, 0.33)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 2px 1px rgba(0,0,0,0.05)",
                width: "100%",
                direction: local=="ar"?"rtl":"ltr" 
              }}
            >
              {/* CONTENT */}
              <div>
                {/* CITY & TIME */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                >
                  <Typography
                    variant="h2"
                    style={{ marginRight: "20px", fontWeight: "600" }}
                  >
                    {t("Riyadh")}
                  </Typography>
                  <Typography variant="h6" style={{ marginRight: "20px" }}>
                   {dateAndTime}
                  </Typography>
                </div>
                {/* CITY & TIME */}
                <hr />

                {/* CONTAINER OF DEGREE + CLOUD ICON*/}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  {/* DEGREE & DESCRPTION */}
                  {/* TEMP */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{display:"flex" , justifyContent:"center", alignItems:"center"}}>
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      <img src={temp.icon} />
                    </div>
                   
                  

                    {/* TEMP */}
                    <Typography variant="h6" style={{ fontWeight: "400" }}>
                     {t(temp.description)}
                    </Typography>
                    {/* MIN AND MAX TEMP */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5 style={{ fontWeight: "400" }}> {t("min")} : {temp.min}</h5>
                      <h5 style={{ fontWeight: "400", margin: "0px 3px" }}>
                        |
                      </h5>
                      <h5 style={{ fontWeight: "400" }}> {t("max")} {temp.min}</h5>
                    </div>
                  </div>
                  {/* MIN AND MAX TEMP */}
                  {/* DEGREE & DESCRPTION */}

                  {/*CLOUD ICON */}
                  <div style={{ width: "200px", height: "200px" }}>
                    <Lottie animationData={cloud} loop={true} autoplay={true} />
                  </div>

                  {/*CLOUD ICON */}
                </div>
              </div>
              {/* CONTENT */}
            </div>
            {/* CARD */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                marginTop: "20px",
                direction:"rtl"
              }}
            >
              <Button style={{ color: "white" }} variant="text" onClick={handleLanguageClick}>
                {local=="en"?"Arabic":"إنجليزي"}
              </Button>
            </div>
          </div>
          {/* CONTENT CONTAINER */}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
