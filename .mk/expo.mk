start: expo.start
expo.start:
	expo start

android: expo.android
expo.android:
	expo start --android

ios: expo.ios
expo.ios:
	expo start --ios

web: expo.web
expo.web:
	expo start --web

eject: expo.eject
expo.eject:
	expo eject

test: expo.test
expo.test:
	jest --watchAll
