'use client'
import styles from "./styles.module.css";
import React, { useState, useEffect } from 'react';

// App main function
export default function Home() {
  // Fetch data for a property using the UPRN handed to the function
  const [data, setData] = useState({});
  const fetchPropertyData = async (uprn) => {
    const url = 'https://api.propeco.io/properties/' + uprn;
    try {
      const results = await fetch(url, {
        headers: {
          "x-api-key": "b1a94f01-c673-4cf8-b83a-09357b942b77"
        },
      });
      const data = await results.json();
      console.log(data);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle the UPRN input box behaviour
  let uprn = 0;
  const handleUPRNInput = event => {
    uprn = event.target.value;
  }

  // Display the UPRN input area, and if data exists, display the data
  return (
    <div className={styles.page}>
      <div className={styles.uprn_entry}>
        <p>Please enter a Unique Property Reference Number (UPRN) to find its information.</p>
        <input name="uprn" onChange={handleUPRNInput} />
        <button onClick={(event) => fetchPropertyData(uprn)}>Fetch property data</button>
      </div>
      <hr className={styles.divider_bar} />
      <div className={styles.property_data}>
        {data["error"] ? (<p>Sorry, there was a problem with your request. Please check the entered UPRN and try again.</p>) : ("") }
        {(data["uprn"] && !data["error"]) ? (<DisplayData propertyData={data} />) : ("")}
      </div>
    </div>
  )
}

// Main data display which arranges subcomponents
function DisplayData({ propertyData }) {
  if (propertyData == {}) {
    return(<div></div>);
  } else {
    return (
      <div className={styles.dd}>
        <DisplayUPRN uprn={propertyData.uprn} />
        <DisplayAddress admin_boundaries={propertyData.location.admin_boundaries} />
        <DisplayAirQuality air_quality={propertyData.environment.air_quality} />
        <DisplayGreenspace greenspace={propertyData.environment.greenspace} />
      </div>
    )
  }
}

// Displays the entered UPRN
function DisplayUPRN({ uprn }) {
  return (
    <div className={styles.dd_box}>
      <p>Unique Property Reference Number: {uprn}</p>
    </div>
  )
}

// Displays the property's address
function DisplayAddress({ admin_boundaries }) {
  return (
    <div className={styles.dd_box}>
      <div className={styles.dd_box_contents}>
        <p>{admin_boundaries.postcode}</p>
        <p>{admin_boundaries.local_authority_district_name}</p>
        <p>{admin_boundaries.region_name}, {admin_boundaries.country_name}</p>
      </div>
    </div>
  )
}

// Displays information on the air quality
function DisplayAirQuality({ air_quality }) {
  let percentile_avg = 0;
  let count = 0;
  for (var key in air_quality) {
    percentile_avg = percentile_avg + air_quality[key].percentile;
    count = count + 1;
  }
  percentile_avg = Math.round(percentile_avg / count);

  return (
    <div className={styles.dd_box}>
      <p>Air Pollution: {percentile_avg}th percentile</p>
    </div>
  )
}

// Displays information on nearby greenspace
function DisplayGreenspace({ greenspace }) {
  return (
    <div className={styles.dd_box}>
      <p>Percentage of greenspace (within 1km): {Math.round(greenspace.greenspace_proportion * 100)}% </p>
    </div>
  )
}
