import "./styles.css";
import "normalize.css";
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

const submit_btn = document.querySelector("#submit_btn");
const logistics_form = document.querySelector("#logistics_form");
const back_btn = document.querySelector("#back_btn");
const results = document.querySelector("#results");
const result_container = document.querySelector("#result_container");

//get gemini api
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDqZ3t-DCfkmdTyzQrnSdTJyr2Lqdt90Uo",
});

function generatePrompt(
  departure,
  destination,
  nationality,
  travel_date,
  travel_days,
  luggage_size = "unknown",
) {
  return `I am travelling from ${departure} to ${destination} with a passport nationality of ${nationality}. I will be travelling from ${travel_date} with ${travel_days} days. My luggage size is ${luggage_size}. Keep in mind of the weather and location and use these information to generate a simple packing list that includes daily neccessities and travel documents and no descriptions. Format is heading with bullet points. `;
}

async function getResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      temperature: 0.1,
    },
  });
  return response.text;
}

async function submitForm(event) {
  event.preventDefault();
  logistics_form.classList.add("hidden");
  result_container.classList.remove("hidden");

  const tripDetails = {
    departure: document.querySelector("#departure").value,
    destination: document.querySelector("#destination").value,
    nationality: document.querySelector("#nationality").value,
    travel_date: document.querySelector("#travel_date").value,
    travel_days: parseInt(document.querySelector("#travel_days").value, 10),
    luggage_size: document.querySelector("#luggage_size").value,
  };

  console.log("Trip Details:", tripDetails);
  var prompt = generatePrompt(
    tripDetails.departure,
    tripDetails.destination,
    tripDetails.nationality,
    tripDetails.travel_date,
    tripDetails.travel_days,
    tripDetails.luggage_size,
  );
  console.log("prompt: " + prompt);

  //   var response = await getResponse(prompt);
  //   results.innerHTML = marked.parse(response);
}

function backPage(event) {
  event.preventDefault();
  logistics_form.classList.remove("hidden");
  result_container.classList.add("hidden");
}
submit_btn.addEventListener("click", submitForm);
back_btn.addEventListener("click", backPage);
