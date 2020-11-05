ifndef basic.mk
basic.mk := $(lastword $(MAKEFILE_LIST))

.PHONY: \
	install \
	prepare \
	lint \
	fix \
	run \
	build \
	release \
	publish

export VOLTA_HOME := $(HOME)/.volta
export PATH := $(VOLTA_HOME)/bin:$(PATH)

install:
	curl https://get.volta.sh | bash -s -- --skip-setup
	volta install node@latest
	volta pin node@latest
	volta pin npm@7
	npm install

prepare:
	npx husky install

release:
	npx standard-version
	git push --follow-tags

endif
