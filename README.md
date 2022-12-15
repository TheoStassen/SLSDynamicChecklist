# Dynalist (SLS - Dynamic Clinical Checklists)

# Information

This project use react v17.0.2 (https://reactjs.org/) (https://github.com/facebook/create-react-app) <br />
and bootstrap 5 (https://getbootstrap.com/docs/5.0/getting-started/introduction/) <br />
(no installation needed for these two)

A deployed version of this project is accessible at the adress : https://theostassen.github.io/

# Installation

You need to have a recent version of node.js, 16.13.0 LTS works fine (https://nodejs.org/fr/)

You simply need to install the dependencies:

* `yarn install`

If there is an error when running the application : <br />

* You can install and activate node using nvm (node version manager) : https://github.com/nvm-sh/nvm <br />
* If react-bootstrap-select-dropdown is missing : `npm i -S react-signature-canvas` <br />
* If react-signature-canvas is missing : `npm i react-bootstrap-select-dropdown --save`

In the project directory, you can run:

* `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Project Overview

The Dynalist application is composed of different elements/routes, linked together :
* LoginApp (/login) : identification of the user
* Main (/main)
  * PatientApp (/patient) : patient selection
  * MenuApp (/menu) : patient's journey checklist list show and selection
  * ChecklistApp (/checklist) : (dynamic) checklist show and filling
  * Credits (/credits) : Application credits

