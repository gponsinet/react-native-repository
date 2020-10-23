ifndef typescript.mk
typescript := $(lastword $(MAKEFILE_LIST))

export VOLTA_HOME := $(HOME)/.volta
export PATH := $(VOLTA_HOME)/bin:$(PATH)

prepare:
	ln -sf eslint_d node_modules/.bin/eslint

lint:
	node_modules/.bin/eslint_d .

fix:
	node_modules/.bin/eslint_d fix .

endif
