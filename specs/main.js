// Import the necessary k6 and faker libraries
import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import http from 'k6/http';
import { check } from 'k6';

// The following config would have k6 ramping up from 1 to 10 VUs for 3 minutes,
// then staying flat at 10 VUs for 5 minutes, then ramping up from 10 to 35 VUs
// over the next 10 minutes before finally ramping down to 0 VUs for another
// 3 minutes.

export let options = {
    stages: [
        // Ramp up to 1 VUs for 5 second
        { duration: "25m", target: 1 }
      ],
};

const flightData = () => ({
	flight: faker.random.arrayElement(['A20240725EJU7886', 'A20240726OR1638', 'A20240726HV5822', 'A20240726HV6706', 'A20240726DL0256', 'A20240726KL0652', 'D20240726OR3093', 'D20240726HV6003', 'D20240726KL1351', 'D20240726EJU7881', 'D20240726TP675', 'D20240726KL1441', 'D20240726KL1815', 'D20240725OR1665', 'D20240725KL1203', 'D20240725CD841', 'D20240725KL0765', 'D20240725AF1641', 'A20240725KL0914', 'A20240725KL1776', 'A20240725KL1232', 'A20240725KL1200', 'A20240725BA434', 'A20240725HV6872', 'A20240725LH2304', 'A20240725KL1604', 'A20240725KL1984']),
	personUuid: faker.random.uuid(),
});


// The main function that will be executed for each VU (virtual user)
export default function() {
	
	// Create a random user using the userData function from the payload.js file
	const parameters = flightData();


	// Set the headers for the POST request
	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}

	const url = `http://schiphol.local/api/notifications/flight/${parameters.flight}/subscribe/${parameters.personUuid}`


	// Send the POST request to the API with the generated user data and headers
	let response = http.post(url, '', {
		headers: headers
	});

	// Check the response status code and response time using the k6 check function
	check(response, {
		// The status code should be 200
		'status is 200': (r) => r.status === 200,
        // The response time should be less than 200ms
        'response time < 200ms': (r) => r.timings.duration < 750
	});

	// If the response status code is not 200, print the response JSON to the console
	if (response.status !== 200) {
		console.log(response.json())
	}
}
