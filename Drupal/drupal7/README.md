# Drupal 7 Plugin

The Drupal 7 plugin that connects Drupal to Silktide.

## Installation

1. Zip up the `silktide/` folder.
2. Navigate to your instance of Drupal
3. Select `Modules` from the top menu
4. Choose Install new module
5. Drop the .zip file into the file upload form and select "Install"
6. Go back to the `Modules` screen
7. Click on `Configuration` next to `Silktide` plugin.
8. Insert your API key (found in your report settings)
9. Test the API key works (choose the option to do this below the form)
10. Save the form
11. In your `common.inc` file usually located in your /includes folder, place inside `_drupal_default_html_head` 
function all of the lines found inside `code-for-common.inc` file inside this project.
12. You should now be good to start using this plugin. To test this works, simply modify some of your content 
and see if the page within 1 minute begins to retest within the Silktide platform. 

## To test this

No idea, I had to install Drupal 7 on my VPS and test that way. 
If you need help testing, let Lee know as he may still have this available.

Good luck!