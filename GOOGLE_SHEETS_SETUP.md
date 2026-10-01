# Google Sheets Email Signup Setup

The site is static. This Apps Script endpoint stores waitlist email addresses and optional phone numbers in a Google Sheet without exposing a Google API key in browser code.

## Configure the sheet

1. Create or open the Google Sheet that will hold signups. Copy its spreadsheet ID from the URL between `/d/` and `/edit`.
2. Open **Extensions > Apps Script** from that sheet and paste in the contents of `google-sheets-signup.gs`.
3. In Apps Script, open **Project Settings > Script Properties** and add `SPREADSHEET_ID` with the copied spreadsheet ID as its value.
4. Choose **Deploy > New deployment > Web app**. Set **Execute as** to your account and access to **Anyone**, then deploy and approve the requested permissions.
5. Copy the deployed web app URL. In `script.js`, set `googleSheetsSignupEndpoint` to that URL.
6. Open the web app URL in a browser to check that it responds, then test the signup form using an email address you control, with or without a phone number. Opening the URL sends a `GET` request and only checks that the endpoint is available; submitting the form sends the `POST` that stores the signup. A `Subscribers` tab is created automatically the first time a signup is accepted; the script adds a `Phone number` column if needed.

The endpoint is public so the static site can submit to it. The site includes a basic honeypot field, but this is not full spam protection. The browser uses a no-CORS request, so its confirmation means the request was dispatched; the browser cannot verify the Apps Script response. Check the Sheet during testing.

Before launch, confirm that the Sheet is shared only with people who need access, and replace the canonical domain in the HTML, `robots.txt`, and `sitemap.xml` if the production domain is not `berenewed.com`.