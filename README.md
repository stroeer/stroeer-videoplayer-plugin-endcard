# Stroeer Videoplayer Endcard Plugin

---

## 🧑‍💻 Development

Install dependencies via `yarn install`.

Build via `yarn run build`.

Start local dev environment via: `yarn run dev`

Start local server with index.html via `yarn start`

You can use `yarn start` and `yarn watch` in different terminals to see saved changes immediately.
Important: You have to set the correct url of your API in [index.html](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/main/dev/index.html#L32) as `data-endcard-url` on video element.

Test via `yarn run test`.

For more commands see [package.json](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/main/package.json#L9)

## 👾 Dependencies
This is a plugin for a videoplayer, make sure your videoplayer provide these [functions](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/main/types/types.d.ts#L11).



The Stroeer Videoplayer Endcard Plugin works with data from a custom API but uses determined keys. So you have to provide these keys or you have to map these in the options object. For more information read next section.

## 😯 Notable features
The Stroeer Videoplayer Endcard Plugin uses determined [data keys](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/main/types/types.d.ts#L1). If these keys are named different in your API, you can map as many keys as you like via `dataKeyMap` in options object.

```javascript
myvideoplayer.initPlugin('Endcard', {
  showEndcard: true,
	dataKeyMap: {
		// key of endcard, key from API
    poster: ‘preview_image’,
    endpoint: ‘endcard_url’,
    image_small: ‘thumbnail’,
    image_medium: ‘preview_image’,
    image_large: ‘preview_image’,
	},
})
```

## API endpoint
These endpoint items are needed for the endcard plugin:

`endpoint: string` - link to the suggestions for this video

`title: string` - caption/title of the video

`image_small: string` - poster image in small size for all images and a browser width less than 769px

`image_medium: string` - poster image in medium size for all images and a browser min-width: 769px

`image_large: string` - poster image in large size for the large image and a browser min-width: 769px

`poster: string` - poster image which will be set in the original video element after the endcard

`playlists: array of strings` - needed by the video player

An API example could look like this: 
```json
[
  {
    "title": "Elden Ring: Fundorte aller 7 legendären Zauber und Anrufungen",
    "image_small": "https://files.giga-video.de/8b/8f/d4/ce5267fe9772673bb448ea25f9_ciAyNDYgMTM4AzhmYzJmNzZiNGFm.jpg",
    "image_medium": "https://files.giga-video.de/8b/8f/d4/ce5267fe9772673bb448ea25f9_ciAyNDYgMTM4AzhmYzJmNzZiNGFm.jpg",
    "image_large": "https://files.giga-video.de/8b/8f/d4/ce5267fe9772673bb448ea25f9_ciAyNDYgMTM4AzhmYzJmNzZiNGFm.jpg",
    "poster": "https://files.giga-video.de/8b/8f/d4/ce5267fe9772673bb448ea25f9_AzhmYzJmNzZiNGFm.jpg",
    "playlists": [
      "https://lx56.spieletips.de/2072001061_v4/playlist.m3u8",
      "https://vid-cdn60.stroeermb.de/2072001061_v4/playlist.m3u8",
      "https://vid-cdn61.stroeermb.de/2072001061_v4/playlist.m3u8"
    ],
    "endpoint": "https://videos-dev.giga.de/suggestions/2072001061"
  },
  {
  ...
  },
]
```

If there is a problem with the API then the fallback (only replay tile) is shown.

## 🔌 Options

You can see all available options [here](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/main/types/types.d.ts#L21).
	
### `onLoadedCallback` - Function

Callback which is triggered when Endcard is loaded and shown.

### `onClickToPlayCallback` - Function

Callback which is triggered when user clicks on one tile except replay tile.

### `onClickToReplayCallback` - Function

Callback which is triggered when user clicks on replay tile.

### `onRevolverplayCallback` - Function

Callback which is triggered when an endcard video is started by revolverplay.

### `onRevolverplayPauseCallback` - Function

Callback which is triggered when user clicks on "Anhalten"-button.

### `dataKeyMap` - Object

Object to map keys of API data structure.

### `revolverplayTime` - number

The number of seconds for the revolverplay countdown. If you set `0` then revolverplay is deactivated.

`Default: 5`

### `showFallback` - boolean

If set to true the fallback (only replay tile) is shown.

`Default: false`

### `showFallback` - Function

A function which gets the current API Data after it got transformed by the `dataKeyMap` and should return a conformal data object.
This function can be used to filter or manipulate the data in an data format compliant way.


## 🌐 Real World Example

You can see a running example also in [index.html](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/main/dev/index.html)

The only required data-attribute for the endcard to work is `data-endcard-url`.
```HTML
<video id="myvideo" class="stroeervideoplayer" data-endcard-url="http://localhost:5000/">
	<source src="https://vid-cdn60.stroeermb.de/1307753225_v4/playlist.m3u8" type="application/x-mpegURL">
</video>
``` 

```javascript
const myvideoplayer = new StroeerVideoplayer(video)
myvideoplayer.initPlugin('Endcard', {
	revolverplayTime: 7,
	dataKeyMap: {
		image_large: 'preview_image',
		image_medium: 'preview_image',
		image_small: 'thumbnail'
	},
	onLoadedCallback: () => {
		console.log('OnLoadedCallback triggered')
 	},
 	onClickToPlayCallback: () => {
		console.log('onClickToPlayCallback triggered')
	},
	onClickToReplayCallback: () => {
		console.log('onClickToReplayCallback triggered')
	},
	onRevolverplayCallback: () => {
		console.log('OnRevolverplayCallback triggered')
 	},
 	onRevolverplayPauseCallback: () => {
		console.log('OnRevolverplayPauseCallback triggered')
	},
})
```

## 👗 Style

You have multiple [scss variables](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/main/src/endcard.scss) to style your endcard.

```scss
$endcard-plugin-highlight-color: #424242 !default;
$endcard-plugin-bg-color: #000 !default;
$endcard-plugin-tile-border: 2px solid #fff !default;
$endcard-plugin-title-bg: linear-gradient(
  180deg,
  rgba(0, 0, 0, 0) 0%,
  rgba(0, 0, 0, 0.8) 100%
) !default;
$endcard-plugin-spacing-large: 16px !default;
$endcard-plugin-spacing-small: 12px !default;
$endcard-plugin-font-size-small: 12px !default;
$endcard-plugin-font-size-smaller: 10px !default;
$endcard-plugin-font-size-medium: 14px !default;
$endcard-plugin-font-size-large: 16px !default;
$endcard-plugin-text-color: #fff !default;
$endcard-plugin-button-pause-bg-color: rgba(255, 255, 255, 0.4) !default;
$endcard-plugin-button-pause-bg-color-hover: rgba(255, 255, 255, 0.2) !default;
$endcard-plugin-tile-overlay-bg: rgba(0, 0, 0, 0.4) !default;
$endcard-plugin-controlbar-height-mobile: 55px !default;
```
