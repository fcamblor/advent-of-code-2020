# Setup

With `node` 12, run :

    npm install


# Results

Results are available publicly (with my personal input seeds) into
[this google spreadsheet](https://docs.google.com/spreadsheets/d/1FCRVNcSlF_nE_tRr6o2kFW9ihsk9qCivZkQRJP4NUU4/edit?usp=sharing)

Every DAY will have 1 dedicated spreadsheet tab with some formula calling scripts defined in src/*.ts files.

# Deploy

- Authenticate with `clasp` (google app script CLI) with `npx clasp login` (follow instructions)  
  Note: `clasp` is a CLI to manage your Google App Scripts, and it's powered by Google (more infos [here](https://codelabs.developers.google.com/codelabs/clasp/))
- Enable app script API here : https://script.google.com/home/usersettings
- Run `npx clasp create --type api` : a new google app script should be created under your google account.
  Publish keys for this script are going to be set into a `.clasp.json` private file : ⚠️ don't commit this file otherwise
  people will have access to your script !
- Run `npx clasp push` (or `npx clasp push --watch` if you want to edit/auto-deploy some changes made to the script)
  - `Manifest file has been updated. Do you want to push and overwrite?` => Answer "Yes" here
    Files are going to be compiled and pushed into your Google App Script.
- Open your app script by running `npx clasp open`

