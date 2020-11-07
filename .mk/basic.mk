ifdef OS
	ifeq ($(OS),Windows_NT)
		global/system/windows := global/system/windows
	endif
endif
ifndef OS
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		global/system/linux := global/system/linux
	endif
	ifeq ($(UNAME_S),Darwin)
		global/system/darwin := global/system/darwin
	endif
endif

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

preinstall:
	curl https://get.volta.sh | bash -s -- --skip-setup
	volta install node@latest
	volta pin node@latest
	volta pin npm@7

install:
	npx husky install

release:
	npx standard-version
	git push --follow-tags
