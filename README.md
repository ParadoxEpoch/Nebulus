# Nebulus
 ### A browser based, JS powered operating system shell.
 
 **Please note: Nebulus was written in a few hours on a whim and may or may not be updated further. It's just an interesting concept.**
 
 Runs entirely within the browser and does not require transpiling or server-side runtimes.
 Just deploy the files to a web server and point to index.html in a browser.
 All external dependencies (jQuery, Axios, Web Fonts) are already included in index.html, sourced from CDNs.
 
 Currently functional is a basic shell that can launch self-contained "apps" from the [/apps](/apps) directory. App parameters such as window width/height and whether the app supports multiple window instances are defined in the app's [config.json](/apps/testapp/config.json).
 
 You can launch an "app" from the [/apps](/apps) directory by calling:
 ```javascript
 nebos.app.open('appIdGoesHere')
 ```
 
 All active windows are assigned a unique instance identifer made up of the app's ID (appId) and a randomly generated seed like so:
 ```
 welcomeApp:s323456789435
 ```
 
 Active windows can be controlled via the "nebos.app" API. For example, to kill an active window instance call:
 ```javascript
 nebos.app.quit('seedGoesHere')
 ```
 
 You can check if there are any active window instances belonging to a certain app by calling:
 ```javascript
 nebos.app.exists('appIdGoesHere')
 ```
 
 Yes, this project depends on jQuery. Want to refactor it in vanilla JS? PRs are always welcome.
 
 ## Future Considerations:
 * Replace jQuery.load() method with Axios for app content loading
 * App Isolation. Apps should run inside of iFrames, preventing execution of code outside of the window's context.
 * Pseudo-IPC. Apps should be able to communicate with other windows that belong to the app.
 * Driver support. Apps should be able to register "drivers" which can execute code outside of the application context.
 * Window resizing. Already implemented in AeonLabs v3. Can be easily backported to Nebulus.
 * Window state retention. Windows should be able to remember their size & position and recover their state in the event of a browser refresh. This is already implemented elsewhere and can be backported to Nebulus.
