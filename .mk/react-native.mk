install: react-native.install
react-native.install:
ifdef global/system/darwin
	brew-gem install bundler
	brew install cocoapods
	# node scripts/init.js
	cd ios && bundle install && bundle exec pod install
endif

start: react-native.start
react-native.start:
	expo start

android: react-native.android
react-native.android:
	expo start --android

ios: react-native.ios
react-native.ios:
	expo start --ios
	
web: react-native.web
react-native.web:
	expo start --web

storybook: react-native.storybook
react-native.storybook:
	start-storybook -p 19001

test: react-native.test
react-native.test:
	jest --watchAll

deploy: react-native.deploy
react-native.deploy:
	expo build:web
	gh-pages -d web-build

eject: react-native.eject
react-native.eject:
	expo eject

publish: react-native.publish
publish:
	expo build:android -t app-bundle
