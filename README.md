Stroeer Videoplayer Endcard Plugin
==================================

## Development

Install via dependencies via `yarn install`.

Build via `yarn run build`. Lint via `yarn run lint`. Test via `yarn run test`.

See coverage with `yarn run test --coverage`.

Run E2E-Tests via `cypress run` or interactive `cypress open`.

## dev.html

```html
<!DOCTYPE html>
<head>
	<title>Dev</title>
	<style>
		html, body {background-color: black;}
		video {
			max-width: 100%;
			width: 100%;
		}
		.container {
			margin: 0 auto;
			max-width: 776px;
		}
	</style>
</head>
<body>
	<div class="container">
		<video id="myvideo" class="stroeervideoplayer" preload="metadata" controls playsinline>
			<source src="https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-1080p.mp4" type="video/mp4" data-label="1080p" />
			<source src="https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-720p.mp4" type="video/mp4" data-label="720p" />
			<source src="https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-240p.mp4" type="video/mp4" data-label="240p" />
		</video>
	</div>

	<hr />

	<script src="node_modules/@stroeer/stroeer-videoplayer/dist/StroeerVideoplayer.umd.js"></script>
	<link rel="stylesheet" href="node_modules/@stroeer/stroeer-videoplayer/dist/StroeerVideoplayer.css" />

	<script src="node_modules/@stroeer/stroeer-videoplayer-default-ui/dist/StroeerVideoplayer-default-ui.umd.js"></script>
	<link rel="stylesheet" href="node_modules/@stroeer/stroeer-videoplayer-default-ui/dist/StroeerVideoplayer-default-ui.css" />

	<script src="dist/StroeerVideoplayer-endcard-plugin.umd.js"></script>

	<script>
		StroeerVideoplayer.registerUI(StroeerVideoplayerDefaultUI);
		StroeerVideoplayer.registerPlugin(StroeerVideoplayerEndcardPlugin)

		const video = document.getElementById("myvideo");
		video.addEventListener('error', function() {
			console.log('error', this.error.code, this.error.message)
		})
		video.addEventListener('firstPlay', function() {
			console.log('firstPlay')
		})
		video.addEventListener('contentVideoSeeked', function() {
			console.log('contentVideoSeeked')
		})
		video.addEventListener('contentVideoPause', function() {
			console.log('contentVideoPause')
		})
		video.addEventListener('contentVideoResume', function() {
			console.log('contentVideoResume')
		})
		video.addEventListener('replay', function() {
			console.log('replay')
		})
		video.addEventListener('contentVideoStart', function() {
			console.log('contentVideoStart')
		})
		video.addEventListener('contentVideoEnded', function() {
			console.log('contentVideoEnded')
		})
		video.addEventListener('contentVideoFirstQuartile', function() {
			console.log('contentVideoFirstQuartile')
		})
		video.addEventListener('contentVideoMidpoint', function() {
			console.log('contentVideoMidpoint')
		})
		video.addEventListener('contentVideoThirdQuartile', function() {
			console.log('contentVideoThirdQuartile')
		})

		const myvideoplayer = new StroeerVideoplayer(video)
		myvideoplayer.initPlugin('Endcard', {
			datauri: 'https://some-domain.com/some-url.json',

		})

		console.log(myvideoplayer);
	</script>
</body>
```
