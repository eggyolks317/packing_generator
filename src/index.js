import "./styles.css";
import "normalize.css";
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

const submit_btn = document.querySelector("#submit_btn");
const logistics_form = document.querySelector("#logistics_form");
const back_btn = document.querySelector("#back_btn");
const results = document.querySelector("#results");
const result_container = document.querySelector("#result_container");
const download_btn = document.querySelector("#download_btn");
const apiKeyInput = document.querySelector("#api_key");

function generatePrompt(
  departure,
  destination,
  nationality,
  travel_date,
  travel_days,
  luggage_size = "unknown",
) {
  return `I am travelling from ${departure} to ${destination} with a passport nationality of ${nationality}. I will be travelling from ${travel_date} with ${travel_days} days. My luggage size is ${luggage_size}. Lookup the weather of the location and time and use these information to generate a simple packing list that includes daily neccessities and travel documents and no descriptions on the bullet points and no parenthesis in headings. Format is heading with bullet points. `;
}

async function getResponse(prompt) {
  //get gemini api
  const ai = new GoogleGenAI({
    apiKey: apiKeyInput.value,
  });
  // get responser
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
    config: {
      temperature: 0.1,
    },
  });
  return response.text;
}

async function submitForm(event) {
  // to prevent actual submission
  event.preventDefault();
  // hide and show designated container
  logistics_form.classList.add("hidden");
  result_container.classList.remove("hidden");
  // show loading text
  results.textContent = "generating a perfect list for you...";
  results.style.color = "cadetblue";
  results.style.fontStyle = "italic";
  // prevent user downloading empty doc
  download_btn.disabled = true;

  // get input
  const tripDetails = {
    departure: document.querySelector("#departure").value,
    destination: document.querySelector("#destination").value,
    nationality: document.querySelector("#nationality").value,
    travel_date: document.querySelector("#travel_date").value,
    travel_days: parseInt(document.querySelector("#travel_days").value, 10),
    luggage_size: document.querySelector("#luggage_size").value,
  };

  // get prompt
  console.log("Trip Details:", tripDetails);
  let prompt = generatePrompt(
    tripDetails.departure,
    tripDetails.destination,
    tripDetails.nationality,
    tripDetails.travel_date,
    tripDetails.travel_days,
    tripDetails.luggage_size,
  );
  console.log("prompt: " + prompt);

  // get response
  var response = await getResponse(prompt);
  console.log(response);
  results.innerHTML = marked.parse(response);
  results.style.color = "cadetblue";
  results.style.fontStyle = "";
  // allow download feature
  download_btn.disabled = false;
}

function backPage(event) {
  event.preventDefault();
  // hide results and allow editing logistics
  logistics_form.classList.remove("hidden");
  result_container.classList.add("hidden");
}

function download() {
  let destination = document.querySelector("#destination").textContent;
  const pdfOptions = {
    margin: 15,
    filename: `packing_list_for_${destination}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(pdfOptions).from(results).save();
}

submit_btn.addEventListener("click", submitForm);
back_btn.addEventListener("click", backPage);
download_btn.addEventListener("click", download);
