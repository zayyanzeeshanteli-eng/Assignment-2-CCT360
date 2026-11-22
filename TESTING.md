# Testing notes

The revised version was checked for the following:

## Interface logic
- city selector triggers a new weather request
- refresh button triggers a new weather request
- Women / Men toggle updates the outfit response
- Casual / Dressed Up toggle updates the outfit response
- outfit image, title, description, styling note, accessory and visual number update together

## Weather logic
- cold weather (< 10°C) shows cold looks
- mild weather (10°C to 23.9°C) shows mild looks
- hot weather (24°C and above) shows hot looks
- rain and snow adjust accessories and precipitation indicators
- strong wind adjusts the styling note and wind data signal

## Error handling
- when the weather request fails, the site displays an error state rather than inventing weather data

## Responsive behaviour
- layout stacks correctly on smaller screens
- button groups become vertical on mobile
