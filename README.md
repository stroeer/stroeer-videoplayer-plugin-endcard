# Stroeer Videoplayer Endcard Plugin

---

## 🧑‍💻 Development

Install dependencies via `yarn install`.

Build via `yarn run build`.

Start local server with index.html via `yarn start`

You can use `yarn start` and `yarn watch` in different terminals to see saved changes immediately.
Important: You have to set the correct url of your API in [index.html](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/83b2d310e4e3e7dbb5770b1af2f50086e25958f3/index.html#L32) as `data-endcard-url` on video element.

Test via `yarn run test`.

For more commands see [package.json](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/83b2d310e4e3e7dbb5770b1af2f50086e25958f3/package.json#L9)

## 👾 Dependencies
This is a plugin for a videoplayer, make sure your videoplayer provide these [functions](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/83b2d310e4e3e7dbb5770b1af2f50086e25958f3/types/types.d.ts#L11).

The Stroeer Videoplayer Endcard Plugin works with data from a custom API but uses determined keys. So you have to provide these keys or you have to map these in the options object. For more information read next section.

## 😯 Notable features
The Stroeer Videoplayer Endcard Plugin uses determined [data keys](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/83b2d310e4e3e7dbb5770b1af2f50086e25958f3/types/types.d.ts#L1). If these keys are named different in your API, you can map as many keys as you like via `dataKeyMap` in options object.

```javascript
myvideoplayer.initPlugin('Endcard', {
	dataKeyMap: {
		// oldKey, newKey
		poster: 'image_large',
	},
})
```

If there is a problem with the API then the fallback (only replay tile) is shown.

## 🔌 Options

You can see all available options [here](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/83b2d310e4e3e7dbb5770b1af2f50086e25958f3/types/types.d.ts#L21).
	
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
Default: 5

### `showEndcard` - boolean

If set to false the fallback (only replay tile) is shown.
Default: true

## 🌐 Real World Example

You can see a running example also in [index.html](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/master/index.html)

The only required data-attribute for the endcard to work is `data-endcard-url`.
```HTML
<video id="myvideo" class="stroeervideoplayer" data-endcard-url="http://localhost:5000/">
	<source src="https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-1080p.mp4" type="video/mp4" data-label="1080p" />
	<source src="https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-720p.mp4" type="video/mp4" data-label="720p" />
	<source src="https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-240p.mp4" type="video/mp4" data-label="240p" />
</video>
``` 

```javascript
const myvideoplayer = new StroeerVideoplayer(video)
myvideoplayer.initPlugin('Endcard', {
	revolverplayTime: 7,
	showEndcard: true,
	dataKeyMap: {
		poster: 'image_large',
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

## Style

You have multiple [scss variables](https://github.com/stroeer/stroeer-videoplayer-plugin-endcard/blob/master/src/endcard.scss) to style your endcard.

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
$endcard-plugin-font-size-smaller: 10px !default;
$endcard-plugin-font-size-small: 12px !default;
$endcard-plugin-font-size-medium: 14px !default;
$endcard-plugin-font-size-large: 16px !default;
$endcard-plugin-text-color: #fff !default;
$endcard-plugin-button-pause-bg-color: rgba(255, 255, 255, 0.4) !default;
$endcard-plugin-button-pause-bg-color-hover: rgba(255, 255, 255, 0.2) !default;
$endcard-plugin-tile-overlay-bg: rgba(0, 0, 0, 0.4) !default;
$endcard-plugin-controlbar-height-mobile: 64px !default;
```
