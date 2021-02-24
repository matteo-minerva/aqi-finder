const API_KEY = process.env.API_KEY;
const axios = require("axios");

class Station {
    constructor() {
        let data = {
            name: "",
            pm10: "",
            co: "",
            no2: "",
            verdict: "",
        };
    }

    setVerdict() {
        const { pm10 } = this.data;
        let verdict = "";
        if (pm10 === "N/A") verdict = "info unavailable";
        if (pm10 >= 0 && pm10 <= 50) verdict = "good";
        if (pm10 >= 51 && pm10 <= 100) verdict = "moderate";
        if (pm10 >= 101 && pm10 <= 150)
            verdict = "unhealthy for sensitive people";
        if (pm10 >= 151 && pm <= 200) verdict = "unhealthy";
        if (pm10 >= 201 && pm10 <= 300) verdict = "very unhealthy";
        if (pm10 >= 301 && pm10 <= 500) verdict = "hazardous";

        this.data = { ...this.data, verdict };
    }

    setData(newObj) {
        if (newObj) {
            this.data = { ...newObj };
        }
    }

    manageInput(e, ...args) {
        e.preventDefault();
        let baseUrl = "https://api.waqi.info/feed/";

        if (args.length === 1) {
            if (args[0]) {
                baseUrl += `${args[0]}`;
                input.value = "";
                baseUrl += `/?token=${API_KEY}`;
            } else {
                alert("Please insert a valid value");
            }
        }

        if (args.length === 2) {
            baseUrl += `geo:${args[0]};${args[1]}`;
            baseUrl += `/?token=${API_KEY}`;
        }

        this.getResponse(baseUrl);
    }

    async getResponse(url) {
        try {
            const response = await axios.get(url);

            if (response.data.status === "ok") {
                const { data } = await response.data;

                const newObj = {
                    name: data.city.hasOwnProperty("name")
                        ? data.city.name
                        : "N/A",
                    pm10: data.iaqi.hasOwnProperty("pm10")
                        ? data.iaqi.pm10.v
                        : "N/A",
                    co2: data.iaqi.hasOwnProperty("co")
                        ? `${data.iaqi.co.v} µg/m3`
                        : "N/A",
                    no2: data.iaqi.hasOwnProperty("no2")
                        ? `${data.iaqi.no2.v} µg/m3`
                        : "N/A",
                };
                this.setData(newObj);
                this.setVerdict();
                this.setDocument();

                window.innerWidth >= "1200"
                    ? (responseSection.style.display = "flex")
                    : (responseSection.style.display = "block");

                responseSection.scrollIntoView();
            }

            if (response.data.data === "Over quota")
                alert("Quota limit reached");
            if (response.data.data === "Invalid key") alert("Invalid API key");
        } catch (error) {
            console.error(`${error.name}: ${error.message}`);
        }
    }

    setDocument() {
        const aqi = document.querySelector(".aqi-index__text");
        const no2 = document.querySelector("#no2");
        const co2 = document.querySelector("#co2");
        const city = document.querySelector(".aqi-index__city");
        const verdict = document.querySelector("#verdict");

        city.textContent = this.data.name;
        aqi.textContent = this.data.pm10;
        co2.textContent = this.data.co2;
        no2.textContent = this.data.no2;
        verdict.textContent = this.data.verdict;
    }
}

const form = document.querySelector(".form");
const input = document.querySelector(".form__content--input");
const cityData = new Station();
const responseSection = document.querySelector("#response");
const geolocation = document.querySelector(".form__content--geolocation");
const helper = document.querySelector(".aqi-index__helper");

helper.addEventListener("click", () =>
    alert(
        "AQI is used by government agencies to communicate to the public how polluted the air currently is or how polluted it is forecast to become."
    )
);

input.focus();
form.addEventListener("submit", (e) => {
    cityData.manageInput(e, input.value);
});

geolocation.addEventListener("click", (e) => {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        cityData.manageInput(e, latitude, longitude);
    });
});
