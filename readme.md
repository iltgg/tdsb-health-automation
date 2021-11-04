# tdsb-health-automation

tdsb-health-automation is a node program that runs puppeteer to automatically complete the COVID-19 health check in. It can be deployed to a Google Cloud function and set to run every morning with cloud scheduler. It can also send a notification via IFTTT webhooks of the completion status.

## Installation

Clone the repository and run npm

```
git clone https://github.com/iltgg/tdsb-health-automation.git
npm install
```

## Usage

Set up a Google Cloud project with cloud functions and Pub/Sub enabled

Install the Google Cloud SDK

If using IFTTT create a new applet with the following settings:

If "Receive a web request with a JSON payload", name the event anything

Then "Send a rich notification from the IFTTT app", in message add the JsonPayload ingredient

### Setup

In order to automate the login we must first take the cookies of a logged in session to be reused each time.

In the test folder is a js file called `get-login-cookies` replace the empty strings with your email and password

```javascript
const email = "example.example@student.tdsb.on.ca";
const password = "**********";
```

Run the file with:

```
npm run login
```

There should now be a `cookies.json` file in the test directory.
In the test folder there is a js file called `health-complete.js` paste the contents of the json file into the `cookiesString`

```javascript
const cookiesString = `
[
    {
      "name": "ESTSAUTH",
      ...
    }
    ...
]
`;
```

Run the file with:

```
npm run complete
```

This should create a `screenshot.png` in the test directory, if it shows the completed screen then the program is working.

## Setup 2

Copy the `example_data.js` file and rename it to `data.js`.

Replace the empty `COOKIES` array with the contents of the the `cookies.json` file, and the empty `IFTTTKEY` string with your IFTTT.

In `index.js` change `SENDNOTIFICATION` to false if not using IFTTT.

### Cloud deployment

Copy the cookies to the `cookiesString` in `index.js` at the root of the project.

Create a Pub/Sub topic:

```
gcloud pubsub topics create auto-check-in
```

Deploy the function:

```
gcloud functions deploy healthComplete --runtime nodejs12 --trigger-topic auto-check-in  --memory=1024mb
```

Create a Cloud Scheduler job that will run the function

Cron job schedule function to fire at 06:00 on every day-of-week from Monday through Friday: `0 6 * * MON-FRI`

## License

[MIT](https://choosealicense.com/licenses/mit/)
